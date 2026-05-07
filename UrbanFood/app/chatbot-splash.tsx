import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { chatbotSplashStyles } from '@/styles/screens/chatbotSplashStyles';
import { ROUTES } from '@/src/constants/navigation';

export default function ChatbotSplash() {
  const router = useRouter();
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Animate image entrance
    scale.value = withSequence(
      withTiming(1.1, { duration: 400, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 200, easing: Easing.inOut(Easing.ease) }),
    );

    // Navigate to chat screen after 2 seconds
    const timer = setTimeout(() => {
      router.replace(ROUTES.CHATBOT);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <ThemedView style={chatbotSplashStyles.container}>
      <Animated.View style={animatedImageStyle}>
        <Image
          source={require('@/assets/images/samosa-bot.png')}
          style={chatbotSplashStyles.image}
          contentFit="contain"
        />
      </Animated.View>
      <Animated.View entering={FadeIn.delay(300).duration(600)}>
        <ThemedText style={chatbotSplashStyles.title}>Samosa Bot</ThemedText>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(500).duration(600)}>
        <ThemedText style={chatbotSplashStyles.subtitle}>
          Your food ordering assistant
        </ThemedText>
      </Animated.View>
    </ThemedView>
  );
}
