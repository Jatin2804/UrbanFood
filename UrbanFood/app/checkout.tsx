import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { DELIVERY_FEE, ESTIMATED_DELIVERY_MINUTES } from '@/src/constants/cart';
import { useAuth } from '@/src/hooks/useAuth';
import { useCart } from '@/src/hooks/useCart';
import { useLocation } from '@/src/hooks/useLocation';
import { useOrders } from '@/src/hooks/useOrders';
import { RootState } from '@/src/store/rootReducer';
import { checkoutStyles as styles } from '@/styles/screens/checkoutStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function Checkout() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);

  const { user } = useAuth();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const { handleClearCart } = useCart();
  const { createNewOrder } = useOrders(user?.id, true);
  const {
    status: locationStatus,
    address: locationAddress,
    coords,
    city,
    district,
    requestLocation,
    openSettings,
  } = useLocation();

  // Guard: redirect to home if cart is empty
  useEffect(() => {
    const totalItems = cart?.dishes.reduce((sum, dish) => sum + dish.quantity, 0) ?? 0;
    if (totalItems === 0) {
      router.replace('/(tabs)');
    }
  }, [cart, router]);

  useEffect(() => {
    if (locationStatus === 'idle') {
      requestLocation();
    }
  }, [locationStatus, requestLocation]);

  const handleConfirmOrder = async () => {
    if (!user) {
      Alert.alert('Error', 'Please login to place an order');
      return;
    }

    if (!cart || cart.dishes.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    setIsConfirming(true);

    try {
      // Fetch current location
      await requestLocation();

      // Build delivery address
      const deliveryAddress = [locationAddress, district, city]
        .filter(Boolean)
        .join(', ') || 'Address not available';

      // Calculate estimated delivery time (2 minutes from now)
      const estimatedTime = new Date(
        Date.now() + ESTIMATED_DELIVERY_MINUTES * 60000,
      ).toISOString();

      // Create order
      const order = await createNewOrder({
        userId: user.id,
        dishes: cart.dishes.map((dish) => ({
          dishId: dish.dishId,
          name: dish.name,
          price: dish.price,
          quantity: dish.quantity,
          nonVeg: dish.nonVeg,
        })),
        paymentType: 'cod',
        status: 'pending',
        userAddress: deliveryAddress,
        estimatedTime,
        totalPrice: cart.totalPrice,
        discount: cart.discount,
        finalPrice: cart.finalPrice + DELIVERY_FEE,
        offerId: cart.offerId,
      });

      // Clear the cart after successful order creation
      await handleClearCart();

      // Prepare navigation params
      const params: Record<string, string> = {
        orderId: order.orderId,
        orderTime: order.orderTime,
        estimatedTime: order.estimatedTime,
      };
      if (coords) {
        params.userLat = coords.latitude.toString();
        params.userLng = coords.longitude.toString();
      }

      // Navigate to success screen
      setIsConfirming(false);
      router.push({ pathname: '/order-success', params });
    } catch (error) {
      console.error('Order confirmation failed:', error);
      setIsConfirming(false);
      Alert.alert(
        'Order Failed',
        'Failed to place your order. Please try again.',
      );
    }
  };

  const total = (cart?.finalPrice ?? 0) + DELIVERY_FEE;

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
            Checkout
          </ThemedText>
          <View style={styles.backBtn} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Delivery Location */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons
                name="location-outline"
                size={20}
                color={Brand.primary}
              />
              <ThemedText
                style={[styles.sectionTitle, { color: theme.textPrimary }]}
              >
                Delivery Location
              </ThemedText>
            </View>

            {locationStatus === 'requesting' && (
              <View style={styles.requestingRow}>
                <View
                  style={[
                    styles.requestingDot,
                    { backgroundColor: Brand.primary },
                  ]}
                />
                <ThemedText
                  style={[
                    styles.requestingText,
                    { color: theme.textSecondary },
                  ]}
                >
                  Detecting your location...
                </ThemedText>
              </View>
            )}

            {locationStatus === 'granted' && locationAddress && (
              <View style={styles.locationRow}>
                <View
                  style={[
                    styles.locationIconWrap,
                    { backgroundColor: Brand.primaryFaded },
                  ]}
                >
                  <Ionicons name="location" size={18} color={Brand.primary} />
                </View>
                <View style={styles.locationTextWrap}>
                  <ThemedText
                    style={[styles.locationLabel, { color: Brand.primary }]}
                  >
                    Delivering to
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.locationAddress,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {locationAddress}
                  </ThemedText>
                  {(city || district) && (
                    <ThemedText
                      style={[
                        styles.locationCity,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {[district, city].filter(Boolean).join(', ')}
                    </ThemedText>
                  )}
                  {coords && (
                    <ThemedText
                      style={[
                        styles.locationCoords,
                        { color: theme.textTertiary },
                      ]}
                    >
                      {coords.latitude.toFixed(5)},{' '}
                      {coords.longitude.toFixed(5)}
                    </ThemedText>
                  )}
                </View>
                <TouchableOpacity
                  style={[
                    styles.locationChangeBtn,
                    { borderColor: theme.border },
                  ]}
                  onPress={requestLocation}
                  activeOpacity={0.7}
                >
                  <ThemedText
                    style={[
                      styles.locationChangeBtnText,
                      { color: Brand.primary },
                    ]}
                  >
                    Refresh
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}

            {locationStatus === 'denied' && (
              <View style={styles.deniedBox}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={Brand.error}
                />
                <ThemedText
                  style={[styles.deniedText, { color: theme.textSecondary }]}
                >
                  Location access denied. Please enable it to continue.
                </ThemedText>
                <TouchableOpacity
                  style={[
                    styles.settingsBtn,
                    { backgroundColor: Brand.primaryFaded },
                  ]}
                  onPress={openSettings}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    style={[styles.settingsBtnText, { color: Brand.primary }]}
                  >
                    Open Settings
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Bill Summary */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons
                name="receipt-outline"
                size={20}
                color={Brand.primary}
              />
              <ThemedText
                style={[styles.sectionTitle, { color: theme.textPrimary }]}
              >
                Bill Details
              </ThemedText>
            </View>

            <View style={styles.billRow}>
              <ThemedText
                style={[styles.billLabel, { color: theme.textSecondary }]}
              >
                Item total
              </ThemedText>
              <ThemedText
                style={[styles.billValue, { color: theme.textPrimary }]}
              >
                ₹{cart?.totalPrice ?? 0}
              </ThemedText>
            </View>

            {(cart?.discount ?? 0) > 0 && (
              <View style={styles.billRow}>
                <View style={styles.discountLabel}>
                  <Ionicons
                    name="pricetag-outline"
                    size={13}
                    color={Brand.success}
                  />
                  <ThemedText
                    style={[styles.billLabel, { color: Brand.success }]}
                  >
                    {cart?.offerId ?? 'Discount'}
                  </ThemedText>
                </View>
                <ThemedText
                  style={[styles.billValue, { color: Brand.success }]}
                >
                  − ₹{cart?.discount}
                </ThemedText>
              </View>
            )}

            <View style={styles.billRow}>
              <ThemedText
                style={[styles.billLabel, { color: theme.textSecondary }]}
              >
                Delivery fee
              </ThemedText>
              <ThemedText
                style={[styles.billValue, { color: theme.textPrimary }]}
              >
                ₹{DELIVERY_FEE}
              </ThemedText>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.billRow}>
              <ThemedText
                style={[styles.totalLabel, { color: theme.textPrimary }]}
              >
                Total
              </ThemedText>
              <ThemedText style={[styles.totalValue, { color: Brand.primary }]}>
                ₹{total}
              </ThemedText>
            </View>
          </View>

          {/* Payment method */}
          <View
            style={[
              styles.paymentBadge,
              {
                backgroundColor: theme.surfaceSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons name="cash-outline" size={18} color={Brand.primary} />
            <ThemedText
              style={[styles.paymentText, { color: theme.textPrimary }]}
            >
              Cash on Delivery
            </ThemedText>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Confirm Order bar */}
        <View
          style={[
            styles.confirmBar,
            { backgroundColor: theme.surface, borderTopColor: theme.border },
          ]}
        >
          <View>
            <ThemedText
              style={[styles.confirmTotalLabel, { color: theme.textSecondary }]}
            >
              Total payable
            </ThemedText>
            <ThemedText
              style={[styles.confirmAmount, { color: theme.textPrimary }]}
            >
              ₹{total}
            </ThemedText>
          </View>
          <TouchableOpacity
            style={[
              styles.confirmBtn,
              {
                opacity: locationStatus === 'denied' || isConfirming ? 0.5 : 1,
              },
            ]}
            onPress={handleConfirmOrder}
            disabled={locationStatus === 'denied' || isConfirming}
            activeOpacity={0.85}
          >
            {isConfirming ? (
              <>
                <ActivityIndicator color="#fff" size="small" />
                <ThemedText style={styles.confirmBtnText}>
                  Confirming...
                </ThemedText>
              </>
            ) : (
              <>
                <ThemedText style={styles.confirmBtnText}>
                  Confirm Order
                </ThemedText>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#fff"
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
