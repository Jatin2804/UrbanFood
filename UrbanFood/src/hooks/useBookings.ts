import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  cancelBooking,
  createBooking,
  fetchBookings,
  fetchTables,
} from '../features/bookings/bookingsThunks';
import { TimeSlot } from '../features/bookings/bookingsTypes';
import { AppDispatch } from '../store';
import { RootState } from '../store/rootReducer';
import { useAuth } from './useAuth';

export const useBookings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, tables, loading, updating, error } = useSelector(
    (state: RootState) => state.bookings,
  );
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchTables());
    dispatch(fetchBookings());
  }, [dispatch]);

  const getBookedTableIds = () => {
    const now = new Date();
    return bookings
      .filter((booking) => {
        if (booking.status !== 'active') return false;
        const bookingTime = new Date(booking.bookingTime);
        const slotDuration =
          booking.timeSlot === '5min' ? 5 * 60 * 1000 : 10 * 60 * 1000;
        const expiryTime = new Date(bookingTime.getTime() + slotDuration);
        return now < expiryTime;
      })
      .map((b) => b.tableId);
  };

  const bookTable = async (
    tableId: string,
    tableNumber: number,
    timeSlot: TimeSlot,
    dishes?: any[],
  ) => {
    if (!user) {
      throw new Error('User not logged in');
    }

    return dispatch(
      createBooking({
        userId: user.id,
        tableId,
        tableNumber,
        timeSlot,
        dishes,
      }),
    ).unwrap();
  };

  const cancelTableBooking = async (bookingId: string) => {
    return dispatch(cancelBooking(bookingId)).unwrap();
  };

  const getUserBookings = () => {
    if (!user) return [];
    return bookings.filter((b) => b.userId === user.id);
  };

  const refreshBookings = () => {
    dispatch(fetchBookings());
  };

  return {
    bookings,
    tables,
    loading,
    updating,
    error,
    user,
    getBookedTableIds,
    bookTable,
    cancelTableBooking,
    getUserBookings,
    refreshBookings,
  };
};
