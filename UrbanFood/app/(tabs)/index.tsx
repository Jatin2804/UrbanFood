import CartFloatingBar from '@/components/cart/CartFloatingBar';
import { HorizontalDishCardSkeleton } from '@/components/skeletons/DishCardSkeleton';
import BannerCarousel from '@/components/home/BannerCarousel';
import BottomBanner from '@/components/home/BottomBanner';
import CategoryCarousel from '@/components/home/CategoryCarousel';
import GreetingSection from '@/components/home/GreetingSection';
import HomeHeader from '@/components/home/HomeHeader';
import HomeSearchBar from '@/components/home/HomeSearchBar';
import OfferCarousel from '@/components/home/OfferCarousel';
import RestaurantCard from '@/components/home/RestaurantCard';
import ScrollSection from '@/components/home/ScrollSection';
import OrderStatusSection from '@/components/orders/FloatingOrderStatus';
import { ThemedView } from '@/components/themed-view';
import { Brand, Spacing } from '@/constants/theme';
import { Dish } from '@/src/features/dishes/dishesType';

import { useAuth } from '@/src/hooks/useAuth';
import { useDishes } from '@/src/hooks/useDishes';
import { useOrders } from '@/src/hooks/useOrders';
import { useTranslation } from '@/src/hooks/useTranslation';
import { homeStyles as styles } from '@/styles/screens/homeStyles';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';

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
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const { dishes, loading } = useDishes();
  const { user: authUser } = useAuth();
  const { refreshDeliveryOrders } = useOrders(authUser?.id, true);
  const { t } = useTranslation();

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

        {/* Category carousel — below offer carousel */}
        <CategoryCarousel />

        {/* Dish scroll sections */}
        <View style={styles.sectionsWrapper}>
          {loading ? (
            <>
              {/* Skeleton for New Arrivals */}
              <View style={{ marginBottom: Spacing.lg }}>
                <View
                  style={{
                    paddingHorizontal: Spacing.md,
                    marginBottom: Spacing.sm,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: Spacing.sm,
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        backgroundColor: Brand.primaryFaded,
                      }}
                    />
                    <View>
                      <View
                        style={{
                          width: 120,
                          height: 16,
                          borderRadius: 4,
                          backgroundColor: Brand.primaryFaded,
                        }}
                      />
                      <View
                        style={{
                          width: 180,
                          height: 12,
                          borderRadius: 4,
                          backgroundColor: Brand.primaryFaded,
                          marginTop: 4,
                        }}
                      />
                    </View>
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: Spacing.md,
                    gap: Spacing.sm,
                  }}
                >
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <HorizontalDishCardSkeleton
                        key={`new-skeleton-${index}`}
                      />
                    ))}
                </ScrollView>
              </View>

              {/* Skeleton for Top Rated */}
              <View style={{ marginBottom: Spacing.lg }}>
                <View
                  style={{
                    paddingHorizontal: Spacing.md,
                    marginBottom: Spacing.sm,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: Spacing.sm,
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        backgroundColor: '#FFF8E7',
                      }}
                    />
                    <View>
                      <View
                        style={{
                          width: 100,
                          height: 16,
                          borderRadius: 4,
                          backgroundColor: '#FFF8E7',
                        }}
                      />
                      <View
                        style={{
                          width: 160,
                          height: 12,
                          borderRadius: 4,
                          backgroundColor: '#FFF8E7',
                          marginTop: 4,
                        }}
                      />
                    </View>
                  </View>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingHorizontal: Spacing.md,
                    gap: Spacing.sm,
                  }}
                >
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <HorizontalDishCardSkeleton
                        key={`top-skeleton-${index}`}
                      />
                    ))}
                </ScrollView>
              </View>
            </>
          ) : (
            <>
              <ScrollSection
                title={t('home.newArrivals')}
                subtitle={t('home.newArrivalsSubtitle')}
                icon="sparkles-outline"
                iconColor={Brand.primary}
                iconBg={Brand.primaryFaded}
                dishes={newArrivals}
                showNewBadge
              />

              <ScrollSection
                title={t('home.topRated')}
                subtitle={t('home.topRatedSubtitle')}
                icon="star"
                iconColor="#FFB800"
                iconBg="#FFF8E7"
                dishes={topRated}
              />
            </>
          )}
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
