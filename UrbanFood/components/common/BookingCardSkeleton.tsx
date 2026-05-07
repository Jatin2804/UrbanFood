import { Spacing } from '@/constants/theme';
import { bookingCardSkeletonStyles as styles } from '@/styles/components/bookingCardSkeletonStyles';
import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';

export const BookingCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonLoader width={100} height={16} />
        <SkeletonLoader width={80} height={24} borderRadius={12} />
      </View>
      <SkeletonLoader
        width="60%"
        height={14}
        style={{ marginTop: Spacing.sm }}
      />
      <SkeletonLoader
        width="50%"
        height={14}
        style={{ marginTop: Spacing.xs }}
      />
      <View style={styles.footer}>
        <SkeletonLoader width={100} height={36} borderRadius={18} />
      </View>
    </View>
  );
};
