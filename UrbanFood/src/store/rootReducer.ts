import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import bookingsReducer from '../features/bookings/bookingsSlice';
import cartReducer from '../features/cart/cartSlice';
import dishesReducer from '../features/dishes/dishesSlice';
import ordersReducer from '../features/orders/ordersSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  dishes: dishesReducer,
  cart: cartReducer,
  orders: ordersReducer,
  bookings: bookingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
