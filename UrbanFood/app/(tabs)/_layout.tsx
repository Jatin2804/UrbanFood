import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { selectCurrentUser } from '@/src/features/auth/authSlice';
import { fetchCart } from '@/src/features/cart/cartThunks';
import { fetchOrders } from '@/src/features/orders/ordersThunks';
import { AppDispatch } from '@/src/store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectCurrentUser);

  // Fetch cart and orders when tabs mount (user enters main app)
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
      dispatch(fetchOrders(user.id));
    }
  }, [user?.id, dispatch]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size ?? 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size ?? 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size ?? 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size ?? 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
