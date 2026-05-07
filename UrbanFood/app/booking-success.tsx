import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { ROUTES } from '@/src/constants/navigation';
import { RootState } from '@/src/store/rootReducer';
import { bookingSuccessStyles as styles } from '@/styles/screens/bookingSuccessStyles';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Animated,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function BookingSuccess() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();
  const params = useLocalSearchParams();

  const { bookings } = useSelector((state: RootState) => state.bookings);

  // Get booking details from params
  const bookingId = params.bookingId as string;
  const booking = bookings.find((b) => b.bookingId === bookingId);

  // Animation values
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Success animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleViewBooking = () => {
    router.replace(ROUTES.DINE_IN);
  };

  const handleGoHome = () => {
    router.replace(ROUTES.TABS.HOME);
  };

  if (!booking) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <ThemedView style={styles.container}>
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color={Brand.error} />
            <ThemedText
              style={[styles.errorTitle, { color: theme.textPrimary }]}
            >
              Booking Not Found
            </ThemedText>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: Brand.primary }]}
              onPress={handleGoHome}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const bookingDate = new Date(booking.bookingTime);
  const formattedDate = bookingDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = bookingDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        {/* Success Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View
            style={[styles.iconCircle, { backgroundColor: Brand.primaryFaded }]}
          >
            <Ionicons
              name="checkmark-circle"
              size={100}
              color={Brand.success}
            />
          </View>
        </Animated.View>

        {/* Success Message */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <ThemedText style={[styles.title, { color: theme.textPrimary }]}>
            Booking Confirmed!
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Your table has been successfully reserved
          </ThemedText>

          {/* Booking Details Card */}
          <View
            style={[
              styles.detailsCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons
                  name="restaurant"
                  size={20}
                  color={Brand.primary}
                  style={styles.detailIcon}
                />
                <Text
                  style={[styles.detailLabel, { color: theme.textSecondary }]}
                >
                  Table Number
                </Text>
              </View>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                Table {booking.tableNumber}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons
                  name="time"
                  size={20}
                  color={Brand.primary}
                  style={styles.detailIcon}
                />
                <Text
                  style={[styles.detailLabel, { color: theme.textSecondary }]}
                >
                  Duration
                </Text>
              </View>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {booking.timeSlot === '5min' ? '5 minutes' : '10 minutes'}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons
                  name="calendar"
                  size={20}
                  color={Brand.primary}
                  style={styles.detailIcon}
                />
                <Text
                  style={[styles.detailLabel, { color: theme.textSecondary }]}
                >
                  Date
                </Text>
              </View>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {formattedDate}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={Brand.primary}
                  style={styles.detailIcon}
                />
                <Text
                  style={[styles.detailLabel, { color: theme.textSecondary }]}
                >
                  Time
                </Text>
              </View>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {formattedTime}
              </Text>
            </View>
          </View>

          {/* Info Box */}
          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: Brand.primaryFaded,
                borderColor: Brand.primary,
              },
            ]}
          >
            <Ionicons
              name="information-circle"
              size={20}
              color={Brand.primary}
            />
            <Text style={[styles.infoText, { color: Brand.primary }]}>
              Please arrive on time. Your booking will expire after the selected
              duration.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: Brand.primary }]}
              onPress={handleViewBooking}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>View My Bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.buttonOutline,
                { borderColor: theme.border, backgroundColor: theme.surface },
              ]}
              onPress={handleGoHome}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.buttonOutlineText, { color: theme.textPrimary }]}
              >
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ThemedView>
    </SafeAreaView>
  );
}
