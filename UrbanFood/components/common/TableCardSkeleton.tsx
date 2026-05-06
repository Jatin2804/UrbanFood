import { tableCardSkeletonStyles as styles } from '@/styles/components/tableCardSkeletonStyles';
import React from 'react';
import { View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';

export const TableCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <SkeletonLoader width={40} height={40} borderRadius={20} />
      <SkeletonLoader width={60} height={14} style={{ marginTop: 8 }} />
      <SkeletonLoader width={80} height={12} style={{ marginTop: 4 }} />
    </View>
  );
};
