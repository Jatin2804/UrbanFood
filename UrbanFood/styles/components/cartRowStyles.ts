import { Brand, Radius, Shadows, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const cartRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  imageWrap: {
    position: 'relative',
    flexShrink: 0,
  },
  rowImage: {
    width: 96,
    height: 96,
  },
  vegBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 16,
    height: 16,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  vegDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  rowInfo: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    justifyContent: 'center',
  },
  rowName: { fontSize: 14, fontWeight: '600', lineHeight: 19 },
  rowTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.primary,
    marginTop: 4,
  },

  rowControls: {
    paddingRight: Spacing.sm,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    flexShrink: 0,
    alignSelf: 'stretch',
  },
  trashBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
