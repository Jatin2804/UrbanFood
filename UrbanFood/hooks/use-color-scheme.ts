import { selectThemeMode } from '@/src/features/theme/themeSlice';
import { useSelector } from 'react-redux';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

/**
 * Returns the resolved color scheme ('light' | 'dark').
 * Reads from Redux first; falls back to device scheme when mode is 'system'.
 */
export function useColorScheme(): 'light' | 'dark' {
  const mode = useSelector(selectThemeMode);
  const deviceScheme = useDeviceColorScheme() ?? 'light';

  if (mode === 'system') {
    return deviceScheme;
  }
  return mode;
}
