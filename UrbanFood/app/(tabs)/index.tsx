import CartFloatingBar from '@/components/cart/CartFloatingBar';
import BannerCarousel from '@/components/home/BannerCarousel';
import BottomBanner from '@/components/home/BottomBanner';
import GreetingSection from '@/components/home/GreetingSection';
import HomeHeader from '@/components/home/HomeHeader';
import HomeSearchBar from '@/components/home/HomeSearchBar';
import OfferCarousel from '@/components/home/OfferCarousel';
import RestaurantCard from '@/components/home/RestaurantCard';
import ScrollSection from '@/components/home/ScrollSection';
import OrderStatusSection from '@/components/orders/FloatingOrderStatus';
import { ThemedView } from '@/components/themed-view';
import { Brand } from '@/constants/theme';
import { selectCurrentUser } from '@/src/features/auth/authSlice';
import { Dish } from '@/src/features/dishes/dishesType';

import { RootState } from '@/src/store/rootReducer';
import { homeStyles as styles } from '@/styles/screens/homeStyles';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { useOrders } from '@/src/hooks/useOrders';

const NEW_ARRIVAL_CUTOFF = new Date('2025-01-10');
const TOP_RATED_MIN = 4.5;

const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date(0);
  const parts = dateStr.includes('-') ? dateStr.split('-') : dateStr.split('/');
  if (parts.length !== 3) return new Date(dateStr);
  if (parts[0].length === 4)
    return new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
  return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
};

const Home = () => {
  const user = useSelector(selectCurrentUser);
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const dishes = useSelector((state: RootState) => state.dishes.dishes);
  const { user: authUser } = useAuth();
  const { refreshDeliveryOrders } = useOrders(authUser?.id, true);

  // On every home focus: expire any pending orders whose ETA has passed
  useFocusEffect(
    useCallback(() => {
      refreshDeliveryOrders();
    }, []),
  );

  // useCart auto-loads cart when user is available — no manual loadCart needed here.

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
        {/* Top auto-scrolling restaurant banner */}
        <BannerCarousel />

        <GreetingSection firstName={firstName} />

        {/* Active order status — shown inline below greeting */}
        <OrderStatusSection />

        <RestaurantCard />

        {/* Search bar — taps navigate to Explore */}
        <HomeSearchBar />

        {/* Offer carousel — below search bar */}
        <OfferCarousel />

        {/* Dish scroll sections */}
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

        {/* Bottom promotional banner — tap handler empty for now */}
        <BottomBanner />
      </ScrollView>

      {/* Cart Floating Bar */}
      <CartFloatingBar />
    </ThemedView>
  );
};

export default Home;
