import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_KEY_PREFIX = '@notifications_history_';

export interface StoredNotification {
  id: string;
  title: string;
  body: string;
  data: any;
  timestamp: number;
  read: boolean;
}

/**
 * Get the storage key for a specific user
 */
function getStorageKey(userId?: string): string {
  if (!userId) {
    return `${NOTIFICATIONS_KEY_PREFIX}guest`;
  }
  return `${NOTIFICATIONS_KEY_PREFIX}${userId}`;
}

/**
 * Save a notification to storage
 */
export async function saveNotification(
  notification: StoredNotification,
  userId?: string,
): Promise<void> {
  try {
    const key = getStorageKey(userId);
    const existing = await getNotifications(userId);
    const updated = [notification, ...existing].slice(0, 50); // Keep last 50
    await AsyncStorage.setItem(key, JSON.stringify(updated));
  } catch (error) {
    // Save failed
  }
}

/**
 * Get all notifications from storage
 */
export async function getNotifications(
  userId?: string,
): Promise<StoredNotification[]> {
  try {
    const key = getStorageKey(userId);
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(
  id: string,
  userId?: string,
): Promise<void> {
  try {
    const key = getStorageKey(userId);
    const notifications = await getNotifications(userId);
    const updated = notifications.map((notif) =>
      notif.id === id ? { ...notif, read: true } : notif,
    );
    await AsyncStorage.setItem(key, JSON.stringify(updated));
  } catch (error) {
    // Mark as read failed
  }
}

/**
 * Clear all notifications
 */
export async function clearAllNotifications(userId?: string): Promise<void> {
  try {
    const key = getStorageKey(userId);
    await AsyncStorage.removeItem(key);
  } catch (error) {
    // Clear failed
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId?: string): Promise<number> {
  try {
    const notifications = await getNotifications(userId);
    return notifications.filter((n) => !n.read).length;
  } catch (error) {
    return 0;
  }
}
