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
import {
    fetchRealRoute,
    getBearing,
    LatLng,
} from '@/src/utils/routeData';
import { deliveryMapStyles as styles } from '@/styles/screens/deliveryMapStyles';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    Animated,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function DeliveryMap() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();
  const params = useLocalSearchParams<{ userLat?: string; userLng?: string }>();

  // Parse user coordinates
  const userCoords: LatLng = useMemo(
    () => ({
      latitude: params.userLat ? parseFloat(params.userLat) : 12.9116,
      longitude: params.userLng ? parseFloat(params.userLng) : 77.6389,
    }),
    [params.userLat, params.userLng],
  );

  // Route state
  const [route, setRoute] = useState<LatLng[]>([]);
  const [routeReady, setRouteReady] = useState(false);
  const routeRef = useRef<LatLng[]>([]);

  // Delivery bike state
  const [bikeCoords, setBikeCoords] = useState<LatLng>(RESTAURANT_COORDS);
  const [bearing, setBearing] = useState(0);

  // Status & ETA
  const [status, setStatus] = useState<DeliveryStatus>('Order Placed');
  const [eta, setEta] = useState(INITIAL_ETA_MINUTES);
  const [isDelivered, setIsDelivered] = useState(false);

  // Refs
  const webViewRef = useRef<WebView>(null);
  const deliveredAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Fetch route on mount
  useEffect(() => {
    let isMounted = true;

    const loadRoute = async () => {
      try {
        console.log('🛣️ Fetching route from OpenRouteService...');
        const routePoints = await fetchRealRoute(RESTAURANT_COORDS, userCoords);
        if (isMounted) {
          console.log('✅ Route loaded:', routePoints.length, 'points');
          setRoute(routePoints);
          routeRef.current = routePoints;
          setBikeCoords(routePoints[0]);
          setRouteReady(true);
        }
      } catch (error) {
        console.error('❌ Failed to fetch route:', error);
        if (isMounted) {
          setRouteReady(true);
        }
      }
    };

    loadRoute();

    return () => {
      isMounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [userCoords.latitude, userCoords.longitude]);

  // Update bike position on map
  useEffect(() => {
    if (webViewRef.current && routeReady) {
      const script = `
        if (window.updateBikePosition) {
          window.updateBikePosition(${bikeCoords.latitude}, ${bikeCoords.longitude}, ${bearing});
        }
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [bikeCoords, bearing, routeReady]);

  // Start delivery simulation
  useEffect(() => {
    if (!routeReady || isDelivered || routeRef.current.length === 0) {
      return;
    }

    console.log('🚴 Starting delivery simulation...');
    startTimeRef.current = Date.now();
    const totalSteps = routeRef.current.length - 1;

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / DELIVERY_DURATION_MS, 1);

      // Calculate current position on route
      const currentIndex = Math.floor(progress * totalSteps);

      if (progress >= 1 || currentIndex >= totalSteps) {
        // Delivery completed
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        console.log('✅ Delivery completed!');
        setIsDelivered(true);
        setStatus('Delivered');
        setEta(0);
        setBikeCoords(routeRef.current[totalSteps]);

        // Animate delivery completion
        deliveredAnim.setValue(0);
        Animated.spring(deliveredAnim, {
          toValue: 1,
          useNativeDriver: true,
          bounciness: 10,
        }).start();
        return;
      }

      // Update bike position
      const newPos = routeRef.current[currentIndex];
      const newBearing =
        currentIndex > 0
          ? getBearing(routeRef.current[currentIndex - 1], newPos)
          : 0;

      setBikeCoords(newPos);
      setBearing(newBearing);

      // Update status based on progress
      let newStatus: DeliveryStatus;
      if (progress >= 0.75) newStatus = 'Arriving Soon';
      else if (progress >= 0.3) newStatus = 'Out for Delivery';
      else if (progress >= 0.15) newStatus = 'Preparing';
      else newStatus = 'Order Placed';

      setStatus(newStatus);

      // Update ETA (countdown from 2 minutes)
      const remainingSeconds = Math.ceil(
        (DELIVERY_DURATION_MS - elapsed) / 1000,
      );
      const remainingMinutes = Math.max(0, Math.ceil(remainingSeconds / 60));
      setEta(remainingMinutes);
    }, STEP_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [routeReady, isDelivered, deliveredAnim]);

  // Recenter map
  const handleRecenter = useCallback(() => {
    if (webViewRef.current) {
      const script = `
        if (window.recenterMap) {
          window.recenterMap();
        }
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, []);

  // Generate HTML for Leaflet map
  const mapHTML = useMemo(() => {
    const routeCoords = route.map(c => `[${c.latitude}, ${c.longitude}]`).join(',');
    
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
    // Initialize map
    const map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([${RESTAURANT_COORDS.latitude}, ${RESTAURANT_COORDS.longitude}], 14);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Restaurant marker
    const restaurantIcon = L.divIcon({
      html: '<div style="background: ${Brand.primary}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="color: white; font-size: 20px;">🍽️</span></div>',
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
    L.marker([${RESTAURANT_COORDS.latitude}, ${RESTAURANT_COORDS.longitude}], { icon: restaurantIcon }).addTo(map);

    // User marker
    const userIcon = L.divIcon({
      html: '<div style="background: #4A90E2; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="color: white; font-size: 20px;">🏠</span></div>',
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });
    L.marker([${userCoords.latitude}, ${userCoords.longitude}], { icon: userIcon }).addTo(map);

    // Route polyline
    let routeLine = null;
    const routeCoords = [${routeCoords}];
    if (routeCoords.length > 0) {
      routeLine = L.polyline(routeCoords, {
        color: '${Brand.success}',
        weight: 4,
        opacity: 0.8
      }).addTo(map);
      
      // Fit map to show route
      map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
    }

    // Bike marker
    const bikeIcon = L.divIcon({
      html: '<div style="background: ${Brand.success}; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><span style="color: white; font-size: 22px;">🚴</span></div>',
      className: '',
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });
    let bikeMarker = L.marker([${RESTAURANT_COORDS.latitude}, ${RESTAURANT_COORDS.longitude}], { icon: bikeIcon }).addTo(map);

    // Update bike position function
    window.updateBikePosition = function(lat, lng, bearing) {
      if (bikeMarker) {
        bikeMarker.setLatLng([lat, lng]);
      }
    };

    // Recenter map function
    window.recenterMap = function() {
      if (routeLine) {
        map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });
      }
    };
  </script>
</body>
</html>
    `;
  }, [route, userCoords]);

  return (
    <View style={styles.container}>
      {/* OpenStreetMap via WebView */}
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

      {/* Top bar */}
      <SafeAreaView style={styles.topBar} edges={['top']}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.surface }]}
          onPress={() => router.back()}
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
