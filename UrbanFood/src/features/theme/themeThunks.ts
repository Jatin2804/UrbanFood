import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThemeMode } from './themeSlice';
import { STORAGE_KEYS } from '@/src/constants/storage';

export const loadStoredTheme = createAsyncThunk(
  'theme/loadStoredTheme',
  async (_, { rejectWithValue }) => {
    try {
      const storedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
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
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);
      return mode;
    } catch (error) {
      return rejectWithValue('Failed to save theme');
    }
  }
);
