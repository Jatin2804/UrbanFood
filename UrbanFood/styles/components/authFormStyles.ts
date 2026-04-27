import { Brand, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const authFormStyles = StyleSheet.create({
  container: { width: '100%' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  icon: { marginRight: Spacing.sm },
  input: {
    flex: 1,
    height: 52,
    ...Typography.body,
  },
  button: {
    backgroundColor: Brand.primary,
    borderRadius: Radius.md,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
    ...Shadows.primary,
  },
  buttonDisabled: {
    backgroundColor: Brand.primaryDisabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    ...Typography.h4,
  },
  signupButton: {
    marginBottom: Spacing.lg,
  },
});
