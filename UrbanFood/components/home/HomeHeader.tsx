import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import restaurantInfo from '@/src/data/restaurantInfo';
import { homeStyles as styles } from '@/styles/screens/homeStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';

const HomeHeader = () => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <ThemedView variant="surface" style={styles.header}>
      <View style={styles.headerLeft}>
        <ThemedText
          type="small"
          style={{ color: theme.textTertiary, marginBottom: 2 }}
        >
          DELIVERY TO
        </ThemedText>
        <TouchableOpacity style={styles.locationRow} activeOpacity={0.7}>
          <Ionicons name="location" size={16} color={Brand.primary} />
          <ThemedText style={styles.locationText}>
            {restaurantInfo.location}
          </ThemedText>
          <Ionicons name="chevron-down" size={14} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.notifBtn, { backgroundColor: theme.surfaceSecondary }]}
        activeOpacity={0.7}
      >
        <Ionicons
          name="notifications-outline"
          size={22}
          color={theme.textPrimary}
        />
        <View style={styles.notifDot} />
      </TouchableOpacity>
    </ThemedView>
  );
};

export default HomeHeader;
