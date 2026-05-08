import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { ROUTES } from '@/src/constants/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { useLocation } from '@/src/hooks/useLocation';
import { splashStyles as styles } from '@/styles/screens/splashStyles';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, useColorScheme, View } from 'react-native';

const Splash = () => {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const { checkAuth } = useAuth();
  const { requestLocation } = useLocation();

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      // Request location permission early — runs in parallel with auth check
      // Dishes are loaded automatically by useDishes() in _layout.tsx
      const [authResult] = await Promise.all([checkAuth(), requestLocation()]);

      const isLoggedIn = authResult.payload !== null;

      setTimeout(() => {
        if (isMounted) {
          router.replace(isLoggedIn ? ROUTES.TABS.HOME : ROUTES.LOGIN);
        }
      }, 4000);
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>

      <ThemedText type="title" style={styles.appName}>
        Urban Food
      </ThemedText>
      <ThemedText type="caption" style={styles.tagline}>
        Fresh. Fast. Delicious.
      </ThemedText>

      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.dotActive]} />
        <View
          style={[styles.dot, { backgroundColor: Colors[scheme].border }]}
        />
        <View
          style={[styles.dot, { backgroundColor: Colors[scheme].border }]}
        />
      </View>
    </ThemedView>
  );
};

export default Splash;
