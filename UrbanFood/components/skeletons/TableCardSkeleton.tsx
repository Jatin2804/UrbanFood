import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { tableCardSkeletonStyles as styles } from '@/styles/components/tableCardSkeletonStyles';
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export default function TableCardSkeleton() {
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
      <Animated.View
        style={[
          styles.iconSkeleton,
          { backgroundColor: theme.border, opacity },
        ]}
      />
      <Animated.View
        style={[
          styles.tableNumberSkeleton,
          { backgroundColor: theme.border, opacity },
        ]}
      />
      <Animated.View
        style={[
          styles.capacitySkeleton,
          { backgroundColor: theme.border, opacity },
        ]}
      />
    </View>
  );
}
