import { Radius, Shadows, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const bottomBannerStyles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  image: {
    width: '100%',
    height: 160,
  },
});
