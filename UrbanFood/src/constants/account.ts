import { Brand } from '@/constants/theme';
import { MenuItem } from '../types/components';

export const MENU_ITEMS: MenuItem[] = [
  {
    icon: 'receipt-outline',
    labelKey: 'account.myOrders',
    iconBg: Brand.primaryFaded,
    iconColor: Brand.primary,
  },
  {
    icon: 'restaurant-outline',
    labelKey: 'account.dineIn',
    iconBg: '#FFE8DF',
    iconColor: '#FF6B35',
  },
  {
    icon: 'heart-outline',
    labelKey: 'account.favourites',
    iconBg: '#FFF4E5',
    iconColor: Brand.warning,
  },
  {
    icon: 'location-outline',
    labelKey: 'account.addresses',
    iconBg: '#E5F4FF',
    iconColor: Brand.info,
  },
  {
    icon: 'settings-outline',
    labelKey: 'account.settings',
    iconBg: '#F0E5FF',
    iconColor: '#8B5CF6',
  },
  {
    icon: 'help-circle-outline',
    labelKey: 'account.helpAndSupport',
    iconBg: '#E5FFE5',
    iconColor: Brand.success,
  },
];

export const APP_VERSION = '1.0.0';
