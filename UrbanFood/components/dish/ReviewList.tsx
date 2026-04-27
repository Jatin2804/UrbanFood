import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors, Spacing } from '@/constants/theme';
import { Feedback } from '@/src/features/dishes/dishesType';
import { dishDetailStyles as styles } from '@/styles/screens/dishDetailStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useColorScheme, View } from 'react-native';

interface ReviewListProps {
  feedback: Feedback[];
}

const ReviewList = ({ feedback }: ReviewListProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  if (feedback.length === 0) return null;

  return (
    <ThemedView variant="surface" style={styles.reviewsCard}>
      <ThemedText type="defaultSemiBold" style={{ marginBottom: Spacing.sm }}>
        Reviews ({feedback.length})
      </ThemedText>

      {feedback.map((fb, i) => (
        <View key={i}>
          <View style={styles.reviewRow}>
            <View style={[styles.reviewAvatar, { backgroundColor: Brand.primaryFaded }]}>
              <ThemedText
                lightColor={Brand.primary}
                darkColor={Brand.primary}
                style={styles.reviewAvatarText}
              >
                {fb.userId.slice(-2).toUpperCase()}
              </ThemedText>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.reviewHeader}>
                <ThemedText type="small" style={{ fontWeight: '600' }}>
                  {fb.userId}
                </ThemedText>
                <View style={styles.reviewRating}>
                  <Ionicons name="star" size={11} color="#FFB800" />
                  <ThemedText
                    type="small"
                    style={{ color: '#E65100', fontWeight: '600' }}
                  >
                    {fb.rating}
                  </ThemedText>
                </View>
              </View>
              <ThemedText
                type="caption"
                style={{ color: theme.textSecondary, marginTop: 2 }}
              >
                {fb.comment}
              </ThemedText>
            </View>
          </View>
          {i < feedback.length - 1 && (
            <View
              style={[styles.reviewDivider, { backgroundColor: theme.border }]}
            />
          )}
        </View>
      ))}
    </ThemedView>
  );
};

export default ReviewList;
