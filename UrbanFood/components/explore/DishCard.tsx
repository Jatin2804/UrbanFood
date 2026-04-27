import AddToCartButton from '@/components/cart/AddToCartButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { FALLBACK_DISH_IMG } from '@/src/constants/explore';
import { Dish } from '@/src/features/dishes/dishesType';
import { dishCardStyles as styles } from '@/styles/components/dishCardStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, TouchableOpacity, useColorScheme, View } from 'react-native';

interface DishCardProps {
  dish: Dish;
}

const DishCard = ({ dish }: DishCardProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const [imgError, setImgError] = useState(false);
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push(`/dish/${dish.id}`)}
      style={{ flex: 1 }}
    >
      <ThemedView variant="surface" style={styles.card}>
        <Image
          source={
            imgError || !dish.bannerImages?.[0]
              ? FALLBACK_DISH_IMG
              : { uri: dish.bannerImages[0] }
          }
          style={styles.cardImage}
          resizeMode="cover"
          onError={() => setImgError(true)}
          defaultSource={FALLBACK_DISH_IMG}
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
        <View style={styles.cardContent}>
          <ThemedText style={styles.dishName} numberOfLines={1}>
            {dish.name}
          </ThemedText>
          <ThemedText
            type="small"
            style={{
              color: theme.textTertiary,
              textTransform: 'capitalize',
              marginBottom: 6,
            }}
          >
            {dish.type}
          </ThemedText>
          <View style={styles.cardFooter}>
            <View>
              <ThemedText style={styles.price}>₹{dish.price}</ThemedText>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={11} color="#FFB800" />
                <ThemedText type="small" style={styles.ratingText}>
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

export default DishCard;
