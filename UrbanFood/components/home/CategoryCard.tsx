import { ThemedText } from '@/components/themed-text';
import { useTranslation } from '@/src/hooks/useTranslation';
import { CategoryCardProps } from '@/src/types/components';
import { categoryCardStyles as styles } from '@/styles/components/categoryCardStyles';
import React from 'react';
import { Image, Pressable } from 'react-native';

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const { currentLanguage } = useTranslation();

  const getCategoryName = () => {
    switch (currentLanguage) {
      case 'hi':
        return category.nameHi;
      case 'te':
        return category.nameTe;
      case 'kn':
        return category.nameKn;
      default:
        return category.name;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <Image source={{ uri: category.image }} style={styles.image} />
      <ThemedText style={styles.name}>{getCategoryName()}</ThemedText>
    </Pressable>
  );
};

export default CategoryCard;
