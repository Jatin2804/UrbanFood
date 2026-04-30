import { createSlice } from '@reduxjs/toolkit';
import {
    cancelOrder,
    createOrder,
    expireOverdueOrders,
    fetchOrders,
    updateOrderStatus,
} from './ordersThunks';
import { OrdersState } from './ordersTypes';

const initialState: OrdersState = {
  orders: [],
  loading: false,
  updating: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrdersState: (state) => {
      state.orders = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;

        // Status weight: terminal statuses (success/failed) beat pending.
        // If local state has 'success' but GitHub still says 'pending'
        // (push not yet synced), keep the local terminal status.
        const statusWeight: Record<string, number> = {
          success: 2,
          failed: 2,
          pending: 1,
        };

        const localById = new Map(state.orders.map((o) => [o.orderId, o]));

        // For orders on GitHub: use fetched data but prefer the higher-weight status
        const merged = action.payload.map((fetched) => {
          const local = localById.get(fetched.orderId);
          if (local) {
            const localW = statusWeight[local.status] ?? 1;
            const fetchedW = statusWeight[fetched.status] ?? 1;
            // Prefer the more terminal status
            if (localW > fetchedW) return { ...fetched, status: local.status };
          }
          return fetched;
        });

        // Preserve local-only orders (not yet on GitHub)
        const fetchedIds = new Set(action.payload.map((o) => o.orderId));
        const localOnly = state.orders.filter((o) => !fetchedIds.has(o.orderId));

        state.orders = [...merged, ...localOnly];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load orders';
      })

      .addCase(createOrder.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.updating = false;
        state.orders = [action.payload, ...state.orders];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload ?? 'Failed to create order';
      })

      .addCase(updateOrderStatus.pending, (state, action) => {
        state.updating = true;
        // Optimistic update — apply status change immediately in local state
        const { orderId, status } = action.meta.arg;
        const index = state.orders.findIndex((o) => o.orderId === orderId);
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], status };
        }
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.orders.findIndex(
          (o) => o.orderId === action.payload.orderId,
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload ?? 'Failed to update order';
      })

      .addCase(cancelOrder.pending, (state) => {
        state.updating = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.orders.findIndex(
          (o) => o.orderId === action.payload.orderId,
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload ?? 'Failed to cancel order';
      })

      // Expire overdue: mark all returned orders as 'failed' in one pass
      .addCase(expireOverdueOrders.fulfilled, (state, action) => {
        if (action.payload.length === 0) return;
        const expiredIds = new Set(action.payload.map((o) => o.orderId));
        state.orders = state.orders.map((o) =>
          expiredIds.has(o.orderId) ? { ...o, status: 'failed' } : o,
        );
      });
  },
});

export const { clearOrdersState } = ordersSlice.actions;
export default ordersSlice.reducer;
