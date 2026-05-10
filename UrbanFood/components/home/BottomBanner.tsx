import { bottomBannerStyles as styles } from '@/styles/components/bottomBannerStyles';
import { RootState } from '@/src/store';
import { getLocalAsset } from '@/src/utils/assetMapper';
import { useSelector } from 'react-redux';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Linking } from 'react-native';

const BottomBanner = () => {
  const remoteConfig = useSelector((state: RootState) => state.remoteConfig.data);
  const config = remoteConfig?.bottomBanner;

  if (!config?.enabled) return null;

  const handlePress = () => {
    if (config.actionType === 'navigate' && config.actionPayload) {
      router.push(config.actionPayload as any);
    } else if (config.actionType === 'url' && config.actionPayload) {
      Linking.openURL(config.actionPayload);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={handlePress}
      style={styles.container}
    >
      <Image
        source={getLocalAsset(config.localAsset)}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

export default BottomBanner;
