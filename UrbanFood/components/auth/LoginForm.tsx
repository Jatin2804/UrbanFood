import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/src/hooks/useAuth';
import { authFormStyles as styles } from '@/styles/components/authFormStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  const router = useRouter();
  const { login, loading, error } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const handleLogin = async () => {
    if (!email || !pin) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (pin.length !== 4) {
      Alert.alert('Error', 'PIN must be 4 digits');
      return;
    }

    const result = await login(email, pin);
    if (result.meta.requestStatus === 'fulfilled') {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Failed', error || 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <ThemedView
        variant="surfaceSecondary"
        style={[styles.inputContainer, { borderColor: theme.border }]}
      >
        <Ionicons
          name="mail-outline"
          size={20}
          color={theme.icon}
          style={styles.icon}
        />
        <TextInput
          style={[styles.input, { color: theme.inputText }]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={theme.placeholder}
        />
      </ThemedView>

      <ThemedView
        variant="surfaceSecondary"
        style={[styles.inputContainer, { borderColor: theme.border }]}
      >
        <Ionicons
          name="lock-closed-outline"
          size={20}
          color={theme.icon}
          style={styles.icon}
        />
        <TextInput
          style={[styles.input, { color: theme.inputText }]}
          placeholder="4-Digit PIN"
          value={pin}
          onChangeText={setPin}
          keyboardType="number-pad"
          maxLength={4}
          secureTextEntry={!showPin}
          placeholderTextColor={theme.placeholder}
        />
        <TouchableOpacity
          onPress={() => setShowPin(!showPin)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={showPin ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color={theme.icon}
          />
        </TouchableOpacity>
      </ThemedView>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ThemedText
            lightColor="#fff"
            darkColor="#fff"
            style={styles.buttonText}
          >
            Login
          </ThemedText>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
