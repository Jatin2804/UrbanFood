// Language selector styles

import { Brand, Radius, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const languageSelectorStyles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  settingDescription: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 24,
    marginLeft: Spacing.md,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '100%',
    paddingBottom: Spacing.xl,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  languageList: {
    padding: Spacing.md,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
  languageItemSelected: {
    backgroundColor: Brand.primaryFaded,
    borderWidth: 2,
    borderColor: Brand.primary,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  languageNameEnglish: {
    fontSize: 14,
  },
  checkmark: {
    fontSize: 24,
    color: Brand.primary,
    fontWeight: '700',
  },
});
