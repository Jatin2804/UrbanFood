import { Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const categoryCarouselStyles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  header: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h3,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.caption,
    opacity: 0.6,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
});
