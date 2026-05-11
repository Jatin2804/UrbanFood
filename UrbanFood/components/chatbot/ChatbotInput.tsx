import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';

import { Brand } from '@/constants/theme';
import { chatbotStyles } from '@/styles/screens/chatbotStyles';

interface ChatbotInputProps {
  inputText: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  colors: any;
}

export default function ChatbotInput({
  inputText,
  onChangeText,
  onSend,
  colors,
}: ChatbotInputProps) {
  return (
    <View
      style={[
        chatbotStyles.inputContainer,
        { backgroundColor: colors.surface },
      ]}
    >
      <TextInput
        style={[
          chatbotStyles.input,
          {
            color: colors.inputText,
            backgroundColor: colors.inputBackground,
            borderColor:
              inputText.trim() !== ''
                ? Brand.primary + '40'
                : 'rgba(0, 0, 0, 0.08)',
          },
        ]}
        placeholder="Ask me anything..."
        placeholderTextColor={colors.placeholder}
        value={inputText}
        onChangeText={onChangeText}
        onSubmitEditing={onSend}
        returnKeyType="send"
        multiline
        maxLength={500}
      />
      <Pressable
        style={({ pressed }) => [
          chatbotStyles.sendButton,
          inputText.trim() === '' && chatbotStyles.sendButtonDisabled,
          {
            opacity: pressed ? 0.85 : 1,
            transform: [{ scale: pressed ? 0.92 : 1 }],
          },
        ]}
        onPress={onSend}
        disabled={inputText.trim() === ''}
      >
        <Ionicons
          name="send"
          size={20}
          color={inputText.trim() === '' ? colors.textTertiary : '#FFFFFF'}
        />
      </Pressable>
    </View>
  );
}
