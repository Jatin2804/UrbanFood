import { Brand, Radius, Shadows, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const dishCardStyles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  cardImage: { width: '100%', height: 130 },
  vegBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  vegDot: { width: 10, height: 10, borderRadius: 5 },
  cardContent: { padding: Spacing.sm },
  dishName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: { fontSize: 15, fontWeight: '700', color: Brand.primary },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: { fontWeight: '600', color: '#E65100', fontSize: 11 },
});
