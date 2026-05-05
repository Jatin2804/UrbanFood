import ContactInfoCard from '@/components/account/ContactInfoCard';
import LogoutButton from '@/components/account/LogoutButton';
import MenuList from '@/components/account/MenuList';
import ProfileHeader from '@/components/account/ProfileHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand } from '@/constants/theme';
import { APP_VERSION } from '@/src/constants/account';
import { useAuth } from '@/src/hooks/useAuth';
import { useTranslation } from '@/src/hooks/useTranslation';
import { accountStyles as styles } from '@/styles/screens/accountStyles';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';

const Account = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handleMenuPress = (item: { labelKey: string }) => {
    if (item.labelKey === 'account.myOrders') {
      router.push('/orders');
    } else if (item.labelKey === 'account.dineIn') {
      router.push('/dine-in');
    } else if (item.labelKey === 'account.settings') {
      router.push('/settings');
    }
  };

  const handleLogout = () => {
    Alert.alert(t('account.logout'), t('account.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('account.logout'),
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/Login');
        },
      },
    ]);
  };

  if (!user) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Brand.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHeader user={user} />
        <ContactInfoCard user={user} />
        <MenuList onItemPress={handleMenuPress} />
        <LogoutButton onPress={handleLogout} />
        <ThemedText type="small" style={styles.version}>
          {t('account.version')} {APP_VERSION}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
};

export default Account;
