import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { bookTableStyles as styles } from '@/styles/screens/bookTableStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookTable() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();

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
            Book a Table
          </ThemedText>
          <View style={styles.backBtn} />
        </View>

        {/* Empty state */}
        <View style={styles.emptyContainer}>
          <View
            style={[styles.iconBox, { backgroundColor: Brand.primaryFaded }]}
          >
            <Ionicons
              name="restaurant-outline"
              size={48}
              color={Brand.primary}
            />
          </View>
          <ThemedText style={[styles.emptyTitle, { color: theme.textPrimary }]}>
            Coming Soon
          </ThemedText>
          <ThemedText
            style={[styles.emptyDesc, { color: theme.textSecondary }]}
          >
            Table booking will be available soon. Stay tuned!
          </ThemedText>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
