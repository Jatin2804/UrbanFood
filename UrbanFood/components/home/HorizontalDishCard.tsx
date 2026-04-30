import AddToCartButton from '@/components/cart/AddToCartButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { FALLBACK_DISH_IMG } from '@/src/constants/explore';
import { Dish } from '@/src/features/dishes/dishesType';
import { horizontalDishCardStyles as styles } from '@/styles/components/horizontalDishCardStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, TouchableOpacity, useColorScheme, View } from 'react-native';

interface HorizontalDishCardProps {
  dish: Dish;
  showNewBadge?: boolean;
}

const HorizontalDishCard = ({
  dish,
  showNewBadge = false,
}: HorizontalDishCardProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const [imgError, setImgError] = useState(false);
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push(`/dish/${dish.id}`)}
    >
      <ThemedView variant="surface" style={styles.card}>
        {/* Image */}
        <Image
          source={
            imgError || !dish.bannerImages?.[0]
              ? FALLBACK_DISH_IMG
              : { uri: dish.bannerImages[0] }
          }
          style={styles.image}
          resizeMode="cover"
          onError={() => setImgError(true)}
          defaultSource={FALLBACK_DISH_IMG}
        />

        {/* Veg badge */}
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

        {/* NEW badge */}
        {showNewBadge && (
          <View style={[styles.newBadge, { backgroundColor: Brand.primary }]}>
            <ThemedText style={styles.newBadgeText}>NEW</ThemedText>
          </View>
        )}

        {/* Info */}
        <View style={styles.content}>
          <ThemedText style={styles.name} numberOfLines={1}>
            {dish.name}
          </ThemedText>
          <ThemedText style={[styles.type, { color: theme.textTertiary }]}>
            {dish.type}
          </ThemedText>
          <View style={styles.footer}>
            <View>
              <ThemedText style={styles.price}>₹{dish.price}</ThemedText>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={10} color="#FFB800" />
                <ThemedText style={styles.ratingText}>
                  {dish.ratings}
                </ThemedText>
              </View>
            </View>
            <AddToCartButton
              dishId={dish.id}
              dishName={dish.name}
              dishPrice={dish.price}
              size="sm"
            />
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default HorizontalDishCard;
