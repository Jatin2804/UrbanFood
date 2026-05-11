import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import ChatbotHeader from '@/components/chatbot/ChatbotHeader';
import ChatbotInput from '@/components/chatbot/ChatbotInput';
import ChatbotMessageItem from '@/components/chatbot/ChatbotMessageItem';
import ChatbotQuickReplies from '@/components/chatbot/ChatbotQuickReplies';
import ChatbotTypingIndicator from '@/components/chatbot/ChatbotTypingIndicator';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
    CHATBOT_GREETING,
} from '@/src/constants/chatbot';
import { ROUTES } from '@/src/constants/navigation';
import { STORAGE_KEYS } from '@/src/constants/storage';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { useAuth } from '@/src/hooks/useAuth';
import { useBookings } from '@/src/hooks/useBookings';
import { useDishes } from '@/src/hooks/useDishes';
import { useOrders } from '@/src/hooks/useOrders';
import { useTranslation } from '@/src/hooks/useTranslation';
import { sendMessageToGrok } from '@/src/services/chatService';
import { ChatbotMessage } from '@/src/types/chatbot';
import { chatbotStyles } from '@/styles/screens/chatbotStyles';

export default function Chatbot() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { mode, setThemeMode } = useAppTheme();
  const { currentLanguage } = useTranslation();

  const openDeepLink = (path: string, delayMs = 500) => {
    setTimeout(() => {
      router.push(path as any);
    }, delayMs);
  };
  const colors = Colors[colorScheme ?? 'light'];
  const flatListRef = useRef<FlatList>(null);

  const { user } = useAuth();
  const { dishes: allDishes } = useDishes();
  const { orders } = useOrders(user?.id, true);
  const { bookings } = useBookings();

  const recentOrders = orders.slice(0, 3);
  const recentBookings = bookings.slice(0, 3);

  const [messages, setMessages] = useState<ChatbotMessage[]>([
    {
      id: '1',
      text: CHATBOT_GREETING,
      isBot: true,
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInitialChips, setShowInitialChips] = useState(true);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    saveChatHistory();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem(
        STORAGE_KEYS.CHATBOT_MESSAGES,
      );
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
        setShowInitialChips(messagesWithDates.length === 1);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const saveChatHistory = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CHATBOT_MESSAGES,
        JSON.stringify(messages),
      );
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const clearChatHistory = async () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all chat history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEYS.CHATBOT_MESSAGES);
              setMessages([
                {
                  id: '1',
                  text: CHATBOT_GREETING,
                  isBot: true,
                  timestamp: new Date(),
                  type: 'text',
                },
              ]);
              setShowInitialChips(true);
            } catch (error) {
              console.error('Failed to clear chat history:', error);
            }
          },
        },
      ],
    );
  };

  const handleSend = async () => {
    if (inputText.trim() === '') return;
    const text = inputText.trim();

    const userMessage: ChatbotMessage = {
      id: Date.now().toString(),
      text: text,
      isBot: false,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setShowInitialChips(false);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    const textMessages = messages.filter((msg) => msg.type === 'text');
    const recentMessages = textMessages.slice(-6);
    const chatHistory = recentMessages.map((msg) => ({
      role: msg.isBot ? 'assistant' : 'user',
      content: msg.text,
    }));

    const lowerText = text.toLowerCase();
    const wordCount = text.trim().split(/\s+/).length;
    let localResponse = null;

    if (wordCount <= 7) {
      if (
        lowerText.includes('track my order') ||
        lowerText.includes('where is my order')
      ) {
        localResponse = 'Let me take you to your orders! 📦';
        openDeepLink('/orders');
      } else if (
        lowerText.includes('track my booking') ||
        lowerText.includes('my table')
      ) {
        localResponse = 'Opening your bookings! 🍽️';
        openDeepLink('/dine-in?tab=mybookings');
      } else if (lowerText.includes('cart')) {
        localResponse = "Let's check your cart! 🛒";
        openDeepLink('/(tabs)/cart');
      } else if (lowerText.includes('offer')) {
        localResponse = 'Here are our amazing offers! 🎉';
        openDeepLink('/offers');
      } else if (lowerText.includes('show menu') || lowerText === 'menu') {
        const first10Dishes = allDishes.slice(0, 10);
        setIsTyping(false);
        const botMessage: ChatbotMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Here are some delicious dishes from our menu! 🍽️',
          isBot: true,
          timestamp: new Date(),
          type: 'menu',
          dishes: first10Dishes,
        };
        setMessages((prev) => [...prev, botMessage]);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
        return;
      }
    }

    if (localResponse) {
      setIsTyping(false);
      const botMessage: ChatbotMessage = {
        id: (Date.now() + 1).toString(),
        text: localResponse,
        isBot: true,
        timestamp: new Date(),
        type: 'text',
      };
      setMessages((prev) => [...prev, botMessage]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return;
    }

    const response = await sendMessageToGrok({
      message: text,
      menuData: allDishes,
      chatHistory,
      recentOrders,
      recentBookings,
    });

    setIsTyping(false);
    const botMessage: ChatbotMessage = {
      id: (Date.now() + 1).toString(),
      text: response.message,
      isBot: true,
      timestamp: new Date(),
      type: 'text',
      dishIds: response.dishIds.length > 0 ? response.dishIds : undefined,
    };
    setMessages((prev) => [...prev, botMessage]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleQuickReply = (reply: string) => {
    if (reply === 'Go Back') {
      setShowInitialChips(true);
      return;
    }

    const userMessage: ChatbotMessage = {
      id: Date.now().toString(),
      text: reply,
      isBot: false,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setShowInitialChips(false);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setTimeout(() => {
      setIsTyping(false);
      let botMessage: ChatbotMessage;

      if (reply.includes('Show menu')) {
        const first10Dishes = allDishes.slice(0, 10);
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Here are some delicious dishes from our menu! 🍽️',
          isBot: true,
          timestamp: new Date(),
          type: 'menu',
          dishes: first10Dishes,
        };
      } else if (reply.includes('Track my order')) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Let me take you to your orders! 📦',
          isBot: true,
          timestamp: new Date(),
          type: 'text',
        };
        openDeepLink('/orders');
      } else if (reply.includes('Track my bookings')) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Opening your bookings! 🍽️',
          isBot: true,
          timestamp: new Date(),
          type: 'text',
        };
        openDeepLink('/dine-in?tab=mybookings');
      } else if (reply.includes('Show Cart')) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: "Let's check your cart! 🛒",
          isBot: true,
          timestamp: new Date(),
          type: 'text',
        };
        openDeepLink('/(tabs)/cart');
      } else if (reply.includes('User Details')) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Opening your profile! 👤',
          isBot: true,
          timestamp: new Date(),
          type: 'text',
        };
        openDeepLink('/(tabs)/account');
      } else if (reply.includes('Restraunt Details')) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Taking you to restaurant details! 🏪',
          isBot: true,
          timestamp: new Date(),
          type: 'text',
        };
        openDeepLink('/(tabs)/');
      } else if (reply.includes('Show Offers')) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Here are our amazing offers! 🎉',
          isBot: true,
          timestamp: new Date(),
          type: 'text',
        };
        openDeepLink('/offers');
      } else if (reply.includes('Toggle Theme')) {
        const newMode = colorScheme === 'dark' ? 'light' : 'dark';
        setThemeMode(newMode);
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: `Switched to ${newMode} mode! ${newMode === 'dark' ? '🌙' : '☀️'}`,
          isBot: true,
          timestamp: new Date(),
          type: 'text',
        };
      } else if (reply.includes('Settings')) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Opening settings! ⚙️',
          isBot: true,
          timestamp: new Date(),
          type: 'text',
        };
        openDeepLink('/settings');
      } else {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: "I'm processing your request...",
          isBot: true,
          timestamp: new Date(),
          type: 'text',
        };
      }

      setMessages((prev) => [...prev, botMessage]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1200);
  };

  const handleCategoryPress = (categoryId: string) => {
    const filterIds = ['toprated', 'newlyadded'];
    if (filterIds.includes(categoryId)) {
      router.push(`${ROUTES.TABS.EXPLORE}?filter=${categoryId}` as any);
    } else {
      router.push(`${ROUTES.TABS.EXPLORE}?category=${categoryId}` as any);
    }
  };

  const handleDishPress = (dishId: string) => {
    router.push(ROUTES.DISH_DETAILS(dishId) as any);
  };

  const handleViewAll = () => {
    router.push(ROUTES.TABS.EXPLORE as any);
  };

  const handleExploreDishes = (dishIds: string[]) => {
    router.push(
      `${ROUTES.CHATBOT_EXPLORE}?dishIds=${dishIds.join(',')}` as any,
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ThemedView style={chatbotStyles.container}>
        <ChatbotHeader
          isTyping={isTyping}
          colors={colors}
          onBackPress={() => router.back()}
          onClearChat={clearChatHistory}
        />

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item, index }) => (
            <ChatbotMessageItem
              item={item}
              index={index}
              colors={colors}
              onCategoryPress={handleCategoryPress}
              onDishPress={handleDishPress}
              onViewAll={handleViewAll}
              onExploreDishes={handleExploreDishes}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={chatbotStyles.messagesList}
          ListFooterComponent={
            <ChatbotTypingIndicator isTyping={isTyping} colors={colors} />
          }
          showsVerticalScrollIndicator={false}
        />

        <ChatbotQuickReplies
          showInitialChips={showInitialChips}
          onQuickReply={handleQuickReply}
          isTyping={isTyping}
        />

        <ChatbotInput
          inputText={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          colors={colors}
        />
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
