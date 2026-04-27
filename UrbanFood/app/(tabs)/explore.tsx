import AddToCartButton from "@/components/cart/AddToCartButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
    Brand,
    Colors,
    Radius,
    Shadows,
    Spacing,
    Typography,
} from "@/constants/theme";
import { Dish } from "@/src/features/dishes/dishesType";
import { RootState } from "@/src/store/rootReducer";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Image,
    Modal,
    PanResponder,
    Pressable,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { useSelector } from "react-redux";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = 400;

type SortOption = "none" | "low_high" | "high_low" | "top_rated";
type VegFilter = "all" | "veg" | "nonveg";

const SORT_OPTIONS: {
  key: SortOption;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "none", label: "Default", icon: "apps-outline" },
  { key: "low_high", label: "Price: Low to High", icon: "arrow-up-outline" },
  { key: "high_low", label: "Price: High to Low", icon: "arrow-down-outline" },
  { key: "top_rated", label: "Top Rated", icon: "star-outline" },
];

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  All: "grid-outline",
  "main course": "restaurant-outline",
  starter: "leaf-outline",
  "fast food": "fast-food-outline",
  beverage: "cafe-outline",
  dessert: "ice-cream-outline",
};

const FALLBACK_IMG = require("../../assets/images/dish.png");

const DishCard = ({ dish }: { dish: Dish }) => {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];
  const [imgError, setImgError] = useState(false);
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => router.push(`/dish/${dish.id}`)}
      style={{ flex: 1 }}
    >
      <ThemedView variant="surface" style={styles.card}>
        <Image
          source={imgError || !dish.bannerImages?.[0] ? FALLBACK_IMG : { uri: dish.bannerImages[0] }}
          style={styles.cardImage}
          resizeMode="cover"
          onError={() => setImgError(true)}
          defaultSource={FALLBACK_IMG}
        />
        <View style={[styles.vegBadge, { backgroundColor: dish.nonVeg ? "#FFE8E8" : "#E8F8F0" }]}>
          <View style={[styles.vegDot, { backgroundColor: dish.nonVeg ? Brand.error : Brand.success }]} />
        </View>
        <View style={styles.cardContent}>
          <ThemedText style={styles.dishName} numberOfLines={1}>{dish.name}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textTertiary, textTransform: "capitalize", marginBottom: 6 }}>
            {dish.type}
          </ThemedText>
          <View style={styles.cardFooter}>
            <View>
              <ThemedText style={styles.price}>₹{dish.price}</ThemedText>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={11} color="#FFB800" />
                <ThemedText type="small" style={styles.ratingText}>{dish.ratings}</ThemedText>
              </View>
            </View>
            <AddToCartButton dishId={dish.id} dishName={dish.name} dishPrice={dish.price} size="sm" />
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

const Explore = () => {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [vegFilter, setVegFilter] = useState<VegFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const [sheetVisible, setSheetVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  const { dishes, loading } = useSelector((state: RootState) => state.dishes);

  const categories = useMemo(() => {
    const types = Array.from(new Set(dishes.map((d) => d.type)));
    return ["All", ...types];
  }, [dishes]);

  const openSheet = useCallback(() => {
    setSheetVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }, [slideAnim]);

  const closeSheet = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: SHEET_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSheetVisible(false));
  }, [slideAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) slideAnim.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80) {
          closeSheet();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const activeFiltersCount =
    (sortBy !== "none" ? 1 : 0) + (vegFilter !== "all" ? 1 : 0);

  const filtered = useMemo(() => {
    let result = dishes.filter((d) => {
      const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || d.type === activeCategory;
      const matchesVeg =
        vegFilter === "all" ? true : vegFilter === "veg" ? !d.nonVeg : d.nonVeg;
      return matchesQuery && matchesCategory && matchesVeg;
    });

    if (sortBy === "low_high")
      result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "high_low")
      result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === "top_rated")
      result = [...result].sort((a, b) => b.ratings - a.ratings);

    return result;
  }, [dishes, query, activeCategory, vegFilter, sortBy]);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: theme.surfaceSecondary,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons name="search-outline" size={20} color={theme.textTertiary} />
        <TextInput
          style={[styles.searchInput, { color: theme.inputText }]}
          placeholder="Search dishes, cuisines..."
          placeholderTextColor={theme.placeholder}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} activeOpacity={0.7}>
            <Ionicons
              name="close-circle"
              size={18}
              color={theme.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            {
              backgroundColor:
                activeFiltersCount > 0 ? Brand.primary : theme.surface,
              borderColor:
                activeFiltersCount > 0 ? Brand.primary : theme.border,
              borderWidth: 1,
            },
          ]}
          onPress={openSheet}
          activeOpacity={0.8}
        >
          <Ionicons
            name="options-outline"
            size={16}
            color={activeFiltersCount > 0 ? "#fff" : theme.textSecondary}
          />
          <ThemedText
            style={[
              styles.filterBtnText,
              { color: activeFiltersCount > 0 ? "#fff" : theme.textSecondary },
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

        <View style={styles.vegToggleGroup}>
          {(["all", "veg", "nonveg"] as VegFilter[]).map((v) => {
            const isActive = vegFilter === v;
            const label = v === "all" ? "All" : v === "veg" ? "Veg" : "Non-Veg";
            const color =
              v === "veg"
                ? Brand.success
                : v === "nonveg"
                  ? Brand.error
                  : Brand.primary;
            return (
              <TouchableOpacity
                key={v}
                style={[
                  styles.vegBtn,
                  {
                    backgroundColor: isActive ? color : theme.surface,
                    borderColor: isActive ? color : theme.border,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setVegFilter(v)}
                activeOpacity={0.8}
              >
                {v !== "all" && (
                  <View
                    style={[
                      styles.vegDotSmall,
                      { backgroundColor: isActive ? "#fff" : color },
                    ]}
                  />
                )}
                <ThemedText
                  style={[
                    styles.vegBtnText,
                    { color: isActive ? "#fff" : theme.textPrimary },
                  ]}
                >
                  {label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        renderItem={({ item }) => {
          const isActive = item === activeCategory;
          const icon = CATEGORY_ICONS[item] ?? "ellipse-outline";
          return (
            <TouchableOpacity
              style={[
                styles.categoryPill,
                {
                  backgroundColor: isActive ? Brand.primary : theme.surface,
                  borderColor: isActive ? Brand.primary : theme.border,
                  borderWidth: 1,
                },
              ]}
              onPress={() => setActiveCategory(item)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={icon}
                size={16}
                color={isActive ? "#fff" : theme.textSecondary}
              />
              <ThemedText
                style={[
                  styles.categoryText,
                  { color: isActive ? "#fff" : theme.textPrimary },
                ]}
              >
                {capitalize(item)}
              </ThemedText>
            </TouchableOpacity>
          );
        }}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Brand.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons
            name="search-outline"
            size={48}
            color={theme.textTertiary}
          />
          <ThemedText
            type="subtitle"
            style={{ marginTop: Spacing.md, color: theme.textSecondary }}
          >
            No dishes found
          </ThemedText>
          <ThemedText
            type="caption"
            style={{ color: theme.textTertiary, marginTop: 4 }}
          >
            Try a different search or category
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <DishCard dish={item} />}
        />
      )}

      <Modal
        visible={sheetVisible}
        transparent
        animationType="none"
        onRequestClose={closeSheet}
      >
        <Pressable style={styles.backdrop} onPress={closeSheet} />
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.surface,
              transform: [{ translateY: slideAnim }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View
            style={[styles.sheetHandle, { backgroundColor: theme.border }]}
          />

          <ThemedText type="subtitle" style={styles.sheetTitle}>
            Sort & Filter
          </ThemedText>

          {SORT_OPTIONS.map((opt) => {
            const isActive = sortBy === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.sheetOption,
                  { borderBottomColor: theme.border },
                ]}
                onPress={() => {
                  setSortBy(opt.key);
                  closeSheet();
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.sheetOptionIcon,
                    {
                      backgroundColor: isActive
                        ? `${Brand.primary}20`
                        : theme.surfaceSecondary,
                    },
                  ]}
                >
                  <Ionicons
                    name={opt.icon}
                    size={20}
                    color={isActive ? Brand.primary : theme.textSecondary}
                  />
                </View>
                <ThemedText
                  style={[
                    styles.sheetOptionText,
                    { color: isActive ? Brand.primary : theme.textPrimary },
                  ]}
                >
                  {opt.label}
                </ThemedText>
                {isActive && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={Brand.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}

          {sortBy !== "none" && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => {
                setSortBy("none");
                closeSheet();
              }}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.clearBtnText, { color: Brand.error }]}>
                Clear Sort
              </ThemedText>
            </TouchableOpacity>
          )}
        </Animated.View>
      </Modal>
    </ThemedView>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: 52,
    paddingBottom: Spacing.md,
    ...Shadows.sm,
  },
  headerTitle: { marginBottom: 2 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.md,
    marginTop: 60,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    paddingVertical: 0,
    fontSize: 16,
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  filterBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  filterBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },

  vegToggleGroup: {
    flex: 1,
    flexDirection: "row",
    gap: Spacing.xs,
  },
  vegBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  vegDotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  vegBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },

  categoriesContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
    borderWidth: 1,
    height: 40,
    marginBottom: Spacing.xl,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 16,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: Spacing.xxl,
  },

  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  columnWrapper: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  card: {
    flex: 1,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadows.sm,
  },
  cardImage: { width: "100%", height: 130 },
  vegBadge: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  vegDot: { width: 10, height: 10, borderRadius: 5 },
  cardContent: { padding: Spacing.sm },
  dishName: { fontSize: 14, fontWeight: "600", marginBottom: 2 },
  cardFooter: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 4,
  },
  price: { fontSize: 15, fontWeight: "700", color: Brand.primary },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  ratingText: { fontWeight: "600", color: "#E65100", fontSize: 11 },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    ...Shadows.lg,
  },
  sheetHandle: {
    width: 48,
    height: 5,
    borderRadius: 2.5,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: Spacing.lg,
  },
  sheetTitle: {
    marginBottom: Spacing.md,
    fontSize: 20,
    fontWeight: "700",
  },
  sheetOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  sheetOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  sheetOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  clearBtn: {
    marginTop: Spacing.lg,
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  clearBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
