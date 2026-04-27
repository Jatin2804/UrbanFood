import { ThemedText } from '@/components/themed-text';
import { Brand, Colors } from '@/constants/theme';
import { accountStyles as styles } from '@/styles/screens/accountStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';

interface LogoutButtonProps {
  onPress: () => void;
}

const LogoutButton = ({ onPress }: LogoutButtonProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <TouchableOpacity
      style={[
        styles.logoutButton,
        { borderColor: Brand.error, backgroundColor: theme.surface },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="log-out-outline" size={22} color={Brand.error} />
      <ThemedText
        lightColor={Brand.error}
        darkColor={Brand.error}
        style={styles.logoutText}
      >
        Logout
      </ThemedText>
    </TouchableOpacity>
  );
};

export default LogoutButton;
