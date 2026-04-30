import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors, Radius, Shadows, Spacing } from '@/constants/theme';
import { useAuth } from '@/src/hooks/useAuth';
import { useOrders } from '@/src/hooks/useOrders';
import { Order } from '@/src/features/orders/ordersTypes';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STATUS_CONFIG = {
  pending: {
    color: Brand.warning,
    icon: 'time-outline' as const,
    label: 'In Progress',
  },
  success: {
    color: Brand.success,
    icon: 'checkmark-circle-outline' as const,
    label: 'Delivered',
  },
  failed: {
    color: Brand.error,
    icon: 'close-circle-outline' as const,
    label: 'Cancelled',
  },
};

function OrderCard({ order, theme }: { order: Order; theme: any }) {
  const router = useRouter();
  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
  const date = new Date(order.orderTime);
  const dateStr = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const shortId = `UF${order.orderId.slice(-6).toUpperCase()}`;
  const totalItems = order.dishes.reduce((s, d) => s + d.quantity, 0);

  const handleTrack = () => {
    if (order.status === 'pending') {
      router.push({
        pathname: '/delivery-map',
        params: {
          orderId: order.orderId,
          orderTime: order.orderTime,
          estimatedTime: order.estimatedTime,
        },
      });
    }
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border },
        Shadows.sm,
      ]}
    >
      {/* Header Row */}
      <View style={styles.cardHeader}>
        <View>
          <ThemedText style={[styles.orderId, { color: theme.textPrimary }]}>
            #{shortId}
          </ThemedText>
          <ThemedText style={[styles.dateText, { color: theme.textTertiary }]}>
            {dateStr} · {timeStr}
          </ThemedText>
        </View>
        <View
          style={[styles.statusBadge, { backgroundColor: `${cfg.color}18` }]}
        >
          <Ionicons name={cfg.icon} size={14} color={cfg.color} />
          <ThemedText style={[styles.statusText, { color: cfg.color }]}>
            {cfg.label}
          </ThemedText>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Dishes */}
      <View style={styles.dishList}>
        {order.dishes.slice(0, 3).map((dish, i) => (
          <ThemedText
            key={`${dish.dishId}-${i}`}
            style={[styles.dishItem, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {dish.quantity}× {dish.name}
          </ThemedText>
        ))}
        {order.dishes.length > 3 && (
          <ThemedText style={[styles.dishItem, { color: theme.textTertiary }]}>
            +{order.dishes.length - 3} more item
            {order.dishes.length - 3 > 1 ? 's' : ''}
          </ThemedText>
        )}
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View>
          <ThemedText style={[styles.itemCount, { color: theme.textTertiary }]}>
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </ThemedText>
          <ThemedText style={[styles.price, { color: theme.textPrimary }]}>
            ₹{order.finalPrice}
          </ThemedText>
        </View>

        {order.status === 'pending' && (
          <TouchableOpacity
            style={styles.trackBtn}
            onPress={handleTrack}
            activeOpacity={0.8}
          >
            <Ionicons name="navigate" size={14} color="#fff" />
            <ThemedText style={styles.trackBtnText}>Track</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function Orders() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();
  const { user } = useAuth();
  // skipInitialFetch=false: this screen is the authoritative orders list,
  // it should always fetch fresh data from GitHub on mount.
  const { orders, loading, refreshOrders } = useOrders(user?.id);

  // Also refresh on every focus so status changes (success/failed) made on the
  // delivery-map screen are reflected immediately when navigating back.
  // The 800ms delay gives in-flight GitHub status pushes time to complete.
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useFocusEffect(
    useCallback(() => {
      focusTimerRef.current = setTimeout(() => {
        refreshOrders();
      }, 800);
      return () => {
        if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      };
    }, []),
  );

  const sorted = [...orders].sort(
    (a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime(),
  );

  const renderItem = useCallback(
    ({ item }: { item: Order }) => <OrderCard order={item} theme={theme} />,
    [theme],
  );

  const keyExtractor = useCallback((item: Order) => item.orderId, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText
            style={[styles.headerTitle, { color: theme.textPrimary }]}
          >
            My Orders
          </ThemedText>
          <View style={styles.backBtn} />
        </View>

        {loading && orders.length === 0 ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Brand.primary} />
            <ThemedText
              style={[styles.loadingText, { color: theme.textSecondary }]}
            >
              Loading orders...
            </ThemedText>
          </View>
        ) : sorted.length === 0 ? (
          <View style={styles.center}>
            <View
              style={[
                styles.emptyIcon,
                { backgroundColor: Brand.primaryFaded },
              ]}
            >
              <Ionicons
                name="receipt-outline"
                size={48}
                color={Brand.primary}
              />
            </View>
            <ThemedText
              style={[styles.emptyTitle, { color: theme.textPrimary }]}
            >
              No orders yet
            </ThemedText>
            <ThemedText
              style={[styles.emptySubtitle, { color: theme.textSecondary }]}
            >
              Place your first order and track it here!
            </ThemedText>
            <TouchableOpacity
              style={styles.shopBtn}
              onPress={() => router.push('/(tabs)')}
              activeOpacity={0.85}
            >
              <ThemedText style={styles.shopBtnText}>Explore Menu</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={sorted}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refreshOrders}
                colors={[Brand.primary]}
                tintColor={Brand.primary}
              />
            }
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  list: {
    padding: Spacing.md,
    gap: Spacing.sm + 4,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginBottom: Spacing.sm,
  },
  dishList: {
    gap: 3,
    marginBottom: Spacing.sm,
  },
  dishItem: {
    fontSize: 13,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemCount: {
    fontSize: 12,
    marginBottom: 2,
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Brand.success,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  trackBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  shopBtn: {
    backgroundColor: Brand.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm + 4,
    borderRadius: Radius.full,
  },
  shopBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
