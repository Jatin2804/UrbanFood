import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { DELIVERY_FEE } from '@/src/constants/cart';
import { Cart } from '@/src/features/cart/cartTypes';
import { cartStyles as styles } from '@/styles/screens/cartStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';

interface CheckoutBarProps {
  cart: Cart | null;
  onPlaceOrder: () => void;
}

const CheckoutBar = ({ cart, onPlaceOrder }: CheckoutBarProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const total = (cart?.finalPrice ?? 0) + DELIVERY_FEE;

  return (
    <ThemedView variant="surface" style={styles.checkoutBar}>
      <View>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          Total payable
        </ThemedText>
        <ThemedText style={styles.checkoutTotal}>₹{total}</ThemedText>
      </View>
      <TouchableOpacity
        style={styles.placeOrderBtn}
        onPress={onPlaceOrder}
        activeOpacity={0.85}
      >
        <ThemedText lightColor="#fff" darkColor="#fff" style={styles.placeOrderText}>
          Place Order
        </ThemedText>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );
};

export default CheckoutBar;
