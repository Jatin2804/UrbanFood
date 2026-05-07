import { Spacing } from '@/constants/theme';
import { notificationCardSkeletonStyles as styles } from '@/styles/components/notificationCardSkeletonStyles';
import React from 'react';
import { View } from 'react-native';
import { SkeletonCircle, SkeletonLoader } from './SkeletonLoader';

export const NotificationCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <SkeletonCircle size={48} />
      <View style={styles.content}>
        <SkeletonLoader width="60%" height={16} />
        <SkeletonLoader
          width="90%"
          height={14}
          style={{ marginTop: Spacing.xs }}
        />
        <SkeletonLoader
          width={60}
          height={12}
          style={{ marginTop: Spacing.xs }}
        />
      </View>
    </View>
  );
};
