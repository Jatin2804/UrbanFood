import BannerCarousel from '@/components/home/BannerCarousel';
import GreetingSection from '@/components/home/GreetingSection';
import HomeHeader from '@/components/home/HomeHeader';
import HomeSearchBar from '@/components/home/HomeSearchBar';
import RestaurantCard from '@/components/home/RestaurantCard';
import ScrollSection from '@/components/home/ScrollSection';
import { ThemedView } from '@/components/themed-view';
import { Brand } from '@/constants/theme';
import { selectCurrentUser } from '@/src/features/auth/authSlice';
import { Dish } from '@/src/features/dishes/dishesType';
import { RootState } from '@/src/store/rootReducer';
import { homeStyles as styles } from '@/styles/screens/homeStyles';
import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';

// Dishes added after this date are considered "new arrivals"
const NEW_ARRIVAL_CUTOFF = new Date('2025-01-10');
const TOP_RATED_MIN = 4.5;

const parseDate = (dateStr: string): Date => {
  // Handles formats: "DD-MM-YYYY", "YYYY-MM-DD", "DD/MM/YYYY"
  if (!dateStr) return new Date(0);
  const parts = dateStr.includes('-') ? dateStr.split('-') : dateStr.split('/');
  if (parts.length !== 3) return new Date(dateStr);
  // Detect DD-MM-YYYY vs YYYY-MM-DD by length of first part
  if (parts[0].length === 4) {
    return new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
  }
  return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
};

const Home = () => {
  const user = useSelector(selectCurrentUser);
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const dishes = useSelector((state: RootState) => state.dishes.dishes);

  const newArrivals = useMemo<Dish[]>(
    () =>
      dishes
        .filter((d) => parseDate(d.addedDate) > NEW_ARRIVAL_CUTOFF)
        .sort(
          (a, b) =>
            parseDate(b.addedDate).getTime() - parseDate(a.addedDate).getTime(),
        ),
    [dishes],
  );

  const topRated = useMemo<Dish[]>(
    () =>
      dishes
        .filter((d) => d.ratings > TOP_RATED_MIN)
        .sort((a, b) => b.ratings - a.ratings),
    [dishes],
  );

  return (
    <ThemedView style={styles.container}>
      <HomeHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BannerCarousel />
        <GreetingSection firstName={firstName} />
        <RestaurantCard />
        <HomeSearchBar />

        <View style={styles.sectionsWrapper}>
          <ScrollSection
            title="New Arrivals"
            subtitle="Added after Jan 10, 2025"
            icon="sparkles-outline"
            iconColor={Brand.primary}
            iconBg={Brand.primaryFaded}
            dishes={newArrivals}
            showNewBadge
          />

          <ScrollSection
            title="Top Rated"
            subtitle="Rating above 4.5 ★"
            icon="star"
            iconColor="#FFB800"
            iconBg="#FFF8E7"
            dishes={topRated}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default Home;
