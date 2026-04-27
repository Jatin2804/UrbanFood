import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createCartsFileAPI,
  fetchCartsAPI,
  getCartsMeta,
  updateCartsAPI,
} from '../../services/apiService';
import { RootState } from '../../store/rootReducer';
import { Cart, CartDish } from './cartTypes';

const parseData = (data: any): Cart[] => {
  if (!data) return [];
  let parsed = data;
  if (typeof parsed === 'string') {
    try {
      if (parsed.trim().startsWith('"carts":')) parsed = '{' + parsed + '}';
      parsed = JSON.parse(parsed);
    } catch {
      return [];
    }
  }
  if (Array.isArray(parsed)) return parsed;
  if (parsed?.carts && Array.isArray(parsed.carts)) return parsed.carts;
  return [];
};

const computeTotals = (dishes: CartDish[], discount: number) => {
  const totalPrice = dishes.reduce((sum, d) => sum + d.price * d.quantity, 0);
  const finalPrice = Math.max(0, totalPrice - discount);
  return { totalPrice, finalPrice };
};

async function pushToGitHub(cart: Cart) {
  try {
    const raw = await fetchCartsAPI();
    const allCarts: Cart[] = parseData(raw);
    const idx = allCarts.findIndex((c) => c.userId === cart.userId);
    const updated =
      idx >= 0
        ? allCarts.map((c, i) => (i === idx ? cart : c))
        : [...allCarts, cart];

    const meta = await getCartsMeta();
    if (meta?.sha) {
      await updateCartsAPI(updated, meta.sha);
    } else {
      await createCartsFileAPI(updated);
    }
  } catch {
    // GitHub push failed silently — local state is still correct
  }
}

export const fetchCart = createAsyncThunk<
  Cart | null,
  string,
  { rejectValue: string }
>('cart/fetch', async (userId, { rejectWithValue }) => {
  try {
    const raw = await fetchCartsAPI();
    const carts: Cart[] = parseData(raw);
    const found = carts.find((c) => c.userId === userId);
    if (found) return found;

    const newCart: Cart = {
      cartId: `cart_${Date.now()}`,
      userId,
      dishes: [],
      offerId: null,
      discount: 0,
      totalPrice: 0,
      finalPrice: 0,
      createdAt: new Date().toISOString(),
    };
    await pushToGitHub(newCart);
    return newCart;
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk<
  Cart,
  { userId: string; dish: CartDish },
  { rejectValue: string; state: RootState }
>('cart/addItem', async ({ userId, dish }, { getState, rejectWithValue }) => {
  try {
    const current = getState().cart.cart;

    let cart: Cart = current ?? {
      cartId: `cart_${Date.now()}`,
      userId,
      dishes: [],
      offerId: null,
      discount: 0,
      totalPrice: 0,
      finalPrice: 0,
      createdAt: new Date().toISOString(),
    };

    const existIdx = cart.dishes.findIndex((d) => d.dishId === dish.dishId);
    let newDishes: CartDish[];
    if (existIdx >= 0) {
      newDishes = cart.dishes.map((d, i) =>
        i === existIdx ? { ...d, quantity: d.quantity + dish.quantity } : d,
      );
    } else {
      newDishes = [...cart.dishes, dish];
    }

    const { totalPrice, finalPrice } = computeTotals(newDishes, cart.discount);
    const updatedCart: Cart = {
      ...cart,
      dishes: newDishes,
      totalPrice,
      finalPrice,
    };

    pushToGitHub(updatedCart);

    return updatedCart;
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Failed to add item');
  }
});

export const updateQuantity = createAsyncThunk<
  Cart,
  { userId: string; dishId: string; quantity: number },
  { rejectValue: string; state: RootState }
>(
  'cart/updateQuantity',
  async ({ userId, dishId, quantity }, { getState, rejectWithValue }) => {
    try {
      const current = getState().cart.cart;
      if (!current) return rejectWithValue('Cart not found');

      const newDishes: CartDish[] =
        quantity <= 0
          ? current.dishes.filter((d) => d.dishId !== dishId)
          : current.dishes.map((d) =>
              d.dishId === dishId ? { ...d, quantity } : d,
            );

      const { totalPrice, finalPrice } = computeTotals(
        newDishes,
        current.discount,
      );
      const updatedCart: Cart = {
        ...current,
        dishes: newDishes,
        totalPrice,
        finalPrice,
      };

      pushToGitHub(updatedCart);

      return updatedCart;
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Failed to update quantity');
    }
  },
);

export const removeFromCart = createAsyncThunk<
  Cart,
  { userId: string; dishId: string },
  { rejectValue: string; state: RootState }
>(
  'cart/removeItem',
  async ({ userId, dishId }, { getState, rejectWithValue }) => {
    try {
      const current = getState().cart.cart;
      if (!current) return rejectWithValue('Cart not found');

      const newDishes = current.dishes.filter((d) => d.dishId !== dishId);
      const { totalPrice, finalPrice } = computeTotals(
        newDishes,
        current.discount,
      );
      const updatedCart: Cart = {
        ...current,
        dishes: newDishes,
        totalPrice,
        finalPrice,
      };

      pushToGitHub(updatedCart);

      return updatedCart;
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Failed to remove item');
    }
  },
);

export const clearCart = createAsyncThunk<
  Cart,
  string,
  { rejectValue: string; state: RootState }
>('cart/clear', async (userId, { getState, rejectWithValue }) => {
  try {
    const current = getState().cart.cart;

    const clearedCart: Cart = current
      ? { ...current, dishes: [], discount: 0, totalPrice: 0, finalPrice: 0 }
      : {
          cartId: `cart_${Date.now()}`,
          userId,
          dishes: [],
          offerId: null,
          discount: 0,
          totalPrice: 0,
          finalPrice: 0,
          createdAt: new Date().toISOString(),
        };

    pushToGitHub(clearedCart);

    return clearedCart;
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Failed to clear cart');
  }
});
