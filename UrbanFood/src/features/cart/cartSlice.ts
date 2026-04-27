import { createSlice } from '@reduxjs/toolkit';
import {
  addToCart,
  clearCart,
  fetchCart,
  removeFromCart,
  updateQuantity,
} from './cartThunks';
import { CartState } from './cartTypes';

const initialState: CartState = {
  cart: null,
  loading: false,
  updating: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.cart = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load cart';
      })

      .addCase(addToCart.pending, (state) => {
        state.updating = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.updating = false;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload ?? 'Failed to add item';
      })

      .addCase(updateQuantity.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.updating = false;
        state.cart = action.payload;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload ?? 'Failed to update';
      })

      .addCase(removeFromCart.pending, (state) => {
        state.updating = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.updating = false;
        state.cart = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload ?? 'Failed to remove';
      })

      .addCase(clearCart.pending, (state) => {
        state.updating = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.updating = false;
        state.cart = action.payload;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload ?? 'Failed to clear';
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
