export interface CartDish {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  cartId: string;
  userId: string;
  dishes: CartDish[];
  offerId: string | null;
  discount: number;
  totalPrice: number;
  finalPrice: number;
  createdAt: string;
}

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
}
