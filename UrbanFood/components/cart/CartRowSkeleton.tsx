import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { cartRowSkeletonStyles as styles } from '@/styles/components/cartRowSkeletonStyles';
import React, { useEffect, useRef } from 'react';
import { Animated, useColorScheme, View } from 'react-native';

const CartRowSkeleton = () => {
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
    <ThemedView variant="surface" style={styles.row}>
      {/* Image skeleton */}
      <Animated.View
        style={[
          styles.imageSkeleton,
          { backgroundColor: theme.border, opacity },
        ]}
      />

      {/* Info skeleton */}
      <View style={styles.infoSkeleton}>
        <Animated.View
          style={[
            styles.nameSkeleton,
            { backgroundColor: theme.border, opacity },
          ]}
        />
        <Animated.View
          style={[
            styles.priceSkeleton,
            { backgroundColor: theme.border, opacity },
          ]}
        />
        <Animated.View
          style={[
            styles.totalSkeleton,
            { backgroundColor: theme.border, opacity },
          ]}
        />
      </View>

      {/* Controls skeleton */}
      <View style={styles.controlsSkeleton}>
        <Animated.View
          style={[
            styles.trashSkeleton,
            { backgroundColor: theme.border, opacity },
          ]}
        />
        <Animated.View
          style={[
            styles.buttonSkeleton,
            { backgroundColor: theme.border, opacity },
          ]}
        />
      </View>
    </ThemedView>
  );
};

export default CartRowSkeleton;
