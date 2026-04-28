import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { orderSuccessStyles as styles } from '@/styles/screens/orderSuccessStyles';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderSuccess() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();
  const params = useLocalSearchParams<{ userLat?: string; userLng?: string }>();

  // Scale + fade animation for the tick icon
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Pulse ring animation
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const orderId = `UF${Date.now().toString().slice(-6)}`;

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
    if (params.userLat) query.userLat = params.userLat;
    if (params.userLng) query.userLng = params.userLng;
    router.replace({ pathname: '/delivery-map', params: query });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        {/* Pulse ring behind icon */}
        <Animated.View
          style={[
            styles.iconWrap,
            {
              position: 'absolute',
              backgroundColor: `${Brand.success}30`,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        {/* Tick icon */}
        <Animated.View
          style={[
            styles.iconWrap,
            { transform: [{ scale: scaleAnim }] },
          ]}
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
              { borderColor: theme.border, backgroundColor: theme.surfaceSecondary },
            ]}
          >
            <Ionicons name="receipt-outline" size={14} color={theme.textSecondary} />
            <ThemedText style={[styles.orderIdText, { color: theme.textSecondary }]}>
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
