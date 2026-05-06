import { ThemedText } from '@/components/themed-text';
import { Brand, Colors } from '@/constants/theme';
import { useTranslation } from '@/src/hooks/useTranslation';
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
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={[
        styles.logoutButton,
        { borderColor: Brand.error, backgroundColor: Brand.primary },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="log-out-outline" size={22} color={'white'} />
      <ThemedText
        lightColor={'white'}
        darkColor={'white'}
        style={styles.logoutText}
      >
        {t('account.logout')}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default LogoutButton;
