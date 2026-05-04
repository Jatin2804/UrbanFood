import { createSlice } from '@reduxjs/toolkit';
import { TABLES } from '../../data/tables';
import {
  cancelBooking,
  createBooking,
  fetchBookings,
  fetchTables,
} from './bookingsThunks';
import { BookingsState } from './bookingsTypes';

const initialState: BookingsState = {
  bookings: [],
  tables: TABLES,
  loading: false,
  updating: false,
  error: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearBookingsState: (state) => {
      state.bookings = [];
      state.tables = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tables
      .addCase(fetchTables.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTables.fulfilled, (state, action) => {
        state.loading = false;
        state.tables = action.payload;
      })
      .addCase(fetchTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load tables';
      })

      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        // Merge fetched bookings with existing ones, preserving local bookings
        const fetchedBookings = action.payload;
        const existingBookingIds = new Set(
          state.bookings.map((b) => b.bookingId),
        );
        const fetchedBookingIds = new Set(
          fetchedBookings.map((b) => b.bookingId),
        );

        // Keep local bookings that aren't in the fetched data (recently created)
        const localOnlyBookings = state.bookings.filter(
          (b) => !fetchedBookingIds.has(b.bookingId),
        );

        // Update existing bookings with fetched data (server is source of truth for synced bookings)
        const mergedBookings = [
          ...localOnlyBookings, // Keep local bookings first
          ...fetchedBookings, // Add all fetched bookings
        ];

        state.bookings = mergedBookings;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load bookings';
      })

      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.updating = false;
        state.bookings = [action.payload, ...state.bookings];
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload ?? 'Failed to create booking';
      })

      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.updating = true;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.bookings.findIndex(
          (b) => b.bookingId === action.payload.bookingId,
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload ?? 'Failed to cancel booking';
      });
  },
});

export const { clearBookingsState } = bookingsSlice.actions;
export default bookingsSlice.reducer;
