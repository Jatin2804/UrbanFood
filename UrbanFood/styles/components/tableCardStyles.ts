import { Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const tableCardStyles = StyleSheet.create({
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
  iconContainer: {
    marginBottom: Spacing.sm,
  },
  tableNumber: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  capacityText: {
    ...Typography.caption,
  },
  bookedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  bookedText: {
    ...Typography.small,
    fontWeight: '600',
  },
  selectedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    borderRadius: Radius.full,
  },
});
