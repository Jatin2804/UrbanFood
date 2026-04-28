import { Brand, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const cartStyles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: 52,
    paddingBottom: Spacing.md,
    ...Shadows.sm,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  clearBtnText: { fontSize: 13, fontWeight: '600' },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 130,
    gap: Spacing.sm,
  },

  billCard: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  billTitle: { marginBottom: Spacing.sm },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billDivider: { height: 1, marginVertical: Spacing.sm },
  toPayText: { fontSize: 16, fontWeight: '700', color: Brand.primary },

  checkoutBar: {
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
  checkoutTotal: { fontSize: 20, fontWeight: '700' },
  placeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Brand.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderRadius: Radius.full,
    ...Shadows.primary,
  },
  placeOrderText: { ...Typography.bodySemiBold },

  // ── Offer section ──────────────────────────
  offerSection: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  offerSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerSectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  offerAppliedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: 4,
    alignSelf: 'flex-start',
  },

  // ── Offer bottom sheet ─────────────────────
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    maxHeight: '75%',
    ...Shadows.lg,
  },
  sheetHandle: {
    width: 48,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: Spacing.md,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },

  // Offer card inside sheet
  offerCard: {
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  offerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  offerCardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  offerCardCode: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  offerCardDesc: {
    fontSize: 13,
    marginBottom: Spacing.sm,
  },
  offerCardMin: {
    fontSize: 11,
    marginBottom: Spacing.sm,
  },
  applyBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  removeBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  removeBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
