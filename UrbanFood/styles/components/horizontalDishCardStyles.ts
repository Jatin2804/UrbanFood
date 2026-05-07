import { Brand, Radius, Shadows, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

const CARD_WIDTH = 160;
const IMAGE_HEIGHT = 140;

export const horizontalDishCardStyles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    marginRight: Spacing.md,
    ...Shadows.md,
  },
  image: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
  },
  topActions: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    ...Shadows.sm,
  },
  vegBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
    ...Shadows.sm,
  },
  vegDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  newBadge: {
    position: 'absolute',
    top: IMAGE_HEIGHT - 24,
    right: Spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.md,
    backgroundColor: Brand.primary,
    borderWidth: 2,
    borderColor: '#fff',
    ...Shadows.md,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  content: {
    padding: Spacing.sm,
  },
  nameTypeRow: {
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 2,
  },
  type: {
    fontSize: 10,
    textTransform: 'capitalize',
    lineHeight: 13,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    gap: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.primary,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  starIcon: {
    marginTop: 1,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E65100',
    lineHeight: 14,
  },
});
