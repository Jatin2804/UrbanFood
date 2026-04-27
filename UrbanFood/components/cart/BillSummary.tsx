import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { DELIVERY_FEE } from '@/src/constants/cart';
import { Cart } from '@/src/features/cart/cartTypes';
import { cartStyles as styles } from '@/styles/screens/cartStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useColorScheme, View } from 'react-native';

interface BillSummaryProps {
  cart: Cart | null;
}

const BillSummary = ({ cart }: BillSummaryProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <ThemedView variant="surface" style={styles.billCard}>
      <ThemedText type="defaultSemiBold" style={styles.billTitle}>
        Bill Details
      </ThemedText>

      <View style={styles.billRow}>
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          Item total
        </ThemedText>
        <ThemedText type="caption">₹{cart?.totalPrice ?? 0}</ThemedText>
      </View>

      {(cart?.discount ?? 0) > 0 && (
        <View style={styles.billRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="pricetag-outline" size={13} color={Brand.success} />
            <ThemedText
              type="caption"
              lightColor={Brand.success}
              darkColor={Brand.success}
            >
              {cart?.offerId ?? 'Discount'}
            </ThemedText>
          </View>
          <ThemedText
            type="caption"
            lightColor={Brand.success}
            darkColor={Brand.success}
          >
            − ₹{cart?.discount}
          </ThemedText>
        </View>
      )}

      <View style={styles.billRow}>
        <ThemedText type="caption" style={{ color: theme.textSecondary }}>
          Delivery fee
        </ThemedText>
        <ThemedText type="caption">₹{DELIVERY_FEE}</ThemedText>
      </View>

      <View style={[styles.billDivider, { backgroundColor: theme.border }]} />

      <View style={styles.billRow}>
        <ThemedText type="defaultSemiBold">To pay</ThemedText>
        <ThemedText style={styles.toPayText}>
          ₹{(cart?.finalPrice ?? 0) + DELIVERY_FEE}
        </ThemedText>
      </View>
    </ThemedView>
  );
};

export default BillSummary;
