import BookingCard from '@/components/bookings/BookingCard';
import TableCard from '@/components/bookings/TableCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { RootState } from '@/src/store/rootReducer';
import { Table, TimeSlot } from '@/src/types';
import { dineInStyles as styles } from '@/styles/screens/dineInStyles';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  cancelBooking,
  createBooking,
  fetchBookings,
} from '../src/features/bookings/bookingsThunks';
import { clearCart } from '../src/features/cart/cartThunks';
import { AppDispatch } from '../src/store';

export default function DineIn() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { bookings, tables, loading, updating } = useSelector(
    (state: RootState) => state.bookings,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { cart } = useSelector((state: RootState) => state.cart);
  const cartItems = cart?.dishes || [];

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>('5min');
  const [activeTab, setActiveTab] = useState<'book' | 'mybookings'>('book');
  const [justBooked, setJustBooked] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Only fetch if we didn't just create a booking
      // This prevents overwriting the local state with stale API data
      if (!justBooked) {
        dispatch(fetchBookings());
      } else {
        // Reset the flag after skipping one fetch
        setJustBooked(false);
      }
    }, [dispatch, justBooked]),
  );

  // Update current time every minute to refresh expired bookings
  const [currentTime, setCurrentTime] = useState(new Date());
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchBookings());
    setRefreshing(false);
  }, [dispatch]);

  const getBookedTableIds = () => {
    return bookings
      .filter((booking) => {
        // Only consider active bookings
        if (booking.status !== 'active') return false;

        // Parse the booking time
        const bookingTime = new Date(booking.bookingTime);

        // Calculate expiry time based on time slot
        const slotDuration =
          booking.timeSlot === '5min' ? 5 * 60 * 1000 : 10 * 60 * 1000;
        const expiryTime = new Date(bookingTime.getTime() + slotDuration);

        // Check if booking is still valid (not expired)
        return currentTime < expiryTime;
      })
      .map((b) => b.tableId);
  };

  // Recalculate booked table IDs whenever bookings change
  const bookedTableIds = getBookedTableIds();

  const handleBookTable = async () => {
    if (!selectedTable) {
      Alert.alert('Error', 'Please select a table');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'Please login to book a table');
      return;
    }

    try {
      const result = await dispatch(
        createBooking({
          userId: user.id,
          tableId: selectedTable.id,
          tableNumber: selectedTable.number,
          timeSlot: selectedSlot,
          dishes: cartItems,
        }),
      ).unwrap();

      // The newly created booking is already added to Redux state by the thunk
      // Set flag to prevent immediate re-fetch on navigation
      setJustBooked(true);

      // Clear the cart after successful booking
      try {
        await dispatch(clearCart(user.id)).unwrap();
      } catch (cartError) {
        // Cart clear failed
      }

      // Navigate to success screen with booking ID
      router.push({
        pathname: '/booking-success',
        params: { bookingId: result.bookingId },
      });
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to book table');
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(cancelBooking(bookingId)).unwrap();
              Alert.alert('Success', 'Booking cancelled successfully');
            } catch (error: any) {
              Alert.alert('Error', error || 'Failed to cancel booking');
            }
          },
        },
      ],
    );
  };

  const myBookings = user
    ? bookings.filter((b) => {
        if (b.userId !== user.id) return false;
        if (b.status !== 'active') return false;

        const bookingTime = new Date(b.bookingTime);
        const slotDuration =
          b.timeSlot === '5min' ? 5 * 60 * 1000 : 10 * 60 * 1000;
        const expiryTime = new Date(bookingTime.getTime() + slotDuration);

        return currentTime < expiryTime;
      })
    : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText
            style={[styles.headerTitle, { color: theme.textPrimary }]}
          >
            Dine In
          </ThemedText>
          <View style={styles.backBtn} />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'book' && {
                borderBottomColor: Brand.primary,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab('book')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'book' ? Brand.primary : theme.textSecondary,
                },
              ]}
            >
              Book Table
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'mybookings' && {
                borderBottomColor: Brand.primary,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => setActiveTab('mybookings')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'mybookings'
                      ? Brand.primary
                      : theme.textSecondary,
                },
              ]}
            >
              My Bookings
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Brand.primary} />
          </View>
        ) : activeTab === 'book' ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={Brand.primary}
                colors={[Brand.primary]}
              />
            }
          >
            {/* Cart Items Summary */}
            {cartItems.length > 0 && (
              <View style={styles.section}>
                <Text
                  style={[styles.sectionTitle, { color: theme.textPrimary }]}
                >
                  Your Order
                </Text>
                <View
                  style={{
                    backgroundColor: theme.surfaceSecondary,
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  {cartItems.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{ color: theme.textPrimary, flex: 1 }}>
                        {item.quantity}x {item.name}
                      </Text>
                      <Text style={{ color: theme.textSecondary }}>
                        ₹{item.price * item.quantity}
                      </Text>
                    </View>
                  ))}
                  <View
                    style={{
                      height: 1,
                      backgroundColor: theme.border,
                      marginVertical: 8,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text
                      style={{ color: theme.textPrimary, fontWeight: 'bold' }}
                    >
                      Total
                    </Text>
                    <Text style={{ color: Brand.primary, fontWeight: 'bold' }}>
                      ₹{cart?.finalPrice}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Time Slot Selection */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Select Time Slot
              </Text>
              <View style={styles.slotContainer}>
                <TouchableOpacity
                  style={[
                    styles.slotButton,
                    {
                      backgroundColor:
                        selectedSlot === '5min' ? Brand.primary : theme.surface,
                      borderColor:
                        selectedSlot === '5min' ? Brand.primary : theme.border,
                    },
                  ]}
                  onPress={() => setSelectedSlot('5min')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.slotButtonText,
                      {
                        color:
                          selectedSlot === '5min'
                            ? '#FFFFFF'
                            : theme.textPrimary,
                      },
                    ]}
                  >
                    5 Minutes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.slotButton,
                    {
                      backgroundColor:
                        selectedSlot === '10min'
                          ? Brand.primary
                          : theme.surface,
                      borderColor:
                        selectedSlot === '10min' ? Brand.primary : theme.border,
                    },
                  ]}
                  onPress={() => setSelectedSlot('10min')}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.slotButtonText,
                      {
                        color:
                          selectedSlot === '10min'
                            ? '#FFFFFF'
                            : theme.textPrimary,
                      },
                    ]}
                  >
                    10 Minutes
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Table Selection */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                Select Table
              </Text>
              <View style={styles.tablesGrid}>
                {tables.map((table) => {
                  const isBooked = bookedTableIds.includes(table.id);
                  const isSelected = selectedTable?.id === table.id;
                  return (
                    <TableCard
                      key={table.id}
                      table={table}
                      isBooked={isBooked}
                      isSelected={isSelected}
                      onSelect={() =>
                        setSelectedTable(isSelected ? null : table)
                      }
                    />
                  );
                })}
              </View>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: Brand.primaryFaded },
                  ]}
                />
                <Text
                  style={[styles.legendText, { color: theme.textSecondary }]}
                >
                  Available
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: theme.surfaceSecondary },
                  ]}
                />
                <Text
                  style={[styles.legendText, { color: theme.textSecondary }]}
                >
                  Booked
                </Text>
              </View>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={Brand.primary}
                colors={[Brand.primary]}
              />
            }
          >
            {myBookings.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View
                  style={[
                    styles.emptyIconBox,
                    { backgroundColor: Brand.primaryFaded },
                  ]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={48}
                    color={Brand.primary}
                  />
                </View>
                <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                  No Bookings Yet
                </Text>
                <Text
                  style={[styles.emptyDesc, { color: theme.textSecondary }]}
                >
                  Book a table to see your reservations here
                </Text>
              </View>
            ) : (
              myBookings.map((booking) => (
                <BookingCard
                  key={booking.bookingId}
                  booking={booking}
                  onCancel={() => handleCancelBooking(booking.bookingId)}
                />
              ))
            )}
          </ScrollView>
        )}

        {/* Book Button */}
        {activeTab === 'book' && (
          <View
            style={[
              styles.footer,
              { backgroundColor: theme.surface, borderTopColor: theme.border },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.bookButton,
                {
                  backgroundColor:
                    selectedTable && !updating
                      ? Brand.primary
                      : Brand.primaryDisabled,
                },
              ]}
              onPress={handleBookTable}
              disabled={!selectedTable || updating}
              activeOpacity={0.8}
            >
              {updating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.bookButtonText}>Book Table</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
