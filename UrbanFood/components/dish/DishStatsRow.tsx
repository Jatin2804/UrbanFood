import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { dishDetailStyles as styles } from '@/styles/screens/dishDetailStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useColorScheme, View } from 'react-native';

interface DishStatsRowProps {
  rating: number;
  reviewCount: number;
  addedDate: string;
}

const DishStatsRow = ({
  rating,
  reviewCount,
  addedDate,
}: DishStatsRowProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <View style={styles.statsRow}>
      <View
        style={[
          styles.statChip,
          { backgroundColor: '#FFF8E7', borderColor: '#FFE082' },
        ]}
      >
        <Ionicons name="star" size={14} color="#FFB800" />
        <ThemedText
          style={styles.statChipText}
          lightColor="#E65100"
          darkColor="#E65100"
        >
          {rating}
        </ThemedText>
      </View>

      <View
        style={[
          styles.statChip,
          {
            backgroundColor: theme.surfaceSecondary,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons
          name="chatbubble-outline"
          size={14}
          color={theme.textSecondary}
        />
        <ThemedText
          style={[styles.statChipText, { color: theme.textSecondary }]}
        >
          {reviewCount} reviews
        </ThemedText>
      </View>

      <View
        style={[
          styles.statChip,
          {
            backgroundColor: theme.surfaceSecondary,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons
          name="calendar-outline"
          size={14}
          color={theme.textSecondary}
        />
        <ThemedText
          style={[styles.statChipText, { color: theme.textSecondary }]}
        >
          {addedDate}
        </ThemedText>
      </View>
    </View>
  );
};

export default DishStatsRow;
