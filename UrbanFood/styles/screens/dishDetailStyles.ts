import { Brand, Radius, Shadows, Spacing } from '@/constants/theme';
import { Dimensions, StyleSheet } from 'react-native';

const { width: W } = Dimensions.get('window');

export const dishDetailStyles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 100 },

  imageSection: {
    height: 300,
    position: 'relative',
  },
  bannerImage: {
    width: W,
    height: 300,
  },
  dots: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: { height: 6, borderRadius: 3 },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnFallback: { marginTop: Spacing.md },
  vegBadge: {
    position: 'absolute',
    top: 48,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  vegDot: { width: 8, height: 8, borderRadius: 4 },
  vegText: { fontSize: 12, fontWeight: '700' },

  content: { padding: Spacing.md },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  dishName: { lineHeight: 36 },
  price: { fontSize: 24, fontWeight: '700', color: Brand.primary },

  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  statChipText: { fontSize: 12, fontWeight: '600' },

  reviewsCard: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  reviewRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  reviewAvatarText: { fontSize: 12, fontWeight: '700' },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  reviewDivider: { height: 1, marginHorizontal: 44 },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 28,
    ...Shadows.lg,
  },
  bottomPrice: { fontSize: 22, fontWeight: '700' },
});
