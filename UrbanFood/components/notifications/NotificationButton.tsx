import { NotificationButtonProps } from '@/src/types/components';
import { showNotification } from '@/src/utils/notifications';
import { notificationButtonStyles } from '@/styles/components/notificationButtonStyles';
import { Text, TouchableOpacity } from 'react-native';

/**
 * Reusable button component that triggers a notification
 * Can be used anywhere in the app to send notifications
 */
export function NotificationButton({
  title,
  body,
  data,
  buttonText = 'Send Notification',
  onPress,
  style,
  textStyle,
}: NotificationButtonProps) {
  const handlePress = async () => {
    try {
      await showNotification(title, body, data);
      onPress?.();
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  return (
    <TouchableOpacity
      style={[notificationButtonStyles.button, style]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={[notificationButtonStyles.text, textStyle]}>
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
}
