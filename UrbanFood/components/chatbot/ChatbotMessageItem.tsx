import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import ChatbotDishCard from '@/components/chatbot/ChatbotDishCard';
import ChatbotMenuCategories from '@/components/chatbot/ChatbotMenuCategories';
import { ThemedText } from '@/components/themed-text';
import { Brand } from '@/constants/theme';
import { ChatbotMessage } from '@/src/types/chatbot';
import { chatbotMenuStyles } from '@/styles/components/chatbotMenuStyles';
import { chatbotStyles } from '@/styles/screens/chatbotStyles';

interface ChatbotMessageItemProps {
  item: ChatbotMessage;
  index: number;
  colors: any;
  onCategoryPress: (categoryId: string) => void;
  onDishPress: (dishId: string) => void;
  onViewAll: () => void;
  onExploreDishes: (dishIds: string[]) => void;
}

export default function ChatbotMessageItem({
  item,
  index,
  colors,
  onCategoryPress,
  onDishPress,
  onViewAll,
  onExploreDishes,
}: ChatbotMessageItemProps) {
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
          <ChatbotMenuCategories onCategoryPress={onCategoryPress} />

          {/* Dishes Section */}
          <View style={chatbotMenuStyles.dishesSection}>
            <View style={chatbotMenuStyles.dishesSectionHeader}>
              <ThemedText style={chatbotMenuStyles.dishesSectionTitle}>
                Popular Dishes
              </ThemedText>
              <TouchableOpacity
                style={chatbotMenuStyles.viewAllButton}
                onPress={onViewAll}
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
                  onPress={() => onDishPress(dish.id)}
                />
              ))}
              {/* View All Card */}
              <TouchableOpacity
                style={chatbotMenuStyles.viewAllCard}
                onPress={onViewAll}
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
            onPress={() => onExploreDishes(item.dishIds!)}
            activeOpacity={0.8}
          >
            <ThemedText style={chatbotStyles.exploreButtonText}>
              Explore Recommendations
            </ThemedText>
            <Ionicons name="arrow-forward" size={16} color={Brand.primary} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}
