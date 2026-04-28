// Restaurant coordinates (Urban Food, HSR Layout, Bangalore)
export const RESTAURANT_COORDS = {
  latitude: 12.899965,
  longitude: 77.641083,
};

export const RESTAURANT_NAME = 'Urban Food';

// OpenRouteService — used for real road routing (no Google Maps key needed)
export const ORS_API_KEY =
  'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjJkNTU3YjUxNzQzZjRlNWU4Yjc2ZDMyYzlhMjY5MDU1IiwiaCI6Im11cm11cjY0In0=';
export const ORS_DIRECTIONS_URL =
  'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

// Mock delivery partner
export const DELIVERY_PARTNER = {
  name: 'Ravi Kumar',
  phone: '+91 98765 00001',
  rating: 4.8,
  vehicle: 'Bike · KA 05 AB 1234',
};

// Delivery status stages
export const DELIVERY_STATUSES = [
  'Order Placed',
  'Preparing',
  'Out for Delivery',
  'Arriving Soon',
  'Delivered',
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

// How many route steps each status covers (out of total route points)
export const STATUS_THRESHOLDS = {
  'Order Placed': 0,
  Preparing: 0.15,
  'Out for Delivery': 0.3,
  'Arriving Soon': 0.75,
  Delivered: 1,
} as const;

// Delivery simulation duration (2 minutes = 120 seconds = 120000 ms)
export const DELIVERY_DURATION_MS = 120000;

// Update interval for smooth animation (60 FPS = ~16ms per frame)
export const STEP_INTERVAL_MS = 100;

// Initial ETA in minutes
export const INITIAL_ETA_MINUTES = 2;
