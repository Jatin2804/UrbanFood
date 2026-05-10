/**
 * Navigation Routes
 * Central mapping of all screen names to their navigation paths
 */

export const ROUTES = {
  // Root screens
  SPLASH: '/Splash',
  LOGIN: '/Login',
  HOME: '/',

  // Main tabs
  TABS: {
    HOME: '/(tabs)',
    EXPLORE: '/(tabs)/explore',
    CART: '/(tabs)/cart',
    ACCOUNT: '/(tabs)/account',
  },

  // Feature screens
  DISH_DETAILS: (id: string | number) => `/dish/${id}`,
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success',
  ORDERS: '/orders',
  DELIVERY_MAP: '/delivery-map',

  // Dining
  DINE_IN: '/dine-in',
  BOOK_TABLE: '/book-table',
  BOOKING_SUCCESS: '/booking-success',

  // Chatbot
  CHATBOT_SPLASH: '/chatbot-splash',
  CHATBOT_EXPLORE: '/chatbot-explore',
  CHATBOT: '/chatbot',

  // Other
  OFFERS: '/offers',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  FAVOURITES: '/favourites',
  HELP_SUPPORT: '/help-support',
  ADDRESSES: '/addresses',
} as const;

/**
 * Screen names for Stack.Screen and Tabs.Screen components
 * Use these in your layout files for consistency
 */
export const SCREEN_NAMES = {
  // Root screens
  INDEX: 'index',
  SPLASH: 'Splash',
  LOGIN: 'Login',
  TABS: '(tabs)',

  // Tab screens
  TAB_INDEX: 'index',
  TAB_EXPLORE: 'explore',
  TAB_CART: 'cart',
  TAB_ACCOUNT: 'account',

  // Feature screens
  DISH_DETAILS: 'dish/[id]',
  CHECKOUT: 'checkout',
  ORDER_SUCCESS: 'order-success',
  ORDERS: 'orders',
  DELIVERY_MAP: 'delivery-map',

  // Dining
  DINE_IN: 'dine-in',
  BOOK_TABLE: 'book-table',
  BOOKING_SUCCESS: 'booking-success',

  // Chatbot
  CHATBOT_SPLASH: 'chatbot-splash',
  CHATBOT_EXPLORE: 'chatbot-explore',
  CHATBOT: 'chatbot',

  // Other
  OFFERS: 'offers',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'settings',
  FAVOURITES: 'favourites',
  HELP_SUPPORT: 'help-support',
  ADDRESSES: 'addresses',
} as const;

/**
 * Type for all valid route paths
 */
export type RoutePath =
  | (typeof ROUTES)[keyof typeof ROUTES]
  | ReturnType<typeof ROUTES.DISH_DETAILS>;

/**
 * Type for all valid screen names
 */
export type ScreenName = (typeof SCREEN_NAMES)[keyof typeof SCREEN_NAMES];
