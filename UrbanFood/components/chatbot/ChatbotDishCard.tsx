import { Image } from 'expo-image';
import { TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Dish } from '@/src/features/dishes/dishesType';
import { chatbotMenuStyles } from '@/styles/components/chatbotMenuStyles';

interface ChatbotDishCardProps {
  dish: Dish;
  onPress: () => void;
}

export default function ChatbotDishCard({
  dish,
  onPress,
}: ChatbotDishCardProps) {
  return (
    <TouchableOpacity
      style={chatbotMenuStyles.dishCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: dish.bannerImages[0] }}
        style={chatbotMenuStyles.dishImage}
        contentFit="cover"
      />
      <View style={chatbotMenuStyles.dishInfo}>
        <ThemedText
          style={chatbotMenuStyles.dishName}
          numberOfLines={2}
        >
          {dish.name.en}
        </ThemedText>
        <ThemedText style={chatbotMenuStyles.dishPrice}>
          ₹{dish.price}
        </ThemedText>
        {dish.isVeg !== undefined && (
          <View
            style={[
              chatbotMenuStyles.vegBadge,
              { borderColor: dish.isVeg ? '#22C55E' : '#EF4444' },
            ]}
          >
            <View
              style={[
                chatbotMenuStyles.vegDot,
                { backgroundColor: dish.isVeg ? '#22C55E' : '#EF4444' },
              ]}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
