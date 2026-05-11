import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Brand } from '@/constants/theme';
import { CHATBOT_QUICK_REPLIES } from '@/src/constants/chatbot';
import { chatbotStyles } from '@/styles/screens/chatbotStyles';

interface ChatbotQuickRepliesProps {
  showInitialChips: boolean;
  onQuickReply: (reply: string) => void;
  isTyping: boolean;
}

export default function ChatbotQuickReplies({
  showInitialChips,
  onQuickReply,
  isTyping,
}: ChatbotQuickRepliesProps) {
  if (isTyping) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(300).springify()}
      style={chatbotStyles.quickRepliesContainer}
    >
      {showInitialChips ? (
        CHATBOT_QUICK_REPLIES.map((reply, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              chatbotStyles.quickReplyButton,
              {
                opacity: pressed ? 0.6 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
            onPress={() => onQuickReply(reply)}
          >
            <ThemedText style={chatbotStyles.quickReplyText}>
              {reply}
            </ThemedText>
          </Pressable>
        ))
      ) : (
        <Pressable
          style={({ pressed }) => [
            chatbotStyles.quickReplyButton,
            chatbotStyles.goBackButton,
            {
              opacity: pressed ? 0.6 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
          onPress={() => onQuickReply('Go Back')}
        >
          <Ionicons name="arrow-back" size={14} color={Brand.primary} />
          <ThemedText style={chatbotStyles.quickReplyText}>
            Go Back
          </ThemedText>
        </Pressable>
      )}
    </Animated.View>
  );
}
