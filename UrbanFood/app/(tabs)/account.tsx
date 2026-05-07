import ContactInfoCard from '@/components/account/ContactInfoCard';
import LogoutButton from '@/components/account/LogoutButton';
import MenuList from '@/components/account/MenuList';
import ProfileHeader from '@/components/account/ProfileHeader';
import { ProfileHeaderSkeleton } from '@/components/common/ProfileHeaderSkeleton';
import { SkeletonLoader } from '@/components/common/SkeletonLoader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { APP_VERSION } from '@/src/constants/account';
import { ROUTES } from '@/src/constants/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { useTranslation } from '@/src/hooks/useTranslation';
import { accountStyles as styles } from '@/styles/screens/accountStyles';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';

const Account = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const handleMenuPress = (item: { labelKey: string }) => {
    if (item.labelKey === 'account.myOrders') {
      router.push(ROUTES.ORDERS);
    } else if (item.labelKey === 'account.dineIn') {
      router.push(ROUTES.DINE_IN);
    } else if (item.labelKey === 'account.settings') {
      router.push(ROUTES.SETTINGS);
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
          router.replace(ROUTES.LOGIN);
        },
      },
    ]);
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ProfileHeaderSkeleton />
          <View style={{ padding: Spacing.md, gap: Spacing.md }}>
            <SkeletonLoader width="100%" height={100} borderRadius={12} />
            <SkeletonLoader width="100%" height={200} borderRadius={12} />
            <SkeletonLoader width="100%" height={50} borderRadius={25} />
          </View>
        </ScrollView>
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
