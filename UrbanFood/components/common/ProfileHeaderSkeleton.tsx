import { Spacing } from '@/constants/theme';
import { profileHeaderSkeletonStyles as styles } from '@/styles/components/profileHeaderSkeletonStyles';
import React from 'react';
import { View } from 'react-native';
import { SkeletonCircle, SkeletonLoader } from './SkeletonLoader';

export const ProfileHeaderSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <SkeletonCircle size={80} />
      <SkeletonLoader width={150} height={20} style={{ marginTop: Spacing.md }} />
      <SkeletonLoader width={100} height={14} style={{ marginTop: Spacing.xs }} />
    </View>
  );
};
