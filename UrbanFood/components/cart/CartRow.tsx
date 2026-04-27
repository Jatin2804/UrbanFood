import AddToCartButton from '@/components/cart/AddToCartButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { FALLBACK_CART_IMG } from '@/src/constants/cart';
import { CartDish } from '@/src/features/cart/cartTypes';
import { cartRowStyles as styles } from '@/styles/components/cartRowStyles';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, TouchableOpacity, useColorScheme, View } from 'react-native';

interface CartRowProps {
  dish: CartDish;
  imageUrl?: string;
  onRemove: () => void;
  onPress: () => void;
}

const CartRow = ({ dish, imageUrl, onRemove, onPress }: CartRowProps) => {
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
          source={imgError || !imageUrl ? FALLBACK_CART_IMG : { uri: imageUrl }}
          style={styles.rowImage}
          resizeMode="cover"
          onError={() => setImgError(true)}
          defaultSource={FALLBACK_CART_IMG}
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

export default CartRow;
