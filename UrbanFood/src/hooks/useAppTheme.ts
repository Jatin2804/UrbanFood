import { useDispatch, useSelector } from 'react-redux';
import { ThemeMode, selectThemeMode } from '../features/theme/themeSlice';
import { loadStoredTheme, setThemeMode } from '../features/theme/themeThunks';
import type { AppDispatch } from '../store';

export function useAppTheme() {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector(selectThemeMode);

  return {
    mode,
    setThemeMode: (newMode: ThemeMode) => dispatch(setThemeMode(newMode)),
    loadStoredTheme: () => dispatch(loadStoredTheme()),
  };
}
