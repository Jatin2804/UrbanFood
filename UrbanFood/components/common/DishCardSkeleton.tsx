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
      <SkeletonLoader width={160} height={140} borderRadius={16} />
      <View style={styles.horizontalContent}>
        <SkeletonLoader width="85%" height={16} />
        <SkeletonLoader width="50%" height={12} style={{ marginTop: 2 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: Spacing.xs }}>
          <View>
            <SkeletonLoader width={60} height={20} />
            <SkeletonLoader width={45} height={12} style={{ marginTop: 2 }} />
          </View>
          <SkeletonCircle size={32} />
        </View>
      </View>
    </View>
  );
};
