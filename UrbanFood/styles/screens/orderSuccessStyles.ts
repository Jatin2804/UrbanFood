import { Brand, Radius, Shadows, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const orderSuccessStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },

  // ── Back button ───────────────────────────
  backBtn: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Shadows.sm,
  },

  // ── Success icon ──────────────────────────
  iconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Brand.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.lg,
  },

  // ── Text ──────────────────────────────────
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },

  // ── Order ID pill ─────────────────────────
  orderIdPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    marginBottom: Spacing.xxl,
  },
  orderIdText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Track button ──────────────────────────
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Brand.success,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 16,
    borderRadius: Radius.full,
    width: '100%',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  trackBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // ── Auto-redirect hint ────────────────────
  autoHint: {
    fontSize: 12,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
