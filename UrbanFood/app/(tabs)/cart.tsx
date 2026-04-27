import AddToCartButton from '@/components/cart/AddToCartButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  Brand,
  Colors,
  Radius,
  Shadows,
  Spacing,
  Typography,
} from '@/constants/theme';
import { selectCurrentUser } from '@/src/features/auth/authSlice';
import {
  clearCart,
  fetchCart,
  removeFromCart,
} from '@/src/features/cart/cartThunks';
import { CartDish } from '@/src/features/cart/cartTypes';
import { getDishById } from '@/src/services/apiService';
import { AppDispatch } from '@/src/store';
import { RootState } from '@/src/store/rootReducer';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const FALLBACK = require('../../assets/images/dish.png');

const CartRow = ({
  dish,
  imageUrl,
  onRemove,
  onPress,
}: {
  dish: CartDish;
  imageUrl?: string;
  onRemove: () => void;
  onPress: () => void;
}) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const [imgError, setImgError] = useState(false);

  return (
    <ThemedView variant="surface" style={styles.row}>
      {/* Image */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.imageWrap}
      >
        <Image
          source={imgError || !imageUrl ? FALLBACK : { uri: imageUrl }}
          style={styles.rowImage}
          resizeMode="cover"
          onError={() => setImgError(true)}
          defaultSource={FALLBACK}
        />
        <View
          style={[
            styles.vegBadge,
            { backgroundColor: dish.nonVeg ? '#FFE8E8' : '#E8F8F0' },
          ]}
        >
          <View
            style={[
              styles.vegDot,
              { backgroundColor: dish.nonVeg ? Brand.error : Brand.success },
            ]}
          />
        </View>
      </TouchableOpacity>

      {/* Info */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        style={styles.rowInfo}
      >
        <ThemedText style={styles.rowName} numberOfLines={2}>
          {dish.name}
        </ThemedText>
        <ThemedText
          type="small"
          style={{ color: theme.textTertiary, marginTop: 2 }}
        >
          ₹{dish.price} × {dish.quantity}
        </ThemedText>
        <ThemedText style={styles.rowTotal}>
          ₹{dish.price * dish.quantity}
        </ThemedText>
      </TouchableOpacity>

      {/* Controls */}
      <View style={styles.rowControls}>
        <TouchableOpacity
          style={styles.trashBtn}
          onPress={onRemove}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={14} color={Brand.error} />
        </TouchableOpacity>
        <AddToCartButton
          dishId={dish.dishId}
          dishName={dish.name}
          dishPrice={dish.price}
          size="sm"
        />
      </View>
    </ThemedView>
  );
};

const Cart = () => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const user = useSelector(selectCurrentUser);
  const { cart, loading } = useSelector((state: RootState) => state.cart);
  const allDishes = useSelector((state: RootState) => state.dishes.dishes);

  useEffect(() => {
    if (user?.id) dispatch(fetchCart(user.id));
  }, [user?.id]);

  const dishes = cart?.dishes ?? [];
  const itemCount = dishes.reduce((s, d) => s + d.quantity, 0);

  const handleRemove = (dishId: string) => {
    if (!user?.id) return;
    Alert.alert('Remove Item', 'Remove this item from cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => dispatch(removeFromCart({ userId: user.id, dishId })),
      },
    ]);
  };

  const handleClear = () => {
    if (!user?.id) return;
    Alert.alert('Clear Cart', 'Remove all items?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => dispatch(clearCart(user.id)),
      },
    ]);
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={Brand.primary} />
        <ThemedText
          type="caption"
          style={{ color: theme.textSecondary, marginTop: Spacing.md }}
        >
          Loading your cart...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView variant="surface" style={styles.header}>
        <View>
          <ThemedText type="title">My Cart</ThemedText>
          {itemCount > 0 && (
            <ThemedText
              type="caption"
              style={{ color: theme.textSecondary, marginTop: 2 }}
            >
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </ThemedText>
          )}
        </View>
        {dishes.length > 0 && (
          <TouchableOpacity
            style={[styles.clearBtn, { borderColor: Brand.error }]}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={13} color={Brand.error} />
            <ThemedText
              lightColor={Brand.error}
              darkColor={Brand.error}
              style={styles.clearBtnText}
            >
              Clear all
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      {dishes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconBox,
              { backgroundColor: Brand.primaryFaded },
            ]}
          >
            <Ionicons name="cart-outline" size={52} color={Brand.primary} />
          </View>
          <ThemedText
            type="subtitle"
            style={{ marginTop: Spacing.lg, marginBottom: 6 }}
          >
            Your cart is empty
          </ThemedText>
          <ThemedText
            type="caption"
            style={{ color: theme.textSecondary, textAlign: 'center' }}
          >
            Browse dishes in Explore and add them to your cart
          </ThemedText>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {dishes.map((dish) => {
              const fullDish = getDishById(allDishes, dish.dishId);
              return (
                <CartRow
                  key={dish.dishId}
                  dish={dish}
                  imageUrl={fullDish?.bannerImages?.[0]}
                  onRemove={() => handleRemove(dish.dishId)}
                  onPress={() => router.push(`/dish/${dish.dishId}`)}
                />
              );
            })}

            <ThemedView variant="surface" style={styles.billCard}>
              <ThemedText type="defaultSemiBold" style={styles.billTitle}>
                Bill Details
              </ThemedText>

              <View style={styles.billRow}>
                <ThemedText
                  type="caption"
                  style={{ color: theme.textSecondary }}
                >
                  Item total
                </ThemedText>
                <ThemedText type="caption">₹{cart?.totalPrice ?? 0}</ThemedText>
              </View>

              {(cart?.discount ?? 0) > 0 && (
                <View style={styles.billRow}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Ionicons
                      name="pricetag-outline"
                      size={13}
                      color={Brand.success}
                    />
                    <ThemedText
                      type="caption"
                      lightColor={Brand.success}
                      darkColor={Brand.success}
                    >
                      {cart?.offerId ?? 'Discount'}
                    </ThemedText>
                  </View>
                  <ThemedText
                    type="caption"
                    lightColor={Brand.success}
                    darkColor={Brand.success}
                  >
                    − ₹{cart?.discount}
                  </ThemedText>
                </View>
              )}

              <View style={styles.billRow}>
                <ThemedText
                  type="caption"
                  style={{ color: theme.textSecondary }}
                >
                  Delivery fee
                </ThemedText>
                <ThemedText type="caption">₹40</ThemedText>
              </View>

              <View
                style={[styles.billDivider, { backgroundColor: theme.border }]}
              />

              <View style={styles.billRow}>
                <ThemedText type="defaultSemiBold">To pay</ThemedText>
                <ThemedText style={styles.toPayText}>
                  ₹{(cart?.finalPrice ?? 0) + 40}
                </ThemedText>
              </View>
            </ThemedView>
          </ScrollView>

          <ThemedView variant="surface" style={styles.checkoutBar}>
            <View>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Total payable
              </ThemedText>
              <ThemedText style={styles.checkoutTotal}>
                ₹{(cart?.finalPrice ?? 0) + 40}
              </ThemedText>
            </View>
            <TouchableOpacity style={styles.placeOrderBtn} activeOpacity={0.85}>
              <ThemedText
                lightColor="#fff"
                darkColor="#fff"
                style={styles.placeOrderText}
              >
                Place Order
              </ThemedText>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </ThemedView>
        </>
      )}
    </ThemedView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: 52,
    paddingBottom: Spacing.md,
    ...Shadows.sm,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  clearBtnText: { fontSize: 13, fontWeight: '600' },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 130,
    gap: Spacing.sm,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  imageWrap: {
    position: 'relative',
    flexShrink: 0,
  },
  rowImage: {
    width: 96,
    height: 96,
  },
  vegBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 16,
    height: 16,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  vegDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  rowInfo: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    justifyContent: 'center',
  },
  rowName: { fontSize: 14, fontWeight: '600', lineHeight: 19 },
  rowTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.primary,
    marginTop: 4,
  },

  rowControls: {
    paddingRight: Spacing.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    flexShrink: 0,
    alignSelf: 'stretch',
  },
  trashBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  billCard: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  billTitle: { marginBottom: Spacing.sm },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billDivider: { height: 1, marginVertical: Spacing.sm },
  toPayText: { fontSize: 16, fontWeight: '700', color: Brand.primary },

  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 28,
    ...Shadows.lg,
  },
  checkoutTotal: { fontSize: 20, fontWeight: '700' },
  placeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Brand.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderRadius: Radius.full,
    ...Shadows.primary,
  },
  placeOrderText: { ...Typography.bodySemiBold },
});
