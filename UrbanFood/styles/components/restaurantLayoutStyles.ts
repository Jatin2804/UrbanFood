import { Brand, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const restaurantLayoutStyles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    width: '100%',
    minHeight: 700,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },

  // Header - Entrance
  headerArea: {
    height: 55,
    borderBottomWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entranceLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // Main area layout (Ground Floor)
  mainArea: {
    flexDirection: 'row',
    padding: Spacing.md,
  },

  // Left section - Kitchen & Staff
  leftSection: {
    width: 85,
    gap: Spacing.md,
  },
  kitchenArea: {
    height: 130,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: Spacing.sm,
  },
  staffArea: {
    height: 90,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: Spacing.sm,
  },

  // Center - Dining area
  diningArea: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  // Stage/DJ Area
  stageArea: {
    height: 70,
    borderRadius: Radius.lg,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginVertical: Spacing.sm,
    ...Shadows.md,
  },
  stageText: {
    ...Typography.body,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Right section - Restrooms
  rightSection: {
    width: 75,
    gap: Spacing.md,
  },
  restroomArea: {
    height: 80,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: Spacing.sm,
  },

  // Balcony Section
  balconySection: {
    borderTopWidth: 3,
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  balconyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: Spacing.md,
  },
  balconyTitle: {
    ...Typography.h3,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  balconyTables: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },

  // Area labels
  areaText: {
    ...Typography.small,
    fontSize: 11,
    textAlign: 'center',
  },

  // Table container
  tableContainer: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xs,
  },

  // Table surface
  tableSurface: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
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
    ...Typography.caption,
    fontWeight: '700',
    fontSize: 13,
  },

  // Seats
  seat: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 3,
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

  // Seat positions
  seatTop: {
    top: 0,
    left: '50%',
    transform: [{ translateX: -6 }],
  },
  seatBottom: {
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -6 }],
  },
  seatLeft: {
    left: 0,
    top: '50%',
    transform: [{ translateY: -6 }],
  },
  seatRight: {
    right: 0,
    top: '50%',
    transform: [{ translateY: -6 }],
  },
  seatTopLeft: {
    top: 4,
    left: 6,
  },
  seatTopRight: {
    top: 4,
    right: 6,
  },
  seatBottomLeft: {
    bottom: 4,
    left: 6,
  },
  seatBottomRight: {
    bottom: 4,
    right: 6,
  },

  // Legend
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    padding: Spacing.md,
    borderTopWidth: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendText: {
    ...Typography.small,
    fontWeight: '600',
  },
});
