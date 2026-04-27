import { Platform } from 'react-native';

export const Brand = {
  primary: '#FF6B35',
  primaryLight: '#FF8C5A',
  primaryFaded: '#FFE8DF',
  primaryDisabled: '#FFB399',

  error: '#FF3B30',
  success: '#10B981',
  warning: '#FFA500',
  info: '#4A90E2',
};

const light = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F2F2F2',

  textPrimary: '#1A1A1A',
  textSecondary: '#555555',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',

  border: '#E5E5E5',
  borderFocus: '#FF6B35',

  inputBackground: '#F5F5F5',
  inputText: '#1A1A1A',
  placeholder: '#AAAAAA',

  icon: '#555555',
  iconMuted: '#AAAAAA',

  tint: Brand.primary,
  tabIconDefault: '#AAAAAA',
  tabIconSelected: Brand.primary,

  shadow: '#000000',
};

const dark = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceSecondary: '#2A2A2A',

  textPrimary: '#F0F0F0',
  textSecondary: '#AAAAAA',
  textTertiary: '#666666',
  textInverse: '#FFFFFF',

  border: '#2E2E2E',
  borderFocus: '#FF6B35',

  inputBackground: '#2A2A2A',
  inputText: '#F0F0F0',
  placeholder: '#666666',

  icon: '#AAAAAA',
  iconMuted: '#555555',

  tint: Brand.primary,
  tabIconDefault: '#666666',
  tabIconSelected: Brand.primary,

  shadow: '#000000',
};

export const Colors = { light, dark };

export const Typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  h4: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const },
  bodySemiBold: { fontSize: 16, fontWeight: '600' as const },
  caption: { fontSize: 14, fontWeight: '400' as const },
  captionMedium: { fontSize: 14, fontWeight: '500' as const },
  small: { fontSize: 12, fontWeight: '400' as const },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  primary: {
    shadowColor: Brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
