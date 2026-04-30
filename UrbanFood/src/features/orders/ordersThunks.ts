import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createOrdersFileAPI,
  fetchOrdersAPI,
  getOrdersMeta,
  updateOrdersAPI,
} from '../../services/apiService';
import { RootState } from '../../store/rootReducer';
import { Order } from './ordersTypes';

const parseData = (data: any): Order[] => {
  if (!data) return [];
  let parsed = data;
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return [];
    }
  }
  // Handle { orders: [...] } wrapper (from GitHub storage)
  if (parsed?.orders && Array.isArray(parsed.orders)) return parsed.orders;
  // Handle plain array
  if (Array.isArray(parsed)) return parsed;
  return [];
};

async function pushToGitHub(orders: Order[]) {
  try {
    const meta = await getOrdersMeta();
    if (meta?.sha) {
      await updateOrdersAPI(orders, meta.sha);
    } else {
      await createOrdersFileAPI(orders);
    }
  } catch {
    // GitHub push failed silently — local state is still correct
  }
}

export const fetchOrders = createAsyncThunk<
  Order[],
  string | undefined,
  { rejectValue: string }
>('orders/fetch', async (userId, { rejectWithValue }) => {
  try {
    const raw = await fetchOrdersAPI();
    const allOrders: Order[] = parseData(raw);

    if (userId) {
      return allOrders.filter((order) => order.userId === userId);
    }

    return allOrders;
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Failed to fetch orders');
  }
});

export const createOrder = createAsyncThunk<
  Order,
  Omit<Order, 'orderId' | 'orderTime'>,
  { rejectValue: string; state: RootState }
>('orders/create', async (orderData, { rejectWithValue }) => {
  try {
    const raw = await fetchOrdersAPI();
    const allOrders: Order[] = parseData(raw);

    const newOrder: Order = {
      ...orderData,
      orderId: `order_${Date.now()}`,
      orderTime: new Date().toISOString(),
    };

    const updatedOrders = [...allOrders, newOrder];
    await pushToGitHub(updatedOrders);

    return newOrder;
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Failed to create order');
  }
});

export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: string; status: Order['status'] },
  { rejectValue: string; state: RootState }
>(
  'orders/updateStatus',
  async ({ orderId, status }, { rejectWithValue, getState }) => {
    try {
      const raw = await fetchOrdersAPI();
      const allOrders: Order[] = parseData(raw);

      const orderIndex = allOrders.findIndex((o) => o.orderId === orderId);

      let updatedOrder: Order;
      let ordersToSave: Order[];

      if (orderIndex !== -1) {
        // Order exists on GitHub — update it in place
        updatedOrder = { ...allOrders[orderIndex], status };
        ordersToSave = allOrders.map((o, i) =>
          i === orderIndex ? updatedOrder : o,
        );
      } else {
        // Order not on GitHub yet (pushToGitHub from createOrder may still be in-flight).
        // Fall back to Redux state so we can still mark it delivered.
        const localOrder = getState().orders.orders.find(
          (o) => o.orderId === orderId,
        );
        if (!localOrder) {
          return rejectWithValue('Order not found locally or on GitHub');
        }
        updatedOrder = { ...localOrder, status };
        // Merge: append the local order (not on GitHub) alongside any existing ones
        ordersToSave = [...allOrders, updatedOrder];
      }

      await pushToGitHub(ordersToSave);
      return updatedOrder;
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Failed to update order status');
    }
  },
);

export const cancelOrder = createAsyncThunk<
  Order,
  string,
  { rejectValue: string; state: RootState }
>('orders/cancel', async (orderId, { rejectWithValue }) => {
  try {
    const raw = await fetchOrdersAPI();
    const allOrders: Order[] = parseData(raw);

    const orderIndex = allOrders.findIndex((o) => o.orderId === orderId);
    if (orderIndex === -1) {
      return rejectWithValue('Order not found');
    }

    const cancelledOrder: Order = {
      ...allOrders[orderIndex],
      status: 'failed',
    };

    const updatedOrders = allOrders.map((o, i) =>
      i === orderIndex ? cancelledOrder : o,
    );

    await pushToGitHub(updatedOrders);

    return cancelledOrder;
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Failed to cancel order');
  }
});

// ── Expire overdue pending orders ─────────────────────────────────────────────
// Runs on home focus. Finds all pending orders whose estimatedTime has passed,
// marks them 'failed' in Redux immediately, and syncs the update to GitHub.
export const expireOverdueOrders = createAsyncThunk<
  Order[], // returns the list of orders that were expired
  void,
  { state: RootState; rejectValue: string }
>('orders/expireOverdue', async (_, { getState, rejectWithValue }) => {
  try {
    const now = Date.now();
    const localOrders = getState().orders.orders;

    // Find pending orders whose ETA has passed
    const overdue = localOrders.filter(
      (o) =>
        o.status === 'pending' &&
        o.estimatedTime &&
        new Date(o.estimatedTime).getTime() < now,
    );

    if (overdue.length === 0) return [];

    const overdueIds = new Set(overdue.map((o) => o.orderId));
    const expiredOrders: Order[] = overdue.map((o) => ({
      ...o,
      status: 'failed',
    }));

    // Fetch current GitHub state to build the merged list
    const raw = await fetchOrdersAPI();
    const githubOrders: Order[] = parseData(raw);
    const githubIds = new Set(githubOrders.map((o) => o.orderId));

    // Update any overdue orders that exist on GitHub
    const updatedGithub = githubOrders.map((o) =>
      overdueIds.has(o.orderId) ? { ...o, status: 'failed' as const } : o,
    );

    // Also include local-only overdue orders not yet on GitHub
    const localOnlyExpired = expiredOrders.filter(
      (o) => !githubIds.has(o.orderId),
    );

    await pushToGitHub([...updatedGithub, ...localOnlyExpired]);

    return expiredOrders;
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Failed to expire overdue orders');
  }
});
