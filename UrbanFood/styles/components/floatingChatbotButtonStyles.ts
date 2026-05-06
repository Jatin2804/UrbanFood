import { StyleSheet } from 'react-native';

import { Brand, Shadows } from '@/constants/theme';
import {
    FLOATING_BUTTON_MARGIN,
    FLOATING_BUTTON_SIZE,
} from '@/src/constants/chatbot';

const WRAPPER_SIZE = FLOATING_BUTTON_SIZE + 20;

export const floatingChatbotButtonStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 100,
    right: FLOATING_BUTTON_MARGIN,
    width: WRAPPER_SIZE,
    height: WRAPPER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    width: FLOATING_BUTTON_SIZE,
    height: FLOATING_BUTTON_SIZE,
    borderRadius: FLOATING_BUTTON_SIZE / 2,
    backgroundColor: '#FFFFFF',
    ...Shadows.lg,
    overflow: 'hidden',
    padding: 6,
    borderWidth: 2,
    borderColor: Brand.primaryFaded,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  glow: {
    position: 'absolute',
    width: FLOATING_BUTTON_SIZE + 16,
    height: FLOATING_BUTTON_SIZE + 16,
    borderRadius: (FLOATING_BUTTON_SIZE + 16) / 2,
    backgroundColor: Brand.primary,
    opacity: 0.15,
  },
});
