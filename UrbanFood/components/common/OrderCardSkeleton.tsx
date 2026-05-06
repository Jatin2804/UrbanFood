import { orderCardSkeletonStyles as styles } from '@/styles/components/orderCardSkeletonStyles';
import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';

export const OrderCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SkeletonLoader width={80} height={16} />
          <SkeletonLoader width={120} height={12} style={{ marginTop: 4 }} />
        </View>
        <SkeletonLoader width={80} height={24} borderRadius={12} />
      </View>

      <View style={styles.divider} />

      <View style={styles.dishList}>
        <SkeletonLoader width="90%" height={14} />
        <SkeletonLoader width="80%" height={14} style={{ marginTop: 6 }} />
        <SkeletonLoader width="70%" height={14} style={{ marginTop: 6 }} />
      </View>

      <View style={styles.footer}>
        <View>
          <SkeletonLoader width={60} height={12} />
          <SkeletonLoader width={50} height={18} style={{ marginTop: 4 }} />
        </View>
      </View>
    </View>
  );
};
