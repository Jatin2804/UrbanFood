import restaurantInfo from '@/src/data/restaurantInfo';
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
  const images = restaurantInfo.bannerImages;
  const total = images.length;

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
      if (isDragging.current) return;
      const next = (currentIndex.current + 1) % total;
      scrollTo(next);
    }, INTERVAL);
  }, [scrollTo, total]);

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
    <Image source={item} style={styles.image} resizeMode="cover" />
  );

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
        keyExtractor={(_, i) => `b${i}`}
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
