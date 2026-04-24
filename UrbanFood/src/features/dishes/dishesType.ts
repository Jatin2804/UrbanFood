export interface Feedback {
  userId: string;
  comment: string;
  rating: number;
}

export interface Dish {
  id: string;
  name: string;
  type: string;
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
