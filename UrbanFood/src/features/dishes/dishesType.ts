export interface Feedback {
  userId: string;
  comment: string;
  rating: number;
}

// Multilingual text fields
interface LocalizedText {
  en: string;
  hi: string;
  te: string;
  kn: string;
}

export interface Dish {
  id: string;
  name: LocalizedText;
  type: LocalizedText;
  bannerImages: string[];
  ratings: number;
  feedback: Feedback[];
  addedDate: string;
  price: number;
  nonVeg: boolean;
}

export interface DishesState {
  dishes: Dish[];
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
}

/**
 * Get localized dish name
 */
export const getDishName = (dish: Dish, lang: 'en' | 'hi' | 'te' | 'kn' = 'en'): string => {
  return dish.name[lang];
};

/**
 * Get localized dish type
 */
export const getDishType = (dish: Dish, lang: 'en' | 'hi' | 'te' | 'kn' = 'en'): string => {
  return dish.type[lang];
};
