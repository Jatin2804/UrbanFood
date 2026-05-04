import { Brand, Colors } from '@/constants/theme';
import { bookingCardStyles as styles } from '@/styles/components/bookingCardStyles';
import { BookingCardProps } from '@/types/components';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function BookingCard({
  booking,
  onCancel,
}: BookingCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const bookingDate = new Date(booking.bookingTime);
  const formattedDate = bookingDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = bookingDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isActive = booking.status === 'active';
  const isCancelled = booking.status === 'cancelled';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: isCancelled ? 0.6 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.tableInfo}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: isCancelled
                  ? theme.surfaceSecondary
                  : Brand.primaryFaded,
              },
            ]}
          >
            <Ionicons
              name="restaurant"
              size={20}
              color={isCancelled ? theme.textTertiary : Brand.primary}
            />
          </View>
          <View>
            <Text style={[styles.tableNumber, { color: theme.textPrimary }]}>
              Table {booking.tableNumber}
            </Text>
            <Text style={[styles.slotText, { color: theme.textSecondary }]}>
              {booking.timeSlot === '5min' ? '5 minutes' : '10 minutes'}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: isCancelled
                ? theme.surfaceSecondary
                : isActive
                  ? Brand.primaryFaded
                  : theme.surfaceSecondary,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: isCancelled
                  ? theme.textTertiary
                  : isActive
                    ? Brand.primary
                    : theme.textSecondary,
              },
            ]}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={16} color={theme.textSecondary} />
          <Text style={[styles.detailText, { color: theme.textSecondary }]}>
            {formattedDate}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color={theme.textSecondary} />
          <Text style={[styles.detailText, { color: theme.textSecondary }]}>
            {formattedTime}
          </Text>
        </View>
      </View>

      {booking.dishes && booking.dishes.length > 0 && (
        <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.border }}>
          <Text style={{ color: theme.textPrimary, fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
            Order Items
          </Text>
          {booking.dishes.map((dish, idx) => (
            <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 13, flex: 1 }}>
                {dish.quantity}x {dish.name}
              </Text>
              <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                ₹{dish.price * dish.quantity}
              </Text>
            </View>
          ))}
        </View>
      )}

      {isActive && (
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: Brand.error }]}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Text style={[styles.cancelText, { color: Brand.error }]}>
            Cancel Booking
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
