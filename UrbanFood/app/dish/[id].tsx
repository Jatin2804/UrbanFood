import AddToCartButton from "@/components/cart/AddToCartButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Brand, Colors, Radius, Shadows, Spacing } from "@/constants/theme";
import { RootState } from "@/src/store/rootReducer";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { useSelector } from "react-redux";

const { width: W } = Dimensions.get("window");
const FALLBACK = require("../../assets/images/dish.png");

const DishDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];

  const dish = useSelector((state: RootState) =>
    state.dishes.dishes.find((d) => d.id === id)
  );

  const [activeImg, setActiveImg] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const flatRef = useRef<FlatList>(null);

  if (!dish) {
    return (
      <ThemedView style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.textTertiary} />
        <ThemedText type="subtitle" style={{ marginTop: Spacing.md }}>Dish not found</ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnFallback}>
          <ThemedText lightColor={Brand.primary} darkColor={Brand.primary}>Go back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const images = dish.bannerImages?.length ? dish.bannerImages : [];

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / W);
    setActiveImg(idx);
  };

  const avgRating = dish.ratings;
  const totalFeedback = dish.feedback?.length ?? 0;

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={styles.imageSection}>
          {images.length > 0 ? (
            <>
              <FlatList
                ref={flatRef}
                data={images}
                keyExtractor={(_, i) => `img-${i}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => (
                  <Image
                    source={imgErrors[index] ? FALLBACK : { uri: item }}
                    style={styles.bannerImage}
                    resizeMode="cover"
                    onError={() => setImgErrors((p) => ({ ...p, [index]: true }))}
                    defaultSource={FALLBACK}
                  />
                )}
              />
              {images.length > 1 && (
                <View style={styles.dots}>
                  {images.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        { backgroundColor: i === activeImg ? "#fff" : "rgba(255,255,255,0.4)", width: i === activeImg ? 18 : 6 },
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          ) : (
            <Image source={FALLBACK} style={styles.bannerImage} resizeMode="cover" />
          )}

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={[styles.vegBadge, { backgroundColor: dish.nonVeg ? "#FFE8E8" : "#E8F8F0" }]}>
            <View style={[styles.vegDot, { backgroundColor: dish.nonVeg ? Brand.error : Brand.success }]} />
            <ThemedText
              style={styles.vegText}
              lightColor={dish.nonVeg ? Brand.error : Brand.success}
              darkColor={dish.nonVeg ? Brand.error : Brand.success}
            >
              {dish.nonVeg ? "Non-Veg" : "Veg"}
            </ThemedText>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <ThemedText type="title" style={styles.dishName}>{dish.name}</ThemedText>
              <ThemedText type="caption" style={{ color: theme.textSecondary, textTransform: "capitalize", marginTop: 2 }}>
                {dish.type}
              </ThemedText>
            </View>
            <ThemedText style={styles.price}>₹{dish.price}</ThemedText>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statChip, { backgroundColor: "#FFF8E7", borderColor: "#FFE082" }]}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <ThemedText style={styles.statChipText} lightColor="#E65100" darkColor="#E65100">
                {avgRating}
              </ThemedText>
            </View>
            <View style={[styles.statChip, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
              <Ionicons name="chatbubble-outline" size={14} color={theme.textSecondary} />
              <ThemedText style={[styles.statChipText, { color: theme.textSecondary }]}>
                {totalFeedback} reviews
              </ThemedText>
            </View>
            <View style={[styles.statChip, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
              <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
              <ThemedText style={[styles.statChipText, { color: theme.textSecondary }]}>
                {dish.addedDate}
              </ThemedText>
            </View>
          </View>

          {totalFeedback > 0 && (
            <ThemedView variant="surface" style={styles.reviewsCard}>
              <ThemedText type="defaultSemiBold" style={{ marginBottom: Spacing.sm }}>
                Reviews ({totalFeedback})
              </ThemedText>
              {dish.feedback.map((fb, i) => (
                <View key={i}>
                  <View style={styles.reviewRow}>
                    <View style={[styles.reviewAvatar, { backgroundColor: Brand.primaryFaded }]}>
                      <ThemedText lightColor={Brand.primary} darkColor={Brand.primary} style={styles.reviewAvatarText}>
                        {fb.userId.slice(-2).toUpperCase()}
                      </ThemedText>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.reviewHeader}>
                        <ThemedText type="small" style={{ fontWeight: "600" }}>{fb.userId}</ThemedText>
                        <View style={styles.reviewRating}>
                          <Ionicons name="star" size={11} color="#FFB800" />
                          <ThemedText type="small" style={{ color: "#E65100", fontWeight: "600" }}>{fb.rating}</ThemedText>
                        </View>
                      </View>
                      <ThemedText type="caption" style={{ color: theme.textSecondary, marginTop: 2 }}>
                        {fb.comment}
                      </ThemedText>
                    </View>
                  </View>
                  {i < dish.feedback.length - 1 && (
                    <View style={[styles.reviewDivider, { backgroundColor: theme.border }]} />
                  )}
                </View>
              ))}
            </ThemedView>
          )}
        </View>
      </ScrollView>

      <ThemedView variant="surface" style={styles.bottomBar}>
        <View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>Price</ThemedText>
          <ThemedText style={styles.bottomPrice}>₹{dish.price}</ThemedText>
        </View>
        <AddToCartButton dishId={dish.id} dishName={dish.name} dishPrice={dish.price} size="md" />
      </ThemedView>
    </ThemedView>
  );
};

export default DishDetail;

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 100 },

  imageSection: {
    height: 300,
    position: "relative",
  },
  bannerImage: {
    width: W,
    height: 300,
  },
  dots: {
    position: "absolute",
    bottom: Spacing.sm,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: { height: 6, borderRadius: 3 },
  backBtn: {
    position: "absolute",
    top: 48,
    left: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  backBtnFallback: { marginTop: Spacing.md },
  vegBadge: {
    position: "absolute",
    top: 48,
    right: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  vegDot: { width: 8, height: 8, borderRadius: 4 },
  vegText: { fontSize: 12, fontWeight: "700" },

  content: { padding: Spacing.md },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  dishName: { lineHeight: 36 },
  price: { fontSize: 24, fontWeight: "700", color: Brand.primary },

  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  statChipText: { fontSize: 12, fontWeight: "600" },

  reviewsCard: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  reviewRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  reviewAvatarText: { fontSize: 12, fontWeight: "700" },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviewRating: { flexDirection: "row", alignItems: "center", gap: 3 },
  reviewDivider: { height: 1, marginHorizontal: 44 },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 28,
    ...Shadows.lg,
  },
  bottomPrice: { fontSize: 22, fontWeight: "700" },
});
