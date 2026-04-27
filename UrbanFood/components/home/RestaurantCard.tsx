import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import restaurantInfo from '@/src/data/restaurantInfo';
import { StatItemProps } from '@/src/types/components';
import {
    statItemStyles,
    restaurantCardStyles as styles,
} from '@/styles/components/restaurantCardStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, useColorScheme, View } from 'react-native';

const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

const StatItem = ({ icon, value, label }: StatItemProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  return (
    <View style={statItemStyles.item}>
      <View
        style={[statItemStyles.iconBox, { backgroundColor: Brand.primaryFaded }]}
      >
        <Ionicons name={icon} size={18} color={Brand.primary} />
      </View>
      <ThemedText style={statItemStyles.value}>{value}</ThemedText>
      <ThemedText
        type="small"
        style={{ color: theme.textTertiary, textAlign: 'center' }}
      >
        {label}
      </ThemedText>
    </View>
  );
};

const RestaurantCard = () => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const r = restaurantInfo;

  return (
    <ThemedView variant="surface" style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.logoRing, { borderColor: Brand.primaryFaded }]}>
          <Image source={r.logo} style={styles.logo} resizeMode="cover" />
        </View>
        <View style={styles.nameBlock}>
          <View style={styles.nameRow}>
            <ThemedText type="subtitle" style={styles.name}>
              {r.name}
            </ThemedText>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: r.isOpen ? '#E8F8F0' : '#FFE8E8' },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: r.isOpen ? Brand.success : Brand.error },
                ]}
              />
              <ThemedText
                style={styles.statusText}
                lightColor={r.isOpen ? Brand.success : Brand.error}
                darkColor={r.isOpen ? Brand.success : Brand.error}
              >
                {r.isOpen ? 'Open' : 'Closed'}
              </ThemedText>
            </View>
          </View>
          <ThemedText type="caption" style={{ color: theme.textSecondary }}>
            {r.tagline}
          </ThemedText>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color="#FFB800" />
            <ThemedText style={styles.ratingText}>{r.rating}</ThemedText>
            <ThemedText type="small" style={{ color: theme.textTertiary }}>
              ({formatCount(r.totalRatings)} ratings)
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Tags */}
      <View style={styles.tagsRow}>
        {r.tags.map((tag) => (
          <View
            key={tag}
            style={[
              styles.tag,
              {
                backgroundColor: theme.surfaceSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary, fontWeight: '500' }}
            >
              {tag}
            </ThemedText>
          </View>
        ))}
      </View>

      {/* Stats */}
      <View
        style={[
          styles.statsContainer,
          {
            backgroundColor: theme.surfaceSecondary,
            borderColor: theme.border,
          },
        ]}
      >
        <StatItem
          icon="star-outline"
          value={`${r.rating} (${formatCount(r.totalRatings)})`}
          label="Rating"
        />
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <StatItem
          icon="people-outline"
          value={formatCount(r.totalUsers)}
          label="Customers"
        />
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <StatItem
          icon="bicycle-outline"
          value={r.deliveryTime}
          label="Delivery"
        />
      </View>

      {/* Info */}
      <View style={[styles.infoContainer, { borderColor: theme.border }]}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={15} color={Brand.primary} />
          <ThemedText
            type="caption"
            style={[styles.infoText, { color: theme.textSecondary }]}
          >
            {r.address}
          </ThemedText>
        </View>
        <View
          style={[styles.infoRowDivider, { backgroundColor: theme.border }]}
        />
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={15} color={Brand.primary} />
          <ThemedText
            type="caption"
            style={[styles.infoText, { color: theme.textSecondary }]}
          >
            {r.openTime} – {r.closeTime}
          </ThemedText>
        </View>
        <View
          style={[styles.infoRowDivider, { backgroundColor: theme.border }]}
        />
        <View style={styles.infoRow}>
          <Ionicons name="receipt-outline" size={15} color={Brand.primary} />
          <ThemedText
            type="caption"
            style={[styles.infoText, { color: theme.textSecondary }]}
          >
            Min. order ₹{r.minOrder}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
};

export default RestaurantCard;
