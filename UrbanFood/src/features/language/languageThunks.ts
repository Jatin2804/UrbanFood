// Language async thunks

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { defaultTranslations } from '../../data/translations';
import { TranslationService } from '../../services/translationService';
import { Translations } from '../../types/translations';

const LANGUAGE_STORAGE_KEY = '@urbanfood_language';
const TRANSLATIONS_STORAGE_KEY = '@urbanfood_translations';

interface FetchTranslationsResult {
  languageCode: string;
  translations: Translations;
}

interface StoredLanguageData {
  languageCode: string;
  translations: Translations;
  lastFetched: number;
}

/**
 * Fetch translations from GitHub and cache locally
 */
export const fetchTranslations = createAsyncThunk<
  FetchTranslationsResult,
  string,
  { rejectValue: string }
>('language/fetchTranslations', async (languageCode, { rejectWithValue }) => {
  try {
    // Try to fetch from GitHub
    const translations = await TranslationService.fetchTranslations(
      languageCode,
    );

    if (translations) {
      // Cache the translations locally
      const dataToStore: StoredLanguageData = {
        languageCode,
        translations,
        lastFetched: Date.now(),
      };

      await AsyncStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        JSON.stringify(dataToStore),
      );

      return { languageCode, translations };
    } else {
      // Fallback to default translations
      console.warn(
        `Failed to fetch ${languageCode} translations, using default`,
      );

      const dataToStore: StoredLanguageData = {
        languageCode,
        translations: defaultTranslations,
        lastFetched: Date.now(),
      };

      await AsyncStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        JSON.stringify(dataToStore),
      );

      return { languageCode, translations: defaultTranslations };
    }
  } catch (error) {
    console.error('Error fetching translations:', error);
    return rejectWithValue('Failed to load translations');
  }
});

/**
 * Load stored language from AsyncStorage on app start
 */
export const loadStoredLanguage = createAsyncThunk<
  StoredLanguageData | null,
  void
>('language/loadStoredLanguage', async () => {
  try {
    const storedData = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (storedData) {
      const data: StoredLanguageData = JSON.parse(storedData);
      return data;
    }

    return null;
  } catch (error) {
    console.error('Error loading stored language:', error);
    return null;
  }
});

/**
 * Change language and reload the app to apply changes immediately
 */
export const changeLanguage = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>('language/changeLanguage', async (languageCode, { dispatch, rejectWithValue }) => {
  try {
    // Fetch and store the new language
    await dispatch(fetchTranslations(languageCode)).unwrap();
  } catch (error) {
    console.error('Error changing language:', error);
    return rejectWithValue('Failed to change language');
  }
});
