import { Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

const CARD_SIZE = 100;

export const categoryCardStyles = StyleSheet.create({
  card: {
    alignItems: 'center',
    width: CARD_SIZE,
  },
  cardPressed: {
    opacity: 0.7,
  },
  image: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: Radius.full,
    marginBottom: Spacing.sm,
    ...Shadows.md,
  },
  name: {
    ...Typography.captionMedium,
    textAlign: 'center',
  },
});
