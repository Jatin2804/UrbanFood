import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Brand, Colors, Radius, Shadows, Spacing } from "@/constants/theme";
import restaurantInfo from "@/src/data/restaurantInfo";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, useColorScheme, View } from "react-native";

const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

interface StatItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}

const StatItem = ({ icon, value, label }: StatItemProps) => {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];
  return (
    <View style={statStyles.item}>
      <View
        style={[statStyles.iconBox, { backgroundColor: Brand.primaryFaded }]}
      >
        <Ionicons name={icon} size={18} color={Brand.primary} />
      </View>
      <ThemedText style={statStyles.value}>{value}</ThemedText>
      <ThemedText
        type="small"
        style={{ color: theme.textTertiary, textAlign: "center" }}
      >
        {label}
      </ThemedText>
    </View>
  );
};

const statStyles = StyleSheet.create({
  item: { flex: 1, alignItems: "center", gap: 4 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  value: { fontSize: 15, fontWeight: "700" },
});

const RestaurantCard = () => {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];
  const r = restaurantInfo;

  return (
    <ThemedView variant="surface" style={styles.card}>
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
                { backgroundColor: r.isOpen ? "#E8F8F0" : "#FFE8E8" },
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
                {r.isOpen ? "Open" : "Closed"}
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
              style={{ color: theme.textSecondary, fontWeight: "500" }}
            >
              {tag}
            </ThemedText>
          </View>
        ))}
      </View>

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

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    overflow: "hidden",
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    padding: Spacing.sm,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  logoRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    overflow: "hidden",
    ...Shadows.sm,
  },
  logo: { width: "100%", height: "100%" },
  nameBlock: { flex: 1 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: 2,
    flexWrap: "wrap",
  },
  name: { marginBottom: 0 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E65100",
  },

  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: Spacing.md,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },

  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
  },
  statDivider: { width: 1, height: 44 },

  infoContainer: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 11,
  },
  infoRowDivider: {
    height: 1,
    marginHorizontal: Spacing.md,
  },
  infoText: { flex: 1, lineHeight: 18 },
});
