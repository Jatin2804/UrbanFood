import { Spacing } from '@/constants/theme';
import { dishCardSkeletonStyles as styles } from '@/styles/components/dishCardSkeletonStyles';
import React from 'react';
import { View } from 'react-native';
import { SkeletonCircle, SkeletonLoader } from './SkeletonLoader';

export const DishCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <SkeletonLoader width="100%" height={120} borderRadius={12} />
      <View style={styles.content}>
        <SkeletonLoader width="80%" height={16} />
        <SkeletonLoader width="50%" height={14} style={{ marginTop: Spacing.xs }} />
        <View style={styles.footer}>
          <SkeletonLoader width={60} height={20} />
          <SkeletonCircle size={32} />
        </View>
      </View>
    </View>
  );
};

export const HorizontalDishCardSkeleton: React.FC = () => {
  return (
    <View style={styles.horizontalContainer}>
      <SkeletonLoader width={100} height={100} borderRadius={12} />
      <View style={styles.horizontalContent}>
        <SkeletonLoader width="70%" height={16} />
        <SkeletonLoader width="40%" height={14} style={{ marginTop: Spacing.xs }} />
        <SkeletonLoader width={50} height={18} style={{ marginTop: Spacing.xs }} />
      </View>
    </View>
  );
};
