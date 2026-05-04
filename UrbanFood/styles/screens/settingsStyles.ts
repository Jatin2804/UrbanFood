import { Radius, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
    padding: Spacing.sm,
    borderRadius: Radius.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
    opacity: 0.6,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    fontSize: 16,
    opacity: 0.6,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});
