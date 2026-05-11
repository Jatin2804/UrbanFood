import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import DishCard from '@/components/explore/DishCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ROUTES } from '@/src/constants/navigation';
import { Dish } from '@/src/features/dishes/dishesType';
import { useDishes } from '@/src/hooks/useDishes';
import { chatbotExploreStyles } from '@/styles/screens/chatbotExploreStyles';

export default function ChatbotExplore() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { dishIds } = useLocalSearchParams<{ dishIds: string }>();

  const { dishes: allDishes } = useDishes();

  // Parse dish IDs and get corresponding dishes
  const recommendedDishes = useMemo(() => {
    if (!dishIds) return [];
    const ids = dishIds.split(',');
    console.log('Chatbot Explore - Received dish IDs:', ids);
    const dishes = ids
      .map((id) => allDishes.find((dish) => dish.id === id))
      .filter((dish): dish is Dish => dish !== undefined);
    console.log('Chatbot Explore - Found dishes:', dishes.length);
    return dishes;
  }, [dishIds, allDishes]);

  const handleDishPress = (dishId: string) => {
    router.push(ROUTES.DISH_DETAILS(dishId) as any);
  };

  const renderDish = ({ item, index }: { item: Dish; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <DishCard dish={item} onPress={() => handleDishPress(item.id)} />
    </Animated.View>
  );

  const handleExploreMore = () => {
    router.push(ROUTES.TABS.EXPLORE as any);
  };

  const renderFooter = () => (
    <Animated.View entering={FadeInDown.delay(recommendedDishes.length * 100).springify()}>
      <Pressable
        onPress={handleExploreMore}
        style={({ pressed }) => [
          chatbotExploreStyles.exploreMoreCard,
          { 
            borderColor: Brand.primary,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View style={[
          chatbotExploreStyles.exploreMoreIconContainer,
          { borderColor: Brand.primary }
        ]}>
          <Ionicons name="restaurant" size={32} color={Brand.primary} />
        </View>
        <ThemedText style={chatbotExploreStyles.exploreMoreTitle}>
          Explore More Dishes
        </ThemedText>
        <ThemedText style={chatbotExploreStyles.exploreMoreSubtitle}>
          Browse our full menu
        </ThemedText>
        <View style={[
          chatbotExploreStyles.exploreMoreArrow,
          { borderColor: Brand.primary }
        ]}>
          <Ionicons name="arrow-forward" size={20} color={Brand.primary} />
        </View>
      </Pressable>
    </Animated.View>
  );

  return (
    <ThemedView style={chatbotExploreStyles.container}>
      {/* Header */}
      <View
        style={[
          chatbotExploreStyles.header,
          { backgroundColor: colors.surface },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            chatbotExploreStyles.backButton,
            { opacity: pressed ? 0.5 : 1 },
          ]}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={chatbotExploreStyles.headerInfo}>
          <ThemedText style={chatbotExploreStyles.headerTitle}>
            Recommended for You
          </ThemedText>
          <ThemedText style={chatbotExploreStyles.headerSubtitle}>
            {recommendedDishes.length}{' '}
            {recommendedDishes.length === 1 ? 'dish' : 'dishes'}
          </ThemedText>
        </View>
      </View>

      {/* Dishes List */}
      {recommendedDishes.length > 0 ? (
        <FlatList
          data={recommendedDishes}
          renderItem={renderDish}
          keyExtractor={(item) => item.id}
          contentContainerStyle={chatbotExploreStyles.listContent}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={chatbotExploreStyles.emptyContainer}>
          <Ionicons
            name="restaurant-outline"
            size={64}
            color={colors.textTertiary}
          />
          <ThemedText style={chatbotExploreStyles.emptyText}>
            No recommendations found
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}
