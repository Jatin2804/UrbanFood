import { Radius, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const notificationCardSkeletonStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
