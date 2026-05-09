import { Radius, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const viewToggleStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  itemCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  toggleBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
});
