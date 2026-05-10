import { RootState } from '@/src/store';
import { getLocalAsset } from '@/src/utils/assetMapper';
import { useSelector } from 'react-redux';
import { bannerCarouselStyles as styles } from '@/styles/components/bannerCarouselStyles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const INTERVAL = 3000;

const BannerCarousel = () => {
  const remoteConfig = useSelector((state: RootState) => state.remoteConfig.data);
  const config = remoteConfig?.bannerCarousel;
  
  const images = config?.images.filter(img => img.show) || [];
  const total = images.length;
  const interval = config?.autoScrollInterval || INTERVAL;

  const flatListRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);
  const [dotIndex, setDotIndex] = useState(0);
  const isDragging = useRef(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const scrollTo = useCallback((index: number) => {
    flatListRef.current?.scrollToOffset({
      offset: index * SCREEN_WIDTH,
      animated: true,
    });
    currentIndex.current = index;
    setDotIndex(index);
  }, []);

  const startTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      if (isDragging.current || total === 0) return;
      const next = (currentIndex.current + 1) % total;
      scrollTo(next);
    }, interval);
  }, [scrollTo, total, interval]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [startTimer]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index !== currentIndex.current) {
      currentIndex.current = index;
      setDotIndex(index);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Image source={getLocalAsset(item.localAsset)} style={styles.image} resizeMode="cover" />
  );

  if (!config?.enabled || total === 0) return null;

  const getItemLayout = (_: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        onScrollBeginDrag={() => {
          isDragging.current = true;
          if (timer.current) clearInterval(timer.current);
        }}
        onScrollEndDrag={() => {
          isDragging.current = false;
          startTimer();
        }}
        onMomentumScrollEnd={onScroll}
        bounces={false}
      />

      <View style={styles.dots}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: i === dotIndex ? 20 : 6,
                backgroundColor:
                  i === dotIndex ? '#fff' : 'rgba(255,255,255,0.45)',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default BannerCarousel;
