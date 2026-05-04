import { showNotification } from '@/src/utils/notifications';
import { notificationTestStyles } from '@/styles/screens/notificationTestStyles';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationTest() {
  const handleTestNotification = async () => {
    try {
      await showNotification(
        'Test Notification',
        'This is a test notification from UrbanFood!',
      );
    } catch (error) {
      // Notification failed
    }
  };

  const handleOrderNotification = async () => {
    try {
      await showNotification(
        'Order Confirmed! 🎉',
        'Your order #1234 has been confirmed and will be delivered in 30 minutes.',
        { orderId: '1234', type: 'order_confirmed' },
      );
    } catch (error) {
      // Notification failed
    }
  };

  const handleDeliveryNotification = async () => {
    try {
      await showNotification(
        'Out for Delivery 🚚',
        'Your order is on the way! Track your delivery in real-time.',
        { orderId: '1234', type: 'out_for_delivery' },
      );
    } catch (error) {
      // Notification failed
    }
  };

  const handlePromoNotification = async () => {
    try {
      await showNotification(
        'Special Offer! 🎁',
        'Get 20% off on your next order. Use code: URBAN20',
        { type: 'promotion', code: 'URBAN20' },
      );
    } catch (error) {
      // Notification failed
    }
  };

  const handleBookingConfirmedNotification = async () => {
    try {
      const notificationContent = NOTIFICATION_TEMPLATES.bookingConfirmed(
        'booking_test_123',
        5,
        '2:30 PM',
      );

      const notificationId = await showNotification(
        notificationContent.title,
        notificationContent.body,
        notificationContent.data,
      );

      // Also save to history for testing
      await saveNotification(
        {
          id: notificationId,
          title: notificationContent.title,
          body: notificationContent.body,
          data: notificationContent.data,
          timestamp: Date.now(),
          read: false,
        },
        'test_user',
      );
    } catch (error) {
      // Notification failed
    }
  };

  const handleBookingCancelledNotification = async () => {
    try {
      const notificationContent = NOTIFICATION_TEMPLATES.bookingCancelled(
        'booking_test_456',
        7,
      );

      const notificationId = await showNotification(
        notificationContent.title,
        notificationContent.body,
        notificationContent.data,
      );

      // Also save to history for testing
      await saveNotification(
        {
          id: notificationId,
          title: notificationContent.title,
          body: notificationContent.body,
          data: notificationContent.data,
          timestamp: Date.now(),
          read: false,
        },
        'test_user',
      );
    } catch (error) {
      // Notification failed
    }
  };

  return (
    <ScrollView style={notificationTestStyles.container}>
      <View style={notificationTestStyles.content}>
        <Text style={notificationTestStyles.title}>
          Notification Test Screen
        </Text>
        <Text style={notificationTestStyles.description}>
          Test different types of notifications in your app
        </Text>

        <TouchableOpacity
          style={notificationTestStyles.button}
          onPress={handleTestNotification}
        >
          <Text style={notificationTestStyles.buttonText}>
            Send Test Notification
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={notificationTestStyles.button}
          onPress={handleOrderNotification}
        >
          <Text style={notificationTestStyles.buttonText}>
            Order Confirmed Notification
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={notificationTestStyles.button}
          onPress={handleDeliveryNotification}
        >
          <Text style={notificationTestStyles.buttonText}>
            Delivery Notification
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={notificationTestStyles.button}
          onPress={handlePromoNotification}
        >
          <Text style={notificationTestStyles.buttonText}>
            Promo Notification
          </Text>
        </TouchableOpacity>

        <View style={notificationTestStyles.infoBox}>
          <Text style={notificationTestStyles.infoTitle}>ℹ️ How to Test:</Text>
          <Text style={notificationTestStyles.infoText}>
            1. Tap any button above to trigger a notification
          </Text>
          <Text style={notificationTestStyles.infoText}>
            2. If app is in foreground, notification will appear as banner
          </Text>
          <Text style={notificationTestStyles.infoText}>
            3. Press home button and tap again to see notification in tray
          </Text>
          <Text style={notificationTestStyles.infoText}>
            4. Tap notification to open app with data payload
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
