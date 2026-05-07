import { LinkingOptions } from '@react-navigation/native';

/**
 * Deep Linking Configuration for UrbanFood App
 *
 * URL Scheme: myapp://
 *
 * Examples:
 * - myapp://explore?category=veg
 * - myapp://explore?filter=toprated
 * - myapp://dish/dish_001
 * - myapp://dine-in?tab=mybookings
 * - myapp://cart
 * - myapp://orders
 * - myapp://offers
 */

export const linking: LinkingOptions<any> = {
  prefixes: ['myapp://', 'https://urbanfood.app', 'https://*.urbanfood.app'],
  config: {
    screens: {
      // Auth Screens
      Login: 'login',
      Splash: 'splash',

      // Main Tab Screens
      '(tabs)': {
        screens: {
          index: 'home',
          explore: {
            path: 'explore',
            parse: {
              category: (category: string) => category,
              filter: (filter: string) => filter,
            },
          },
          cart: 'cart',
          account: 'account',
        },
      },

      // Dish Detail
      'dish/:id': {
        path: 'dish/:id',
        parse: {
          id: (id: string) => id,
        },
      },

      // Orders
      orders: 'orders',

      // Notifications
      notifications: 'notifications',

      // Dine In / Table Booking
      'dine-in': {
        path: 'dine-in',
        parse: {
          tab: (tab: string) => tab, // 'book' or 'mybookings'
        },
      },
      'book-table': 'book-table',
      'booking-success': 'booking-success',

      // Checkout & Delivery
      checkout: 'checkout',
      'delivery-map': 'delivery-map',

      // Offers
      offers: 'offers',

      // Chatbot
      'chatbot-splash': 'chatbot-splash',
      chatbot: 'chatbot',

      // Settings
      settings: 'settings',
      'notification-test': 'notification-test',
    },
  },
};

/**
 * Deep Link Helper Functions
 */

export const DeepLinks = {
  // Home
  home: () => 'myapp://home',

  // Explore with filters
  explore: (params?: { category?: string; filter?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.filter) query.append('filter', params.filter);
    const queryString = query.toString();
    return `myapp://explore${queryString ? `?${queryString}` : ''}`;
  },

  // Explore by category
  exploreVeg: () => 'myapp://explore?category=veg',
  exploreNonVeg: () => 'myapp://explore?category=nonveg',
  exploreTopRated: () => 'myapp://explore?filter=toprated',
  exploreNewlyAdded: () => 'myapp://explore?filter=newlyadded',
  exploreMainCourse: () => 'myapp://explore?category=maincourse',
  exploreStarters: () => 'myapp://explore?category=starters',
  exploreFastFood: () => 'myapp://explore?category=fastfood',
  exploreBeverage: () => 'myapp://explore?category=beverage',
  exploreDessert: () => 'myapp://explore?category=dessert',

  // Dish detail
  dish: (dishId: string) => `myapp://dish/${dishId}`,

  // Cart
  cart: () => 'myapp://cart',

  // Orders
  orders: () => 'myapp://orders',

  // Account
  account: () => 'myapp://account',

  // Dine In
  dineIn: (tab?: 'book' | 'mybookings') => {
    return tab ? `myapp://dine-in?tab=${tab}` : 'myapp://dine-in';
  },
  dineInBook: () => 'myapp://dine-in?tab=book',
  dineInMyBookings: () => 'myapp://dine-in?tab=mybookings',
  bookTable: () => 'myapp://book-table',

  // Checkout
  checkout: () => 'myapp://checkout',
  deliveryMap: () => 'myapp://delivery-map',

  // Offers
  offers: () => 'myapp://offers',

  // Chatbot
  chatbot: () => 'myapp://chatbot',
  chatbotSplash: () => 'myapp://chatbot-splash',

  // Settings
  settings: () => 'myapp://settings',
  notifications: () => 'myapp://notifications',
};

/**
 * Category ID to Deep Link Mapping
 */
export const CategoryDeepLinks: Record<string, string> = {
  veg: DeepLinks.exploreVeg(),
  nonveg: DeepLinks.exploreNonVeg(),
  toprated: DeepLinks.exploreTopRated(),
  newlyadded: DeepLinks.exploreNewlyAdded(),
  maincourse: DeepLinks.exploreMainCourse(),
  starters: DeepLinks.exploreStarters(),
  fastfood: DeepLinks.exploreFastFood(),
  beverage: DeepLinks.exploreBeverage(),
  dessert: DeepLinks.exploreDessert(),
};
