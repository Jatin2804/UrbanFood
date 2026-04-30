import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { MENU_ITEMS } from '@/src/constants/account';
import { MenuItem } from '@/src/types/components';
import { accountStyles as styles } from '@/styles/screens/accountStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';

interface MenuListProps {
  onItemPress?: (item: MenuItem) => void;
}

const MenuList = ({ onItemPress }: MenuListProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <ThemedView variant="surface" style={styles.card}>
      {MENU_ITEMS.map((item, index) => (
        <View key={item.label}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => onItemPress?.(item)}
          >
            <View style={styles.menuLeft}>
              <View
                style={[styles.menuIconBox, { backgroundColor: item.iconBg }]}
              >
                <Ionicons name={item.icon} size={22} color={item.iconColor} />
              </View>
              <ThemedText type="defaultSemiBold">{item.label}</ThemedText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.iconMuted}
            />
          </TouchableOpacity>
          {index < MENU_ITEMS.length - 1 && (
            <View
              style={[
                styles.divider,
                { backgroundColor: theme.border, marginLeft: 60 },
              ]}
            />
          )}
        </View>
      ))}
    </ThemedView>
  );
};

export default MenuList;
