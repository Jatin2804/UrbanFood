import { Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const bookingSuccessStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    ...Typography.h1,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  detailsCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: Spacing.sm,
  },
  detailLabel: {
    ...Typography.body,
  },
  detailValue: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.xs,
  },
  infoBox: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  infoText: {
    ...Typography.caption,
    flex: 1,
    lineHeight: 18,
  },
  buttonContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  button: {
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...Shadows.sm,
  },
  buttonText: {
    ...Typography.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buttonOutline: {
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderWidth: 1,
  },
  buttonOutlineText: {
    ...Typography.bodyMedium,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  errorTitle: {
    ...Typography.h3,
  },
});
