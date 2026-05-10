import { selectThemeMode } from '@/src/features/theme/themeSlice';
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useSelector } from 'react-redux';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 * Reads from Redux; falls back to device scheme when mode is 'system'.
 */
export function useColorScheme(): 'light' | 'dark' {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const mode = useSelector(selectThemeMode);
  const deviceScheme = useRNColorScheme() ?? 'light';

  if (!hasHydrated) {
    return 'dark'; // match default Redux state
  }

  if (mode === 'system') {
    return deviceScheme;
  }
  return mode;
}
