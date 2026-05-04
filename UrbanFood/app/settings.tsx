import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { selectCurrentUser } from '@/src/features/auth/authSlice';
import { updateBiometricSetting } from '@/src/features/auth/authThunks';
import { checkBiometricSupport } from '@/src/utils/biometricAuth';
import { settingsStyles } from '@/styles/screens/settingsStyles';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Switch, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function Settings() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [biometricSupport, setBiometricSupport] = useState({
    isSupported: false,
    isEnrolled: false,
    biometricType: 'None',
  });

  useEffect(() => {
    checkSupport();
  }, []);

  const checkSupport = async () => {
    const support = await checkBiometricSupport();
    setBiometricSupport(support);
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value && !biometricSupport.isEnrolled) {
      Alert.alert(
        'Biometric Not Set Up',
        `Please set up ${biometricSupport.biometricType} in your device settings first.`,
        [{ text: 'OK' }],
      );
      return;
    }

    if (value && !biometricSupport.isSupported) {
      Alert.alert(
        'Not Supported',
        'Your device does not support biometric authentication.',
        [{ text: 'OK' }],
      );
      return;
    }

    dispatch(updateBiometricSetting(value) as any);
  };

  return (
    <ThemedView style={settingsStyles.container}>
      <ScrollView contentContainerStyle={settingsStyles.content}>
        <ThemedText style={settingsStyles.title}>Settings</ThemedText>

        <ThemedView variant="surface" style={settingsStyles.section}>
          <ThemedText style={settingsStyles.sectionTitle}>Security</ThemedText>

          <ThemedView variant="surface" style={settingsStyles.settingRow}>
            <View style={settingsStyles.settingInfo}>
              <ThemedText style={settingsStyles.settingLabel}>
                {biometricSupport.biometricType} Authentication
              </ThemedText>
              <ThemedText style={settingsStyles.settingDescription}>
                {biometricSupport.isSupported
                  ? biometricSupport.isEnrolled
                    ? `Use ${biometricSupport.biometricType} to unlock the app`
                    : `${biometricSupport.biometricType} not enrolled on device`
                  : 'Not supported on this device'}
              </ThemedText>
            </View>
            <Switch
              value={user?.biometricEnabled ?? false}
              onValueChange={handleBiometricToggle}
              disabled={!biometricSupport.isSupported || !biometricSupport.isEnrolled}
            />
          </ThemedView>
        </ThemedView>

        <ThemedView variant="surface" style={settingsStyles.section}>
          <ThemedText style={settingsStyles.sectionTitle}>Account</ThemedText>
          
          <ThemedView variant="surface" style={settingsStyles.infoRow}>
            <ThemedText style={settingsStyles.infoLabel}>Name</ThemedText>
            <ThemedText style={settingsStyles.infoValue}>{user?.name}</ThemedText>
          </ThemedView>

          <ThemedView variant="surface" style={settingsStyles.infoRow}>
            <ThemedText style={settingsStyles.infoLabel}>Email</ThemedText>
            <ThemedText style={settingsStyles.infoValue}>{user?.email}</ThemedText>
          </ThemedView>

          <ThemedView variant="surface" style={settingsStyles.infoRow}>
            <ThemedText style={settingsStyles.infoLabel}>Phone</ThemedText>
            <ThemedText style={settingsStyles.infoValue}>{user?.phone}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
