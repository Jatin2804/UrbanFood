import { ThemedText } from '@/components/themed-text';
import { Brand, Colors, Spacing } from '@/constants/theme';
import { useTranslation } from '@/src/hooks/useTranslation';
import { cartStyles as styles } from '@/styles/screens/cartStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useColorScheme, View } from 'react-native';

const CartEmptyState = () => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const { t } = useTranslation();

  return (
    <View style={styles.emptyContainer}>
      <View
        style={[styles.emptyIconBox, { backgroundColor: Brand.primaryFaded }]}
      >
        <Ionicons name="cart-outline" size={52} color={Brand.primary} />
      </View>
      <ThemedText
        type="subtitle"
        style={{ marginTop: Spacing.lg, marginBottom: 6 }}
      >
        {t('cart.emptyCart')}
      </ThemedText>
      <ThemedText
        type="caption"
        style={{ color: theme.textSecondary, textAlign: 'center' }}
      >
        {t('cart.emptyCartMessage')}
      </ThemedText>
    </View>
  );
};

export default CartEmptyState;
