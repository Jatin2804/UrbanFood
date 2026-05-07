import { Image } from 'expo-image';
import { Share, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { DeepLinks } from '@/src/config/linking';
import { Dish } from '@/src/features/dishes/dishesType';
import { useAuth } from '@/src/hooks/useAuth';
import { chatbotMenuStyles } from '@/styles/components/chatbotMenuStyles';
import { Ionicons } from '@expo/vector-icons';

interface ChatbotDishCardProps {
  dish: Dish;
  onPress: () => void;
}

export default function ChatbotDishCard({
  dish,
  onPress,
}: ChatbotDishCardProps) {
  const { user, toggleFavourite } = useAuth();
  const isFav = !!user?.favoriteDishes?.includes(dish.id);

  const onShare = async (e?: any) => {
    e?.stopPropagation?.();
    const url = DeepLinks.dish(dish.id);
    await Share.share({
      message: `${dish.name.en}\n${url}`,
      url,
      title: dish.name.en,
    });
  };

  const onToggleFav = async (e?: any) => {
    e?.stopPropagation?.();
    if (!user) return;
    await toggleFavourite(dish.id);
  };

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

      <View style={chatbotMenuStyles.topActions}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onToggleFav}
          style={chatbotMenuStyles.actionBtn}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={16}
            color={isFav ? '#FF4D6D' : '#fff'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onShare}
          style={chatbotMenuStyles.actionBtn}
        >
          <Ionicons name="share-social-outline" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={chatbotMenuStyles.dishInfo}>
        <ThemedText style={chatbotMenuStyles.dishName} numberOfLines={2}>
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
