import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSelector } from 'react-redux';

import ChatbotDishCard from '@/components/chatbot/ChatbotDishCard';
import ChatbotMenuCategories from '@/components/chatbot/ChatbotMenuCategories';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
    CHATBOT_GREETING,
    CHATBOT_QUICK_REPLIES,
} from '@/src/constants/chatbot';
import { Dish } from '@/src/features/dishes/dishesType';
import { sendMessageToGrok } from '@/src/services/chatService';
import { RootState } from '@/src/store/rootReducer';
import { ChatMessage } from '@/src/types/components';
import { chatbotMenuStyles } from '@/styles/components/chatbotMenuStyles';
import { chatbotStyles } from '@/styles/screens/chatbotStyles';
import { ROUTES } from '@/src/constants/navigation';

const CHAT_STORAGE_KEY = '@chatbot_messages';

interface ChatbotMessage extends ChatMessage {
  type?: 'text' | 'menu';
  dishes?: Dish[];
  dishIds?: string[]; // IDs of recommended dishes
}

export default function Chatbot() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  /**
   * Common deeplink navigation helper.
   * Uses router.push() for in-app navigation (reliable within Expo Router).
   * Accepts any valid Expo Router href path.
   */
  const openDeepLink = (path: string, delayMs = 500) => {
    setTimeout(() => {
      router.push(path as any);
    }, delayMs);
  };
  const colors = Colors[colorScheme ?? 'light'];
  const flatListRef = useRef<FlatList>(null);

  const allDishes = useSelector((state: RootState) => state.dishes.dishes);
  const recentOrders = useSelector((state: RootState) => state.orders.orders).slice(0, 3);
  const recentBookings = useSelector((state: RootState) => state.bookings.bookings).slice(0, 3);

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

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Save chat history whenever messages change
  useEffect(() => {
    saveChatHistory();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
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
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
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
              await AsyncStorage.removeItem(CHAT_STORAGE_KEY);
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

    // Prepare chat history for AI - get last 3 message pairs (6 messages)
    // Filter out menu type messages and only include text messages
    const textMessages = messages.filter((msg) => msg.type === 'text');
    const recentMessages = textMessages.slice(-6); // Last 6 messages (3 pairs)
    const chatHistory = recentMessages.map((msg) => ({
      role: msg.isBot ? 'assistant' : 'user',
      content: msg.text,
    }));

    // Local intent fallback
    const lowerText = text.toLowerCase();
    const wordCount = text.trim().split(/\s+/).length;
    let localResponse = null;

    // Only process local intents if the message is short (e.g., <= 7 words)
    if (wordCount <= 7) {
      if (lowerText.includes('track my order') || lowerText.includes('where is my order')) {
        localResponse = "Let me take you to your orders! 📦";
        openDeepLink('/orders');
      } else if (lowerText.includes('track my booking') || lowerText.includes('my table')) {
        localResponse = "Opening your bookings! 🍽️";
        openDeepLink('/dine-in?tab=mybookings');
      } else if (lowerText.includes('cart')) {
        localResponse = "Let's check your cart! 🛒";
        openDeepLink('/(tabs)/cart');
      } else if (lowerText.includes('offer')) {
        localResponse = "Here are our amazing offers! 🎉";
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

    // Call Grok AI
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
    // Handle "Go Back" chip
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
        // Show menu with categories and dishes
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
          text: "Let me take you to your orders! 📦",
          isBot: true,
          timestamp: new Date(),
          type: 'text',
        };
        openDeepLink('/orders');
      } else if (reply.includes('Track my bookings')) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: "Opening your bookings! 🍽️",
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
          text: "Opening your profile! 👤",
          isBot: true,
          timestamp: new Date(),
          type: 'text',
        };
        openDeepLink('/(tabs)/account');
      } else if (reply.includes('Restraunt Details')) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: "Taking you to restaurant details! 🏪",
          isBot: true,
          timestamp: new Date(),
          type: 'text',
        };
        openDeepLink('/(tabs)/');
      } else if (reply.includes('Show Offers')) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: "Here are our amazing offers! 🎉",
          isBot: true,
          timestamp: new Date(),
          type: 'text',
        };
        openDeepLink('/offers');
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
    // Determine if it's a filter or category
    const filterIds = ['toprated', 'newlyadded'];
    
    if (filterIds.includes(categoryId)) {
      // It's a filter, use filter parameter
      router.push(`${ROUTES.TABS.EXPLORE}?filter=${categoryId}` as any);
    } else {
      // It's a category, use category parameter
      router.push(`${ROUTES.TABS.EXPLORE}?category=${categoryId}` as any);
    }
  };

  const handleDishPress = (dishId: string) => {
    // Navigate to dish detail
    router.push(ROUTES.DISH_DETAILS(dishId) as any);
  };

  const handleViewAll = () => {
    // Navigate to explore
    router.push(ROUTES.TABS.EXPLORE as any);
  };

  const handleExploreDishes = (dishIds: string[]) => {
    // Navigate to chatbot response explore screen with dish IDs
    router.push(`${ROUTES.CHATBOT_EXPLORE}?dishIds=${dishIds.join(',')}` as any);
  };

  const renderMessage = ({
    item,
    index,
  }: {
    item: ChatbotMessage;
    index: number;
  }) => {
    if (item.type === 'menu' && item.dishes) {
      return (
        <Animated.View
          entering={FadeInUp.delay(index * 50).springify()}
          style={chatbotStyles.messageContainer}
        >
          <Image
            source={require('@/assets/images/samosa-bot.png')}
            style={chatbotStyles.botAvatar}
            contentFit="cover"
          />
          <View style={{ flex: 1 }}>
            <View
              style={[
                chatbotStyles.messageBubble,
                chatbotStyles.botBubble,
                { backgroundColor: colors.surfaceSecondary },
              ]}
            >
              <ThemedText style={chatbotStyles.messageText}>
                {item.text}
              </ThemedText>
            </View>

            {/* Categories */}
            <ChatbotMenuCategories onCategoryPress={handleCategoryPress} />

            {/* Dishes Section */}
            <View style={chatbotMenuStyles.dishesSection}>
              <View style={chatbotMenuStyles.dishesSectionHeader}>
                <ThemedText style={chatbotMenuStyles.dishesSectionTitle}>
                  Popular Dishes
                </ThemedText>
                <TouchableOpacity
                  style={chatbotMenuStyles.viewAllButton}
                  onPress={handleViewAll}
                  activeOpacity={0.7}
                >
                  <ThemedText style={chatbotMenuStyles.viewAllText}>
                    View All →
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={chatbotMenuStyles.dishesScroll}
              >
                {item.dishes.map((dish) => (
                  <ChatbotDishCard
                    key={dish.id}
                    dish={dish}
                    onPress={() => handleDishPress(dish.id)}
                  />
                ))}
                {/* View All Card */}
                <TouchableOpacity
                  style={chatbotMenuStyles.viewAllCard}
                  onPress={handleViewAll}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="arrow-forward-circle"
                    size={32}
                    color={Brand.primary}
                  />
                  <ThemedText style={chatbotMenuStyles.viewAllCardText}>
                    View All
                  </ThemedText>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 50).springify()}
        style={[
          chatbotStyles.messageContainer,
          item.isBot
            ? chatbotStyles.botMessageContainer
            : chatbotStyles.userMessageContainer,
        ]}
      >
        {item.isBot && (
          <Image
            source={require('@/assets/images/samosa-bot.png')}
            style={chatbotStyles.botAvatar}
            contentFit="cover"
          />
        )}
        <View style={{ flex: 1 }}>
          <View
            style={[
              chatbotStyles.messageBubble,
              item.isBot ? chatbotStyles.botBubble : chatbotStyles.userBubble,
              {
                backgroundColor: item.isBot
                  ? colors.surfaceSecondary
                  : Brand.primary,
              },
            ]}
          >
            <ThemedText
              style={[
                chatbotStyles.messageText,
                !item.isBot && chatbotStyles.userMessageText,
              ]}
            >
              {item.text}
            </ThemedText>
          </View>
          
          {/* Explore Button for dish recommendations */}
          {item.isBot && item.dishIds && item.dishIds.length > 0 && (
            <TouchableOpacity
              style={chatbotStyles.exploreButton}
              onPress={() => handleExploreDishes(item.dishIds!)}
              activeOpacity={0.8}
            >
              <ThemedText style={chatbotStyles.exploreButtonText}>
                Explore Recommendations
              </ThemedText>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderTypingIndicator = () => {
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
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ThemedView style={chatbotStyles.container}>
        {/* Header */}
        <View
          style={[chatbotStyles.header, { backgroundColor: colors.surface }]}
        >
          <Pressable
            onPress={() => router.back()}
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
            <ThemedText style={chatbotStyles.headerTitle}>
              Samosa
            </ThemedText>
            <ThemedText style={chatbotStyles.headerStatus}>
              {isTyping ? 'Typing...' : 'Always here to help'}
            </ThemedText>
          </View>
          {/* Clear Chat Button */}
          <Pressable
            onPress={clearChatHistory}
            style={({ pressed }) => [
              chatbotStyles.clearButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={chatbotStyles.messagesList}
          ListFooterComponent={renderTypingIndicator}
          showsVerticalScrollIndicator={false}
        />

        {/* Quick Replies */}
        {!isTyping && (
          <Animated.View
            entering={FadeInDown.delay(300).springify()}
            style={chatbotStyles.quickRepliesContainer}
          >
            {showInitialChips ? (
              // Show initial quick replies
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
                  onPress={() => handleQuickReply(reply)}
                >
                  <ThemedText style={chatbotStyles.quickReplyText}>
                    {reply}
                  </ThemedText>
                </Pressable>
              ))
            ) : (
              // Show "Go Back" chip
              <Pressable
                style={({ pressed }) => [
                  chatbotStyles.quickReplyButton,
                  chatbotStyles.goBackButton,
                  {
                    opacity: pressed ? 0.6 : 1,
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  },
                ]}
                onPress={() => handleQuickReply('Go Back')}
              >
                <Ionicons name="arrow-back" size={14} color={Brand.primary} />
                <ThemedText style={chatbotStyles.quickReplyText}>
                  Go Back
                </ThemedText>
              </Pressable>
            )}
          </Animated.View>
        )}

        {/* Input */}
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
                borderColor: inputText.trim() !== '' ? Brand.primary + '40' : 'rgba(0, 0, 0, 0.08)',
              },
            ]}
            placeholder="Ask me anything..."
            placeholderTextColor={colors.placeholder}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
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
            onPress={handleSend}
            disabled={inputText.trim() === ''}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() === '' ? colors.textTertiary : '#FFFFFF'}
            />
          </Pressable>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}
