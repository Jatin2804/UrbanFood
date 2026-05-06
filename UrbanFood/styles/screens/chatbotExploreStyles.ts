import { StyleSheet } from 'react-native';

import { Spacing, Typography } from '@/constants/theme';

export const chatbotExploreStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 4,
    paddingTop: Spacing.xl + Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.06)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 3,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.5,
    lineHeight: 18,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md + 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl * 2,
  },
  emptyText: {
    ...Typography.body,
    fontSize: 16,
    textAlign: 'center',
    marginTop: Spacing.md + 2,
    opacity: 0.5,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
