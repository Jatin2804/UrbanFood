import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const chatbotSplashStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});
