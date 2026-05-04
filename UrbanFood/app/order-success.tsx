import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { orderSuccessStyles as styles } from '@/styles/screens/orderSuccessStyles';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  BackHandler,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderSuccess() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();
  const params = useLocalSearchParams<{
    orderId?: string;
    userLat?: string;
    userLng?: string;
  }>();

  // Scale + fade animation for the tick icon
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Pulse ring animation
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Use the actual order ID from params or generate a display ID
  const orderId = params.orderId
    ? `UF${params.orderId.slice(-6)}`
    : `UF${Date.now().toString().slice(-6)}`;

  // ── Handle back navigation (gesture & hardware button) ──────────────────────
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.push('/(tabs)');
        return true; // Prevent default back behavior
      };

      // For Android hardware back button
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [router]),
  );

  useEffect(() => {
    // Pop-in animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 14,
        speed: 8,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse ring loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Auto-navigate after 3 seconds
    const timer = setTimeout(() => navigateToTracking(), 3000);
    return () => clearTimeout(timer);
  }, []);

  const navigateToTracking = () => {
    const query: Record<string, string> = {};
    if (params.orderId) query.orderId = params.orderId;
    if (params.userLat) query.userLat = params.userLat;
    if (params.userLng) query.userLng = params.userLng;
    router.replace({ pathname: '/delivery-map', params: query });
  };

  const handleBackToHome = () => {
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        {/* Back button */}
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.surface }]}
          onPress={handleBackToHome}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
        </TouchableOpacity>

        {/* Tick icon */}
        <Animated.View
          style={[styles.iconWrap, { transform: [{ scale: scaleAnim }] }]}
        >
          <Ionicons name="checkmark" size={64} color="#fff" />
        </Animated.View>

        {/* Text */}
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <ThemedText style={[styles.title, { color: theme.textPrimary }]}>
            Order Confirmed!
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Your order has been placed successfully.{'\n'}
            We're preparing it right now!
          </ThemedText>

          {/* Order ID */}
          <View
            style={[
              styles.orderIdPill,
              {
                borderColor: theme.border,
                backgroundColor: theme.surfaceSecondary,
              },
            ]}
          >
            <Ionicons
              name="receipt-outline"
              size={14}
              color={theme.textSecondary}
            />
            <ThemedText
              style={[styles.orderIdText, { color: theme.textSecondary }]}
            >
              Order #{orderId}
            </ThemedText>
          </View>

          {/* Track button */}
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={navigateToTracking}
            activeOpacity={0.85}
          >
            <Ionicons name="navigate" size={20} color="#fff" />
            <ThemedText style={styles.trackBtnText}>Track My Order</ThemedText>
          </TouchableOpacity>

          <ThemedText style={[styles.autoHint, { color: theme.textTertiary }]}>
            Redirecting to tracking in 3 seconds...
          </ThemedText>
        </Animated.View>
      </ThemedView>
    </SafeAreaView>
  );
}
