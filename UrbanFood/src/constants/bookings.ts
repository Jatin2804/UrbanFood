export const TIME_SLOTS = {
  FIVE_MIN: '5min' as const,
  TEN_MIN: '10min' as const,
};

export const TIME_SLOT_DURATIONS = {
  '5min': 5 * 60 * 1000, // 5 minutes in milliseconds
  '10min': 10 * 60 * 1000, // 10 minutes in milliseconds
};

export const BOOKING_STATUS = {
  ACTIVE: 'active' as const,
  COMPLETED: 'completed' as const,
  CANCELLED: 'cancelled' as const,
};

export const MIN_TABLE_CAPACITY = 2;
export const MAX_TABLE_CAPACITY = 8;
