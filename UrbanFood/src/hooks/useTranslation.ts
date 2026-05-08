// Custom hook for accessing translations

import { useDispatch, useSelector } from 'react-redux';
import { defaultTranslations } from '../data/translations';
import {
  selectCurrentLanguage,
  selectLanguageLoading,
  selectTranslations,
} from '../features/language/languageSlice';
import {
  changeLanguage,
  loadStoredLanguage as loadStoredLanguageThunk,
} from '../features/language/languageThunks';
import { AppDispatch } from '../store';

export function useTranslation() {
  const dispatch = useDispatch<AppDispatch>();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const translations = useSelector(selectTranslations);
  const loading = useSelector(selectLanguageLoading);

  // Fallback to default translations if none are loaded
  const translationsData = translations || defaultTranslations;

  /**
   * Get translation by key path (e.g., 'common.welcome' or 'tabs.home')
   * Supports placeholder replacement: t('home.greeting', { name: 'John' })
   */
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translationsData;

    // Navigate through nested object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Return key if translation not found
        return key;
      }
    }

    // If value is not a string, return the key
    if (typeof value !== 'string') {
      return key;
    }

    // Replace placeholders like {name}, {count}, etc.
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  const setLanguage = async (languageCode: string) => {
    return dispatch(changeLanguage(languageCode)).unwrap();
  };

  const loadStoredLanguage = async () => {
    return dispatch(loadStoredLanguageThunk());
  };

  return {
    t,
    currentLanguage,
    translations: translationsData,
    loading,
    setLanguage,
    loadStoredLanguage,
  };
}
