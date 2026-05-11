import { DishDetailSkeleton } from '@/components/skeletons/DishDetailSkeleton';
import { useColorScheme } from '@/hooks/use-color-scheme';
import DishBottomBar from '@/components/dish/DishBottomBar';
import DishImageCarousel from '@/components/dish/DishImageCarousel';
import DishInfoSection from '@/components/dish/DishInfoSection';
import DishStatsRow from '@/components/dish/DishStatsRow';
import ReviewList from '@/components/dish/ReviewList';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors, Spacing } from '@/constants/theme';
import { DeepLinks } from '@/src/config/linking';
import { getDishName, getDishType } from '@/src/features/dishes/dishesType';
import { useAuth } from '@/src/hooks/useAuth';
import { useDishes } from '@/src/hooks/useDishes';
import { useTranslation } from '@/src/hooks/useTranslation';
import { dishDetailStyles as styles } from '@/styles/screens/dishDetailStyles';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  Share,
  TouchableOpacity,
  View,
} from 'react-native';

const DishDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const { user, toggleFavourite } = useAuth();
  const { currentLanguage } = useTranslation();
  const lang = currentLanguage as 'en' | 'hi' | 'te' | 'kn';

  const { dishes, loading } = useDishes();
  const dish = dishes.find((d) => d.id === id);

  if (loading && !dish) {
    return (
      <ThemedView style={styles.container}>
        <DishDetailSkeleton />
      </ThemedView>
    );
  }

  if (!dish) {
    return (
      <ThemedView style={styles.centered}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={theme.textTertiary}
        />
        <ThemedText type="subtitle" style={{ marginTop: Spacing.md }}>
          Dish not found
        </ThemedText>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtnFallback}
        >
          <ThemedText lightColor={Brand.primary} darkColor={Brand.primary}>
            Go back
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const isFav = !!user?.favoriteDishes?.includes(dish.id);

  const onShare = async () => {
    const url = DeepLinks.dish(dish.id);
    const name = getDishName(dish, lang);
    await Share.share({
      message: `${name}\n${url}`,
      url,
      title: name,
    });
  };

  const onToggleFav = async () => {
    if (!user) return;
    await toggleFavourite(dish.id);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <DishImageCarousel
          images={dish.bannerImages ?? []}
          isNonVeg={dish.nonVeg}
          onBack={() => router.back()}
        />

        <View style={styles.content}>
          <View style={styles.headerActionsRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onToggleFav}
              style={styles.headerActionBtn}
            >
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={20}
                color={isFav ? '#FF4D6D' : theme.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onShare}
              style={styles.headerActionBtn}
            >
              <Ionicons
                name="share-social-outline"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <DishInfoSection
            name={getDishName(dish, lang)}
            type={getDishType(dish, lang)}
            price={dish.price}
          />
          <DishStatsRow
            rating={dish.ratings}
            reviewCount={dish.feedback?.length ?? 0}
            addedDate={dish.addedDate}
          />
          <ReviewList feedback={dish.feedback ?? []} />
        </View>
      </ScrollView>

      <DishBottomBar
        dishId={dish.id}
        dishName={getDishName(dish, lang)}
        price={dish.price}
      />
    </ThemedView>
  );
};

export default DishDetail;
