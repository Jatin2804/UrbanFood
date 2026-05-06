import { Spacing } from '@/constants/theme';
import { dishDetailSkeletonStyles as styles } from '@/styles/components/dishDetailSkeletonStyles';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';

export const DishDetailSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel Skeleton */}
        <SkeletonLoader width="100%" height={300} borderRadius={0} />

        {/* Content */}
        <View style={styles.content}>
          {/* Dish Info */}
          <View style={styles.section}>
            <SkeletonLoader width="70%" height={24} />
            <SkeletonLoader width="40%" height={16} style={{ marginTop: Spacing.xs }} />
            <SkeletonLoader width={80} height={28} style={{ marginTop: Spacing.sm }} />
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <SkeletonLoader width={100} height={40} borderRadius={8} />
            <SkeletonLoader width={100} height={40} borderRadius={8} />
            <SkeletonLoader width={100} height={40} borderRadius={8} />
          </View>

          {/* Reviews Section */}
          <View style={styles.section}>
            <SkeletonLoader width={120} height={20} />
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <View key={`review-skeleton-${index}`} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <SkeletonLoader width={100} height={16} />
                    <SkeletonLoader width={60} height={16} />
                  </View>
                  <SkeletonLoader width="100%" height={14} style={{ marginTop: Spacing.xs }} />
                  <SkeletonLoader width="80%" height={14} style={{ marginTop: 4 }} />
                </View>
              ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar Skeleton */}
      <View style={styles.bottomBar}>
        <SkeletonLoader width={100} height={40} borderRadius={20} />
        <SkeletonLoader width={150} height={48} borderRadius={24} />
      </View>
    </View>
  );
};
