import { Brand, Radius, Shadows, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const placeOrderSheetStyles = StyleSheet.create({
  backdrop: {
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
    alignItems: 'center',
    ...Shadows.lg,
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  optionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    gap: 6,
    ...Shadows.sm,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  optionSub: {
    fontSize: 12,
    textAlign: 'center',
  },
  // Dine In option — neutral
  dineInBtn: {
    // backgroundColor and borderColor set dynamically from theme
  },
  dineInIconCircle: {
    backgroundColor: Brand.primaryFaded,
  },
  // Cash on Delivery option — brand
  codBtn: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  codIconCircle: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});

export const PLACE_ORDER_SHEET_HEIGHT = 280;
