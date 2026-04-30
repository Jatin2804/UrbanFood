import DishBottomBar from '@/components/dish/DishBottomBar';
import DishImageCarousel from '@/components/dish/DishImageCarousel';
import DishInfoSection from '@/components/dish/DishInfoSection';
import DishStatsRow from '@/components/dish/DishStatsRow';
import ReviewList from '@/components/dish/ReviewList';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors, Spacing } from '@/constants/theme';
import { RootState } from '@/src/store/rootReducer';
import { dishDetailStyles as styles } from '@/styles/screens/dishDetailStyles';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

const DishDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const dish = useSelector((state: RootState) =>
    state.dishes.dishes.find((d) => d.id === id),
  );

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
          <DishInfoSection
            name={dish.name}
            type={dish.type}
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

      <DishBottomBar dishId={dish.id} dishName={dish.name} price={dish.price} />
    </ThemedView>
  );
};

export default DishDetail;
