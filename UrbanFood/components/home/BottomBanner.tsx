import { BOTTOM_BANNER } from '@/src/data/homeContent';
import { bottomBannerStyles as styles } from '@/styles/components/bottomBannerStyles';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

const BottomBanner = () => {
  const handlePress = () => {
    // Intentionally empty — wire up later via homeContent.ts
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={handlePress}
      style={styles.container}
      activeOpacity={1}
    >
      <Image
        source={BOTTOM_BANNER.image}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

export default BottomBanner;
