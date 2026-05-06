import { StyleSheet } from 'react-native';

import { Brand, Radius, Shadows, Spacing, Typography } from '@/constants/theme';

export const offersStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingTop: Spacing.xl + Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  headerTitle: {
    ...Typography.h3,
    flex: 1,
  },
  headerSpacer: {
    width: 32,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  offerCard: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
    position: 'relative',
    overflow: 'hidden',
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  offerHeaderText: {
    flex: 1,
  },
  offerTitle: {
    ...Typography.h4,
    marginBottom: 4,
  },
  codeContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Brand.primary,
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Brand.primary,
    letterSpacing: 0.5,
  },
  offerDescription: {
    ...Typography.body,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  minOrderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  minOrderText: {
    fontSize: 13,
    opacity: 0.7,
  },
  discountBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: Brand.primary,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    ...Shadows.sm,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Brand.primaryFaded,
    marginTop: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: Brand.primary,
  },
});
