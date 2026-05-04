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

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isBooked
            ? theme.surfaceSecondary
            : isSelected
              ? Brand.primaryFaded
              : theme.surface,
          borderColor: isSelected ? Brand.primary : theme.border,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={onSelect}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={isBooked ? 'lock-closed' : 'restaurant'}
          size={24}
          color={isBooked ? theme.textTertiary : Brand.primary}
        />
      </View>

      <Text
        style={[
          styles.tableNumber,
          { color: isBooked ? theme.textTertiary : theme.textPrimary },
        ]}
      >
        Table {table.number}
      </Text>

      <View style={styles.capacityRow}>
        <Ionicons
          name="people"
          size={14}
          color={isBooked ? theme.textTertiary : theme.textSecondary}
        />
        <Text
          style={[
            styles.capacityText,
            { color: isBooked ? theme.textTertiary : theme.textSecondary },
          ]}
        >
          {table.capacity} seats
        </Text>
      </View>

      {isBooked && (
        <View style={[styles.bookedBadge, { backgroundColor: theme.border }]}>
          <Text style={[styles.bookedText, { color: theme.textTertiary }]}>
            Booked
          </Text>
        </View>
      )}

      {isSelected && !isBooked && (
        <View
          style={[styles.selectedBadge, { backgroundColor: Brand.primary }]}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
}
