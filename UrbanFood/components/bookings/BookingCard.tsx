import { Brand, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { bookingCardStyles as styles } from '@/styles/components/bookingCardStyles';
import { BookingCardProps } from '@/types/components';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function BookingCard({
  booking,
  onCancel,
  isExpired = false,
}: BookingCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const bookingDate = new Date(booking.bookingDate || booking.bookingTime);
  const bookingTime = new Date(booking.bookingTime);
  const formattedDate = bookingDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = bookingTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isCancelled = booking.status === 'cancelled';
  const showActions = !isExpired && !isCancelled && booking.status === 'active';

  // Calculate total price if dishes exist
  const totalPrice = booking.dishes?.reduce(
    (sum: number, dish: any) => sum + dish.price * dish.quantity,
    0,
  );

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: isExpired || isCancelled ? theme.border : Brand.primary,
          borderWidth: isExpired || isCancelled ? 1 : 1.5,
        },
      ]}
    >
      {/* Header with Table Info */}
      <View style={styles.header}>
        <View style={styles.tableInfo}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor:
                  isExpired || isCancelled
                    ? theme.surfaceSecondary
                    : Brand.primaryFaded,
              },
            ]}
          >
            <Ionicons
              name="restaurant"
              size={24}
              color={
                isExpired || isCancelled ? theme.textTertiary : Brand.primary
              }
            />
          </View>
          <View style={styles.tableInfoText}>
            <Text style={[styles.tableNumber, { color: theme.textPrimary }]}>
              Table {booking.tableNumber}
            </Text>
            <View style={styles.slotBadge}>
              <Ionicons
                name="time-outline"
                size={12}
                color={theme.textSecondary}
              />
              <Text style={[styles.slotText, { color: theme.textSecondary }]}>
                {booking.timeSlot === '5min' ? '5 min' : '10 min'}
              </Text>
            </View>
          </View>
        </View>

        {/* Status Badge - Only show for non-expired bookings */}
        {!isExpired && (
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isCancelled
                  ? '#FEE2E2'
                  : Brand.primaryFaded,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: isCancelled ? '#DC2626' : Brand.primary,
                },
              ]}
            >
              {isCancelled ? 'Cancelled' : 'Active'}
            </Text>
          </View>
        )}
      </View>

      {/* Date and Time Info */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={Brand.primary}
            />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Date
              </Text>
              <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
                {formattedDate}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={18} color={Brand.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Time
              </Text>
              <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
                {formattedTime}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Order Items */}
      {booking.dishes && booking.dishes.length > 0 && (
        <View
          style={[
            styles.orderSection,
            { borderTopColor: theme.border, backgroundColor: theme.background },
          ]}
        >
          <View style={styles.orderHeader}>
            <Ionicons name="receipt-outline" size={16} color={Brand.primary} />
            <Text style={[styles.orderTitle, { color: theme.textPrimary }]}>
              Order Items
            </Text>
          </View>
          <View style={styles.orderItems}>
            {booking.dishes.map((dish: any, idx: number) => (
              <View key={idx} style={styles.orderItem}>
                <View style={styles.orderItemLeft}>
                  <View
                    style={[
                      styles.quantityBadge,
                      { backgroundColor: Brand.primaryFaded },
                    ]}
                  >
                    <Text style={[styles.quantityText, { color: Brand.primary }]}>
                      {dish.quantity}×
                    </Text>
                  </View>
                  <Text
                    style={[styles.dishName, { color: theme.textPrimary }]}
                    numberOfLines={1}
                  >
                    {dish.name}
                  </Text>
                </View>
                <Text style={[styles.dishPrice, { color: theme.textPrimary }]}>
                  ₹{dish.price * dish.quantity}
                </Text>
              </View>
            ))}
          </View>
          {totalPrice && (
            <View
              style={[
                styles.totalRow,
                { borderTopColor: theme.border, backgroundColor: theme.surface },
              ]}
            >
              <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>
                Total Amount
              </Text>
              <Text style={[styles.totalValue, { color: Brand.primary }]}>
                ₹{totalPrice}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Cancel Button - Only show for active, non-expired bookings */}
      {showActions && (
        <TouchableOpacity
          style={[
            styles.cancelButton,
            { borderColor: Brand.error, backgroundColor: '#FEE2E2' },
          ]}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Ionicons name="close-circle-outline" size={18} color={Brand.error} />
          <Text style={[styles.cancelText, { color: Brand.error }]}>
            Cancel Booking
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
