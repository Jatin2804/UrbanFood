export interface OrderDish {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  nonVeg?: boolean;
}

export type OrderPaymentType = 'cod' | 'online';
export type OrderStatus = 'pending' | 'success' | 'failed';

export interface Order {
  orderId: string;
  userId: string;
  dishes: OrderDish[];
  paymentType: OrderPaymentType;
  status: OrderStatus;
  userAddress: string;
  orderTime: string;
  estimatedTime: string;
  totalPrice: number;
  discount: number;
  finalPrice: number;
  offerId: string | null;
}

export interface OrdersState {
  orders: Order[];
  loading: boolean;
  updating: boolean;
  error: string | null;
}
