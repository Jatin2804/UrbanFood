import { createAsyncThunk } from '@reduxjs/toolkit';
import { NOTIFICATION_TEMPLATES } from '../../constants/notifications';
import { TABLES } from '../../data/tables';
import {
    createBookingAPI,
    fetchBookingsAPI,
    getBookingsMeta,
    updateBookingsAPI
} from '../../services/apiService';
import { showNotification } from '../../utils/notifications';
import { saveNotification } from '../../utils/notificationStorage';
import { CartDish } from '../cart/cartTypes';
import { Booking, Table, TimeSlot } from './bookingsTypes';

export const fetchTables = createAsyncThunk<
  Table[],
  void,
  { rejectValue: string }
>('bookings/fetchTables', async (_, { rejectWithValue }) => {
  try {
    // Tables are static for now, but this allows for future API integration
    return TABLES;
  } catch (error: any) {
    console.error('[fetchTables] Error:', error);
    return rejectWithValue(error.message || 'Failed to fetch tables');
  }
});

export const fetchBookings = createAsyncThunk<
  Booking[],
  void,
  { rejectValue: string }
>('bookings/fetchBookings', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchBookingsAPI();
    // fetchBookingsAPI already handles parsing and returns an array
    const bookings = Array.isArray(data) ? data : [];
    
    if (__DEV__) {
      console.log('[fetchBookings] Fetched bookings count:', bookings.length);
      console.log('[fetchBookings] Active bookings:', bookings.filter(b => b.status === 'active').length);
    }
    
    return bookings;
  } catch (error: any) {
    console.error('[fetchBookings] Error:', error);
    return rejectWithValue(error.message || 'Failed to fetch bookings');
  }
});

export const createBooking = createAsyncThunk<
  Booking,
  {
    userId: string;
    tableId: string;
    tableNumber: number;
    timeSlot: TimeSlot;
    dishes?: CartDish[];
  },
  { rejectValue: string; state: any }
>(
  'bookings/createBooking',
  async (
    { userId, tableId, tableNumber, timeSlot, dishes },
    { rejectWithValue, getState },
  ) => {
    try {
      const state = getState();
      const existingBookings = state.bookings.bookings || [];

      const newBooking: Booking = {
        bookingId: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        tableId,
        tableNumber,
        timeSlot,
        bookingTime: new Date().toISOString(),
        status: 'active',
        createdAt: new Date().toISOString(),
        dishes: dishes || [],
      };

      const updatedBookings = [newBooking, ...existingBookings];

      if (__DEV__) {
        console.log('[createBooking] Creating new booking:', newBooking.bookingId);
        console.log('[createBooking] Table ID:', tableId);
        console.log('[createBooking] Total bookings after creation:', updatedBookings.length);
      }

      // Update the API with the new bookings array
      try {
        const meta = await getBookingsMeta();
        if (meta && meta.sha) {
          await updateBookingsAPI(updatedBookings, meta.sha);
          if (__DEV__) console.log('[createBooking] Successfully updated API');
        } else {
          await createBookingAPI(updatedBookings);
          if (__DEV__) console.log('[createBooking] Successfully created in API');
        }
      } catch (apiError) {
        console.warn('API update failed, using local state:', apiError);
        // Still return the booking even if API fails - it's in Redux state
      }

      // Send push notification for booking confirmation
      try {
        const bookingTime = new Date(newBooking.bookingTime);
        const timeString = bookingTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        
        const notificationContent = NOTIFICATION_TEMPLATES.bookingConfirmed(
          newBooking.bookingId,
          tableNumber,
          timeString
        );

        // Show the notification
        const notificationId = await showNotification(
          notificationContent.title,
          notificationContent.body,
          notificationContent.data
        );

        // Save to notification history
        await saveNotification(
          {
            id: notificationId,
            title: notificationContent.title,
            body: notificationContent.body,
            data: notificationContent.data,
            timestamp: Date.now(),
            read: false,
          },
          userId
        );

        if (__DEV__) console.log('[createBooking] Notification sent:', notificationId);
      } catch (notificationError) {
        console.warn('Failed to send notification:', notificationError);
        // Don't fail the booking if notification fails
      }

      return newBooking;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create booking');
    }
  },
);

export const cancelBooking = createAsyncThunk<
  Booking,
  string,
  { rejectValue: string; state: any }
>('bookings/cancelBooking', async (bookingId, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const bookings = state.bookings.bookings || [];

    const bookingIndex = bookings.findIndex(
      (b: Booking) => b.bookingId === bookingId,
    );
    if (bookingIndex === -1) {
      return rejectWithValue('Booking not found');
    }

    const originalBooking = bookings[bookingIndex];
    const updatedBooking = {
      ...originalBooking,
      status: 'cancelled' as const,
    };

    const updatedBookings = [
      ...bookings.slice(0, bookingIndex),
      updatedBooking,
      ...bookings.slice(bookingIndex + 1),
    ];

    // Update the API with the updated bookings array
    try {
      const meta = await getBookingsMeta();
      if (meta && meta.sha) {
        await updateBookingsAPI(updatedBookings, meta.sha);
      }
    } catch (apiError) {
      console.warn('API update failed, using local state:', apiError);
      // Still return the updated booking even if API fails
    }

    // Send cancellation notification
    try {
      const notificationContent = NOTIFICATION_TEMPLATES.bookingCancelled(
        originalBooking.bookingId,
        originalBooking.tableNumber
      );

      const notificationId = await showNotification(
        notificationContent.title,
        notificationContent.body,
        notificationContent.data
      );

      await saveNotification(
        {
          id: notificationId,
          title: notificationContent.title,
          body: notificationContent.body,
          data: notificationContent.data,
          timestamp: Date.now(),
          read: false,
        },
        originalBooking.userId
      );

      if (__DEV__) console.log('[cancelBooking] Cancellation notification sent');
    } catch (notificationError) {
      console.warn('Failed to send cancellation notification:', notificationError);
    }

    return updatedBooking;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to cancel booking');
  }
});
