import { Ionicons } from '@expo/vector-icons';

export type SortOption = 'none' | 'low_high' | 'high_low' | 'top_rated';
export type VegFilter = 'all' | 'veg' | 'nonveg';

export const SORT_OPTIONS: {
  key: SortOption;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: 'none', label: 'Default', icon: 'apps-outline' },
  { key: 'low_high', label: 'Price: Low to High', icon: 'arrow-up-outline' },
  { key: 'high_low', label: 'Price: High to Low', icon: 'arrow-down-outline' },
  { key: 'top_rated', label: 'Top Rated', icon: 'star-outline' },
];

export const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  All: 'grid-outline',
  'main course': 'restaurant-outline',
  starter: 'leaf-outline',
  'fast food': 'fast-food-outline',
  beverage: 'cafe-outline',
  dessert: 'ice-cream-outline',
};

export const FALLBACK_DISH_IMG = require('../../assets/images/dish.png');
export const SHEET_HEIGHT = 400;
