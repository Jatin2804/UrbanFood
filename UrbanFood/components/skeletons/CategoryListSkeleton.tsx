import { categoryListSkeletonStyles as styles } from '@/styles/components/categoryListSkeletonStyles';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';

export const CategoryListSkeleton: React.FC = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <View key={`category-skeleton-${index}`} style={styles.item}>
            <SkeletonLoader width={80} height={36} borderRadius={18} />
          </View>
        ))}
    </ScrollView>
  );
};
