import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    cancelOrder,
    createOrder,
    expireOverdueOrders,
    fetchOrders,
    updateOrderStatus,
} from '../features/orders/ordersThunks';
import { Order } from '../features/orders/ordersTypes';
import { AppDispatch, RootState } from '../store/rootReducer';

export const useOrders = (userId?: string, skipInitialFetch = false) => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, updating, error } = useSelector(
    (state: RootState) => state.orders,
  );

  useEffect(() => {
    // Skip fetch if:
    // 1. No userId yet
    // 2. Caller opted out (e.g. FloatingOrderStatus reads from shared Redux state)
    // 3. We already have orders loaded (avoids wiping freshly-created order from state)
    if (!userId || skipInitialFetch) return;
    dispatch(fetchOrders(userId));
  }, [dispatch, userId, skipInitialFetch]);

  const createNewOrder = async (
    orderData: Omit<Order, 'orderId' | 'orderTime'>,
  ) => {
    return dispatch(createOrder(orderData)).unwrap();
  };

  const updateStatus = async (orderId: string, status: Order['status']) => {
    return dispatch(updateOrderStatus({ orderId, status })).unwrap();
  };

  const cancelUserOrder = async (orderId: string) => {
    return dispatch(cancelOrder(orderId)).unwrap();
  };

  const refreshOrders = () => {
    dispatch(fetchOrders(userId));
  };

  // Checks all pending orders — if now > estimatedTime, marks them 'failed'
  // and pushes the update to GitHub. Safe to call repeatedly on focus.
  const refreshDeliveryOrders = () => {
    dispatch(expireOverdueOrders());
  };

  // Get all pending orders for the user, sorted newest first
  const pendingOrders = orders
    .filter((o) => o.status === 'pending')
    .sort(
      (a, b) =>
        new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime(),
    );

  // Most recent pending order (kept for backward compat)
  const currentOrder = pendingOrders[0];

  return {
    orders,
    loading,
    updating,
    error,
    createNewOrder,
    updateStatus,
    cancelUserOrder,
    refreshOrders,
    refreshDeliveryOrders,
    currentOrder,
    pendingOrders,
  };
};
