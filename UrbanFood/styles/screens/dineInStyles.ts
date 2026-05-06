import { Radius, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const dineInStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
  headerTitle: {
    ...Typography.h2,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'transparent',
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabText: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h3,
    fontWeight: '700',
    marginBottom: Spacing.md,
    letterSpacing: 0.3,
  },
  slotContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  slotButton: {
    flex: 1,
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.lg,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotButtonText: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  legendDot: {
    width: 18,
    height: 18,
    borderRadius: Radius.sm,
  },
  legendText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyIconBox: {
    width: 100,
    height: 100,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.h2,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  emptyDesc: {
    ...Typography.body,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
  },
  bookButton: {
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  bookButtonText: {
    ...Typography.h4,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  viewToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
