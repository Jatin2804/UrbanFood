// Language selector component

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SUPPORTED_LANGUAGES } from '@/src/constants/languages';
import {
    selectCurrentLanguage,
    selectLanguageLoading,
} from '@/src/features/language/languageSlice';
import { changeLanguage } from '@/src/features/language/languageThunks';
import { useTranslation } from '@/src/hooks/useTranslation';
import { languageSelectorStyles } from '@/styles/components/languageSelectorStyles';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export function LanguageSelector() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const loading = useSelector(selectLanguageLoading);
  const [modalVisible, setModalVisible] = useState(false);

  const currentLanguageName =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguage)
      ?.nativeName || 'English';

  const handleLanguageSelect = async (languageCode: string) => {
    if (languageCode === currentLanguage) {
      setModalVisible(false);
      return;
    }

    setModalVisible(false);

    try {
      // Save the new language to AsyncStorage via Redux
      await dispatch(changeLanguage(languageCode) as any).unwrap();
      // Navigate to Splash so the app re-initialises with the new language
      router.replace('/Splash');
    } catch (error) {
      Alert.alert(t('alerts.error'), t('settings.failedToChangeLanguage'));
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        disabled={loading}
        activeOpacity={0.7}
      >
        <ThemedView variant="surface" style={languageSelectorStyles.settingRow}>
          <View style={languageSelectorStyles.settingInfo}>
            <ThemedText style={languageSelectorStyles.settingLabel}>
              {t('settings.language')}
            </ThemedText>
            <ThemedText
              type="caption"
              style={languageSelectorStyles.settingDescription}
            >
              {currentLanguageName}
            </ThemedText>
          </View>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <ThemedText style={languageSelectorStyles.chevron}>›</ThemedText>
          )}
        </ThemedView>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={languageSelectorStyles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <ThemedView style={languageSelectorStyles.modalContent}>
              <ThemedView
                variant="surface"
                style={languageSelectorStyles.modalHeader}
              >
                <ThemedText style={languageSelectorStyles.modalTitle}>
                  {t('settings.selectLanguage')}
                </ThemedText>
              </ThemedView>

              <ScrollView style={languageSelectorStyles.languageList}>
                {SUPPORTED_LANGUAGES.map((language) => (
                  <TouchableOpacity
                    key={language.code}
                    onPress={() => handleLanguageSelect(language.code)}
                    activeOpacity={0.7}
                  >
                    <ThemedView
                      variant="surface"
                      style={[
                        languageSelectorStyles.languageItem,
                        currentLanguage === language.code &&
                          languageSelectorStyles.languageItemSelected,
                      ]}
                    >
                      <View>
                        <ThemedText style={languageSelectorStyles.languageName}>
                          {language.nativeName}
                        </ThemedText>
                        <ThemedText
                          type="caption"
                          style={languageSelectorStyles.languageNameEnglish}
                        >
                          {language.name}
                        </ThemedText>
                      </View>
                      {currentLanguage === language.code && (
                        <ThemedText style={languageSelectorStyles.checkmark}>
                          ✓
                        </ThemedText>
                      )}
                    </ThemedView>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ThemedView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
