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
  ScrollView,
  TextInput,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  const router = useRouter();
  const { signup, loading, error } = useAuth();
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const handleSignup = async () => {
    if (!name || !email || !phone || !pin || !confirmPin) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (pin.length !== 4) {
      Alert.alert('Error', 'PIN must be 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      return;
    }
    if (!phone.startsWith('+91')) {
      Alert.alert('Error', 'Phone number must start with +91');
      return;
    }

    const result = await signup({ name, email, phone, pin });
    if (result.meta.requestStatus === 'fulfilled') {
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(tabs)');
    } else {
      Alert.alert('Signup Failed', error || 'Could not create account');
    }
  };

  const EyeToggle = () => (
    <TouchableOpacity onPress={() => setShowPin(!showPin)} activeOpacity={0.7}>
      <Ionicons
        name={showPin ? 'eye-outline' : 'eye-off-outline'}
        size={20}
        color={theme.icon}
      />
    </TouchableOpacity>
  );

  const Field = ({
    icon,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    maxLength,
    secureTextEntry = false,
    rightElement,
  }: any) => (
    <ThemedView
      variant="surfaceSecondary"
      style={[styles.inputContainer, { borderColor: theme.border }]}
    >
      <Ionicons name={icon} size={20} color={theme.icon} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: theme.inputText }]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        placeholderTextColor={theme.placeholder}
      />
      {rightElement}
    </ThemedView>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Field
        icon="person-outline"
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <Field
        icon="mail-outline"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Field
        icon="call-outline"
        placeholder="Phone (+91 XXXXX XXXXX)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Field
        icon="lock-closed-outline"
        placeholder="4-Digit PIN"
        value={pin}
        onChangeText={setPin}
        keyboardType="number-pad"
        maxLength={4}
        secureTextEntry={!showPin}
        rightElement={<EyeToggle />}
      />
      <Field
        icon="lock-closed-outline"
        placeholder="Confirm PIN"
        value={confirmPin}
        onChangeText={setConfirmPin}
        keyboardType="number-pad"
        maxLength={4}
        secureTextEntry={!showPin}
      />

      <TouchableOpacity
        style={[
          styles.button,
          styles.signupButton,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleSignup}
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
            Create Account
          </ThemedText>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignupForm;
