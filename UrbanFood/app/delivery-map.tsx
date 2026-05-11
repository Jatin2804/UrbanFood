import DeliveryStatusCard from '@/components/delivery/DeliveryStatusCard';
import { ThemedText } from '@/components/themed-text';
import { Brand, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
    DELIVERY_DURATION_MS,
    DELIVERY_PARTNER,
    DeliveryStatus,
    INITIAL_ETA_MINUTES,
    RESTAURANT_COORDS,
    STEP_INTERVAL_MS,
} from '@/src/constants/delivery';
import { ROUTES } from '@/src/constants/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { useOrders } from '@/src/hooks/useOrders';
import { postFeedbackAPI } from '@/src/services/apiService';
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
import {
    ActivityIndicator,
    Alert,
    Animated,
    Modal,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
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
  }>();

  const { user } = useAuth();
  const { orders, updateStatus } = useOrders(user?.id, true);

  // Find the specific order by orderId from params
  const currentOrder = orders.find((o) => o.orderId === params.orderId);

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

  // Feedback states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

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
        router.push(ROUTES.TABS.HOME);
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

  // ── Fit MapView to route for zoomed only (Expo Go only) ─────────────────────────────────────
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
    // Get timestamps directly from the order object in Redux
    let totalDuration = DELIVERY_DURATION_MS; // 2 min default
    let elapsedAtMount = 0;

    if (currentOrder?.estimatedTime) {
      const estimatedTs = new Date(currentOrder.estimatedTime).getTime();
      const now = Date.now();

      if (currentOrder.orderTime) {
        const orderTs = new Date(currentOrder.orderTime).getTime();
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
          updateStatus(orderToUpdate, 'success')
            .then(() => console.log(' Order status updated to success'))
            .catch((error) =>
              console.error(' Failed to update order status:', error),
            );
        }

        setTimeout(() => {
          setShowFeedbackModal(true);
        }, 1500);
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
  }, [routeReady, isDelivered, deliveredAnim, currentOrder]);

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

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating out of 5.');
      return;
    }
    const orderToUpdate = params.orderId || currentOrder?.orderId;
    if (!orderToUpdate || !user?.id) {
      setShowFeedbackModal(false);
      router.replace(ROUTES.TABS.HOME);
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      await postFeedbackAPI({
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        orderId: orderToUpdate,
        rating,
        comment: comment.trim(),
      });
      setFeedbackSuccess(true);
      // Auto-close after 2 seconds and navigate to home
      setTimeout(() => {
        setShowFeedbackModal(false);
        setFeedbackSuccess(false);
        setRating(0);
        setComment('');
        router.replace(ROUTES.TABS.HOME);
      }, 2000);
    } catch (error) {
      Alert.alert('Error', 'Could not submit feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleCloseFeedback = () => {
    setShowFeedbackModal(false);
    setFeedbackSuccess(false);
    setRating(0);
    setComment('');
    // Navigate to home when user skips feedback
    router.replace(ROUTES.TABS.HOME);
  };

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
          onPress={() => router.push(ROUTES.TABS.HOME)}
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

      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseFeedback}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.surface }]}
          >
            {!feedbackSuccess ? (
              <>
                {/* Close button */}
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={handleCloseFeedback}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>

                {/* Icon */}
                <View
                  style={[
                    styles.modalIconCircle,
                    { backgroundColor: `${Brand.primary}15` },
                  ]}
                >
                  <Ionicons name="star" size={32} color={Brand.primary} />
                </View>

                {/* Title & Subtitle */}
                <ThemedText
                  style={[styles.modalTitle, { color: theme.textPrimary }]}
                >
                  How was your experience?
                </ThemedText>
                <ThemedText
                  style={[styles.modalSubtitle, { color: theme.textSecondary }]}
                >
                  Your feedback helps us improve
                </ThemedText>

                {/* Stars */}
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      activeOpacity={0.7}
                      style={styles.starButton}
                    >
                      <Ionicons
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={40}
                        color={
                          star <= rating ? Brand.primary : theme.textTertiary
                        }
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Rating label */}
                {rating > 0 && (
                  <ThemedText
                    style={[styles.ratingLabel, { color: Brand.primary }]}
                  >
                    {rating === 5
                      ? '🎉 Excellent!'
                      : rating === 4
                        ? '😊 Great!'
                        : rating === 3
                          ? '👍 Good'
                          : rating === 2
                            ? '😐 Okay'
                            : '😞 Poor'}
                  </ThemedText>
                )}

                {/* Comment input */}
                <TextInput
                  style={[
                    styles.commentInput,
                    {
                      color: theme.textPrimary,
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                  placeholder="Share your thoughts (optional)"
                  placeholderTextColor={theme.textTertiary}
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  maxLength={200}
                />

                {/* Character count */}
                <ThemedText
                  style={[styles.charCount, { color: theme.textTertiary }]}
                >
                  {comment.length}/200
                </ThemedText>

                {/* Buttons */}
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.skipBtn, { borderColor: theme.border }]}
                    onPress={handleCloseFeedback}
                    activeOpacity={0.7}
                  >
                    <ThemedText
                      style={[
                        styles.skipBtnText,
                        { color: theme.textSecondary },
                      ]}
                    >
                      Skip
                    </ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.submitBtn,
                      {
                        opacity: rating === 0 || isSubmittingFeedback ? 0.5 : 1,
                      },
                    ]}
                    onPress={handleSubmitFeedback}
                    disabled={rating === 0 || isSubmittingFeedback}
                    activeOpacity={0.8}
                  >
                    {isSubmittingFeedback ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <ThemedText style={styles.submitBtnText}>
                          Submit
                        </ThemedText>
                        <Ionicons name="checkmark" size={20} color="#fff" />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {/* Success state */}
                <Animated.View style={styles.successContent}>
                  <View
                    style={[
                      styles.successIconCircle,
                      { backgroundColor: Brand.success },
                    ]}
                  >
                    <Ionicons name="checkmark" size={48} color="#fff" />
                  </View>
                  <ThemedText
                    style={[styles.successTitle, { color: theme.textPrimary }]}
                  >
                    Thank You!
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.successSubtitle,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Your feedback has been submitted successfully
                  </ThemedText>
                  <View style={styles.successStars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name="star"
                        size={24}
                        color={star <= rating ? Brand.primary : theme.border}
                      />
                    ))}
                  </View>
                </Animated.View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
