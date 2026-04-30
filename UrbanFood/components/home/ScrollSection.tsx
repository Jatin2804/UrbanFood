import { ThemedText } from '@/components/themed-text';
import { Brand, Colors } from '@/constants/theme';
import { Dish } from '@/src/features/dishes/dishesType';
import { scrollSectionStyles as styles } from '@/styles/components/scrollSectionStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, TouchableOpacity, useColorScheme, View } from 'react-native';
import HorizontalDishCard from './HorizontalDishCard';

interface ScrollSectionProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  dishes: Dish[];
  showNewBadge?: boolean;
}

const ScrollSection = ({
  title,
  subtitle,
  icon,
  iconColor,
  iconBg,
  dishes,
  showNewBadge = false,
}: ScrollSectionProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();

  if (dishes.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
            <Ionicons name={icon} size={16} color={iconColor} />
          </View>
          <View>
            <ThemedText style={{ fontSize: 16, fontWeight: '700' }}>
              {title}
            </ThemedText>
            {subtitle && (
              <ThemedText
                type="small"
                style={{ color: theme.textTertiary, marginTop: 1 }}
              >
                {subtitle}
              </ThemedText>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)/explore')}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.seeAll, { color: Brand.primary }]}>
            See all
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Horizontal list */}
      <FlatList
        data={dishes}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <HorizontalDishCard dish={item} showNewBadge={showNewBadge} />
        )}
      />
    </View>
  );
};

export default ScrollSection;
