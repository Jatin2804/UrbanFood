import { Brand, Shadows, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const tableCardStyles = StyleSheet.create({
  cardContainer: {
    width: '48%',
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  tableWrapper: {
    width: 100,
    height: 100,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Table surface (center)
  tableSurface: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
    zIndex: 1,
  },
  tableSurfaceBooked: {
    backgroundColor: '#F5F5F5',
    borderColor: '#BDBDBD',
  },
  tableSurfaceSelected: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  tableNumber: {
    ...Typography.h3,
    fontWeight: '700',
    marginBottom: 2,
  },

  // Seat base styles
  seat: {
    position: 'absolute',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatInner: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Brand.primary,
  },
  seatBooked: {
    backgroundColor: '#F5F5F5',
    borderColor: '#BDBDBD',
  },
  seatSelected: {
    backgroundColor: Brand.primaryFaded,
    borderColor: Brand.primary,
  },

  // Seat positions for 2-seater (left, right)
  seatLeft: {
    left: 0,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  seatRight: {
    right: 0,
    top: '50%',
    transform: [{ translateY: -12 }],
  },

  // Seat positions for 4-seater (top, right, bottom, left)
  seatTop: {
    top: 0,
    left: '50%',
    transform: [{ translateX: -12 }],
  },
  seatBottom: {
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -12 }],
  },

  // Seat positions for 6-seater
  seatTopLeft: {
    top: 5,
    left: 15,
  },
  seatTopRight: {
    top: 5,
    right: 15,
  },
  seatBottomLeft: {
    bottom: 5,
    left: 15,
  },
  seatBottomRight: {
    bottom: 5,
    right: 15,
  },

  // Label below table
  labelContainer: {
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  labelText: {
    ...Typography.caption,
    fontSize: 12,
  },
});
