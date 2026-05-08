# UrbanFood - Restaurant App

A full-featured restaurant mobile application built with React Native and Expo, offering seamless food ordering, table booking, live delivery tracking, and AI-powered chatbot assistance.

---

## 🚀 Features

- **Explore Dishes** - Browse and search through restaurant menu with categories and filters
- **Smart Cart Management** - Add items to cart with quantity control and offers
- **Dual Order Modes** - Support for both Cash on Delivery and Dine-In orders
- **Multiple Order Handling** - Track and manage multiple orders simultaneously
- **Live Delivery Tracking** - Real-time order tracking on interactive maps
- **Table Booking** - Reserve tables with visual restaurant layout
- **Push Notifications** - Order confirmations and delivery status updates
- **AI Chatbot** - Intelligent assistant for menu exploration and support
- **Multi-language Support** - Internationalization with dynamic language switching
- **Biometric Authentication** - Secure login with fingerprint/face recognition
- **Offline Support** - AsyncStorage for persistent data

---

## 📚 Tech Stack

### Core Technologies

- **React Native** (0.81.5) - Mobile app framework
- **Expo** (~54.0.33) - Development platform and tooling
- **TypeScript** (~5.9.2) - Type-safe development
- **Redux Toolkit** (^2.11.2) - State management
- **Expo Router** (~6.0.23) - File-based navigation

### Key Libraries

- **axios** (^1.15.2) - HTTP client for API calls
- **react-native-maps** (1.20.1) - Interactive maps for delivery tracking
- **expo-notifications** (^55.0.21) - Push notification handling
- **expo-local-authentication** (~17.0.8) - Biometric authentication
- **expo-location** (~19.0.8) - GPS and location services
- **react-native-reanimated** (~4.1.1) - Smooth animations
- **react-native-gesture-handler** (~2.28.0) - Touch gesture handling
- **react-native-webview** (13.15.0) - WebView for chatbot interface
- **@react-native-async-storage/async-storage** (2.2.0) - Local data persistence

---

## 📁 Project Structure

```
urbanfood/
├── app/                          # Expo Router screens (file-based routing)
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── _layout.tsx           # Tab navigator configuration
│   │   ├── index.tsx             # Home screen (main landing)
│   │   ├── explore.tsx           # Dish exploration and search
│   │   ├── cart.tsx              # Shopping cart screen
│   │   └── account.tsx           # User profile and settings
│   ├── dish/
│   │   └── [id].tsx              # Dynamic dish detail screen (uses route params)
│   ├── _layout.tsx               # Root layout with Redux Provider
│   ├── index.tsx                 # App entry point
│   ├── Splash.tsx                # Splash screen with animations
│   ├── Login.tsx                 # Authentication screen
│   ├── checkout.tsx              # Order checkout and payment
│   ├── addresses.tsx             # Delivery address management
│   ├── book-table.tsx            # Table booking interface
│   ├── booking-success.tsx       # Booking confirmation screen
│   ├── dine-in.tsx               # Dine-in order screen
│   ├── delivery-map.tsx          # Live delivery tracking map
│   ├── order-success.tsx         # Order confirmation screen
│   ├── orders.tsx                # Order history and tracking
│   ├── favourites.tsx            # Saved favorite dishes
│   ├── offers.tsx                # Promotional offers screen
│   ├── notifications.tsx         # Notification center
│   ├── settings.tsx              # App settings (language, preferences)
│   ├── help-support.tsx          # Help and support screen
│   ├── chatbot.tsx               # AI chatbot interface
│   ├── chatbot-splash.tsx        # Chatbot intro screen
│   └── chatbot-explore.tsx       # Chatbot-powered dish exploration
│
├── components/                   # Reusable UI components (one per file)
│   ├── account/
│   │   ├── ProfileHeader.tsx     # User profile display with avatar
│   │   ├── ContactInfoCard.tsx   # Contact details card
│   │   ├── MenuList.tsx          # Account menu options list
│   │   └── LogoutButton.tsx      # Logout action button
│   ├── auth/
│   │   ├── LoginForm.tsx         # Login form with validation
│   │   └── SignupForm.tsx        # Registration form
│   ├── bookings/
│   │   ├── RestaurantLayout.tsx  # Visual table layout renderer
│   │   ├── TableCard.tsx         # Individual table selection card
│   │   ├── TableCardSkeleton.tsx # Loading placeholder for tables
│   │   ├── BookingCard.tsx       # Booking details card
│   │   └── BookingCardSkeleton.tsx # Loading placeholder for bookings
│   ├── cart/
│   │   ├── CartHeader.tsx        # Cart screen header
│   │   ├── CartRow.tsx           # Individual cart item row
│   │   ├── CartRowSkeleton.tsx   # Loading placeholder for cart items
│   │   ├── CartEmptyState.tsx    # Empty cart illustration
│   │   ├── CartFloatingBar.tsx   # Floating action bar in cart
│   │   ├── AddToCartButton.tsx   # Add to cart CTA button
│   │   ├── BillSummary.tsx       # Order total breakdown
│   │   ├── CheckoutBar.tsx       # Checkout action bar
│   │   ├── OfferSection.tsx      # Applied offers display
│   │   ├── OfferSheet.tsx        # Bottom sheet for offer selection
│   │   └── PlaceOrderSheet.tsx   # Order confirmation bottom sheet
│   ├── chatbot/
│   │   ├── FloatingChatbotButton.tsx # Floating chatbot launcher
│   │   ├── ChatbotDishCard.tsx   # Dish card in chatbot interface
│   │   └── ChatbotMenuCategories.tsx # Category selector in chatbot
│   ├── common/
│   │   ├── SkeletonLoader.tsx    # Base skeleton loading component
│   │   ├── EmptyState.tsx        # Generic empty state component
│   │   ├── StarRating.tsx        # Star rating display
│   │   ├── DishCardSkeleton.tsx  # Loading placeholder for dishes
│   │   ├── DishDetailSkeleton.tsx # Loading placeholder for dish details
│   │   ├── CategoryListSkeleton.tsx # Loading placeholder for categories
│   │   ├── OrderCardSkeleton.tsx # Loading placeholder for orders
│   │   ├── NotificationCardSkeleton.tsx # Loading placeholder for notifications
│   │   ├── ProfileHeaderSkeleton.tsx # Loading placeholder for profile
│   │   ├── BookingCardSkeleton.tsx # Reusable booking skeleton
│   │   ├── CartRowSkeleton.tsx   # Reusable cart row skeleton
│   │   └── TableCardSkeleton.tsx # Reusable table skeleton
│   ├── delivery/
│   │   └── DeliveryStatusCard.tsx # Delivery progress indicator
│   ├── dish/
│   │   ├── DishImageCarousel.tsx # Image gallery for dish details
│   │   ├── DishInfoSection.tsx   # Dish description and details
│   │   ├── DishStatsRow.tsx      # Rating, reviews, prep time stats
│   │   ├── DishBottomBar.tsx     # Add to cart bottom bar
│   │   └── ReviewList.tsx        # Customer reviews list
│   ├── explore/
│   │   ├── SearchBar.tsx         # Search input with debounce
│   │   ├── CategoryList.tsx      # Horizontal category chips
│   │   ├── FilterBar.tsx         # Filter options (veg, rating, etc.)
│   │   ├── DishCard.tsx          # Dish card in grid/list view
│   │   └── SortSheet.tsx         # Bottom sheet for sorting options
│   ├── home/
│   │   ├── HomeHeader.tsx        # Home screen header with location
│   │   ├── HomeSearchBar.tsx     # Search bar on home screen
│   │   ├── GreetingSection.tsx   # Personalized greeting
│   │   ├── BannerCarousel.tsx    # Promotional banner slider
│   │   ├── CategoryCarousel.tsx  # Horizontal category scroll
│   │   ├── CategoryCard.tsx      # Category card with image
│   │   ├── OfferCarousel.tsx     # Offers slider
│   │   ├── ScrollSection.tsx     # Generic horizontal scroll section
│   │   ├── HorizontalDishCard.tsx # Dish card in horizontal scroll
│   │   ├── RestaurantCard.tsx    # Restaurant info card
│   │   └── BottomBanner.tsx      # Bottom promotional banner
│   ├── notifications/
│   │   ├── NotificationButton.tsx # Notification bell icon with badge
│   │   └── NotificationCardSkeleton.tsx # Loading placeholder
│   ├── orders/
│   │   └── FloatingOrderStatus.tsx # Floating order tracking widget
│   ├── settings/
│   │   └── LanguageSelector.tsx  # Language selection dropdown
│   ├── haptic-tab.tsx            # Tab bar with haptic feedback
│   ├── themed-text.tsx           # Themed Text component
│   └── themed-view.tsx           # Themed View component
│
├── src/
│   ├── config/
│   │   ├── env.ts                # Environment variables configuration
│   │   └── linking.ts            # Deep linking configuration
│   ├── constants/                # App-wide constants (no hardcoded values)
│   │   ├── account.ts            # Account-related constants
│   │   ├── bookings.ts           # Booking constants (time slots, capacity)
│   │   ├── cart.ts               # Cart constants (delivery fee, min order)
│   │   ├── chatbot.ts            # Chatbot configuration constants
│   │   ├── delivery.ts           # Delivery status constants
│   │   ├── explore.ts            # Explore screen constants (filters, sorts)
│   │   ├── languages.ts          # Supported languages list
│   │   ├── navigation.ts         # Navigation route names
│   │   └── notifications.ts      # Notification types and channels
│   ├── data/                     # Static data arrays/objects
│   │   ├── categories.ts         # Food categories data
│   │   ├── cartOffers.ts         # Available cart offers
│   │   ├── homeContent.ts        # Home screen content (banners, sections)
│   │   ├── restaurantInfo.ts     # Restaurant details and info
│   │   ├── tables.ts             # Restaurant table layout data
│   │   ├── translations.json     # Translation strings (JSON format)
│   │   └── translations.ts       # Translation utilities
│   ├── features/                 # Redux slices (state management)
│   │   ├── auth/
│   │   │   ├── authSlice.ts      # Auth state slice (user, token, status)
│   │   │   ├── authThunks.ts     # Async auth actions (login, signup, logout)
│   │   │   └── authTypes.ts      # Auth TypeScript types
│   │   ├── bookings/
│   │   │   ├── bookingsSlice.ts  # Bookings state slice
│   │   │   ├── bookingsThunks.ts # Async booking actions (create, fetch, cancel)
│   │   │   └── bookingsTypes.ts  # Booking TypeScript types
│   │   ├── cart/
│   │   │   ├── cartSlice.ts      # Cart state slice (items, total, offers)
│   │   │   ├── cartThunks.ts     # Async cart actions (sync with backend)
│   │   │   └── cartTypes.ts      # Cart TypeScript types
│   │   ├── dishes/
│   │   │   ├── dishesSlice.ts    # Dishes state slice (list, filters, search)
│   │   │   ├── dishesThunk.ts    # Async dish actions (fetch, search)
│   │   │   └── dishesType.ts     # Dish TypeScript types
│   │   ├── language/
│   │   │   ├── languageSlice.ts  # Language state slice (current language)
│   │   │   ├── languageThunks.ts # Async language actions (load translations)
│   │   │   └── languageTypes.ts  # Language TypeScript types
│   │   └── orders/
│   │       ├── ordersSlice.ts    # Orders state slice (history, active orders)
│   │       ├── ordersThunks.ts   # Async order actions (place, track, cancel)
│   │       └── ordersTypes.ts    # Order TypeScript types
│   ├── hooks/                    # Custom React hooks (reusable logic)
│   │   ├── useAuth.ts            # Authentication hook (login, logout, user state)
│   │   ├── useBookings.ts        # Bookings hook (fetch, create, cancel bookings)
│   │   ├── useCart.ts            # Cart hook (add, remove, update items)
│   │   ├── useDishes.ts          # Dishes hook (fetch, filter, search dishes)
│   │   ├── useLocation.ts        # Location hook (GPS, address selection)
│   │   ├── useNotifications.ts   # Notifications hook (register, handle notifications)
│   │   ├── useOrders.ts          # Orders hook (place order, fetch history)
│   │   ├── useOrderTimer.ts      # Order timer hook (countdown for delivery)
│   │   └── useTranslation.ts     # Translation hook (i18n utilities)
│   ├── services/                 # API calls and external services
│   │   ├── apiClient.ts          # Axios instance with interceptors
│   │   ├── apiService.ts         # API endpoints (dishes, orders, bookings)
│   │   ├── chatService.ts        # Chatbot API integration
│   │   └── translationService.ts # Translation API service
│   ├── store/
│   │   ├── index.ts              # Redux store configuration
│   │   └── rootReducer.ts        # Combined reducers
│   ├── types/
│   │   ├── components.ts         # Component prop interfaces
│   │   ├── index.ts              # Exported types
│   │   └── navigation.ts         # Navigation type definitions
│   ├── utils/                    # Utility functions
│   │   ├── base64.ts             # Base64 encoding/decoding
│   │   ├── biometricAuth.ts      # Biometric authentication utilities
│   │   ├── notifications.ts      # Notification helpers
│   │   ├── notificationStorage.ts # Notification persistence
│   │   └── routeData.ts          # Route data utilities
│   ├── navigation.ts             # Navigation utilities
│   └── theme.ts                  # Theme configuration (colors, spacing, fonts)
│
├── styles/                       # StyleSheet files (separated from components)
│   ├── components/               # Component-specific styles
│   │   └── [componentName]Styles.ts # Matches each component file
│   └── screens/                  # Screen-specific styles
│       └── [screenName]Styles.ts # Matches each screen file
│
├── android/                      # Android native code
├── ios/                          # iOS native code (if applicable)
├── .expo/                        # Expo build cache
├── .env                          # Environment variables (API keys, URLs)
├── .env.example                  # Example environment variables
├── .gitignore                    # Git ignore rules
├── .prettierrc                   # Prettier configuration
├── .prettierignore               # Prettier ignore rules
├── app.json                      # Expo app configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

---

## 🏗️ Architecture Patterns

### State Management (Redux Toolkit)

- **Slices**: Feature-based state slices (auth, cart, dishes, orders, bookings, language)
- **Thunks**: Async actions for API calls with loading/error states
- **Selectors**: Memoized selectors for derived state

### Component Architecture

- **Separation of Concerns**: Screens are thin, components are reusable
- **Style Separation**: All styles in dedicated `styles/` directory
- **Type Safety**: All props defined in `src/types/components.ts`

### Navigation

- **File-based Routing**: Expo Router for automatic route generation
- **Tab Navigation**: Bottom tabs for main screens
- **Stack Navigation**: Nested navigation for detail screens
- **Deep Linking**: Configured for push notifications and external links

### Data Flow

1. **UI Components** → Dispatch actions via hooks
2. **Hooks** → Call Redux thunks
3. **Thunks** → Make API calls via services
4. **Services** → Use axios client with interceptors
5. **State Updates** → Components re-render via selectors

---

## 🔧 Key APIs & Services

### Backend APIs (via apiService.ts)

- **Dishes API**: Fetch menu, search, filter dishes
- **Orders API**: Place orders, track status, order history
- **Bookings API**: Create table reservations, fetch bookings
- **Auth API**: Login, signup, token refresh
- **Chatbot API**: AI-powered menu assistance

### Third-Party Services

- **Google Maps API**: Delivery tracking and location services
- **Expo Notifications**: Push notification delivery
- **Expo Location**: GPS and geolocation
- **Expo Local Authentication**: Biometric authentication

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Environment Variables

Create a `.env` file with:

```
API_BASE_URL=https://your-api-url.com
GOOGLE_MAPS_API_KEY=your-google-maps-key
CHATBOT_API_KEY=your-chatbot-api-key
```

---

## 📱 Features in Detail

### 1. Explore & Search

- Category-based filtering
- Real-time search with debounce
- Sort by price, rating, popularity
- Veg/Non-veg filters

### 2. Cart Management

- Add/remove items with quantity control
- Apply promotional offers
- Bill summary with taxes and delivery fee
- Persistent cart (AsyncStorage)

### 3. Order Placement

- Delivery and Dine-in modes
- Address selection with GPS
- Multiple payment options
- Order confirmation with tracking

### 4. Live Tracking

- Real-time delivery status updates
- Interactive map with driver location
- Estimated delivery time
- Push notifications for status changes

### 5. Table Booking

- Visual restaurant layout
- Real-time table availability
- Date and time selection
- Booking confirmation

### 6. AI Chatbot

- Natural language menu exploration
- Dish recommendations
- Order assistance
- Multi-language support

### 7. Notifications

- Order confirmations
- Delivery status updates
- Promotional offers
- Booking reminders

---

## 🎨 Design System

### Theme (src/theme.ts)

- **Colors**: Primary, secondary, accent, background, text
- **Spacing**: Consistent spacing scale (4px base)
- **Typography**: Font families, sizes, weights
- **Shadows**: Elevation system for depth

### Components

- **ThemedText**: Styled text with theme support
- **ThemedView**: Styled view with theme support
- **SkeletonLoader**: Loading placeholders
- **EmptyState**: Empty state illustrations

---

## 🧪 Code Quality

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

### TypeScript

- Strict mode enabled
- All components and functions typed
- No implicit any

---

## 📦 Build & Deployment

### Android Build

```bash
# Development build
npm run android

# Release build
npm run android-release
```

### iOS Build

```bash
npm run ios
```

---
