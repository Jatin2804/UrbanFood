import { Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const notificationCardSkeletonStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  iconSkeleton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  titleSkeleton: {
    height: 16,
    borderRadius: 4,
    width: '60%',
    marginBottom: Spacing.xs,
  },
  bodySkeleton: {
    height: 14,
    borderRadius: 4,
    width: '90%',
    marginBottom: Spacing.xs,
  },
  timeSkeleton: {
    height: 12,
    borderRadius: 4,
    width: '30%',
  },
});
