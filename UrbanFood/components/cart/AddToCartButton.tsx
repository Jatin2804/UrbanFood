import { Brand, Colors, Radius, Shadows } from '@/constants/theme';
import { selectCurrentUser } from '@/src/features/auth/authSlice';
import { addToCart, updateQuantity } from '@/src/features/cart/cartThunks';
import { AppDispatch } from '@/src/store';
import { RootState } from '@/src/store/rootReducer';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  dishId: string;
  dishName: string;
  dishPrice: number;
  size?: 'sm' | 'md';
}

const AddToCartButton = ({
  dishId,
  dishName,
  dishPrice,
  size = 'md',
}: Props) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectCurrentUser);
  const qty = useSelector(
    (state: RootState) =>
      state.cart.cart?.dishes.find((d) => d.dishId === dishId)?.quantity ?? 0,
  );

  const sm = size === 'sm';

  const handleAdd = () => {
    if (!user?.id) return;
    dispatch(
      addToCart({
        userId: user.id,
        dish: { dishId, name: dishName, price: dishPrice, quantity: 1 },
      }),
    );
  };

  const handleIncrease = () => {
    if (!user?.id) return;
    dispatch(updateQuantity({ userId: user.id, dishId, quantity: qty + 1 }));
  };

  const handleDecrease = () => {
    if (!user?.id) return;
    dispatch(updateQuantity({ userId: user.id, dishId, quantity: qty - 1 }));
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

const styles = StyleSheet.create({
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primary,
    borderRadius: Radius.full,
    gap: 4,
    ...Shadows.primary,
  },
  addBtnSm: { height: 30, paddingHorizontal: 12 },
  addBtnMd: { height: 40, paddingHorizontal: 20 },
  addBtnLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    overflow: 'hidden',
  },
  stepperSm: { height: 30 },
  stepperMd: { height: 40 },

  stepSide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepSideSm: { width: 30, height: 30 },
  stepSideMd: { width: 40, height: 40 },

  stepMiddle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  stepQty: {
    fontWeight: '700',
    color: Brand.primary,
    textAlign: 'center',
  },
  stepQtySm: { width: 26, fontSize: 13 },
  stepQtyMd: { width: 32, fontSize: 15 },
});
