import ContactInfoCard from '@/components/account/ContactInfoCard';
import LogoutButton from '@/components/account/LogoutButton';
import MenuList from '@/components/account/MenuList';
import ProfileHeader from '@/components/account/ProfileHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand } from '@/constants/theme';
import { APP_VERSION } from '@/src/constants/account';
import { useAuth } from '@/src/hooks/useAuth';
import { accountStyles as styles } from '@/styles/screens/accountStyles';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';

const Account = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleMenuPress = (item: { label: string }) => {
    if (item.label === 'My Orders') {
      router.push('/orders');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
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
          Version {APP_VERSION}
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
};

export default Account;
