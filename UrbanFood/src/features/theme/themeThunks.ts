import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThemeMode } from './themeSlice';

const THEME_STORAGE_KEY = '@app_theme_mode';

export const loadStoredTheme = createAsyncThunk(
  'theme/loadStoredTheme',
  async (_, { rejectWithValue }) => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme) {
        return storedTheme as ThemeMode;
      }
      return null;
    } catch (error) {
      return rejectWithValue('Failed to load theme');
    }
  }
);

export const setThemeMode = createAsyncThunk(
  'theme/setThemeMode',
  async (mode: ThemeMode, { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      return mode;
    } catch (error) {
      return rejectWithValue('Failed to save theme');
    }
  }
);
