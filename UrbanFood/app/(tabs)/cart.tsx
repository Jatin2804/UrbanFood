import BillSummary from '@/components/cart/BillSummary';
import CartEmptyState from '@/components/cart/CartEmptyState';
import CartHeader from '@/components/cart/CartHeader';
import CartRow from '@/components/cart/CartRow';
import CheckoutBar from '@/components/cart/CheckoutBar';
import OfferSection from '@/components/cart/OfferSection';
import OfferSheet from '@/components/cart/OfferSheet';
import PlaceOrderSheet from '@/components/cart/PlaceOrderSheet';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors, Spacing } from '@/constants/theme';
import { useCart } from '@/src/hooks/useCart';
import { getDishById } from '@/src/services/apiService';
import { RootState } from '@/src/store/rootReducer';
import { cartStyles as styles } from '@/styles/screens/cartStyles';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    ScrollView,
    useColorScheme,
} from 'react-native';
import { useSelector } from 'react-redux';

const SHEET_HEIGHT = 500;
const ORDER_SHEET_HEIGHT = 280;

const Cart = () => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();

  const {
    cart,
    dishes,
    itemCount,
    loading,
    updating,
    loadCart,
    handleRemoveFromCart,
    handleClearCart,
    handleApplyOffer,
    handleRemoveOffer,
  } = useCart();
  const allDishes = useSelector((state: RootState) => state.dishes.dishes);

  // Offer bottom sheet animation
  const [sheetVisible, setSheetVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  // Place Order bottom sheet animation
  const [orderSheetVisible, setOrderSheetVisible] = useState(false);
  const orderSlideAnim = useRef(new Animated.Value(ORDER_SHEET_HEIGHT)).current;

  const openSheet = useCallback(() => {
    setSheetVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }, [slideAnim]);

  const closeSheet = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSheetVisible(false));
  }, [slideAnim]);

  const openOrderSheet = useCallback(() => {
    setOrderSheetVisible(true);
    Animated.spring(orderSlideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }, [orderSlideAnim]);

  const closeOrderSheet = useCallback(() => {
    Animated.timing(orderSlideAnim, {
      toValue: ORDER_SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setOrderSheetVisible(false));
  }, [orderSlideAnim]);

  useEffect(() => {
    loadCart();
  }, []);

  const onRemove = (dishId: string) => {
    Alert.alert('Remove Item', 'Remove this item from cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => handleRemoveFromCart(dishId),
      },
    ]);
  };

  const onClear = () => {
    Alert.alert('Clear Cart', 'Remove all items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: handleClearCart },
    ]);
  };

  const onApplyOffer = async (offerId: string) => {
    const result = await handleApplyOffer(offerId);
    if (result && 'error' in result && result.error) {
      Alert.alert('Cannot Apply', (result.payload as string) ?? 'Failed to apply offer');
    } else {
      closeSheet();
    }
  };

  const onRemoveOffer = async () => {
    await handleRemoveOffer();
    closeSheet();
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
      <CartHeader
        itemCount={itemCount}
        hasItems={dishes.length > 0}
        onClear={onClear}
      />

      {dishes.length === 0 ? (
        <CartEmptyState />
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
                  onRemove={() => onRemove(dish.dishId)}
                  onPress={() => router.push(`/dish/${dish.dishId}`)}
                />
              );
            })}

            {/* Offer section — above bill */}
            <OfferSection cart={cart} onOpen={openSheet} />

            <BillSummary cart={cart} />
          </ScrollView>

          <CheckoutBar cart={cart} onPlaceOrder={openOrderSheet} />
        </>
      )}

      {/* Offer bottom sheet */}
      <OfferSheet
        visible={sheetVisible}
        slideAnim={slideAnim}
        cart={cart}
        applying={updating}
        onApply={onApplyOffer}
        onRemove={onRemoveOffer}
        onClose={closeSheet}
      />

      {/* Place Order bottom sheet */}
      <PlaceOrderSheet
        visible={orderSheetVisible}
        slideAnim={orderSlideAnim}
        onDineIn={() => {
          closeOrderSheet();
          router.push('/book-table');
        }}
        onCashOnDelivery={() => {
          closeOrderSheet();
          router.push('/checkout');
        }}
        onClose={closeOrderSheet}
      />
    </ThemedView>
  );
};

export default Cart;
