import { Brand, Colors } from '@/constants/theme';
import { Table } from '@/src/types';
import { restaurantLayoutStyles as styles } from '@/styles/components/restaurantLayoutStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

interface RestaurantLayoutProps {
  tables: Table[];
  bookedTableIds: string[];
  selectedTable: Table | null;
  onSelectTable: (table: Table) => void;
}

export default function RestaurantLayout({
  tables,
  bookedTableIds,
  selectedTable,
  onSelectTable,
}: RestaurantLayoutProps) {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const isTableBooked = (tableId: string) => bookedTableIds.includes(tableId);
  const isTableSelected = (tableId: string) => selectedTable?.id === tableId;

  // Render a single table with seats
  const renderTable = (table: Table, style: any = {}) => {
    const isBooked = isTableBooked(table.id);
    const isSelected = isTableSelected(table.id);

    return (
      <TouchableOpacity
        key={table.id}
        style={[styles.tableContainer, style]}
        onPress={() => !isBooked && onSelectTable(table)}
        disabled={isBooked}
        activeOpacity={0.7}
      >
        {/* Table surface */}
        <View
          style={[
            styles.tableSurface,
            isBooked && styles.tableSurfaceBooked,
            isSelected && styles.tableSurfaceSelected,
          ]}
        >
          <Text
            style={[
              styles.tableNumber,
              {
                color: isSelected ? '#FFFFFF' : isBooked ? '#999' : theme.textPrimary,
              },
            ]}
          >
            {table.number}
          </Text>
        </View>

        {/* Seats around table */}
        {renderSeats(table.capacity, isBooked, isSelected)}
      </TouchableOpacity>
    );
  };

  // Render seats based on capacity
  const renderSeats = (capacity: number, isBooked: boolean, isSelected: boolean) => {
    const seatStyle = [
      styles.seat,
      isBooked && styles.seatBooked,
      isSelected && styles.seatSelected,
    ];

    if (capacity === 2) {
      return (
        <>
          <View style={[seatStyle, styles.seatLeft]} />
          <View style={[seatStyle, styles.seatRight]} />
        </>
      );
    } else if (capacity === 4) {
      return (
        <>
          <View style={[seatStyle, styles.seatTop]} />
          <View style={[seatStyle, styles.seatRight]} />
          <View style={[seatStyle, styles.seatBottom]} />
          <View style={[seatStyle, styles.seatLeft]} />
        </>
      );
    } else if (capacity === 6) {
      return (
        <>
          <View style={[seatStyle, styles.seatTopLeft]} />
          <View style={[seatStyle, styles.seatTopRight]} />
          <View style={[seatStyle, styles.seatRight]} />
          <View style={[seatStyle, styles.seatBottomRight]} />
          <View style={[seatStyle, styles.seatBottomLeft]} />
          <View style={[seatStyle, styles.seatLeft]} />
        </>
      );
    }
    return null;
  };

  // Split tables into ground floor and balcony
  const groundFloorTables = tables.slice(0, 15); // Tables 1-15
  const balconyTables = tables.slice(15, 20); // Tables 16-20

  return (
    <ScrollView 
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header - Entrance */}
        <View style={[styles.headerArea, { borderBottomColor: theme.border }]}>
          <View style={styles.entranceLabel}>
            <Ionicons name="enter-outline" size={22} color={Brand.primary} />
            <Text style={[styles.areaText, { color: theme.textPrimary, fontWeight: '700', fontSize: 13 }]}>
              Main Entrance
            </Text>
          </View>
        </View>

        {/* Ground Floor */}
        <View style={styles.mainArea}>
          {/* Left Section - Kitchen & Staff */}
          <View style={styles.leftSection}>
            <View style={[styles.kitchenArea, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
              <Ionicons name="restaurant" size={26} color={Brand.primary} />
              <Text style={[styles.areaText, { color: theme.textPrimary, fontWeight: '700' }]}>Kitchen</Text>
            </View>
            <View style={[styles.staffArea, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
              <Ionicons name="people" size={22} color={Brand.primary} />
              <Text style={[styles.areaText, { color: theme.textPrimary, fontWeight: '600' }]}>Staff</Text>
            </View>
          </View>

          {/* Center - Ground Floor Dining Area */}
          <View style={styles.diningArea}>
            {/* Row 1 - Top tables (4 tables) */}
            <View style={styles.tableRow}>
              {groundFloorTables.slice(0, 4).map((table) => 
                renderTable(table, { marginHorizontal: 6 })
              )}
            </View>

            {/* Row 2 - Second row (4 tables) */}
            <View style={styles.tableRow}>
              {groundFloorTables.slice(4, 8).map((table) => 
                renderTable(table, { marginHorizontal: 6 })
              )}
            </View>

            {/* Stage/DJ Area */}
            <View style={[styles.stageArea, { backgroundColor: theme.surfaceSecondary, borderColor: Brand.primary }]}>
              <Ionicons name="musical-notes" size={28} color={Brand.primary} />
              <Text style={[styles.stageText, { color: theme.textPrimary }]}>Stage / DJ Area</Text>
            </View>

            {/* Row 3 - Third row (4 tables) */}
            <View style={styles.tableRow}>
              {groundFloorTables.slice(8, 12).map((table) => 
                renderTable(table, { marginHorizontal: 6 })
              )}
            </View>

            {/* Row 4 - Bottom row (3 tables) */}
            <View style={styles.tableRow}>
              {groundFloorTables.slice(12, 15).map((table) => 
                renderTable(table, { marginHorizontal: 6 })
              )}
            </View>
          </View>

          {/* Right Section - Restrooms */}
          <View style={styles.rightSection}>
            <View style={[styles.restroomArea, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
              <Ionicons name="man" size={22} color={Brand.primary} />
              <Text style={[styles.areaText, { color: theme.textPrimary, fontWeight: '600' }]}>Men</Text>
            </View>
            <View style={[styles.restroomArea, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
              <Ionicons name="woman" size={22} color={Brand.primary} />
              <Text style={[styles.areaText, { color: theme.textPrimary, fontWeight: '600' }]}>Women</Text>
            </View>
          </View>
        </View>

        {/* Balcony Section */}
        <View style={[styles.balconySection, { borderTopColor: theme.border, backgroundColor: theme.surfaceSecondary }]}>
          <View style={styles.balconyHeader}>
            <Ionicons name="home-outline" size={24} color={Brand.primary} />
            <Text style={[styles.balconyTitle, { color: theme.textPrimary }]}>Balcony Area</Text>
            <Ionicons name="partly-sunny-outline" size={20} color={Brand.primary} />
          </View>
          
          <View style={styles.balconyTables}>
            {balconyTables.map((table) => 
              renderTable(table, { marginHorizontal: 10 })
            )}
          </View>
        </View>

        {/* Legend */}
        <View style={[styles.legend, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFFFFF', borderColor: Brand.primary, borderWidth: 2 }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Brand.primary }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#BDBDBD' }]} />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>Booked</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
