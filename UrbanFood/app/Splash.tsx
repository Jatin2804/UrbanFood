import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Brand, Colors, Shadows } from "@/constants/theme";
import { checkAuthStatus } from "@/src/features/auth/authThunks";
import { fetchDishes } from "@/src/features/dishes/dishesThunk";
import { AppDispatch } from "@/src/store";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, useColorScheme, View } from "react-native";
import { useDispatch } from "react-redux";

const Splash = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const scheme = useColorScheme() ?? "light";

  useEffect(() => {
    const init = async () => {
      const [authResult] = await Promise.all([
        dispatch(checkAuthStatus()),
        dispatch(fetchDishes()),
      ]);

      const isLoggedIn =
        checkAuthStatus.fulfilled.match(authResult) &&
        authResult.payload !== null;

      setTimeout(() => {
        router.replace(isLoggedIn ? "/(tabs)" : "/Login");
      }, 4000);
    };

    init();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image
          source={require("../assets/images/logo.png")}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Brand.primaryFaded,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    ...Shadows.primary,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  appName: {
    marginBottom: 8,
  },
  tagline: {
    marginBottom: 48,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Brand.primary,
  },
});
