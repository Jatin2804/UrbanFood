import { Radius, Shadows, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const bookingCardSkeletonStyles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  tableInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBoxSkeleton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
  },
  tableNumberSkeleton: {
    width: 80,
    height: 20,
    borderRadius: 4,
    marginBottom: 4,
  },
  slotSkeleton: {
    width: 60,
    height: 14,
    borderRadius: 4,
  },
  statusBadgeSkeleton: {
    width: 60,
    height: 24,
    borderRadius: Radius.sm,
  },
  divider: {
    height: 1,
    marginBottom: Spacing.md,
  },
  details: {
    gap: Spacing.sm,
  },
  detailRowSkeleton: {
    width: '60%',
    height: 14,
    borderRadius: 4,
  },
});
