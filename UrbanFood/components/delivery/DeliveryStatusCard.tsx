import { ThemedText } from '@/components/themed-text';
import { Brand, Colors } from '@/constants/theme';
import {
    DELIVERY_STATUSES,
    STATUS_THRESHOLDS
} from '@/src/constants/delivery';
import { DeliveryStatusCardProps } from '@/src/types/components';
import { deliveryStatusCardStyles as styles } from '@/styles/components/deliveryStatusCardStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';

const DeliveryStatusCard = ({
  status,
  eta,
  partnerName,
  partnerVehicle,
  onRecenter,
}: DeliveryStatusCardProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const currentIndex = DELIVERY_STATUSES.indexOf(status);
  const progress = STATUS_THRESHOLDS[status];
  const isDelivered = status === 'Delivered';

  const etaLabel =
    isDelivered
      ? 'Delivered!'
      : eta <= 1
      ? 'Arriving now'
      : `${eta} min away`;

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }]}>
      {/* Handle */}
      <View style={[styles.handle, { backgroundColor: theme.border }]} />

      {/* Status */}
      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isDelivered ? Brand.success : Brand.primary },
          ]}
        />
        <ThemedText style={[styles.statusText, { color: theme.textPrimary }]}>
          {status}
        </ThemedText>
      </View>

      <ThemedText style={[styles.etaText, { color: theme.textSecondary }]}>
        {etaLabel}
      </ThemedText>

      {/* Progress bar */}
      <View style={[styles.progressTrack, { backgroundColor: theme.surfaceSecondary }]}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Step dots */}
      <View style={styles.stepsRow}>
        {DELIVERY_STATUSES.map((s, i) => {
          const done = i <= currentIndex;
          return (
            <View key={s} style={styles.stepItem}>
              <View
                style={[
                  styles.stepDot,
                  {
                    backgroundColor: done ? Brand.success : theme.border,
                  },
                ]}
              />
              <ThemedText
                style={[
                  styles.stepLabel,
                  { color: done ? Brand.success : theme.textTertiary },
                ]}
              >
                {s}
              </ThemedText>
            </View>
          );
        })}
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Partner row */}
      <View style={styles.partnerRow}>
        <View style={styles.partnerAvatar}>
          <Ionicons name="bicycle" size={22} color="#fff" />
        </View>
        <View style={styles.partnerInfo}>
          <ThemedText style={[styles.partnerName, { color: theme.textPrimary }]}>
            {partnerName}
          </ThemedText>
          <ThemedText style={[styles.partnerVehicle, { color: theme.textSecondary }]}>
            {partnerVehicle}
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[styles.callBtn, { borderColor: Brand.success }]}
          onPress={onRecenter}
          activeOpacity={0.8}
        >
          <Ionicons name="navigate" size={18} color={Brand.success} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeliveryStatusCard;
