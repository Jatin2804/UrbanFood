import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useNotifications } from '@/src/hooks/useNotifications';
import { store } from '@/src/store';

export const unstable_settings = {
  initialRouteName: 'index',
};

function AppContent() {
  const colorScheme = useColorScheme();

  // Initialize notifications (now inside Provider)
  useNotifications();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Splash" options={{ headerShown: false }} />
        <Stack.Screen name="Login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="dish/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="book-table" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="order-success" options={{ headerShown: false }} />
        <Stack.Screen name="delivery-map" options={{ headerShown: false }} />
        <Stack.Screen name="orders" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="dine-in" options={{ headerShown: false }} />
        <Stack.Screen name="booking-success" options={{ headerShown: false }} />
        <Stack.Screen
          name="notification-test"
          options={{ headerShown: true, title: 'Test Notifications' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
