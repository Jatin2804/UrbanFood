import { Brand, Colors } from '@/constants/theme';
import { OFFER_ITEMS, OfferItem } from '@/src/data/homeContent';
import {
  OFFER_SNAP_INTERVAL,
  offerCarouselStyles as styles,
} from '@/styles/components/offerCarouselStyles';
import { router } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AUTO_SCROLL_INTERVAL = 3500;

const OfferCarousel = () => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  // Only show items where show === true
  const visibleItems = useMemo(
    () => OFFER_ITEMS.filter((item) => item.show),
    [],
  );
  const total = visibleItems.length;

  const flatRef = useRef<FlatList>(null);
  const currentIndex = useRef(0);
  const [dotIndex, setDotIndex] = useState(0);
  const isDragging = useRef(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const scrollTo = useCallback((index: number) => {
    flatRef.current?.scrollToOffset({
      offset: index * OFFER_SNAP_INTERVAL,
      animated: true,
    });
    currentIndex.current = index;
    setDotIndex(index);
  }, []);

  const startTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      if (isDragging.current) return;
      scrollTo((currentIndex.current + 1) % total);
    }, AUTO_SCROLL_INTERVAL);
  }, [scrollTo, total]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [startTimer]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / OFFER_SNAP_INTERVAL);
    if (idx !== currentIndex.current) {
      currentIndex.current = idx;
      setDotIndex(idx);
    }
  };

  const getItemLayout = (_: any, index: number) => ({
    length: OFFER_SNAP_INTERVAL,
    offset: OFFER_SNAP_INTERVAL * index,
    index,
  });

  const renderItem = ({ item }: { item: OfferItem }) => (
    <View style={styles.slide}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push('/(tabs)/explore')}
        style={styles.card}
      >
        <Image source={item.image} style={styles.image} resizeMode="cover" />
      </TouchableOpacity>
    </View>
  );

  if (total === 0) return null;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatRef}
        data={visibleItems}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        style={styles.flatList}
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
        renderItem={renderItem}
      />

      {/* Dot pagination */}
      <View style={styles.dotsRow}>
        {visibleItems.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: i === dotIndex ? 20 : 6,
                backgroundColor: i === dotIndex ? Brand.primary : theme.border,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default OfferCarousel;
