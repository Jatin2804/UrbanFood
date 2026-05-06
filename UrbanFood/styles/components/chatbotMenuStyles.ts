import { StyleSheet } from 'react-native';

import { Brand, Radius, Shadows, Spacing } from '@/constants/theme';

export const chatbotMenuStyles = StyleSheet.create({
  // Categories
  categoriesContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Brand.primaryFaded,
    borderWidth: 1,
    borderColor: Brand.primary,
    gap: Spacing.xs,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.primary,
  },

  // Dishes Section
  dishesSection: {
    paddingVertical: Spacing.sm,
  },
  dishesSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  dishesSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  viewAllButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.primary,
  },
  dishesScroll: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },

  // Dish Card
  dishCard: {
    width: 140,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    ...Shadows.sm,
  },
  dishImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F5F5F5',
  },
  dishInfo: {
    padding: Spacing.sm,
  },
  dishName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 16,
  },
  dishPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.primary,
  },
  vegBadge: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // View All Card
  viewAllCard: {
    width: 140,
    height: 100,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Brand.primaryFaded,
    borderWidth: 2,
    borderColor: Brand.primary,
    borderStyle: 'dashed',
  },
  viewAllCardText: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.primary,
    marginTop: Spacing.xs,
  },
});
