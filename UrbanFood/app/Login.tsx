import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  Brand,
  Colors,
  Radius,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View
              style={[
                styles.logoWrapper,
                { backgroundColor: Brand.primaryFaded },
              ]}
            >
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
              />
            </View>
            <ThemedText type="title" style={styles.title}>
              Urban Food
            </ThemedText>
            <ThemedText type="caption" style={styles.subtitle}>
              {isLogin ? "Welcome back!" : "Create your account"}
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {isLogin ? <LoginForm /> : <SignupForm />}
          </View>

          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <ThemedText type="caption">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
            </ThemedText>
            <TouchableOpacity
              onPress={() => setIsLogin(!isLogin)}
              activeOpacity={0.7}
            >
              <ThemedText
                type="caption"
                lightColor={Brand.primary}
                darkColor={Brand.primary}
                style={styles.toggleLink}
              >
                {isLogin ? "Sign Up" : "Login"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    ...Shadows.primary,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    textAlign: "center",
  },
  pillContainer: {
    flexDirection: "row",
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  pill: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: Radius.sm,
  },
  pillActive: {
    backgroundColor: Brand.primary,
    ...Shadows.primary,
  },
  pillText: {
    ...Typography.bodySemiBold,
  },
  pillTextActive: {
    color: "#fff",
  },
  formContainer: {
    marginBottom: Spacing.md,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.md,
  },
  toggleLink: {
    fontWeight: "600",
  },
});
