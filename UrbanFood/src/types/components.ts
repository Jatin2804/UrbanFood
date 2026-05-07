import { FoodCategory } from '../data/categories';

// Category Carousel Props
export interface CategoryCarouselProps {
  categories?: FoodCategory[];
}

export interface CategoryCardProps {
  category: FoodCategory;
  onPress: () => void;
}

// Menu Item Props
export interface MenuItem {
  icon: any;
  labelKey: string;
  iconBg: string;
  iconColor: string;
}
