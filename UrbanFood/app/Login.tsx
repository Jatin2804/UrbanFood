import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand } from '@/constants/theme';
import { loginStyles as styles } from '@/styles/screens/loginStyles';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <View
              style={[
                styles.logoWrapper,
                { backgroundColor: Brand.primaryFaded },
              ]}
            >
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
              />
            </View>
            <ThemedText type="title" style={styles.title}>
              Urban Food
            </ThemedText>
            <ThemedText type="caption" style={styles.subtitle}>
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </ThemedText>
          </View>

          <View style={styles.formContainer}>
            {isLogin ? <LoginForm /> : <SignupForm />}
          </View>

          <View style={styles.toggleContainer}>
            <ThemedText type="caption">
              {isLogin
                ? "Don't have an account? "
                : 'Already have an account? '}
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
                {isLogin ? 'Sign Up' : 'Login'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

export default Login;
