import BillSummary from '@/components/cart/BillSummary';
import CartEmptyState from '@/components/cart/CartEmptyState';
import CartHeader from '@/components/cart/CartHeader';
import CartRow from '@/components/cart/CartRow';
import CheckoutBar from '@/components/cart/CheckoutBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors, Spacing } from '@/constants/theme';
import { useCart } from '@/src/hooks/useCart';
import { getDishById } from '@/src/services/apiService';
import { RootState } from '@/src/store/rootReducer';
import { cartStyles as styles } from '@/styles/screens/cartStyles';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    useColorScheme,
} from 'react-native';
import { useSelector } from 'react-redux';

const Cart = () => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();

  const {
    cart,
    dishes,
    itemCount,
    loading,
    loadCart,
    handleRemoveFromCart,
    handleClearCart,
  } = useCart();
  const allDishes = useSelector((state: RootState) => state.dishes.dishes);

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
            <BillSummary cart={cart} />
          </ScrollView>

          <CheckoutBar cart={cart} onPlaceOrder={() => {}} />
        </>
      )}
    </ThemedView>
  );
};

export default Cart;
