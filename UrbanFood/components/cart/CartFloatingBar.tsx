import { ThemedText } from '@/components/themed-text';
import { Brand, Colors } from '@/constants/theme';
import { RootState } from '@/src/store/rootReducer';
import { CartFloatingBarProps } from '@/src/types/components';
import { cartFloatingBarStyles as styles } from '@/styles/components/cartFloatingBarStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSelector } from 'react-redux';

const CartFloatingBar: React.FC<CartFloatingBarProps> = () => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();

  const cart = useSelector((state: RootState) => state.cart.cart);

  // Calculate total items
  const totalItems = cart?.dishes.reduce((sum, dish) => sum + dish.quantity, 0) ?? 0;

  // Don't show if cart is empty
  if (!cart || totalItems === 0) {
    return null;
  }

  const handlePress = () => {
    router.push('/(tabs)/cart');
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
            {totalItems > 0 && (
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>{totalItems}</ThemedText>
              </View>
            )}
          </View>
          <View>
            <ThemedText style={styles.itemsText}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
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
