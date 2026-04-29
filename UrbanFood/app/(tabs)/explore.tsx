import CartFloatingBar from '@/components/cart/CartFloatingBar';
import EmptyState from '@/components/common/EmptyState';
import CategoryList from '@/components/explore/CategoryList';
import DishCard from '@/components/explore/DishCard';
import FilterBar from '@/components/explore/FilterBar';
import SearchBar from '@/components/explore/SearchBar';
import SortSheet from '@/components/explore/SortSheet';
import { ThemedView } from '@/components/themed-view';
import { Brand } from '@/constants/theme';
import { SHEET_HEIGHT, SortOption, VegFilter } from '@/src/constants/explore';
import { useDishes } from '@/src/hooks/useDishes';
import { exploreStyles as styles } from '@/styles/screens/exploreStyles';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, View } from 'react-native';

const Explore = () => {
  const { dishes, loading } = useDishes();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [vegFilter, setVegFilter] = useState<VegFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [sheetVisible, setSheetVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  const openSheet = useCallback(() => {
    setSheetVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }, [slideAnim]);

  const closeSheet = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSheetVisible(false));
  }, [slideAnim]);

  const categories = useMemo(() => {
    const types = Array.from(new Set(dishes.map((d) => d.type)));
    return ['All', ...types];
  }, [dishes]);

  const activeFiltersCount =
    (sortBy !== 'none' ? 1 : 0) + (vegFilter !== 'all' ? 1 : 0);

  const filteredDishes = useMemo(() => {
    let result = dishes.filter((d) => {
      const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' || d.type === activeCategory;
      const matchesVeg =
        vegFilter === 'all' ? true : vegFilter === 'veg' ? !d.nonVeg : d.nonVeg;
      return matchesQuery && matchesCategory && matchesVeg;
    });

    if (sortBy === 'low_high')
      result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === 'high_low')
      result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === 'top_rated')
      result = [...result].sort((a, b) => b.ratings - a.ratings);

    return result;
  }, [dishes, query, activeCategory, vegFilter, sortBy]);

  return (
    <ThemedView style={styles.container}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onClear={() => setQuery('')}
      />

      <FilterBar
        activeFiltersCount={activeFiltersCount}
        vegFilter={vegFilter}
        onVegFilterChange={setVegFilter}
        onOpenSheet={openSheet}
      />

      <CategoryList
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Brand.primary} />
        </View>
      ) : filteredDishes.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No dishes found"
          subtitle="Try a different search or category"
        />
      ) : (
        <FlatList
          data={filteredDishes}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <DishCard dish={item} />}
        />
      )}

      <SortSheet
        visible={sheetVisible}
        slideAnim={slideAnim}
        sortBy={sortBy}
        onSelect={(opt) => {
          setSortBy(opt);
          closeSheet();
        }}
        onClear={() => {
          setSortBy('none');
          closeSheet();
        }}
        onClose={closeSheet}
      />

      {/* Cart Floating Bar */}
      <CartFloatingBar />
    </ThemedView>
  );
};

export default Explore;
