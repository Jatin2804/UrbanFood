import { ThemedText } from '@/components/themed-text';
import { Brand, Colors, Radius, Shadows } from '@/constants/theme';
import { Order } from '@/src/features/orders/ordersTypes';
import { useAuth } from '@/src/hooks/useAuth';
import { useLocation } from '@/src/hooks/useLocation';
import { useOrderTimer } from '@/src/hooks/useOrderTimer';
import { useOrders } from '@/src/hooks/useOrders';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

// ── Single order card (inline, not floating) ───────────────────────────────────
const OrderCard = memo(({ order, theme }: { order: Order; theme: any }) => {
  const router = useRouter();
  const { coords } = useLocation();
  const timeLeft = useOrderTimer(order.estimatedTime);

  const handlePress = useCallback(() => {
    const params: Record<string, string> = {
      orderId: order.orderId,
      orderTime: order.orderTime,
      estimatedTime: order.estimatedTime,
    };
    if (coords) {
      params.userLat = coords.latitude.toString();
      params.userLng = coords.longitude.toString();
    }
    requestAnimationFrame(() => {
      router.push({ pathname: '/delivery-map', params });
    });
  }, [order.orderId, order.orderTime, order.estimatedTime, coords, router]);

  const shortId = `UF${order.orderId.slice(-6).toUpperCase()}`;
  const isArriving = timeLeft.totalSeconds <= 0;

  return (
    <TouchableOpacity
      style={[
        cardStyles.card,
        { backgroundColor: theme.surface, borderColor: theme.border },
        Shadows.sm,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Left: icon */}
      <View style={[cardStyles.iconBox, { backgroundColor: `${Brand.success}20` }]}>
        <Ionicons name="bicycle" size={22} color={Brand.success} />
      </View>

      {/* Middle: text */}
      <View style={cardStyles.textBox}>
        <ThemedText style={[cardStyles.title, { color: theme.textPrimary }]}>
          Order #{shortId}
        </ThemedText>
        <ThemedText style={[cardStyles.eta, { color: Brand.success }]}>
          {isArriving ? '🎉 Arriving now!' : `⏱ Arriving in ${timeLeft.formatted}`}
        </ThemedText>
      </View>

      {/* Right: track chip */}
      <View style={cardStyles.trackChip}>
        <ThemedText style={cardStyles.trackText}>Track</ThemedText>
        <Ionicons name="chevron-forward" size={13} color={Brand.primary} />
      </View>
    </TouchableOpacity>
  );
});

// ── Section (renders nothing if no pending orders) ────────────────────────────
const OrderStatusSection = () => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const { user } = useAuth();

  // skipInitialFetch=true: reads from shared Redux state; avoids overwriting
  // a freshly-created order with a stale GitHub response.
  const { pendingOrders } = useOrders(user?.id, true);

  // Only show truly pending orders (status === 'pending').
  // The pendingOrders selector already filters by status, so this is clean.
  if (!pendingOrders || pendingOrders.length === 0) return null;

  return (
    <View style={sectionStyles.wrapper}>
      <View style={sectionStyles.header}>
        <View style={[sectionStyles.dot, { backgroundColor: Brand.success }]} />
        <ThemedText style={[sectionStyles.heading, { color: theme.textPrimary }]}>
          Active Orders
        </ThemedText>
      </View>
      {pendingOrders.map((order) => (
        <OrderCard key={order.orderId} order={order} theme={theme} />
      ))}
    </View>
  );
};

const sectionStyles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  heading: {
    fontSize: 15,
    fontWeight: '700',
  },
});

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBox: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  eta: {
    fontSize: 13,
    fontWeight: '500',
  },
  trackChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: `${Brand.primary}15`,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  trackText: {
    fontSize: 12,
    fontWeight: '600',
    color: Brand.primary,
  },
});

export default OrderStatusSection;
