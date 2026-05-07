import { Brand, Colors } from '@/constants/theme';
import { tableCardStyles as styles } from '@/styles/components/tableCardStyles';
import { TableCardProps } from '@/types/components';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function TableCard({
  table,
  isBooked,
  isSelected,
  onSelect,
}: TableCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const disabled = isBooked;

  // Render seats around the table based on capacity
  const renderSeats = () => {
    const seats = [];
    const capacity = table.capacity;

    // Determine seat positions based on capacity
    if (capacity === 2) {
      // 2 seats: left and right
      seats.push(
        <View key="left" style={[styles.seat, styles.seatLeft]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
        <View key="right" style={[styles.seat, styles.seatRight]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
      );
    } else if (capacity === 4) {
      // 4 seats: top, right, bottom, left
      seats.push(
        <View key="top" style={[styles.seat, styles.seatTop]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
        <View key="right" style={[styles.seat, styles.seatRight]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
        <View key="bottom" style={[styles.seat, styles.seatBottom]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
        <View key="left" style={[styles.seat, styles.seatLeft]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
      );
    } else if (capacity === 6) {
      // 6 seats: 2 on top, 2 on bottom, 1 on left, 1 on right
      seats.push(
        <View key="top-left" style={[styles.seat, styles.seatTopLeft]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
        <View key="top-right" style={[styles.seat, styles.seatTopRight]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
        <View key="right" style={[styles.seat, styles.seatRight]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
        <View key="bottom-right" style={[styles.seat, styles.seatBottomRight]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
        <View key="bottom-left" style={[styles.seat, styles.seatBottomLeft]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
        <View key="left" style={[styles.seat, styles.seatLeft]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
      );
    } else {
      // Default: 4 seats for any other capacity
      seats.push(
        <View key="top" style={[styles.seat, styles.seatTop]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
        <View key="right" style={[styles.seat, styles.seatRight]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
        <View key="bottom" style={[styles.seat, styles.seatBottom]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
        <View key="left" style={[styles.seat, styles.seatLeft]}>
          <View
            style={[
              styles.seatInner,
              isBooked && styles.seatBooked,
              isSelected && styles.seatSelected,
            ]}
          />
        </View>,
      );
    }

    return seats;
  };

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.tableWrapper}>
        {/* Seats around the table */}
        {renderSeats()}

        {/* Table surface */}
        <View
          style={[
            styles.tableSurface,
            isBooked && styles.tableSurfaceBooked,
            isSelected && styles.tableSurfaceSelected,
          ]}
        >
          {/* Table number */}
          <Text
            style={[
              styles.tableNumber,
              {
                color: isSelected
                  ? '#FFFFFF'
                  : isBooked
                    ? theme.textTertiary
                    : theme.textPrimary,
              },
            ]}
          >
            {table.number}
          </Text>

          {/* Icon */}
          <Ionicons
            name={isBooked ? 'lock-closed' : 'checkmark-circle'}
            size={16}
            color={
              isSelected
                ? '#FFFFFF'
                : isBooked
                  ? theme.textTertiary
                  : Brand.primary
            }
            style={{ opacity: isBooked || isSelected ? 1 : 0 }}
          />
        </View>
      </View>

      {/* Status label below */}
      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.labelText,
            {
              color: isSelected
                ? Brand.primary
                : isBooked
                  ? theme.textTertiary
                  : theme.textSecondary,
              fontWeight: isSelected ? '700' : '500',
            },
          ]}
        >
          {isBooked
            ? 'Booked'
            : isSelected
              ? 'Selected'
              : `${table.capacity} Seats`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
