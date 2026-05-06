import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

import { FloatingChatbotButtonProps } from '@/src/types/components';
import { floatingChatbotButtonStyles } from '@/styles/components/floatingChatbotButtonStyles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function FloatingChatbotButton(
  props: FloatingChatbotButtonProps,
) {
  const router = useRouter();

  // Animation values
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.12);

  useEffect(() => {
    // Gentle pulse animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );

    // Subtle glow variation
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.18, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.08, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  const handlePress = () => {
    router.push('/chatbot-splash');
  };

  // Animated styles
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={floatingChatbotButtonStyles.wrapper}>
      {/* Subtle glow layer */}
      <Animated.View
        style={[floatingChatbotButtonStyles.glow, animatedGlowStyle]}
      />

      {/* Main button */}
      <AnimatedPressable
        style={[floatingChatbotButtonStyles.container, animatedButtonStyle]}
        onPress={handlePress}
      >
        <Image
          source={require('@/assets/images/samosa-bot.png')}
          style={floatingChatbotButtonStyles.image}
          contentFit="cover"
        />
      </AnimatedPressable>
    </View>
  );
}
