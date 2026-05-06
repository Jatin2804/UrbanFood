import { ScrollView, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MENU_CATEGORIES } from '@/src/constants/chatbot';
import { chatbotMenuStyles } from '@/styles/components/chatbotMenuStyles';

interface ChatbotMenuCategoriesProps {
  onCategoryPress: (categoryId: string) => void;
}

export default function ChatbotMenuCategories({
  onCategoryPress,
}: ChatbotMenuCategoriesProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={chatbotMenuStyles.categoriesContainer}
    >
      {MENU_CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={chatbotMenuStyles.categoryPill}
          onPress={() => onCategoryPress(category.id)}
          activeOpacity={0.7}
        >
          <ThemedText style={chatbotMenuStyles.categoryIcon}>
            {category.icon}
          </ThemedText>
          <ThemedText style={chatbotMenuStyles.categoryLabel}>
            {category.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
