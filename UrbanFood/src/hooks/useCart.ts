import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import {
    addToCart,
    clearCart,
    fetchCart,
    removeFromCart,
    updateQuantity,
} from '../features/cart/cartThunks';
import { CartDish } from '../features/cart/cartTypes';
import { AppDispatch } from '../store';
import { RootState } from '../store/rootReducer';

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectCurrentUser);
  const { cart, loading, updating, error } = useSelector(
    (state: RootState) => state.cart,
  );

  const dishes: CartDish[] = cart?.dishes ?? [];
  const itemCount = dishes.reduce((s, d) => s + d.quantity, 0);

  const loadCart = () => {
    if (user?.id) dispatch(fetchCart(user.id));
  };

  const handleAddToCart = (dish: {
    dishId: string;
    name: string;
    price: number;
    quantity: number;
  }) => {
    if (!user?.id) return;
    dispatch(addToCart({ userId: user.id, dish }));
  };

  const handleUpdateQuantity = (dishId: string, quantity: number) => {
    if (!user?.id) return;
    dispatch(updateQuantity({ userId: user.id, dishId, quantity }));
  };

  const handleRemoveFromCart = (dishId: string) => {
    if (!user?.id) return;
    dispatch(removeFromCart({ userId: user.id, dishId }));
  };

  const handleClearCart = () => {
    if (!user?.id) return;
    dispatch(clearCart(user.id));
  };

  const getItemQuantity = (dishId: string): number =>
    cart?.dishes.find((d) => d.dishId === dishId)?.quantity ?? 0;

  return {
    cart,
    dishes,
    itemCount,
    loading,
    updating,
    error,
    loadCart,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveFromCart,
    handleClearCart,
    getItemQuantity,
  };
};
