import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { dishDetailStyles as styles } from '@/styles/screens/dishDetailStyles';
import React from 'react';
import { useColorScheme, View } from 'react-native';

interface DishInfoSectionProps {
  name: string;
  type: string;
  price: number;
}

const DishInfoSection = ({ name, type, price }: DishInfoSectionProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <View style={styles.titleSection}>
      <ThemedText
        type="title"
        style={[styles.dishName, { textAlign: 'center' }]}
      >
        {name}
      </ThemedText>

      <View style={styles.categoryChip}>
        <ThemedText
          type="caption"
          style={{ color: theme.textSecondary, textTransform: 'capitalize' }}
        >
          {type}
        </ThemedText>
      </View>

      <ThemedText style={styles.price}>₹{price}</ThemedText>
    </View>
  );
};

export default DishInfoSection;
