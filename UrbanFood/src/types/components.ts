import { ViewMode } from '../constants/explore';
import { FoodCategory } from '../data/categories';
import { Dish } from '../features/dishes/dishesType';

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

// Booking Card Props
export interface BookingCardProps {
  booking: any;
  onCancel: () => void;
  isExpired?: boolean;
}

// Explore View Props
export interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  itemCount: number;
}

export interface DishCardListProps {
  dish: Dish;
}
