import { Radius, Spacing } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const tableCardSkeletonStyles = StyleSheet.create({
  container: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
