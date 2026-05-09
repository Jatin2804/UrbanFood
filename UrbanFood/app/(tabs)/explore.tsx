import CartFloatingBar from '@/components/cart/CartFloatingBar';
import { DishCardSkeleton } from '@/components/common/DishCardSkeleton';
import EmptyState from '@/components/common/EmptyState';
import CategoryList from '@/components/explore/CategoryList';
import DishCard from '@/components/explore/DishCard';
import DishCardList from '@/components/explore/DishCardList';
import FilterBar from '@/components/explore/FilterBar';
import SearchBar from '@/components/explore/SearchBar';
import SortSheet from '@/components/explore/SortSheet';
import ViewToggle from '@/components/explore/ViewToggle';
import { ThemedView } from '@/components/themed-view';
import { SHEET_HEIGHT, SortOption, VegFilter } from '@/src/constants/explore';
import { getDishName, getDishType } from '@/src/features/dishes/dishesType';
import { useDishes } from '@/src/hooks/useDishes';
import { useTranslation } from '@/src/hooks/useTranslation';
import { exploreStyles as styles } from '@/styles/screens/exploreStyles';
import { useLocalSearchParams } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, FlatList } from 'react-native';

const Explore = () => {
  const { dishes, loading } = useDishes();
  const { currentLanguage, t } = useTranslation();
  const lang = currentLanguage as 'en' | 'hi' | 'te' | 'kn';

  // Get deep link parameters
  const params = useLocalSearchParams<{ category?: string; filter?: string }>();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [vegFilter, setVegFilter] = useState<VegFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [sheetVisible, setSheetVisible] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

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
    const types = Array.from(new Set(dishes.map((d) => getDishType(d, lang))));
    return ['All', ...types];
  }, [dishes, lang]);

  const activeFiltersCount =
    (sortBy !== 'none' ? 1 : 0) + (vegFilter !== 'all' ? 1 : 0);

  // Handle deep link parameters - needs to run after categories are loaded
  useEffect(() => {
    if (!dishes.length) return; // Wait for dishes to load

    if (params.category) {
      // Map category to veg filter or category
      const categoryMap: Record<
        string,
        { vegFilter?: VegFilter; category?: string }
      > = {
        veg: { vegFilter: 'veg' },
        nonveg: { vegFilter: 'nonveg' },
        maincourse: { category: 'Main Course' },
        starters: { category: 'Starter' }, // Singular form
        fastfood: { category: 'Fast Food' },
        beverage: { category: 'Beverage' },
        dessert: { category: 'Dessert' },
      };

      const mapping = categoryMap[params.category.toLowerCase()];
      if (mapping) {
        if (mapping.vegFilter) setVegFilter(mapping.vegFilter);
        if (mapping.category) {
          // Check if the category exists in the categories list
          const categoryExists = categories.includes(mapping.category);
          if (categoryExists) {
            setActiveCategory(mapping.category);
          } else {
            // Try to find a similar category (case-insensitive)
            const similarCategory = categories.find(
              (cat) => cat.toLowerCase() === mapping.category?.toLowerCase(),
            );
            if (similarCategory) {
              setActiveCategory(similarCategory);
            }
          }
        }
      }
    }

    if (params.filter) {
      // Map filter to sort option
      const filterMap: Record<string, SortOption> = {
        toprated: 'top_rated',
        newlyadded: 'newest',
      };

      const sortOption = filterMap[params.filter.toLowerCase()];
      if (sortOption) {
        setSortBy(sortOption);
      }
    }
  }, [params.category, params.filter, dishes.length, categories]);

  const filteredDishes = useMemo(() => {
    let result = dishes.filter((d) => {
      const dishName = getDishName(d, lang);
      const dishType = getDishType(d, lang);
      const matchesQuery = dishName.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' || dishType === activeCategory;
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
    else if (sortBy === 'newest')
      result = [...result].sort(
        (a, b) =>
          new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime(),
      );

    return result;
  }, [dishes, query, activeCategory, vegFilter, sortBy, lang]);

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

      {loading ? (
        <CategoryListSkeleton />
      ) : (
        <CategoryList
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      )}

      {!loading && (
        <ViewToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          itemCount={filteredDishes.length}
        />
      )}

      {loading ? (
        <FlatList
          data={Array(6).fill(0)}
          keyExtractor={(_, index) => `skeleton-${index}`}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={viewMode === 'grid' ? styles.columnWrapper : null}
          showsVerticalScrollIndicator={false}
          renderItem={() => <DishCardSkeleton />}
        />
      ) : filteredDishes.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title={t('explore.noDishesFound')}
          subtitle={t('explore.tryDifferentSearch')}
        />
      ) : (
        <FlatList
          data={filteredDishes}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={viewMode === 'grid' ? styles.columnWrapper : null}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            viewMode === 'grid' ? (
              <DishCard dish={item} />
            ) : (
              <DishCardList dish={item} />
            )
          }
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
