import { Brand, Radius, Shadows, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const horizontalDishCardStyles = StyleSheet.create({
  card: {
    width: 160,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginRight: Spacing.sm,
    ...Shadows.sm,
  },
  image: {
    width: 160,
    height: 110,
  },
  vegBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  vegDot: { width: 9, height: 9, borderRadius: 5 },
  newBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    padding: Spacing.sm,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  type: {
    fontSize: 11,
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E65100',
  },
});
