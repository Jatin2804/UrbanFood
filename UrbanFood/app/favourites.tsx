import CartFloatingBar from '@/components/cart/CartFloatingBar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DishCardSkeleton } from '@/components/common/DishCardSkeleton';
import EmptyState from '@/components/common/EmptyState';
import DishCard from '@/components/explore/DishCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { getDishName } from '@/src/features/dishes/dishesType';
import { useAuth } from '@/src/hooks/useAuth';
import { useDishes } from '@/src/hooks/useDishes';
import { useTranslation } from '@/src/hooks/useTranslation';
import { favouritesStyles as styles } from '@/styles/screens/favouritesStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Favourites = () => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();
  const { dishes, loading } = useDishes();
  const { user } = useAuth();
  const { currentLanguage, t } = useTranslation();
  const lang = currentLanguage as 'en' | 'hi' | 'te' | 'kn';

  const [query, setQuery] = useState('');

  // Filter dishes based on user's favorites
  const favoriteDishes = useMemo(() => {
    if (!user?.favoriteDishes || user.favoriteDishes.length === 0) {
      return [];
    }

    // Get dishes that are in user's favorites
    const favDishes = dishes.filter((dish) =>
      user.favoriteDishes.includes(dish.id),
    );

    // Apply search filter
    if (query.trim() === '') {
      return favDishes;
    }

    return favDishes.filter((dish) => {
      const dishName = getDishName(dish, lang);
      return dishName.toLowerCase().includes(query.toLowerCase());
    });
  }, [dishes, user?.favoriteDishes, query, lang]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        {/* Custom Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText
            style={[styles.headerTitle, { color: theme.textPrimary }]}
          >
            {t('favourites.title')}
          </ThemedText>
          <View style={styles.backBtn} />
        </View>

        {/* Search Bar - wrapped to override default margins */}
        <View
          style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}
        >
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 12,
                borderWidth: 1,
                gap: 12,
                backgroundColor: theme.surfaceSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={20}
              color={theme.textTertiary}
            />
            <TextInput
              style={[
                {
                  flex: 1,
                  fontSize: 16,
                  paddingVertical: 0,
                  color: theme.inputText,
                },
              ]}
              placeholder={t('explore.searchPlaceholder')}
              placeholderTextColor={theme.placeholder}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => setQuery('')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={theme.textTertiary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading ? (
          <FlatList
            data={Array(6).fill(0)}
            keyExtractor={(_, index) => `skeleton-${index}`}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            renderItem={() => <DishCardSkeleton />}
          />
        ) : favoriteDishes.length === 0 ? (
          <EmptyState
            icon="heart-outline"
            title={
              query.trim() !== ''
                ? t('explore.noDishesFound')
                : t('favourites.noFavourites')
            }
            subtitle={
              query.trim() !== ''
                ? t('explore.tryDifferentSearch')
                : t('favourites.noFavouritesMessage')
            }
          />
        ) : (
          <FlatList
            data={favoriteDishes}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <DishCard dish={item} />}
          />
        )}

        {/* Cart Floating Bar */}
        <CartFloatingBar />
      </ThemedView>
    </SafeAreaView>
  );
};

export default Favourites;
