import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cart } from '../features/cart/cartTypes';

const CART_STORAGE_KEY = '@cart_';

/**
 * Save cart to AsyncStorage
 */
export const saveCart = async (userId: string, cart: Cart) => {
  try {
    const key = `${CART_STORAGE_KEY}${userId}`;
    await AsyncStorage.setItem(key, JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
};

/**
 * Load cart from AsyncStorage
 */
export const loadCart = async (userId: string): Promise<Cart | null> => {
  try {
    const key = `${CART_STORAGE_KEY}${userId}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load cart:', error);
    return null;
  }
};

/**
 * Clear cart from AsyncStorage
 */
export const clearCart = async (userId: string) => {
  try {
    const key = `${CART_STORAGE_KEY}${userId}`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear cart:', error);
  }
};
