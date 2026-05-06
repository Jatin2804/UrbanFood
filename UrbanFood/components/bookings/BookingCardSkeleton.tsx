import { Colors } from '@/constants/theme';
import { bookingCardSkeletonStyles as styles } from '@/styles/components/bookingCardSkeletonStyles';
import React, { useEffect, useRef } from 'react';
import { Animated, useColorScheme, View } from 'react-native';

export default function BookingCardSkeleton() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.tableInfo}>
          <Animated.View
            style={[
              styles.iconBoxSkeleton,
              { backgroundColor: theme.border, opacity },
            ]}
          />
          <View>
            <Animated.View
              style={[
                styles.tableNumberSkeleton,
                { backgroundColor: theme.border, opacity },
              ]}
            />
            <Animated.View
              style={[
                styles.slotSkeleton,
                { backgroundColor: theme.border, opacity },
              ]}
            />
          </View>
        </View>

        <Animated.View
          style={[
            styles.statusBadgeSkeleton,
            { backgroundColor: theme.border, opacity },
          ]}
        />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.details}>
        <Animated.View
          style={[
            styles.detailRowSkeleton,
            { backgroundColor: theme.border, opacity },
          ]}
        />
        <Animated.View
          style={[
            styles.detailRowSkeleton,
            { backgroundColor: theme.border, opacity },
          ]}
        />
      </View>
    </View>
  );
}
