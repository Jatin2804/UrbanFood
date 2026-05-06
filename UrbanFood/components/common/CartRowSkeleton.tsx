import { Spacing } from '@/constants/theme';
import { cartRowSkeletonStyles as styles } from '@/styles/components/cartRowSkeletonStyles';
import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';

export const CartRowSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <SkeletonLoader width={80} height={80} borderRadius={12} />
      <View style={styles.content}>
        <SkeletonLoader width="70%" height={16} />
        <SkeletonLoader width="40%" height={14} style={{ marginTop: Spacing.xs }} />
        <View style={styles.footer}>
          <SkeletonLoader width={60} height={18} />
          <SkeletonLoader width={80} height={32} borderRadius={8} />
        </View>
      </View>
    </View>
  );
};
