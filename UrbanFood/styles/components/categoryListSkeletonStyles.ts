import { Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const categoryListSkeletonStyles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  item: {
    marginRight: Spacing.xs,
  },
});
