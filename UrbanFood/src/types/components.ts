import { Ionicons } from '@expo/vector-icons';

export interface StatItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}

export interface AddToCartButtonProps {
  dishId: string;
  dishName: string;
  dishPrice: number;
  size?: 'sm' | 'md';
}

export interface DishCardProps {
  dish: import('../features/dishes/dishesType').Dish;
}

export interface CartRowProps {
  dish: import('../features/cart/cartTypes').CartDish;
  imageUrl?: string;
  onRemove: () => void;
  onPress: () => void;
}

export interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  iconBg: string;
  iconColor: string;
}

// ── PlaceOrderSheet ───────────────────────────────────────────────────────────
import { Animated } from 'react-native';

export interface PlaceOrderSheetProps {
  visible: boolean;
  slideAnim: Animated.Value;
  onDineIn: () => void;
  onCashOnDelivery: () => void;
  onClose: () => void;
}

// ── DeliveryStatusCard ────────────────────────────────────────────────────────
import type { DeliveryStatus } from '../constants/delivery';

export interface DeliveryStatusCardProps {
  status: DeliveryStatus;
  eta: number; // minutes remaining
  partnerName: string;
  partnerVehicle: string;
  onRecenter: () => void;
}
