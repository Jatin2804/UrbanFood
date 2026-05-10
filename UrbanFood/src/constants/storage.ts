/**
 * AsyncStorage Keys
 * Centralized storage keys for the application
 */

export const STORAGE_KEYS = {
  // Theme
  THEME: '@app_theme_mode',

  // Language & Translations
  LANGUAGE: '@urbanfood_language',
  TRANSLATIONS: '@urbanfood_translations',

  // Cart (prefix - append userId)
  CART_PREFIX: '@cart_',

  // Notifications (prefix - append userId)
  NOTIFICATIONS_PREFIX: '@notifications_history_',

  // Chatbot
  CHATBOT_MESSAGES: '@chatbot_messages',
} as const;

/**
 * Helper to get cart storage key for a specific user
 */
export const getCartStorageKey = (userId: string) =>
  `${STORAGE_KEYS.CART_PREFIX}${userId}`;

/**
 * Helper to get notifications storage key for a specific user
 */
export const getNotificationsStorageKey = (userId?: string) =>
  `${STORAGE_KEYS.NOTIFICATIONS_PREFIX}${userId || 'guest'}`;
