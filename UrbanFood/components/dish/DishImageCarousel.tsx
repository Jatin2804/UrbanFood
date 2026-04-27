import { ThemedText } from '@/components/themed-text';
import { Brand } from '@/constants/theme';
import { dishDetailStyles as styles } from '@/styles/screens/dishDetailStyles';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    TouchableOpacity,
    View
} from 'react-native';

const { width: W } = Dimensions.get('window');
const FALLBACK = require('../../assets/images/dish.png');

interface DishImageCarouselProps {
  images: string[];
  isNonVeg: boolean;
  onBack: () => void;
}

const DishImageCarousel = ({ images, isNonVeg, onBack }: DishImageCarouselProps) => {
  const [activeImg, setActiveImg] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const flatRef = useRef<FlatList>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / W);
    setActiveImg(idx);
  };

  return (
    <View style={styles.imageSection}>
      {images.length > 0 ? (
        <>
          <FlatList
            ref={flatRef}
            data={images}
            keyExtractor={(_, i) => `img-${i}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => (
              <Image
                source={imgErrors[index] ? FALLBACK : { uri: item }}
                style={styles.bannerImage}
                resizeMode="cover"
                onError={() => setImgErrors((p) => ({ ...p, [index]: true }))}
                defaultSource={FALLBACK}
              />
            )}
          />
          {images.length > 1 && (
            <View style={styles.dots}>
              {images.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        i === activeImg ? '#fff' : 'rgba(255,255,255,0.4)',
                      width: i === activeImg ? 18 : 6,
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </>
      ) : (
        <Image source={FALLBACK} style={styles.bannerImage} resizeMode="cover" />
      )}

      <TouchableOpacity
        style={styles.backBtn}
        onPress={onBack}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>

      <View
        style={[
          styles.vegBadge,
          { backgroundColor: isNonVeg ? '#FFE8E8' : '#E8F8F0' },
        ]}
      >
        <View
          style={[
            styles.vegDot,
            { backgroundColor: isNonVeg ? Brand.error : Brand.success },
          ]}
        />
        <ThemedText
          style={styles.vegText}
          lightColor={isNonVeg ? Brand.error : Brand.success}
          darkColor={isNonVeg ? Brand.error : Brand.success}
        >
          {isNonVeg ? 'Non-Veg' : 'Veg'}
        </ThemedText>
      </View>
    </View>
  );
};

export default DishImageCarousel;
