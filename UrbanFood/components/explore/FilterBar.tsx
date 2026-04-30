import { ThemedText } from '@/components/themed-text';
import { Brand, Colors } from '@/constants/theme';
import { VegFilter } from '@/src/constants/explore';
import { exploreStyles as styles } from '@/styles/screens/exploreStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';

interface FilterBarProps {
  activeFiltersCount: number;
  vegFilter: VegFilter;
  onVegFilterChange: (v: VegFilter) => void;
  onOpenSheet: () => void;
}

const VEG_OPTIONS: { key: VegFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'veg', label: 'Veg' },
  { key: 'nonveg', label: 'Non-Veg' },
];

const FilterBar = ({
  activeFiltersCount,
  vegFilter,
  onVegFilterChange,
  onOpenSheet,
}: FilterBarProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <View style={styles.filterRow}>
      {/* Sort button */}
      <TouchableOpacity
        style={[
          styles.filterBtn,
          {
            backgroundColor:
              activeFiltersCount > 0 ? Brand.primary : theme.surface,
            borderColor: activeFiltersCount > 0 ? Brand.primary : theme.border,
            borderWidth: 1,
          },
        ]}
        onPress={onOpenSheet}
        activeOpacity={0.8}
      >
        <Ionicons
          name="options-outline"
          size={16}
          color={activeFiltersCount > 0 ? '#fff' : theme.textSecondary}
        />
        <ThemedText
          style={[
            styles.filterBtnText,
            { color: activeFiltersCount > 0 ? '#fff' : theme.textSecondary },
          ]}
        >
          Filter
        </ThemedText>
        {activeFiltersCount > 0 && (
          <View style={styles.filterBadge}>
            <ThemedText style={styles.filterBadgeText}>
              {activeFiltersCount}
            </ThemedText>
          </View>
        )}
      </TouchableOpacity>

      {/* Veg toggles */}
      <View style={styles.vegToggleGroup}>
        {VEG_OPTIONS.map(({ key, label }) => {
          const isActive = vegFilter === key;
          const color =
            key === 'veg'
              ? Brand.success
              : key === 'nonveg'
                ? Brand.error
                : Brand.primary;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.vegBtn,
                {
                  backgroundColor: isActive ? color : theme.surface,
                  borderColor: isActive ? color : theme.border,
                  borderWidth: 1,
                },
              ]}
              onPress={() => onVegFilterChange(key)}
              activeOpacity={0.8}
            >
              {key !== 'all' && (
                <View
                  style={[
                    styles.vegDotSmall,
                    { backgroundColor: isActive ? '#fff' : color },
                  ]}
                />
              )}
              <ThemedText
                style={[
                  styles.vegBtnText,
                  { color: isActive ? '#fff' : theme.textPrimary },
                ]}
              >
                {label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default FilterBar;
