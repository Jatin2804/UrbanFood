import { ThemedText } from '@/components/themed-text';
import { Brand, Colors, Spacing } from '@/constants/theme';
import { homeStyles as styles } from '@/styles/screens/homeStyles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';

const HomeSearchBar = () => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <TouchableOpacity
      onPress={() => router.replace('/(tabs)/explore')}
      style={[
        styles.searchBar,
        { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
      ]}
      activeOpacity={0.8}
    >
      <Ionicons name="search-outline" size={20} color={theme.textTertiary} />
      <ThemedText
        type="caption"
        style={{ color: theme.placeholder, flex: 1, marginLeft: Spacing.sm }}
      >
        Search dishes, cuisines...
      </ThemedText>
      <View style={[styles.filterBtn, { backgroundColor: Brand.primaryFaded }]}>
        <Ionicons name="options-outline" size={16} color={Brand.primary} />
      </View>
    </TouchableOpacity>
  );
};

export default HomeSearchBar;
