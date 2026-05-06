import { Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const dishCardSkeletonStyles = StyleSheet.create({
  container: {
    width: 160,
    marginRight: Spacing.sm,
  },
  content: {
    paddingTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  horizontalContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  horizontalContent: {
    flex: 1,
    justifyContent: 'center',
  },
});
