import { ThemedText } from '@/components/themed-text';
import { Brand, Colors } from '@/constants/theme';
import { CART_OFFERS, CartOffer } from '@/src/data/cartOffers';
import { Cart } from '@/src/features/cart/cartTypes';
import { cartStyles as styles } from '@/styles/screens/cartStyles';
import React, { useRef } from 'react';
import {
    Animated,
    Modal,
    PanResponder,
    Pressable,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

interface OfferSheetProps {
  visible: boolean;
  slideAnim: Animated.Value;
  cart: Cart | null;
  applying: boolean;
  onApply: (offerId: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

const SHEET_HEIGHT = 500;

const OfferSheet = ({
  visible,
  slideAnim,
  cart,
  applying,
  onApply,
  onRemove,
  onClose,
}: OfferSheetProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) slideAnim.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80) {
          onClose();
        } else {
          Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    }),
  ).current;

  const isApplied = (offer: CartOffer) => cart?.offerId === offer.id;
  const totalPrice = cart?.totalPrice ?? 0;
  const isEligible = (offer: CartOffer) => totalPrice >= offer.minOrderValue;

  const getDiscountLabel = (offer: CartOffer) =>
    offer.discountType === 'percentage'
      ? `${offer.discountValue}% off`
      : `₹${offer.discountValue} off`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />
      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.surface,
            height: SHEET_HEIGHT,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
        <ThemedText style={[styles.sheetTitle, { color: theme.textPrimary }]}>
          Available Offers
        </ThemedText>

        <ScrollView showsVerticalScrollIndicator={false}>
          {CART_OFFERS.map((offer) => {
            const applied = isApplied(offer);
            const eligible = isEligible(offer);

            return (
              <View
                key={offer.id}
                style={[
                  styles.offerCard,
                  {
                    backgroundColor: applied
                      ? `${Brand.success}12`
                      : theme.surfaceSecondary,
                    borderColor: applied ? Brand.success : theme.border,
                  },
                ]}
              >
                {/* Title + code pill */}
                <View style={styles.offerCardHeader}>
                  <ThemedText
                    style={[styles.offerCardTitle, { color: theme.textPrimary }]}
                  >
                    {offer.title}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.offerCardCode,
                      {
                        color: Brand.primary,
                        borderColor: Brand.primaryFaded,
                        backgroundColor: Brand.primaryFaded,
                      },
                    ]}
                  >
                    {offer.code}
                  </ThemedText>
                </View>

                {/* Description */}
                <ThemedText
                  style={[styles.offerCardDesc, { color: theme.textSecondary }]}
                >
                  {offer.description}
                </ThemedText>

                {/* Min order note */}
                {offer.minOrderValue > 0 && (
                  <ThemedText
                    style={[
                      styles.offerCardMin,
                      {
                        color: eligible ? Brand.success : theme.textTertiary,
                      },
                    ]}
                  >
                    {eligible
                      ? `✓ Eligible — saves ${getDiscountLabel(offer)}`
                      : `Min. order ₹${offer.minOrderValue} required`}
                  </ThemedText>
                )}

                {/* Apply / Remove button */}
                {applied ? (
                  <TouchableOpacity
                    style={[
                      styles.removeBtn,
                      { borderColor: Brand.error },
                    ]}
                    onPress={onRemove}
                    disabled={applying}
                    activeOpacity={0.8}
                  >
                    <ThemedText
                      style={[styles.removeBtnText, { color: Brand.error }]}
                    >
                      Remove
                    </ThemedText>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.applyBtn,
                      {
                        backgroundColor: eligible
                          ? Brand.primary
                          : theme.border,
                      },
                    ]}
                    onPress={() => eligible && onApply(offer.id)}
                    disabled={!eligible || applying}
                    activeOpacity={0.8}
                  >
                    <ThemedText
                      style={[
                        styles.applyBtnText,
                        { color: eligible ? '#fff' : theme.textTertiary },
                      ]}
                    >
                      {applying ? 'Applying...' : 'Apply'}
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

export default OfferSheet;
