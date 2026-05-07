import { LanguageSelector } from '@/components/settings/LanguageSelector';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { selectCurrentUser } from '@/src/features/auth/authSlice';
import { updateBiometricSetting } from '@/src/features/auth/authThunks';
import { useTranslation } from '@/src/hooks/useTranslation';
import { checkBiometricSupport } from '@/src/utils/biometricAuth';
import { settingsStyles as styles } from '@/styles/screens/settingsStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    Switch,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

function SettingsHeader() {
  const router = useRouter();
  const { t } = useTranslation();
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <View style={[styles.header, { borderBottomColor: theme.border }]}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={22} color={theme.textPrimary} />
      </TouchableOpacity>
      <ThemedText style={[styles.headerTitle, { color: theme.textPrimary }]}>
        {t('settings.title')}
      </ThemedText>
      <View style={styles.backBtn} />
    </View>
  );
}

export default function Settings() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector(selectCurrentUser);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
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
        t('settings.biometricNotSetUp'),
        t('settings.pleaseSetupBiometric', {
          type: biometricSupport.biometricType,
        }),
        [{ text: t('common.ok') }],
      );
      return;
    }

    if (value && !biometricSupport.isSupported) {
      Alert.alert(
        t('settings.notSupported'),
        t('settings.deviceDoesNotSupportBiometric'),
        [{ text: t('common.ok') }],
      );
      return;
    }

    dispatch(updateBiometricSetting(value) as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        <SettingsHeader />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Language Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionIconContainer,
                  { backgroundColor: Brand.primaryFaded },
                ]}
              >
                <Ionicons name="language" size={20} color={Brand.primary} />
              </View>
              <ThemedText style={styles.sectionTitle}>
                {t('settings.language')}
              </ThemedText>
            </View>
            <ThemedView variant="surface" style={styles.section}>
              <LanguageSelector />
            </ThemedView>
          </View>

          {/* Security Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionIconContainer,
                  { backgroundColor: '#E8F5E9' },
                ]}
              >
                <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
              </View>
              <ThemedText style={styles.sectionTitle}>
                {t('settings.security')}
              </ThemedText>
            </View>
            <ThemedView variant="surface" style={styles.section}>
              <View style={styles.settingRow}>
                <View style={styles.settingIconWrapper}>
                  <View
                    style={[styles.settingIcon, { backgroundColor: '#FFF3E0' }]}
                  >
                    <Ionicons name="finger-print" size={22} color="#FF9800" />
                  </View>
                  <View style={styles.settingInfo}>
                    <ThemedText style={styles.settingLabel}>
                      {t('settings.fingerprintAuthentication')}
                    </ThemedText>
                    <ThemedText style={styles.settingDescription}>
                      {biometricSupport.isSupported
                        ? biometricSupport.isEnrolled
                          ? t('settings.useFingerprintToUnlock')
                          : t('settings.fingerprintNotEnrolled')
                        : t('settings.notSupportedOnDevice')}
                    </ThemedText>
                  </View>
                </View>
                <Switch
                  value={user?.biometricEnabled ?? false}
                  onValueChange={handleBiometricToggle}
                  disabled={
                    !biometricSupport.isSupported ||
                    !biometricSupport.isEnrolled
                  }
                  trackColor={{ false: '#E0E0E0', true: Brand.primaryFaded }}
                  thumbColor={
                    user?.biometricEnabled ? Brand.primary : '#f4f3f4'
                  }
                />
              </View>
            </ThemedView>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
