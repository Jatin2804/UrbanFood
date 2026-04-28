import { Brand, Radius, Shadows, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const checkoutStyles = StyleSheet.create({
  container: { flex: 1 },

  // ── Header ────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Radius.full,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  // ── Scroll content ────────────────────────
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },

  // ── Section card ──────────────────────────
  sectionCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  // ── Location ──────────────────────────────
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  locationIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  locationTextWrap: {
    flex: 1,
    gap: 2,
  },
  locationLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  locationCity: {
    fontSize: 12,
    marginTop: 2,
  },
  locationCoords: {
    fontSize: 11,
    marginTop: 4,
  },
  locationChangeBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  locationChangeBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Requesting skeleton
  requestingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  requestingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  requestingText: {
    fontSize: 14,
  },
  deniedBox: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  deniedText: {
    fontSize: 13,
    textAlign: 'center',
  },
  settingsBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  settingsBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // ── Bill ──────────────────────────────────
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  billLabel: {
    fontSize: 14,
  },
  billValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  discountLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },

  // ── Payment badge ─────────────────────────
  paymentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Confirm bar ───────────────────────────
  confirmBar: {
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
    borderTopWidth: 1,
    ...Shadows.lg,
  },
  confirmTotalLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  confirmAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Brand.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderRadius: Radius.full,
    ...Shadows.primary,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
