import { Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const cartRowSkeletonStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
});
