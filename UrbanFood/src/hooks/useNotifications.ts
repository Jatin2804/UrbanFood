import { selectCurrentUser } from '@/src/features/auth/authSlice';
import {
    configureNotificationHandler,
    requestNotificationPermissions,
} from '@/src/utils/notifications';
import { saveNotification } from '@/src/utils/notificationStorage';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

export interface NotificationData {
  notification: Notifications.Notification;
  data: Record<string, any>;
}

/**
 * Custom hook to manage notifications in the app
 * Handles permission requests, configuration, and notification listeners
 */
export function useNotifications() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [lastNotification, setLastNotification] =
    useState<NotificationData | null>(null);

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    // Configure notification handler
    configureNotificationHandler();

    // Request permissions
    requestNotificationPermissions().then((granted) => {
      setPermissionGranted(granted);
    });

    // Listener for notifications received while app is in foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const notifData = {
          notification,
          data: notification.request.content.data,
        };
        setLastNotification(notifData);

        // Save to storage with userId
        saveNotification({
          id: notification.request.identifier,
          title: notification.request.content.title || 'Notification',
          body: notification.request.content.body || '',
          data: notification.request.content.data,
          timestamp: Date.now(),
          read: false,
        }, user?.id);
      });

    // Listener for when user taps on a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        const notifData = {
          notification: response.notification,
          data,
        };
        setLastNotification(notifData);

        // Save to storage with userId
        saveNotification({
          id: response.notification.request.identifier,
          title: response.notification.request.content.title || 'Notification',
          body: response.notification.request.content.body || '',
          data: response.notification.request.content.data,
          timestamp: Date.now(),
          read: true, // Mark as read when tapped
        }, user?.id);

        // Handle notification tap here (e.g., navigate to specific screen)
        console.log('Notification tapped:', data);
      });

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [user?.id]);

  return {
    permissionGranted,
    lastNotification,
  };
}
