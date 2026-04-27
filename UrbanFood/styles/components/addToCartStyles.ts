import { Brand, Radius, Shadows } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const addToCartStyles = StyleSheet.create({
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primary,
    borderRadius: Radius.full,
    gap: 4,
    ...Shadows.primary,
  },
  addBtnSm: { height: 30, paddingHorizontal: 12 },
  addBtnMd: { height: 40, paddingHorizontal: 20 },
  addBtnLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    overflow: 'hidden',
  },
  stepperSm: { height: 30 },
  stepperMd: { height: 40 },

  stepSide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepSideSm: { width: 30, height: 30 },
  stepSideMd: { width: 40, height: 40 },

  stepMiddle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  stepQty: {
    fontWeight: '700',
    color: Brand.primary,
    textAlign: 'center',
  },
  stepQtySm: { width: 26, fontSize: 13 },
  stepQtyMd: { width: 32, fontSize: 15 },
});
