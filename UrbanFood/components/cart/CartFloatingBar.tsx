import { ThemedText } from '@/components/themed-text';
import { Brand, Colors } from '@/constants/theme';
import { ROUTES } from '@/src/constants/navigation';
import { useCart } from '@/src/hooks/useCart';
import { CartFloatingBarProps } from '@/src/types/components';
import { cartFloatingBarStyles as styles } from '@/styles/components/cartFloatingBarStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';

const CartFloatingBar: React.FC<CartFloatingBarProps> = () => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();

  const { cart, itemCount } = useCart();

  // Don't show if cart is empty
  if (!cart || itemCount === 0) {
    return null;
  }

  const handlePress = () => {
    router.push(ROUTES.TABS.CART);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.bar, { backgroundColor: Brand.primary }]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.leftSection}>
          <View style={styles.iconWrap}>
            <Ionicons name="cart" size={20} color="#fff" />
            {itemCount > 0 && (
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>{itemCount}</ThemedText>
              </View>
            )}
          </View>
          <View>
            <ThemedText style={styles.itemsText}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </ThemedText>
            <ThemedText style={styles.priceText}>₹{cart.finalPrice}</ThemedText>
          </View>
        </View>

        <View style={styles.rightSection}>
          <ThemedText style={styles.viewCartText}>View Cart</ThemedText>
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CartFloatingBar;
