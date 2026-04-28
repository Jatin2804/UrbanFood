import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { CART_OFFERS } from '@/src/data/cartOffers';
import { Cart } from '@/src/features/cart/cartTypes';
import { cartStyles as styles } from '@/styles/screens/cartStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';

interface OfferSectionProps {
  cart: Cart | null;
  onOpen: () => void;
}

const OfferSection = ({ cart, onOpen }: OfferSectionProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const appliedOffer = cart?.offerId
    ? CART_OFFERS.find((o) => o.id === cart.offerId)
    : null;

  return (
    <ThemedView variant="surface" style={styles.offerSection}>
      <TouchableOpacity
        style={styles.offerSectionRow}
        onPress={onOpen}
        activeOpacity={0.8}
      >
        <View style={styles.offerSectionLeft}>
          <Ionicons
            name="pricetag-outline"
            size={20}
            color={appliedOffer ? Brand.success : Brand.primary}
          />
          <View>
            <ThemedText style={{ fontSize: 14, fontWeight: '600' }}>
              {appliedOffer ? 'Offer Applied' : 'Apply Offer'}
            </ThemedText>
            {appliedOffer && (
              <View
                style={[
                  styles.offerAppliedBadge,
                  { backgroundColor: `${Brand.success}18` },
                ]}
              >
                <ThemedText
                  style={{ fontSize: 12, fontWeight: '600', color: Brand.success }}
                >
                  {appliedOffer.code} — saving ₹{cart?.discount}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.textTertiary}
        />
      </TouchableOpacity>
    </ThemedView>
  );
};

export default OfferSection;
