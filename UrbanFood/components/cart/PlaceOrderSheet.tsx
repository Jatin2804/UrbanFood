import { ThemedText } from '@/components/themed-text';
import { Brand, Colors } from '@/constants/theme';
import { PlaceOrderSheetProps } from '@/src/types/components';
import {
  PLACE_ORDER_SHEET_HEIGHT,
  placeOrderSheetStyles as styles,
} from '@/styles/components/placeOrderSheetStyles';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const PlaceOrderSheet = ({
  visible,
  slideAnim,
  onDineIn,
  onCashOnDelivery,
  onClose,
}: PlaceOrderSheetProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) slideAnim.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 60) {
          onClose();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.surface,
            height: PLACE_ORDER_SHEET_HEIGHT,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: theme.border }]} />

        {/* Title */}
        <ThemedText style={[styles.title, { color: theme.textPrimary }]}>
          How would you like to order?
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
          Choose your preferred dining option
        </ThemedText>

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          {/* Dine In */}
          <TouchableOpacity
            style={[
              styles.optionBtn,
              {
                backgroundColor: theme.surfaceSecondary,
                borderColor: theme.border,
              },
            ]}
            onPress={onDineIn}
            activeOpacity={0.8}
          >
            <View style={[styles.iconCircle, styles.dineInIconCircle]}>
              <Ionicons
                name="restaurant-outline"
                size={26}
                color={Brand.primary}
              />
            </View>
            <ThemedText
              style={[styles.optionLabel, { color: theme.textPrimary }]}
            >
              Dine In
            </ThemedText>
            <ThemedText
              style={[styles.optionSub, { color: theme.textSecondary }]}
            >
              Book a table
            </ThemedText>
          </TouchableOpacity>

          {/* Cash on Delivery */}
          <TouchableOpacity
            style={[styles.optionBtn, styles.codBtn]}
            onPress={onCashOnDelivery}
            activeOpacity={0.8}
          >
            <View style={[styles.iconCircle, styles.codIconCircle]}>
              <Ionicons name="cash-outline" size={26} color="#fff" />
            </View>
            <ThemedText style={[styles.optionLabel, { color: '#fff' }]}>
              Cash on Delivery
            </ThemedText>
            <ThemedText
              style={[styles.optionSub, { color: 'rgba(255,255,255,0.75)' }]}
            >
              Pay at your door
            </ThemedText>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default PlaceOrderSheet;
