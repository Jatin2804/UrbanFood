import BannerCarousel from "@/components/home/BannerCarousel";
import RestaurantCard from "@/components/home/RestaurantCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Brand, Colors, Radius, Shadows, Spacing } from "@/constants/theme";
import restaurantInfo from "@/src/data/restaurantInfo";
import { selectCurrentUser } from "@/src/features/auth/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSelector } from "react-redux";

const Home = () => {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];
  const user = useSelector(selectCurrentUser);
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <ThemedView style={styles.container}>
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
            <Ionicons
              name="chevron-down"
              size={14}
              color={theme.textSecondary}
            />
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BannerCarousel />

        <View style={styles.greeting}>
          <ThemedText type="title">Hey, {firstName}</ThemedText>
          <ThemedText
            type="caption"
            style={{ color: theme.textSecondary, marginTop: 4 }}
          >
            What are you craving today?
          </ThemedText>
        </View>

        <RestaurantCard />

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/explore")}
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.surfaceSecondary,
              borderColor: theme.border,
            },
          ]}
          activeOpacity={0.8}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={theme.textTertiary}
          />
          <ThemedText
            type="caption"
            style={{
              color: theme.placeholder,
              flex: 1,
              marginLeft: Spacing.sm,
            }}
          >
            Search dishes, cuisines...
          </ThemedText>
          <View
            style={[styles.filterBtn, { backgroundColor: Brand.primaryFaded }]}
          >
            <Ionicons name="options-outline" size={16} color={Brand.primary} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingTop: 52,
    paddingBottom: Spacing.md,
    ...Shadows.sm,
  },
  headerLeft: {
    flex: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 15,
    fontWeight: "700",
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.md,
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Brand.error,
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  scrollContent: {
    paddingBottom: Spacing.xxl,
  },

  greeting: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  filterBtn: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },

  sectionHeader: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
});
