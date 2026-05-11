import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { chatbotStyles } from '@/styles/screens/chatbotStyles';

interface ChatbotHeaderProps {
  isTyping: boolean;
  colors: any;
  onBackPress: () => void;
  onClearChat: () => void;
}

export default function ChatbotHeader({
  isTyping,
  colors,
  onBackPress,
  onClearChat,
}: ChatbotHeaderProps) {
  return (
    <View style={[chatbotStyles.header, { backgroundColor: colors.surface }]}>
      <Pressable
        onPress={onBackPress}
        style={({ pressed }) => [
          chatbotStyles.backButton,
          { opacity: pressed ? 0.5 : 1 },
        ]}
      >
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </Pressable>
      <Image
        source={require('@/assets/images/samosa-bot.png')}
        style={chatbotStyles.headerAvatar}
        contentFit="cover"
      />
      <View style={chatbotStyles.headerInfo}>
        <ThemedText style={chatbotStyles.headerTitle}>Samosa</ThemedText>
        <ThemedText style={chatbotStyles.headerStatus}>
          {isTyping ? 'Typing...' : 'Always here to help'}
        </ThemedText>
      </View>
      <Pressable
        onPress={onClearChat}
        style={({ pressed }) => [
          chatbotStyles.clearButton,
          { opacity: pressed ? 0.5 : 1 },
        ]}
      >
        <Ionicons
          name="trash-outline"
          size={20}
          color={colors.textSecondary}
        />
      </Pressable>
    </View>
  );
}
