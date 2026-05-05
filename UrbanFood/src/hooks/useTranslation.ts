// Custom hook for accessing translations

import { useSelector } from 'react-redux';
import { defaultTranslations } from '../data/translations';
import {
    selectCurrentLanguage,
    selectTranslations,
} from '../features/language/languageSlice';

export function useTranslation() {
  const currentLanguage = useSelector(selectCurrentLanguage);
  const translations = useSelector(selectTranslations);

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

  return {
    t,
    currentLanguage,
    translations: translationsData,
  };
}
