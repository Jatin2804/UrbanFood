import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { selectAuthError, selectAuthLoading } from '@/src/features/auth/authSlice';
import { signupUser } from '@/src/features/auth/authThunks';
import { AppDispatch } from '@/src/store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const handleSignup = async () => {
    if (!name || !email || !phone || !pin || !confirmPin) { Alert.alert('Error', 'Please fill in all fields'); return; }
    if (pin.length !== 4) { Alert.alert('Error', 'PIN must be 4 digits'); return; }
    if (pin !== confirmPin) { Alert.alert('Error', 'PINs do not match'); return; }
    if (!phone.startsWith('+91')) { Alert.alert('Error', 'Phone number must start with +91'); return; }

    const result = await dispatch(signupUser({ name, email, phone, pin }));
    if (signupUser.fulfilled.match(result)) {
      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(tabs)');
    } else {
      Alert.alert('Signup Failed', error || 'Could not create account');
    }
  };

  const Field = ({ icon, placeholder, value, onChangeText, keyboardType = 'default', maxLength, secureTextEntry = false, rightElement }: any) => (
    <ThemedView variant="surfaceSecondary" style={[styles.inputContainer, { borderColor: theme.border }]}>
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

  const EyeToggle = () => (
    <TouchableOpacity onPress={() => setShowPin(!showPin)} activeOpacity={0.7}>
      <Ionicons name={showPin ? 'eye-outline' : 'eye-off-outline'} size={20} color={theme.icon} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Field icon="person-outline"      placeholder="Full Name"              value={name}       onChangeText={setName} />
      <Field icon="mail-outline"        placeholder="Email"                  value={email}      onChangeText={setEmail}      keyboardType="email-address" />
      <Field icon="call-outline"        placeholder="Phone (+91 XXXXX XXXXX)" value={phone}     onChangeText={setPhone}      keyboardType="phone-pad" />
      <Field icon="lock-closed-outline" placeholder="4-Digit PIN"            value={pin}        onChangeText={setPin}        keyboardType="number-pad" maxLength={4} secureTextEntry={!showPin} rightElement={<EyeToggle />} />
      <Field icon="lock-closed-outline" placeholder="Confirm PIN"            value={confirmPin} onChangeText={setConfirmPin} keyboardType="number-pad" maxLength={4} secureTextEntry={!showPin} />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignup}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <ThemedText lightColor="#fff" darkColor="#fff" style={styles.buttonText}>Create Account</ThemedText>
        }
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SignupForm;

const styles = StyleSheet.create({
  container: { width: '100%' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  icon: { marginRight: Spacing.sm },
  input: {
    flex: 1,
    height: 52,
    ...Typography.body,
  },
  button: {
    backgroundColor: Brand.primary,
    borderRadius: Radius.md,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    ...Shadows.primary,
  },
  buttonDisabled: {
    backgroundColor: Brand.primaryDisabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    ...Typography.h4,
  },
});
