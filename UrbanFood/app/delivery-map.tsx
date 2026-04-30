import DeliveryStatusCard from '@/components/delivery/DeliveryStatusCard';
import { ThemedText } from '@/components/themed-text';
import { Brand, Colors } from '@/constants/theme';
import {
  DELIVERY_DURATION_MS,
  DELIVERY_PARTNER,
  DeliveryStatus,
  INITIAL_ETA_MINUTES,
  RESTAURANT_COORDS,
  STEP_INTERVAL_MS,
} from '@/src/constants/delivery';
import { useAuth } from '@/src/hooks/useAuth';
import { useOrders } from '@/src/hooks/useOrders';
import { fetchRealRoute, getBearing, LatLng } from '@/src/utils/routeData';
import { deliveryMapStyles as styles } from '@/styles/screens/deliveryMapStyles';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, TouchableOpacity, useColorScheme, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const isExpoGo = Constants.appOwnership === 'expo';

export default function DeliveryMap() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();
  const params = useLocalSearchParams<{
    orderId?: string;
    userLat?: string;
    userLng?: string;
    orderTime?: string; // ISO timestamp — when the order was placed
    estimatedTime?: string; // ISO timestamp — when it should arrive
  }>();

  const { user } = useAuth();
  const { currentOrder, updateStatus } = useOrders(user?.id, true);

  // Parse user coordinates
  const userCoords: LatLng = useMemo(
    () => ({
      latitude: params.userLat ? parseFloat(params.userLat) : 12.9116,
      longitude: params.userLng ? parseFloat(params.userLng) : 77.6389,
    }),
    [params.userLat, params.userLng],
  );

  // ── Shared state ────────────────────────────────────────────────────────────
  const [route, setRoute] = useState<LatLng[]>([]);
  const [routeReady, setRouteReady] = useState(false);
  const routeRef = useRef<LatLng[]>([]);

  const [bikeCoords, setBikeCoords] = useState<LatLng>(RESTAURANT_COORDS);
  const [bearing, setBearing] = useState(0);

  const [status, setStatus] = useState<DeliveryStatus>('Order Placed');
  const [eta, setEta] = useState(INITIAL_ETA_MINUTES);
  const [isDelivered, setIsDelivered] = useState(false);

  const deliveredAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Refs — one per map type, only the active one gets used
  const mapRef = useRef<MapView>(null);
  const webViewRef = useRef<WebView>(null);

  // ── Handle back navigation (gesture & hardware button) ──────────────────────
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.push('/(tabs)');
        return true; // Prevent default back behavior
      };

      // For Android hardware back button
      const subscription = require('react-native').BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [router]),
  );

  // ── Fetch route ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const loadRoute = async () => {
      try {
        const routePoints = await fetchRealRoute(RESTAURANT_COORDS, userCoords);
        if (isMounted) {
          setRoute(routePoints);
          routeRef.current = routePoints;
          setBikeCoords(routePoints[0]);
          setRouteReady(true);
        }
      } catch (error) {
        if (isMounted) setRouteReady(true);
      }
    };

    loadRoute();

    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [userCoords.latitude, userCoords.longitude]);

  // ── Fit MapView to route (Expo Go only) ─────────────────────────────────────
  useEffect(() => {
    if (isExpoGo && routeReady && route.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(route, {
        edgePadding: { top: 80, right: 40, bottom: 300, left: 40 },
        animated: true,
      });
    }
  }, [routeReady, route]);

  // ── Update bike position in WebView (standalone only) ───────────────────────
  useEffect(() => {
    if (!isExpoGo && webViewRef.current && routeReady) {
      const script = `
        if (window.updateBikePosition) {
          window.updateBikePosition(${bikeCoords.latitude}, ${bikeCoords.longitude}, ${bearing});
        }
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [bikeCoords, bearing, routeReady]);

  // ── Delivery simulation (shared, time-synced) ────────────────────────────────
  useEffect(() => {
    if (!routeReady || isDelivered || routeRef.current.length === 0) return;

    // ── Determine the total delivery window from order timestamps ──────────────
    // Priority: URL params (always set by callers) → currentOrder from Redux.
    // This makes the map self-contained; it doesn't need Redux orders loaded.
    let totalDuration = DELIVERY_DURATION_MS; // 2 min default
    let elapsedAtMount = 0;

    const estimatedTimeStr =
      params.estimatedTime || currentOrder?.estimatedTime;
    const orderTimeStr = params.orderTime || currentOrder?.orderTime;

    if (estimatedTimeStr) {
      const estimatedTs = new Date(estimatedTimeStr).getTime();
      const now = Date.now();

      if (orderTimeStr) {
        const orderTs = new Date(orderTimeStr).getTime();
        totalDuration = Math.max(10000, estimatedTs - orderTs);
        elapsedAtMount = Math.max(0, now - orderTs);
      } else {
        // Fallback: only remaining time known
        const remainingMs = estimatedTs - now;
        totalDuration = Math.max(10000, remainingMs);
        elapsedAtMount = 0;
      }
    }

    // Clamp initial progress to [0, 1)
    const initialProgress = Math.min(elapsedAtMount / totalDuration, 0.999);
    const totalSteps = routeRef.current.length - 1;

    // Place bike at the correct starting position immediately (no flash to origin)
    const initialIndex = Math.floor(initialProgress * totalSteps);
    const initialPos = routeRef.current[Math.min(initialIndex, totalSteps)];
    setBikeCoords(initialPos);
    if (initialIndex > 0) {
      setBearing(getBearing(routeRef.current[initialIndex - 1], initialPos));
    }

    // Set initial status
    if (initialProgress >= 0.75) setStatus('Arriving Soon');
    else if (initialProgress >= 0.3) setStatus('Out for Delivery');
    else if (initialProgress >= 0.15) setStatus('Preparing');
    else setStatus('Order Placed');

    // Set initial ETA
    const remainingMs = totalDuration - elapsedAtMount;
    setEta(Math.max(0, Math.ceil(remainingMs / 60000)));

    // ── Trick: set startTimeRef in the past so interval progress aligns ────────
    // Instead of starting elapsed from 0, we pretend we started `elapsedAtMount`
    // ms ago. This way progress = (Date.now() - startTimeRef) / totalDuration
    // naturally equals initialProgress on the first tick and continues forward.
    startTimeRef.current = Date.now() - elapsedAtMount;

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / totalDuration, 1);
      const currentIndex = Math.floor(progress * totalSteps);

      if (progress >= 1 || currentIndex >= totalSteps) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsDelivered(true);
        setStatus('Delivered');
        setEta(0);
        setBikeCoords(routeRef.current[totalSteps]);
        deliveredAnim.setValue(0);
        Animated.spring(deliveredAnim, {
          toValue: 1,
          useNativeDriver: true,
          bounciness: 10,
        }).start();

        // Update order status to success
        const orderToUpdate = params.orderId || currentOrder?.orderId;
        if (orderToUpdate) {
          updateStatus(orderToUpdate, 'success').catch((error) => {
            console.error('Failed to update order status:', error);
          });
        } else {
          console.warn('No orderId available to update status');
        }
        return;
      }

      const newPos = routeRef.current[currentIndex];
      const newBearing =
        currentIndex > 0
          ? getBearing(routeRef.current[currentIndex - 1], newPos)
          : 0;

      setBikeCoords(newPos);
      setBearing(newBearing);

      let newStatus: DeliveryStatus;
      if (progress >= 0.75) newStatus = 'Arriving Soon';
      else if (progress >= 0.3) newStatus = 'Out for Delivery';
      else if (progress >= 0.15) newStatus = 'Preparing';
      else newStatus = 'Order Placed';
      setStatus(newStatus);

      const remainingSeconds = Math.ceil((totalDuration - elapsed) / 1000);
      setEta(Math.max(0, Math.ceil(remainingSeconds / 60)));
    }, STEP_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    routeReady,
    isDelivered,
    deliveredAnim,
    params.estimatedTime,
    params.orderTime,
    currentOrder?.estimatedTime,
    currentOrder?.orderTime,
  ]);

  // ── Recenter (each map type handles it differently) ─────────────────────────
  const handleRecenter = useCallback(() => {
    if (isExpoGo) {
      if (mapRef.current && route.length > 0) {
        mapRef.current.fitToCoordinates(route, {
          edgePadding: { top: 80, right: 40, bottom: 300, left: 40 },
          animated: true,
        });
      }
    } else {
      if (webViewRef.current) {
        const script = `
          if (window.recenterMap) { window.recenterMap(); }
          true;
        `;
        webViewRef.current.injectJavaScript(script);
      }
    }
  }, [route]);

  // ── Leaflet HTML (standalone only) ──────────────────────────────────────────
  const mapHTML = useMemo(() => {
    if (isExpoGo) return '';
    const routeCoords = route
      .map((c) => `[${c.latitude}, ${c.longitude}]`)
      .join(',');
    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const map = L.map('map', { zoomControl: false, attributionControl: false })
      .setView([${RESTAURANT_COORDS.latitude}, ${RESTAURANT_COORDS.longitude}], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

    const restaurantIcon = L.divIcon({
      html: '<div style="background:${Brand.primary};width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><span style="color:white;font-size:20px">🍽️</span></div>',
      className: '', iconSize: [40,40], iconAnchor: [20,20]
    });
    L.marker([${RESTAURANT_COORDS.latitude}, ${RESTAURANT_COORDS.longitude}], { icon: restaurantIcon }).addTo(map);

    const userIcon = L.divIcon({
      html: '<div style="background:#4A90E2;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><span style="color:white;font-size:20px">🏠</span></div>',
      className: '', iconSize: [40,40], iconAnchor: [20,20]
    });
    L.marker([${userCoords.latitude}, ${userCoords.longitude}], { icon: userIcon }).addTo(map);

    let routeLine = null;
    const routeCoords = [${routeCoords}];
    if (routeCoords.length > 0) {
      routeLine = L.polyline(routeCoords, { color: '${Brand.success}', weight: 4, opacity: 0.8 }).addTo(map);
      map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
    }

    const bikeIcon = L.divIcon({
      html: '<div style="background:${Brand.success};width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><span style="color:white;font-size:22px">🚴</span></div>',
      className: '', iconSize: [44,44], iconAnchor: [22,22]
    });
    let bikeMarker = L.marker([${RESTAURANT_COORDS.latitude}, ${RESTAURANT_COORDS.longitude}], { icon: bikeIcon }).addTo(map);

    window.updateBikePosition = function(lat, lng, bearing) {
      if (bikeMarker) bikeMarker.setLatLng([lat, lng]);
    };
    window.recenterMap = function() {
      if (routeLine) map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
    };
  </script>
</body>
</html>`;
  }, [route, userCoords]);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* MAP — react-native-maps on Expo Go, Leaflet/WebView on standalone */}
      {isExpoGo ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: (RESTAURANT_COORDS.latitude + userCoords.latitude) / 2,
            longitude: (RESTAURANT_COORDS.longitude + userCoords.longitude) / 2,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={RESTAURANT_COORDS}
            title="Restaurant"
            description="Urban Food"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Ionicons name="restaurant" size={32} color={Brand.primary} />
          </Marker>

          {!isDelivered && (
            <Marker
              coordinate={bikeCoords}
              title="Delivery Partner"
              description={DELIVERY_PARTNER.name}
              anchor={{ x: 0.5, y: 0.5 }}
              flat
              rotation={bearing}
            >
              <Ionicons name="bicycle" size={32} color={Brand.success} />
            </Marker>
          )}

          <Marker
            coordinate={userCoords}
            title="Delivery Location"
            description="Your address"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Ionicons name="location" size={32} color="#4A90E2" />
          </Marker>

          {route.length > 1 && (
            <Polyline
              coordinates={route}
              strokeColor={Brand.success}
              strokeWidth={4}
              lineDashPattern={[1]}
            />
          )}
        </MapView>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ html: mapHTML }}
          style={styles.map}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          scrollEnabled={false}
        />
      )}

      {/* Top bar */}
      <SafeAreaView style={styles.topBar} edges={['top']}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.surface }]}
          onPress={() => router.push('/(tabs)')}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={[styles.topBarPill, { backgroundColor: theme.surface }]}>
          <ThemedText
            style={[styles.topBarTitle, { color: theme.textPrimary }]}
          >
            Tracking Order
          </ThemedText>
        </View>

        <TouchableOpacity
          style={[styles.recenterBtn, { backgroundColor: theme.surface }]}
          onPress={handleRecenter}
          activeOpacity={0.8}
        >
          <Ionicons name="navigate" size={20} color={Brand.success} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Delivered banner */}
      {isDelivered && (
        <Animated.View
          style={[
            styles.deliveredBanner,
            {
              backgroundColor: Brand.success,
              opacity: deliveredAnim,
              transform: [{ scale: deliveredAnim }],
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <ThemedText style={styles.deliveredText}>
            Order Delivered! Enjoy your meal 🎉
          </ThemedText>
        </Animated.View>
      )}

      {/* Status card */}
      <DeliveryStatusCard
        status={status}
        eta={eta}
        partnerName={DELIVERY_PARTNER.name}
        partnerVehicle={DELIVERY_PARTNER.vehicle}
        onRecenter={handleRecenter}
      />
    </View>
  );
}
