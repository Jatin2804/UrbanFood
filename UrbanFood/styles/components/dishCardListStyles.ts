import { Brand, Radius, Shadows, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const dishCardListStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  cardImage: {
    width: 120,
    height: 120,
  },
  vegBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  vegDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cardContent: {
    flex: 1,
    padding: Spacing.sm,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    marginRight: Spacing.xs,
  },
  dishName: {
    fontSize: 15,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  priceSection: {
    gap: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontWeight: '600',
    color: '#E65100',
    fontSize: 12,
  },
});
