import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  /** Use 'surface' for cards/modals, default is page background */
  variant?: 'background' | 'surface' | 'surfaceSecondary';
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = 'background',
  ...otherProps
}: ThemedViewProps) {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const backgroundColor =
    lightColor && scheme === 'light' ? lightColor :
    darkColor  && scheme === 'dark'  ? darkColor  :
    theme[variant];

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
