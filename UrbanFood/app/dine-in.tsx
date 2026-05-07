import BookingCard from '@/components/bookings/BookingCard';
import BookingCardSkeleton from '@/components/bookings/BookingCardSkeleton';
import RestaurantLayout from '@/components/bookings/RestaurantLayout';
import TableCard from '@/components/bookings/TableCard';
import TableCardSkeleton from '@/components/bookings/TableCardSkeleton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors, Radius, Spacing } from '@/constants/theme';
import { RootState } from '@/src/store/rootReducer';
import { Table, TimeSlot } from '@/src/types';
import { dineInStyles as styles } from '@/styles/screens/dineInStyles';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
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
import { ROUTES } from '@/src/constants/navigation';

export default function DineIn() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get deep link parameters
  const params = useLocalSearchParams<{ tab?: string }>();

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
  const [viewMode, setViewMode] = useState<'grid' | 'layout'>('layout');
  
  // Handle deep link tab parameter
  useEffect(() => {
    if (params.tab === 'mybookings' || params.tab === 'book') {
      setActiveTab(params.tab);
    }
  }, [params.tab]);

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
        pathname: ROUTES.BOOKING_SUCCESS,
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
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {activeTab === 'book' ? (
              <>
                <View style={styles.section}>
                  <Text
                    style={[styles.sectionTitle, { color: theme.textPrimary }]}
                  >
                    Select Table
                  </Text>
                  <View style={styles.tablesGrid}>
                    {Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <TableCardSkeleton key={`skeleton-${index}`} />
                      ))}
                  </View>
                </View>
              </>
            ) : (
              <>
                {Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <BookingCardSkeleton key={`skeleton-${index}`} />
                  ))}
              </>
            )}
          </ScrollView>
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
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md }}>
                  <Ionicons name="receipt-outline" size={24} color={Brand.primary} />
                  <Text
                    style={[styles.sectionTitle, { color: theme.textPrimary, marginBottom: 0, marginLeft: Spacing.sm }]}
                  >
                    Your Order
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: theme.surface,
                    borderRadius: Radius.lg,
                    padding: Spacing.lg,
                    borderWidth: 1,
                    borderColor: theme.border,
                  }}
                >
                  {cartItems.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: index < cartItems.length - 1 ? Spacing.sm : 0,
                        paddingBottom: index < cartItems.length - 1 ? Spacing.sm : 0,
                        borderBottomWidth: index < cartItems.length - 1 ? 1 : 0,
                        borderBottomColor: theme.border,
                      }}
                    >
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <View
                          style={{
                            backgroundColor: Brand.primaryFaded,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: Radius.sm,
                            marginRight: Spacing.sm,
                          }}
                        >
                          <Text style={{ color: Brand.primary, fontWeight: '700', fontSize: 12 }}>
                            {item.quantity}x
                          </Text>
                        </View>
                        <Text style={{ color: theme.textPrimary, flex: 1, fontWeight: '500' }}>
                          {item.name}
                        </Text>
                      </View>
                      <Text style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 15 }}>
                        ₹{item.price * item.quantity}
                      </Text>
                    </View>
                  ))}
                  <View
                    style={{
                      height: 2,
                      backgroundColor: theme.border,
                      marginVertical: Spacing.md,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{ color: theme.textPrimary, fontWeight: '700', fontSize: 16 }}
                    >
                      Total Amount
                    </Text>
                    <Text style={{ color: Brand.primary, fontWeight: '700', fontSize: 20 }}>
                      ₹{cart?.finalPrice}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Time Slot Selection */}
            <View style={styles.section}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md }}>
                <Ionicons name="time-outline" size={24} color={Brand.primary} />
                <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginBottom: 0, marginLeft: Spacing.sm }]}>
                  Select Time Slot
                </Text>
              </View>
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
                  <Ionicons
                    name="timer-outline"
                    size={20}
                    color={selectedSlot === '5min' ? '#FFFFFF' : theme.textSecondary}
                    style={{ marginBottom: 4 }}
                  />
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
                  <Ionicons
                    name="timer-outline"
                    size={20}
                    color={selectedSlot === '10min' ? '#FFFFFF' : theme.textSecondary}
                    style={{ marginBottom: 4 }}
                  />
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
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="grid-outline" size={24} color={Brand.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginBottom: 0, marginLeft: Spacing.sm }]}>
                    Select Table
                  </Text>
                </View>
                
                {/* View Toggle */}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={[
                      styles.viewToggleBtn,
                      {
                        backgroundColor: viewMode === 'layout' ? Brand.primary : theme.surface,
                        borderColor: viewMode === 'layout' ? Brand.primary : theme.border,
                      },
                    ]}
                    onPress={() => setViewMode('layout')}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="map-outline"
                      size={18}
                      color={viewMode === 'layout' ? '#FFFFFF' : theme.textSecondary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.viewToggleBtn,
                      {
                        backgroundColor: viewMode === 'grid' ? Brand.primary : theme.surface,
                        borderColor: viewMode === 'grid' ? Brand.primary : theme.border,
                      },
                    ]}
                    onPress={() => setViewMode('grid')}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="grid-outline"
                      size={18}
                      color={viewMode === 'grid' ? '#FFFFFF' : theme.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Restaurant Layout View */}
              {viewMode === 'layout' ? (
                <RestaurantLayout
                  tables={tables}
                  bookedTableIds={bookedTableIds}
                  selectedTable={selectedTable}
                  onSelectTable={(table) => setSelectedTable(selectedTable?.id === table.id ? null : table)}
                />
              ) : (
                /* Grid View */
                <>
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

                  {/* Legend for grid view */}
                  <View style={[styles.legend, { backgroundColor: theme.surfaceSecondary, marginTop: Spacing.md }]}>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendDot,
                          { backgroundColor: Brand.primary },
                        ]}
                      />
                      <Text
                        style={[styles.legendText, { color: theme.textPrimary }]}
                      >
                        Available
                      </Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendDot,
                          { backgroundColor: '#FF6B6B' },
                        ]}
                      />
                      <Text
                        style={[styles.legendText, { color: theme.textPrimary }]}
                      >
                        Booked
                      </Text>
                    </View>
                  </View>
                </>
              )}
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
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                  <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                  <Text style={styles.bookButtonText}>
                    {selectedTable ? `Book Table ${selectedTable.number}` : 'Book Table'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
