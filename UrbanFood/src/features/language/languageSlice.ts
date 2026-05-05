// Language Redux slice

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_LANGUAGE } from '../../constants/languages';
import { defaultTranslations } from '../../data/translations';
import { fetchTranslations, loadStoredLanguage } from './languageThunks';
import { LanguageState } from './languageTypes';

const initialState: LanguageState = {
  currentLanguage: DEFAULT_LANGUAGE,
  translations: defaultTranslations,
  loading: false,
  error: null,
  lastFetched: null,
  pendingLanguage: null,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPendingLanguage: (state, action: PayloadAction<string | null>) => {
      state.pendingLanguage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch translations from GitHub
      .addCase(fetchTranslations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTranslations.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLanguage = action.payload.languageCode;
        state.translations = action.payload.translations;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchTranslations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Keep existing translations on error
      })

      // Load stored language on app start
      .addCase(loadStoredLanguage.fulfilled, (state, action) => {
        if (action.payload) {
          state.currentLanguage = action.payload.languageCode;
          state.translations = action.payload.translations;
          state.lastFetched = action.payload.lastFetched;
        }
      });
  },
});

export const { clearError, setPendingLanguage } = languageSlice.actions;

// Selectors
export const selectCurrentLanguage = (state: { language: LanguageState }) =>
  state.language.currentLanguage;

export const selectTranslations = (state: { language: LanguageState }) =>
  state.language.translations;

export const selectLanguageLoading = (state: { language: LanguageState }) =>
  state.language.loading;

export const selectLanguageError = (state: { language: LanguageState }) =>
  state.language.error;

export const selectPendingLanguage = (state: { language: LanguageState }) =>
  state.language.pendingLanguage;

export default languageSlice.reducer;
