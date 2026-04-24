import { checkAuthStatus } from "@/src/features/auth/authThunks";
import { fetchDishes } from "@/src/features/dishes/dishesThunk";
import { AppDispatch } from "@/src/store";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

const Splash = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const init = async () => {
      // Fetch all app data on startup in parallel
      const [authResult] = await Promise.all([
        dispatch(checkAuthStatus()),
        dispatch(fetchDishes()),
      ]);

      // Read auth result directly from the thunk response
      const isLoggedIn =
        checkAuthStatus.fulfilled.match(authResult) &&
        authResult.payload !== null;

      setTimeout(() => {
        if (isLoggedIn) {
          router.replace("/(tabs)");
        } else {
          router.replace("/Login");
        }
      }, 4000);
    };

    init();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});
