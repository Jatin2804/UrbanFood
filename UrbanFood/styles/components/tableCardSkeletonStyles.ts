import { Radius, Shadows, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const tableCardSkeletonStyles = StyleSheet.create({
  card: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: Radius.md,
    borderWidth: 2,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  iconSkeleton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  tableNumberSkeleton: {
    width: 60,
    height: 20,
    borderRadius: 4,
    marginBottom: Spacing.xs,
  },
  capacitySkeleton: {
    width: 50,
    height: 14,
    borderRadius: 4,
  },
});
