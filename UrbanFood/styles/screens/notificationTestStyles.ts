import { Brand, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const notificationTestStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl * 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 16,
    color: '#555555',
    marginBottom: Spacing.xl,
  },
  button: {
    backgroundColor: Brand.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.lg,
    borderRadius: 12,
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: Spacing.md,
  },
  infoText: {
    fontSize: 14,
    color: '#555555',
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
});
