import { Radius, Shadows, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const cartRowSkeletonStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  imageSkeleton: {
    width: 96,
    height: 96,
    flexShrink: 0,
  },
  infoSkeleton: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    justifyContent: 'center',
    gap: 8,
  },
  nameSkeleton: {
    height: 14,
    borderRadius: 4,
    width: '80%',
  },
  priceSkeleton: {
    height: 12,
    borderRadius: 4,
    width: '40%',
  },
  totalSkeleton: {
    height: 15,
    borderRadius: 4,
    width: '30%',
  },
  controlsSkeleton: {
    paddingRight: Spacing.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    flexShrink: 0,
    alignSelf: 'stretch',
  },
  trashSkeleton: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  buttonSkeleton: {
    width: 80,
    height: 32,
    borderRadius: 8,
  },
});
