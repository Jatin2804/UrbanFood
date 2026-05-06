import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider, useDispatch, useSelector } from 'react-redux';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  selectCurrentUser,
  selectIsLoggedIn,
} from '@/src/features/auth/authSlice';
import { loadStoredLanguage } from '@/src/features/language/languageThunks';
import { useNotifications } from '@/src/hooks/useNotifications';
import { store } from '@/src/store';
import { authenticateUser } from '@/src/utils/biometricAuth';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

export const unstable_settings = {
  initialRouteName: 'index',
};

function AppContent() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectCurrentUser);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricChecked, setBiometricChecked] = useState(false);
  const [languageLoaded, setLanguageLoaded] = useState(false);

  // Initialize notifications (now inside Provider)
  useNotifications();

  // Load stored language on app start
  useEffect(() => {
    const initLanguage = async () => {
      await dispatch(loadStoredLanguage() as any);
      setLanguageLoaded(true);
    };

    initLanguage();
  }, [dispatch]);

  // Handle biometric authentication on app launch
  useEffect(() => {
    const handleBiometricAuth = async () => {
      // Only check biometric if user is logged in and has it enabled
      if (isLoggedIn && user?.biometricEnabled && !biometricChecked) {
        setIsAuthenticating(true);
        const authenticated = await authenticateUser();

        if (!authenticated) {
          // If biometric auth fails, logout or redirect to login
          router.replace('/Login');
        }

        setIsAuthenticating(false);
        setBiometricChecked(true);
      }
    };

    handleBiometricAuth();
  }, [isLoggedIn, user?.biometricEnabled, biometricChecked]);

  // Show loading screen while authenticating or loading language
  if (isAuthenticating || !languageLoaded) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

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
        <Stack.Screen name="chatbot-splash" options={{ headerShown: false }} />
        <Stack.Screen name="chatbot" options={{ headerShown: false }} />
        <Stack.Screen name="offers" options={{ headerShown: false }} />
        <Stack.Screen name="chatbot-explore" options={{ headerShown: false }} />
        <Stack.Screen
          name="settings"
          options={{ headerShown: true, title: 'Settings' }}
        />
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
