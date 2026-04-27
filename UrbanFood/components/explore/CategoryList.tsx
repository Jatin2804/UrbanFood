import { ThemedText } from '@/components/themed-text';
import { Brand, Colors } from '@/constants/theme';
import { CATEGORY_ICONS } from '@/src/constants/explore';
import { exploreStyles as styles } from '@/styles/screens/exploreStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, TouchableOpacity, useColorScheme } from 'react-native';

interface CategoryListProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const CategoryList = ({
  categories,
  activeCategory,
  onSelect,
}: CategoryListProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
      renderItem={({ item }) => {
        const isActive = item === activeCategory;
        const icon = CATEGORY_ICONS[item] ?? 'ellipse-outline';
        return (
          <TouchableOpacity
            style={[
              styles.categoryPill,
              {
                backgroundColor: isActive ? Brand.primary : theme.surface,
                borderColor: isActive ? Brand.primary : theme.border,
                borderWidth: 1,
              },
            ]}
            onPress={() => onSelect(item)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={icon}
              size={16}
              color={isActive ? '#fff' : theme.textSecondary}
            />
            <ThemedText
              style={[
                styles.categoryText,
                { color: isActive ? '#fff' : theme.textPrimary },
              ]}
            >
              {capitalize(item)}
            </ThemedText>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default CategoryList;
