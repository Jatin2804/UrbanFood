import { Brand, Radius, Shadows, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const deliveryStatusCardStyles = StyleSheet.create({
  card: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 36,
    ...Shadows.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Brand.success,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '800',
  },
  etaText: {
    fontSize: 13,
    marginBottom: Spacing.md,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: Brand.success,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  stepLabel: {
    fontSize: 9,
    textAlign: 'center',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginBottom: Spacing.md,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  partnerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Brand.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerInfo: { flex: 1 },
  partnerName: {
    fontSize: 15,
    fontWeight: '700',
  },
  partnerVehicle: {
    fontSize: 12,
    marginTop: 2,
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
});
