import { Radius, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const orderCardSkeletonStyles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  divider: {
    height: 1,
    marginBottom: Spacing.sm,
  },
  dishList: {
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
