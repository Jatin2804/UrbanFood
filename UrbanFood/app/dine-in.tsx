import BookingCard from '@/components/bookings/BookingCard';
import RestaurantLayout from '@/components/bookings/RestaurantLayout';
import TableCard from '@/components/bookings/TableCard';
import BookingCardSkeleton from '@/components/skeletons/BookingCardSkeleton';
import TableCardSkeleton from '@/components/skeletons/TableCardSkeleton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ROUTES } from '@/src/constants/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { useBookings } from '@/src/hooks/useBookings';
import { useCart } from '@/src/hooks/useCart';
import { Table, TimeSlot } from '@/src/types';
import { dineInStyles as styles } from '@/styles/screens/dineInStyles';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DineIn() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();

  // Get deep link parameters
  const params = useLocalSearchParams<{ tab?: string }>();

  const { user } = useAuth();
  const {
    bookings,
    tables,
    loading,
    updating,
    bookTable,
    cancelTableBooking,
    getUserBookings,
    refreshBookings,
  } = useBookings();
  const { cart, handleClearCart } = useCart();
  const cartItems = cart?.dishes || [];

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot>('5min');
  const [activeTab, setActiveTab] = useState<'book' | 'mybookings'>('book');
  const [bookingSubTab, setBookingSubTab] = useState<
    'upcoming' | 'current' | 'expired'
  >('current');
  const [justBooked, setJustBooked] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'layout'>('layout');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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
        refreshBookings();
      } else {
        // Reset the flag after skipping one fetch
        setJustBooked(false);
      }
    }, [justBooked]),
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
    refreshBookings();
    setRefreshing(false);
  }, []);

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
      const result = await bookTable(
        selectedTable.id,
        selectedTable.number,
        selectedSlot,
        cartItems,
        selectedDate.toISOString(),
      );

      // The newly created booking is already added to Redux state by the thunk
      // Set flag to prevent immediate re-fetch on navigation
      setJustBooked(true);

      // Clear the cart after successful booking
      try {
        await handleClearCart();
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
              await cancelTableBooking(bookingId);
              Alert.alert('Success', 'Booking cancelled successfully');
            } catch (error: any) {
              Alert.alert('Error', error || 'Failed to cancel booking');
            }
          },
        },
      ],
    );
  };

  // Filter bookings by user
  const userBookings = user
    ? bookings.filter((b) => b.userId === user.id && b.status === 'active')
    : [];

  // Get today's date at midnight for comparison
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Categorize bookings
  const upcomingBookings = userBookings.filter((b) => {
    const bookingDate = new Date(b.bookingDate || b.bookingTime);
    return bookingDate > todayEnd;
  });

  const currentBookings = userBookings.filter((b) => {
    const bookingDate = new Date(b.bookingDate || b.bookingTime);
    const bookingTime = new Date(b.bookingTime);
    const slotDuration = b.timeSlot === '5min' ? 5 * 60 * 1000 : 10 * 60 * 1000;
    const expiryTime = new Date(bookingTime.getTime() + slotDuration);

    // Must be today and not expired
    return (
      bookingDate >= todayStart &&
      bookingDate <= todayEnd &&
      currentTime < expiryTime
    );
  });

  const expiredBookings = userBookings.filter((b) => {
    const bookingDate = new Date(b.bookingDate || b.bookingTime);
    const bookingTime = new Date(b.bookingTime);
    const slotDuration = b.timeSlot === '5min' ? 5 * 60 * 1000 : 10 * 60 * 1000;
    const expiryTime = new Date(bookingTime.getTime() + slotDuration);

    // Either past date or today but expired
    return (
      bookingDate < todayStart ||
      (bookingDate >= todayStart &&
        bookingDate <= todayEnd &&
        currentTime >= expiryTime)
    );
  });

  // Get bookings to display based on active sub-tab
  const displayBookings =
    bookingSubTab === 'upcoming'
      ? upcomingBookings
      : bookingSubTab === 'current'
        ? currentBookings
        : expiredBookings;

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
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: Spacing.md,
                  }}
                >
                  <Ionicons
                    name="receipt-outline"
                    size={24}
                    color={Brand.primary}
                  />
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        color: theme.textPrimary,
                        marginBottom: 0,
                        marginLeft: Spacing.sm,
                      },
                    ]}
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
                        marginBottom:
                          index < cartItems.length - 1 ? Spacing.sm : 0,
                        paddingBottom:
                          index < cartItems.length - 1 ? Spacing.sm : 0,
                        borderBottomWidth: index < cartItems.length - 1 ? 1 : 0,
                        borderBottomColor: theme.border,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: Brand.primaryFaded,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: Radius.sm,
                            marginRight: Spacing.sm,
                          }}
                        >
                          <Text
                            style={{
                              color: Brand.primary,
                              fontWeight: '700',
                              fontSize: 12,
                            }}
                          >
                            {item.quantity}x
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: theme.textPrimary,
                            flex: 1,
                            fontWeight: '500',
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: theme.textPrimary,
                          fontWeight: '700',
                          fontSize: 15,
                        }}
                      >
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
                      style={{
                        color: theme.textPrimary,
                        fontWeight: '700',
                        fontSize: 16,
                      }}
                    >
                      Total Amount
                    </Text>
                    <Text
                      style={{
                        color: Brand.primary,
                        fontWeight: '700',
                        fontSize: 20,
                      }}
                    >
                      ₹{cart?.finalPrice}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Date Selection */}
            <View style={styles.section}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: Spacing.md,
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={Brand.primary}
                />
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: theme.textPrimary,
                      marginBottom: 0,
                      marginLeft: Spacing.sm,
                    },
                  ]}
                >
                  Select Date
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.slotButton,
                  {
                    backgroundColor: theme.surface,
                    borderColor: Brand.primary,
                    borderWidth: 1,
                    width: '100%',
                  },
                ]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="calendar"
                  size={20}
                  color={Brand.primary}
                  style={{ marginBottom: 4 }}
                />
                <Text
                  style={[
                    styles.slotButtonText,
                    {
                      color: theme.textPrimary,
                    },
                  ]}
                >
                  {selectedDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={new Date()}
                  onChange={(event, date) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (date) {
                      setSelectedDate(date);
                    }
                  }}
                />
              )}
            </View>

            {/* Time Slot Selection */}
            <View style={styles.section}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: Spacing.md,
                }}
              >
                <Ionicons name="time-outline" size={24} color={Brand.primary} />
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: theme.textPrimary,
                      marginBottom: 0,
                      marginLeft: Spacing.sm,
                    },
                  ]}
                >
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
                    color={
                      selectedSlot === '5min' ? '#FFFFFF' : theme.textSecondary
                    }
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
                    color={
                      selectedSlot === '10min' ? '#FFFFFF' : theme.textSecondary
                    }
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: Spacing.md,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name="grid-outline"
                    size={24}
                    color={Brand.primary}
                  />
                  <Text
                    style={[
                      styles.sectionTitle,
                      {
                        color: theme.textPrimary,
                        marginBottom: 0,
                        marginLeft: Spacing.sm,
                      },
                    ]}
                  >
                    Select Table
                  </Text>
                </View>

                {/* View Toggle */}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={[
                      styles.viewToggleBtn,
                      {
                        backgroundColor:
                          viewMode === 'layout' ? Brand.primary : theme.surface,
                        borderColor:
                          viewMode === 'layout' ? Brand.primary : theme.border,
                      },
                    ]}
                    onPress={() => setViewMode('layout')}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="map-outline"
                      size={18}
                      color={
                        viewMode === 'layout' ? '#FFFFFF' : theme.textSecondary
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.viewToggleBtn,
                      {
                        backgroundColor:
                          viewMode === 'grid' ? Brand.primary : theme.surface,
                        borderColor:
                          viewMode === 'grid' ? Brand.primary : theme.border,
                      },
                    ]}
                    onPress={() => setViewMode('grid')}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="grid-outline"
                      size={18}
                      color={
                        viewMode === 'grid' ? '#FFFFFF' : theme.textSecondary
                      }
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
                  onSelectTable={(table) =>
                    setSelectedTable(
                      selectedTable?.id === table.id ? null : table,
                    )
                  }
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
                  <View
                    style={[
                      styles.legend,
                      {
                        backgroundColor: theme.surfaceSecondary,
                        marginTop: Spacing.md,
                      },
                    ]}
                  >
                    <View style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendDot,
                          { backgroundColor: Brand.primary },
                        ]}
                      />
                      <Text
                        style={[
                          styles.legendText,
                          { color: theme.textPrimary },
                        ]}
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
                        style={[
                          styles.legendText,
                          { color: theme.textPrimary },
                        ]}
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
            {/* Sub-tabs for My Bookings */}
            <View style={styles.subTabsContainer}>
              <TouchableOpacity
                style={[
                  styles.subTab,
                  bookingSubTab === 'upcoming' && {
                    backgroundColor: Brand.primaryFaded,
                    borderColor: Brand.primary,
                  },
                ]}
                onPress={() => setBookingSubTab('upcoming')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.subTabText,
                    {
                      color:
                        bookingSubTab === 'upcoming'
                          ? Brand.primary
                          : theme.textSecondary,
                    },
                  ]}
                >
                  Upcoming
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.subTab,
                  bookingSubTab === 'current' && {
                    backgroundColor: Brand.primaryFaded,
                    borderColor: Brand.primary,
                  },
                ]}
                onPress={() => setBookingSubTab('current')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.subTabText,
                    {
                      color:
                        bookingSubTab === 'current'
                          ? Brand.primary
                          : theme.textSecondary,
                    },
                  ]}
                >
                  Current
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.subTab,
                  bookingSubTab === 'expired' && {
                    backgroundColor: Brand.primaryFaded,
                    borderColor: Brand.primary,
                  },
                ]}
                onPress={() => setBookingSubTab('expired')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.subTabText,
                    {
                      color:
                        bookingSubTab === 'expired'
                          ? Brand.primary
                          : theme.textSecondary,
                    },
                  ]}
                >
                  Expired
                </Text>
              </TouchableOpacity>
            </View>

            {displayBookings.length === 0 ? (
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
                  {bookingSubTab === 'upcoming'
                    ? 'No Upcoming Bookings'
                    : bookingSubTab === 'current'
                      ? 'No Current Bookings'
                      : 'No Expired Bookings'}
                </Text>
                <Text
                  style={[styles.emptyDesc, { color: theme.textSecondary }]}
                >
                  {bookingSubTab === 'upcoming'
                    ? 'Bookings scheduled for future dates will appear here'
                    : bookingSubTab === 'current'
                      ? 'Active bookings for today will appear here'
                      : 'Past bookings will appear here'}
                </Text>
              </View>
            ) : (
              displayBookings.map((booking) => (
                <BookingCard
                  key={booking.bookingId}
                  booking={booking}
                  onCancel={() => handleCancelBooking(booking.bookingId)}
                  isExpired={bookingSubTab === 'expired'}
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
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.sm,
                  }}
                >
                  <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                  <Text style={styles.bookButtonText}>
                    {selectedTable
                      ? `Book Table ${selectedTable.number}`
                      : 'Book Table'}
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
