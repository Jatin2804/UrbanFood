import AddToCartButton from '@/components/cart/AddToCartButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { DeepLinks } from '@/src/config/linking';
import { FALLBACK_DISH_IMG } from '@/src/constants/explore';
import { ROUTES } from '@/src/constants/navigation';
import {
  Dish,
  getDishName,
  getDishType,
} from '@/src/features/dishes/dishesType';
import { useAuth } from '@/src/hooks/useAuth';
import { useTranslation } from '@/src/hooks/useTranslation';
import { horizontalDishCardStyles as styles } from '@/styles/components/horizontalDishCardStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Share,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

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
  const { user, toggleFavourite } = useAuth();
  const { currentLanguage } = useTranslation();
  const lang = currentLanguage as 'en' | 'hi' | 'te' | 'kn';

  const isFav = !!user?.favoriteDishes?.includes(dish.id);

  const onShare = async (e?: any) => {
    e?.stopPropagation?.();
    const url = DeepLinks.dish(dish.id);
    const name = getDishName(dish, lang);
    await Share.share({
      message: `${name}\n${url}`,
      url,
      title: name,
    });
  };

  const onToggleFav = async (e?: any) => {
    e?.stopPropagation?.();
    if (!user) return;
    await toggleFavourite(dish.id);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push(ROUTES.DISH_DETAILS(dish.id))}
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

        <View style={styles.topActions}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onToggleFav}
            style={styles.actionBtn}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={18}
              color={isFav ? '#FF4D6D' : '#fff'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onShare}
            style={styles.actionBtn}
          >
            <Ionicons name="share-social-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

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
          <View style={styles.newBadge}>
            <ThemedText style={styles.newBadgeText}>NEW</ThemedText>
          </View>
        )}

        {/* Info */}
        <View style={styles.content}>
          <View style={styles.nameTypeRow}>
            <ThemedText style={styles.name} numberOfLines={1}>
              {getDishName(dish, lang)}
            </ThemedText>
            <ThemedText
              style={[styles.type, { color: theme.textTertiary }]}
              numberOfLines={1}
            >
              {getDishType(dish, lang)}
            </ThemedText>
          </View>

          <View style={styles.footer}>
            <View style={styles.leftSection}>
              <ThemedText style={styles.price}>₹{dish.price}</ThemedText>
              <View style={styles.ratingRow}>
                <Ionicons
                  name="star"
                  size={11}
                  color="#FFB800"
                  style={styles.starIcon}
                />
                <ThemedText style={styles.ratingText}>
                  {dish.ratings.toFixed(1)}
                </ThemedText>
              </View>
            </View>
            <AddToCartButton
              dishId={dish.id}
              dishName={getDishName(dish, lang)}
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
