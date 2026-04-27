import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { cartStyles as styles } from '@/styles/screens/cartStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';

interface CartHeaderProps {
  itemCount: number;
  hasItems: boolean;
  onClear: () => void;
}

const CartHeader = ({ itemCount, hasItems, onClear }: CartHeaderProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <ThemedView variant="surface" style={styles.header}>
      <View>
        <ThemedText type="title">My Cart</ThemedText>
        {itemCount > 0 && (
          <ThemedText
            type="caption"
            style={{ color: theme.textSecondary, marginTop: 2 }}
          >
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </ThemedText>
        )}
      </View>
      {hasItems && (
        <TouchableOpacity
          style={[styles.clearBtn, { borderColor: Brand.error }]}
          onPress={onClear}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={13} color={Brand.error} />
          <ThemedText
            lightColor={Brand.error}
            darkColor={Brand.error}
            style={styles.clearBtnText}
          >
            Clear all
          </ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
};

export default CartHeader;
