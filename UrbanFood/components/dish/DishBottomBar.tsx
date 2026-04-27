import AddToCartButton from '@/components/cart/AddToCartButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { dishDetailStyles as styles } from '@/styles/screens/dishDetailStyles';
import React from 'react';
import { useColorScheme, View } from 'react-native';

interface DishBottomBarProps {
  dishId: string;
  dishName: string;
  price: number;
}

const DishBottomBar = ({ dishId, dishName, price }: DishBottomBarProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <ThemedView variant="surface" style={styles.bottomBar}>
      <View>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          Price
        </ThemedText>
        <ThemedText style={styles.bottomPrice}>₹{price}</ThemedText>
      </View>
      <AddToCartButton
        dishId={dishId}
        dishName={dishName}
        dishPrice={price}
        size="md"
      />
    </ThemedView>
  );
};

export default DishBottomBar;
