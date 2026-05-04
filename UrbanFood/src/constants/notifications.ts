/**
 * Notification constants and templates for the UrbanFood app
 * Use these predefined templates for consistent notification messaging
 */

export const NOTIFICATION_TYPES = {
  ORDER_CONFIRMED: 'order_confirmed',
  ORDER_PREPARING: 'order_preparing',
  ORDER_READY: 'order_ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  NEARBY: 'nearby',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  REFUND_PROCESSED: 'refund_processed',
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_CANCELLED: 'booking_cancelled',
  BOOKING_REMINDER: 'booking_reminder',
  PROMOTION: 'promotion',
  NEW_RESTAURANT: 'new_restaurant',
  ABANDONED_CART: 'abandoned_cart',
  REVIEW_REQUEST: 'review_request',
  LOYALTY_POINTS: 'loyalty_points',
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

/**
 * Predefined notification templates
 * Use these for consistent messaging across the app
 */
export const NOTIFICATION_TEMPLATES = {
  orderConfirmed: (orderId: string) => ({
    title: 'Order Confirmed! 🎉',
    body: `Your order #${orderId} has been placed successfully. We're preparing it now!`,
    data: { orderId, type: NOTIFICATION_TYPES.ORDER_CONFIRMED },
  }),

  orderPreparing: (orderId: string) => ({
    title: 'Preparing Your Order 👨‍🍳',
    body: 'The restaurant is preparing your delicious meal',
    data: { orderId, type: NOTIFICATION_TYPES.ORDER_PREPARING },
  }),

  orderReady: (orderId: string) => ({
    title: 'Order Ready! 🍽️',
    body: 'Your order is ready for pickup at the restaurant',
    data: { orderId, type: NOTIFICATION_TYPES.ORDER_READY },
  }),

  outForDelivery: (orderId: string, driverName?: string) => ({
    title: 'Out for Delivery 🚚',
    body: driverName
      ? `${driverName} is on the way with your order`
      : 'Your order is on the way!',
    data: {
      orderId,
      driverName,
      type: NOTIFICATION_TYPES.OUT_FOR_DELIVERY,
    },
  }),

  nearby: (orderId: string, minutes: number = 2) => ({
    title: 'Almost There! 📍',
    body: `Your delivery partner is ${minutes} minute${minutes > 1 ? 's' : ''} away`,
    data: { orderId, minutes, type: NOTIFICATION_TYPES.NEARBY },
  }),

  delivered: (orderId: string) => ({
    title: 'Delivered! ',
    body: 'Your order has been delivered. Enjoy your meal!',
    data: { orderId, type: NOTIFICATION_TYPES.DELIVERED },
  }),

  cancelled: (orderId: string, reason?: string) => ({
    title: 'Order Cancelled',
    body: reason || 'Your order has been cancelled',
    data: { orderId, reason, type: NOTIFICATION_TYPES.CANCELLED },
  }),

  paymentSuccess: (orderId: string, amount: number) => ({
    title: 'Payment Successful! 💳',
    body: `₹${amount} paid successfully`,
    data: { orderId, amount, type: NOTIFICATION_TYPES.PAYMENT_SUCCESS },
  }),

  paymentFailed: (orderId: string) => ({
    title: 'Payment Failed',
    body: 'Your payment could not be processed. Please try again.',
    data: { orderId, type: NOTIFICATION_TYPES.PAYMENT_FAILED },
  }),

  refundProcessed: (orderId: string, amount: number) => ({
    title: 'Refund Processed 💰',
    body: `₹${amount} has been refunded to your account`,
    data: { orderId, amount, type: NOTIFICATION_TYPES.REFUND_PROCESSED },
  }),

  bookingConfirmed: (bookingId: string, tableNumber: number, time: string) => ({
    title: 'Table Reserved! 🪑',
    body: `Your table #${tableNumber} is confirmed for ${time}`,
    data: {
      bookingId,
      tableNumber,
      time,
      type: NOTIFICATION_TYPES.BOOKING_CONFIRMED,
    },
  }),

  bookingCancelled: (bookingId: string, tableNumber: number) => ({
    title: 'Booking Cancelled',
    body: `Your reservation for table #${tableNumber} has been cancelled`,
    data: {
      bookingId,
      tableNumber,
      type: NOTIFICATION_TYPES.BOOKING_CANCELLED,
    },
  }),

  bookingReminder: (bookingId: string, time: string, hours: number = 1) => ({
    title: 'Reminder: Table Booking 📅',
    body: `Your table reservation is in ${hours} hour${hours > 1 ? 's' : ''} at ${time}`,
    data: { bookingId, time, type: NOTIFICATION_TYPES.BOOKING_REMINDER },
  }),

  promotion: (discount: number, code?: string) => ({
    title: 'Special Offer! 🎁',
    body: code
      ? `Get ${discount}% off on your next order. Use code: ${code}`
      : `Get ${discount}% off on your next order`,
    data: { discount, code, type: NOTIFICATION_TYPES.PROMOTION },
  }),

  flashSale: (category: string, discount: number) => ({
    title: 'Flash Sale! ⚡',
    body: `Limited time offer: ${discount}% off on all ${category}`,
    data: { category, discount, type: NOTIFICATION_TYPES.PROMOTION },
  }),

  newRestaurant: (restaurantName: string, cuisine: string) => ({
    title: 'New Restaurant! 🆕',
    body: `Check out ${restaurantName} - ${cuisine} cuisine now available`,
    data: {
      restaurantName,
      cuisine,
      type: NOTIFICATION_TYPES.NEW_RESTAURANT,
    },
  }),

  abandonedCart: (itemCount: number) => ({
    title: "Don't Forget! 🛒",
    body: `You have ${itemCount} item${itemCount > 1 ? 's' : ''} in your cart. Complete your order now!`,
    data: { itemCount, type: NOTIFICATION_TYPES.ABANDONED_CART },
  }),

  reviewRequest: (orderId: string) => ({
    title: 'Rate Your Order ⭐',
    body: 'How was your experience? Share your feedback',
    data: { orderId, type: NOTIFICATION_TYPES.REVIEW_REQUEST },
  }),

  loyaltyPoints: (pointsEarned: number, totalPoints: number) => ({
    title: 'Points Earned! 🎯',
    body: `You earned ${pointsEarned} points on your last order. Total: ${totalPoints}`,
    data: {
      pointsEarned,
      totalPoints,
      type: NOTIFICATION_TYPES.LOYALTY_POINTS,
    },
  }),
};

/**
 * Helper function to get notification template
 * @param templateName - Name of the template
 * @param params - Parameters for the template
 */
export function getNotificationTemplate(
  templateName: keyof typeof NOTIFICATION_TEMPLATES,
  ...params: any[]
): { title: string; body: string; data: Record<string, any> } {
  const template = NOTIFICATION_TEMPLATES[templateName];
  if (!template) {
    throw new Error(`Notification template "${templateName}" not found`);
  }
  return template(...params);
}
