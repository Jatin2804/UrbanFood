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
import { dishCardListStyles as styles } from '@/styles/components/dishCardListStyles';
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

interface DishCardListProps {
  dish: Dish;
}

const DishCardList = ({ dish }: DishCardListProps) => {
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
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <ThemedText style={styles.dishName} numberOfLines={1}>
                {getDishName(dish, lang)}
              </ThemedText>
              <ThemedText
                type="small"
                style={{
                  color: theme.textTertiary,
                  textTransform: 'capitalize',
                  marginTop: 2,
                }}
              >
                {getDishType(dish, lang)}
              </ThemedText>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onToggleFav}
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor:
                      scheme === 'dark'
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.05)',
                  },
                ]}
              >
                <Ionicons
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={18}
                  color={isFav ? '#FF4D6D' : theme.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onShare}
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor:
                      scheme === 'dark'
                        ? 'rgba(255,255,255,0.1)'
                        : 'rgba(0,0,0,0.05)',
                  },
                ]}
              >
                <Ionicons
                  name="share-social-outline"
                  size={18}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.priceSection}>
              <ThemedText style={styles.price}>₹{dish.price}</ThemedText>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#FFB800" />
                <ThemedText type="small" style={styles.ratingText}>
                  {dish.ratings}
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

export default DishCardList;
