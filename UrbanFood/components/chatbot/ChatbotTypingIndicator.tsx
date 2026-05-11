import { Image } from 'expo-image';
import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { chatbotStyles } from '@/styles/screens/chatbotStyles';

interface ChatbotTypingIndicatorProps {
  isTyping: boolean;
  colors: any;
}

export default function ChatbotTypingIndicator({
  isTyping,
  colors,
}: ChatbotTypingIndicatorProps) {
  if (!isTyping) return null;

  return (
    <Animated.View
      entering={FadeInUp.springify()}
      style={[
        chatbotStyles.messageContainer,
        chatbotStyles.botMessageContainer,
      ]}
    >
      <Image
        source={require('@/assets/images/samosa-bot.png')}
        style={chatbotStyles.botAvatar}
        contentFit="cover"
      />
      <View
        style={[
          chatbotStyles.messageBubble,
          chatbotStyles.botBubble,
          { backgroundColor: colors.surfaceSecondary },
        ]}
      >
        <ThemedText style={chatbotStyles.messageText}>
          <ThemedText style={{ opacity: 0.4 }}>●</ThemedText>
          <ThemedText style={{ opacity: 0.6 }}> ●</ThemedText>
          <ThemedText style={{ opacity: 0.8 }}> ●</ThemedText>
        </ThemedText>
      </View>
    </Animated.View>
  );
}
