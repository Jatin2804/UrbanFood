import { CartDish } from '../cart/cartTypes';

export type TimeSlot = '5min' | '10min';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  isAvailable: boolean;
}

export interface Booking {
  bookingId: string;
  userId: string;
  tableId: string;
  tableNumber: number;
  timeSlot: TimeSlot;
  bookingTime: string; // ISO string
  bookingDate: string; // ISO string - date for the booking
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string; // ISO string
  dishes?: CartDish[];
}

export interface BookingsState {
  bookings: Booking[];
  tables: Table[];
  loading: boolean;
  updating: boolean;
  error: string | null;
}
