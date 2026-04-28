import { Radius, Shadows, Spacing } from '@/constants/theme';
import { Dimensions, StyleSheet } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const OFFER_SIDE_PADDING = Spacing.md;
export const OFFER_CARD_WIDTH = SCREEN_WIDTH - OFFER_SIDE_PADDING * 2;
export const OFFER_CARD_HEIGHT = 200;
export const OFFER_SNAP_INTERVAL = SCREEN_WIDTH;

export const offerCarouselStyles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  flatList: {
    width: SCREEN_WIDTH,
  },
  // Each slide is full SCREEN_WIDTH; card is inset by padding
  slide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: OFFER_SIDE_PADDING,
  },
  card: {
    width: OFFER_CARD_WIDTH,
    height: OFFER_CARD_HEIGHT,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadows.md,
  },
  image: {
    width: OFFER_CARD_WIDTH,
    height: OFFER_CARD_HEIGHT,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
