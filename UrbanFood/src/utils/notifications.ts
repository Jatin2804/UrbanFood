import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Request notification permissions from the user
 * @returns Promise<boolean> - true if permission granted, false otherwise
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('❌ Push notification permissions denied');
    return false;
  }

  // Android-specific: Create notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      enableVibrate: true,
      showBadge: true,
    });
  }

  return true;
}

/**
 * Configure how notifications are handled when the app is in the foreground
 */
export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

/**
 * Show a local notification
 * @param title - Notification title
 * @param body - Notification body text
 * @param data - Optional data payload
 * @returns Promise<string> - Notification identifier
 */
export async function showNotification(
  title: string,
  body: string,
  data?: Record<string, any>,
): Promise<string> {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true, // Use default system sound
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Show immediately
    });

    return notificationId;
  } catch (error) {
    console.error('❌ Error showing notification:', error);
    throw error;
  }
}

/**
 * Cancel a specific notification
 * @param notificationId - The notification identifier to cancel
 */
export async function cancelNotification(
  notificationId: string,
): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get the notification badge count (iOS only)
 */
export async function getBadgeCount(): Promise<number> {
  return await Notifications.getBadgeCountAsync();
}

/**
 * Set the notification badge count (iOS only)
 * @param count - Badge count to set
 */
export async function setBadgeCount(count: number): Promise<void> {
  await Notifications.setBadgeCountAsync(count);
}
