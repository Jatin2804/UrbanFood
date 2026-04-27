import { Brand, Colors } from '@/constants/theme';
import { useCart } from '@/src/hooks/useCart';
import { AddToCartButtonProps } from '@/src/types/components';
import { addToCartStyles as styles } from '@/styles/components/addToCartStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, useColorScheme, View } from 'react-native';

const AddToCartButton = ({
  dishId,
  dishName,
  dishPrice,
  size = 'md',
}: AddToCartButtonProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const { getItemQuantity, handleAddToCart, handleUpdateQuantity } = useCart();

  const qty = getItemQuantity(dishId);
  const sm = size === 'sm';

  const handleAdd = () => {
    handleAddToCart({ dishId, name: dishName, price: dishPrice, quantity: 1 });
  };

  const handleIncrease = () => {
    handleUpdateQuantity(dishId, qty + 1);
  };

  const handleDecrease = () => {
    handleUpdateQuantity(dishId, qty - 1);
  };

  if (qty === 0) {
    return (
      <TouchableOpacity
        style={[styles.addBtn, sm ? styles.addBtnSm : styles.addBtnMd]}
        onPress={handleAdd}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={sm ? 14 : 16} color="#fff" />
        {!sm && <Text style={styles.addBtnLabel}>Add</Text>}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.stepper,
        sm ? styles.stepperSm : styles.stepperMd,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}
    >
      <TouchableOpacity
        style={[styles.stepSide, sm ? styles.stepSideSm : styles.stepSideMd]}
        onPress={handleDecrease}
        activeOpacity={0.7}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <Ionicons
          name={qty === 1 ? 'trash-outline' : 'remove'}
          size={sm ? 13 : 15}
          color={qty === 1 ? Brand.error : Brand.primary}
        />
      </TouchableOpacity>

      <View style={[styles.stepMiddle, { borderColor: theme.border }]}>
        <Text
          style={[styles.stepQty, sm ? styles.stepQtySm : styles.stepQtyMd]}
        >
          {qty}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.stepSide, sm ? styles.stepSideSm : styles.stepSideMd]}
        onPress={handleIncrease}
        activeOpacity={0.7}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      >
        <Ionicons name="add" size={sm ? 13 : 15} color={Brand.primary} />
      </TouchableOpacity>
    </View>
  );
};

export default AddToCartButton;
