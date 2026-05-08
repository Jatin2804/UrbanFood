import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import FloatingChatbotButton from '@/components/chatbot/FloatingChatbotButton';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SCREEN_NAMES } from '@/src/constants/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { useTranslation } from '@/src/hooks/useTranslation';
import { useCart } from '@/src/hooks/useCart';
import { useOrders } from '@/src/hooks/useOrders';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const { t } = useTranslation();

  const { loadCart } = useCart();
  const { refreshOrders } = useOrders(user?.id, true);

  useEffect(() => {
    if (user?.id) {
      loadCart();
      refreshOrders();
    }
  }, [user?.id]);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name={SCREEN_NAMES.TAB_INDEX}
          options={{
            title: t('tabs.home'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size ?? 24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name={SCREEN_NAMES.TAB_EXPLORE}
          options={{
            title: t('tabs.explore'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="compass" size={size ?? 24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name={SCREEN_NAMES.TAB_CART}
          options={{
            title: t('tabs.cart'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart" size={size ?? 24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name={SCREEN_NAMES.TAB_ACCOUNT}
          options={{
            title: t('tabs.account'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size ?? 24} color={color} />
            ),
          }}
        />
      </Tabs>
      <FloatingChatbotButton />
    </>
  );
}
