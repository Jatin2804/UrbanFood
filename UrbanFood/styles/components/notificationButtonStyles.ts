import { Brand, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const notificationButtonStyles = StyleSheet.create({
  button: {
    backgroundColor: Brand.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
