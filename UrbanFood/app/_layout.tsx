import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider, useDispatch } from 'react-redux';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { ROUTES, SCREEN_NAMES } from '@/src/constants/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { useDishes } from '@/src/hooks/useDishes';
import { useNotifications } from '@/src/hooks/useNotifications';
import { useTranslation } from '@/src/hooks/useTranslation';
import { store } from '@/src/store';
import { authenticateUser } from '@/src/utils/biometricAuth';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { loadRemoteConfig } from '@/src/services/remoteConfigService';
import { AppDispatch } from '@/src/store';

export const unstable_settings = {
  initialRouteName: SCREEN_NAMES.INDEX,
};

function AppContent() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, user } = useAuth();
  const { loadStoredLanguage } = useTranslation();
  const { loadStoredTheme } = useAppTheme();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricChecked, setBiometricChecked] = useState(false);
  const [languageLoaded, setLanguageLoaded] = useState(false);

  // Initialize notifications (now inside Provider)
  useNotifications();

  // Initialize dishes (auto-fetches on first mount)
  useDishes();

  // Load stored language, theme, and remote config on app start
  useEffect(() => {
    const init = async () => {
      // Dispatch remote config fetch (non-blocking for UI rendering)
      dispatch(loadRemoteConfig());

      await Promise.all([loadStoredLanguage(), loadStoredTheme()]);
      setLanguageLoaded(true);
    };

    init();
  }, []);

  // Handle biometric authentication on app launch
  useEffect(() => {
    const handleBiometricAuth = async () => {
      // Only check biometric if user is logged in and has it enabled
      if (isLoggedIn && user?.biometricEnabled && !biometricChecked) {
        setIsAuthenticating(true);
        const authenticated = await authenticateUser();

        if (!authenticated) {
          // If biometric auth fails, logout or redirect to login
          router.replace(ROUTES.LOGIN);
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
        <Stack.Screen
          name={SCREEN_NAMES.INDEX}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.SPLASH}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.LOGIN}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.TABS}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.DISH_DETAILS}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.BOOK_TABLE}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.CHECKOUT}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.ORDER_SUCCESS}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.DELIVERY_MAP}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.ORDERS}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.NOTIFICATIONS}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.DINE_IN}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.BOOKING_SUCCESS}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.CHATBOT_SPLASH}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.CHATBOT}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.OFFERS}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.CHATBOT_EXPLORE}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.SETTINGS}
          options={{ headerShown: false, title: 'Settings' }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.FAVOURITES}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.HELP_SUPPORT}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.ADDRESSES}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={SCREEN_NAMES.NOTIFICATION_TEST}
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
