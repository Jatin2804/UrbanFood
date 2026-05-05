import { LanguageSelector } from '@/components/settings/LanguageSelector';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { selectCurrentUser } from '@/src/features/auth/authSlice';
import { updateBiometricSetting } from '@/src/features/auth/authThunks';
import { useTranslation } from '@/src/hooks/useTranslation';
import { checkBiometricSupport } from '@/src/utils/biometricAuth';
import { settingsStyles } from '@/styles/screens/settingsStyles';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Switch, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function Settings() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
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
        t('settings.biometricNotSetUp'),
        t('settings.pleaseSetupBiometric', { type: biometricSupport.biometricType }),
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
    <ThemedView style={settingsStyles.container}>
      <ScrollView contentContainerStyle={settingsStyles.content}>
        <ThemedText style={settingsStyles.title}>{t('settings.title')}</ThemedText>

        {/* Language Section */}
        <ThemedView variant="surface" style={settingsStyles.section}>
          <ThemedText style={settingsStyles.sectionTitle}>
            {t('settings.language')}
          </ThemedText>
          <LanguageSelector />
        </ThemedView>

        {/* Security Section */}
        <ThemedView variant="surface" style={settingsStyles.section}>
          <ThemedText style={settingsStyles.sectionTitle}>
            {t('settings.security')}
          </ThemedText>

          <ThemedView variant="surface" style={settingsStyles.settingRow}>
            <View style={settingsStyles.settingInfo}>
              <ThemedText style={settingsStyles.settingLabel}>
                {biometricSupport.biometricType} {t('settings.authentication')}
              </ThemedText>
              <ThemedText style={settingsStyles.settingDescription}>
                {biometricSupport.isSupported
                  ? biometricSupport.isEnrolled
                    ? t('settings.useBiometricToUnlock', { type: biometricSupport.biometricType })
                    : t('settings.biometricNotEnrolled', { type: biometricSupport.biometricType })
                  : t('settings.notSupportedOnDevice')}
              </ThemedText>
            </View>
            <Switch
              value={user?.biometricEnabled ?? false}
              onValueChange={handleBiometricToggle}
              disabled={
                !biometricSupport.isSupported || !biometricSupport.isEnrolled
              }
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
