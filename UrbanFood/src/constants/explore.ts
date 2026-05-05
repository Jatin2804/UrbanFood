import { Ionicons } from '@expo/vector-icons';

export type SortOption = 'none' | 'low_high' | 'high_low' | 'top_rated';
export type VegFilter = 'all' | 'veg' | 'nonveg';

export const SORT_OPTIONS: {
  key: SortOption;
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: 'none', labelKey: 'explore.default', icon: 'apps-outline' },
  { key: 'low_high', labelKey: 'explore.lowToHigh', icon: 'arrow-up-outline' },
  { key: 'high_low', labelKey: 'explore.highToLow', icon: 'arrow-down-outline' },
  { key: 'top_rated', labelKey: 'explore.topRated', icon: 'star-outline' },
];

export const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  all: 'grid-outline',
  'main course': 'restaurant-outline',
  starter: 'leaf-outline',
  'fast food': 'fast-food-outline',
  beverage: 'cafe-outline',
  dessert: 'ice-cream-outline',
  // Add common variations
  appetizer: 'leaf-outline',
  drink: 'cafe-outline',
  drinks: 'cafe-outline',
  desserts: 'ice-cream-outline',
  'main courses': 'restaurant-outline',
  starters: 'leaf-outline',
};

/**
 * Get icon for a category with case-insensitive lookup
 */
export const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
  const normalized = category.toLowerCase().trim();
  return CATEGORY_ICONS[normalized] ?? 'restaurant-outline';
};

export const FALLBACK_DISH_IMG = require('../../assets/images/dish.png');
export const SHEET_HEIGHT = 400;
