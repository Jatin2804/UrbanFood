import { createSlice } from '@reduxjs/toolkit';
import { loadStoredTheme, setThemeMode } from './themeThunks';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: 'dark',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadStoredTheme.fulfilled, (state, action) => {
        if (action.payload) {
          state.mode = action.payload;
        }
      })
      .addCase(setThemeMode.fulfilled, (state, action) => {
        state.mode = action.payload;
      });
  },
});

export const selectThemeMode = (state: { theme: ThemeState }) => state.theme.mode;

export default themeSlice.reducer;
