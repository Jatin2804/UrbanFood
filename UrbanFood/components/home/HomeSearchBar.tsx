import { ThemedText } from '@/components/themed-text';
import { Brand, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ROUTES } from '@/src/constants/navigation';
import { useTranslation } from '@/src/hooks/useTranslation';
import { homeStyles as styles } from '@/styles/screens/homeStyles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

const HomeSearchBar = () => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={() => router.replace(ROUTES.TABS.EXPLORE)}
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
        {t('home.searchPlaceholder')}
      </ThemedText>
      <View style={[styles.filterBtn, { backgroundColor: Brand.primaryFaded }]}>
        <Ionicons name="options-outline" size={16} color={Brand.primary} />
      </View>
    </TouchableOpacity>
  );
};

export default HomeSearchBar;
