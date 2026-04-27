import { Brand } from '@/constants/theme';
import { MenuItem } from '../types/components';

export const MENU_ITEMS: MenuItem[] = [
  {
    icon: 'receipt-outline',
    label: 'My Orders',
    iconBg: Brand.primaryFaded,
    iconColor: Brand.primary,
  },
  {
    icon: 'heart-outline',
    label: 'Favourites',
    iconBg: '#FFF4E5',
    iconColor: Brand.warning,
  },
  {
    icon: 'location-outline',
    label: 'Addresses',
    iconBg: '#E5F4FF',
    iconColor: Brand.info,
  },
  {
    icon: 'settings-outline',
    label: 'Settings',
    iconBg: '#F0E5FF',
    iconColor: '#8B5CF6',
  },
  {
    icon: 'help-circle-outline',
    label: 'Help & Support',
    iconBg: '#E5FFE5',
    iconColor: Brand.success,
  },
];

export const APP_VERSION = '1.0.0';
