import { Radius, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const bookingCardSkeletonStyles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    marginTop: Spacing.md,
    alignItems: 'flex-start',
  },
});
