import { FOOD_CATEGORIES } from '@/src/data/categories';
import { useTranslation } from '@/src/hooks/useTranslation';
import { CategoryCarouselProps } from '@/src/types/components';
import { categoryCarouselStyles as styles } from '@/styles/components/categoryCarouselStyles';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import CategoryCard from './CategoryCard';

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  categories = FOOD_CATEGORIES,
}) => {
  const { t } = useTranslation();

  const handleCategoryPress = (deepLink: string) => {
    router.push(deepLink as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onPress={() => handleCategoryPress(category.deepLink)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default CategoryCarousel;
