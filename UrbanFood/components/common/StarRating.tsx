import { Ionicons } from '@expo/vector-icons';
import React, { memo, useMemo } from 'react';
import { View } from 'react-native';

type StarRatingProps = {
  rating: number; // 0..5 (can be float; we render filled stars only)
  size?: number;
  filledColor?: string;
  emptyColor?: string;
  max?: number;
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const StarRating = ({
  rating,
  size = 14,
  filledColor = '#FFB800',
  emptyColor = 'rgba(0,0,0,0.18)',
  max = 5,
}: StarRatingProps) => {
  const filled = useMemo(
    () => clamp(Math.round(rating), 0, max),
    [rating, max],
  );

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < filled ? 'star' : 'star-outline'}
          size={size}
          color={i < filled ? filledColor : emptyColor}
        />
      ))}
    </View>
  );
};

export default memo(StarRating);
