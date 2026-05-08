import NotificationCardSkeleton from '@/components/notifications/NotificationCardSkeleton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/src/hooks/useAuth';
import {
  clearAllNotifications,
  getNotifications,
  markNotificationAsRead,
  StoredNotification,
} from '@/src/utils/notificationStorage';
import { notificationsScreenStyles as styles } from '@/styles/screens/notificationsScreenStyles';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    const stored = await getNotifications(user?.id);
    setNotifications(stored);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [user?.id]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id, user?.id);
    await loadNotifications();
  };

  const handleClearAll = async () => {
    await clearAllNotifications(user?.id);
    setNotifications([]);
  };

  const getNotificationIcon = (title: string) => {
    if (title.includes('Order') || title.includes('order')) {
      return 'receipt-outline';
    } else if (title.includes('Delivery') || title.includes('delivery')) {
      return 'bicycle-outline';
    } else if (title.includes('Payment') || title.includes('payment')) {
      return 'card-outline';
    } else if (title.includes('Offer') || title.includes('Special')) {
      return 'gift-outline';
    }
    return 'notifications-outline';
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Notifications</ThemedText>
          {notifications.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAll}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.clearText}>Clear All</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, index) => (
                <NotificationCardSkeleton key={`skeleton-${index}`} />
              ))
          ) : notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <View
                style={[
                  styles.emptyIconContainer,
                  { backgroundColor: theme.surfaceSecondary },
                ]}
              >
                <Ionicons
                  name="notifications-off-outline"
                  size={64}
                  color={theme.textTertiary}
                />
              </View>
              <ThemedText style={styles.emptyTitle}>
                No Notifications Yet
              </ThemedText>
              <ThemedText style={styles.emptySubtitle}>
                When you receive notifications, they'll appear here
              </ThemedText>
            </View>
          ) : (
            notifications.map((notif) => (
              <TouchableOpacity
                key={notif.id}
                style={[
                  styles.notificationCard,
                  {
                    backgroundColor: notif.read
                      ? theme.background
                      : theme.surface,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => handleMarkAsRead(notif.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: theme.surfaceSecondary },
                  ]}
                >
                  <Ionicons
                    name={getNotificationIcon(notif.title) as any}
                    size={24}
                    color={theme.textPrimary}
                  />
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <ThemedText style={styles.notificationTitle}>
                      {notif.title}
                    </ThemedText>
                    {!notif.read && <View style={styles.unreadDot} />}
                  </View>
                  <ThemedText style={styles.notificationBody}>
                    {notif.body}
                  </ThemedText>
                  <ThemedText style={styles.notificationTime}>
                    {formatTime(notif.timestamp)}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
