import StarRating from '@/components/common/StarRating';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { User } from '@/src/features/auth/authTypes';
import { Feedback } from '@/src/features/dishes/dishesType';
import { fetchUsersAPI } from '@/src/services/apiService';
import { dishDetailStyles as styles } from '@/styles/screens/dishDetailStyles';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, View } from 'react-native';

interface ReviewListProps {
  feedback: Feedback[];
}

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const ReviewList = ({ feedback }: ReviewListProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const [usersById, setUsersById] = useState<Record<string, User>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const users = await fetchUsersAPI();
        if (cancelled) return;
        const map: Record<string, User> = {};
        for (const u of users) map[u.id] = u;
        setUsersById(map);
      } catch {
        if (!cancelled) setUsersById({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const resolvedFeedback = useMemo(() => {
    return feedback.map((fb) => {
      const user = usersById[fb.userId];
      return {
        ...fb,
        _user: user,
        _displayName: user?.name ?? fb.userId,
        _avatarText: user?.name
          ? getInitials(user.name)
          : fb.userId.slice(-2).toUpperCase(),
        _avatarUrl: user?.image,
      };
    });
  }, [feedback, usersById]);

  if (feedback.length === 0) return null;

  return (
    <ThemedView variant="surface" style={styles.reviewsCard}>
      <ThemedText type="defaultSemiBold" style={{ marginBottom: Spacing.sm }}>
        Reviews ({feedback.length})
      </ThemedText>

      {resolvedFeedback.map((fb, i) => (
        <View key={`${fb.userId}_${i}`}>
          <View style={styles.reviewRow}>
            <View
              style={[
                styles.reviewAvatar,
                { backgroundColor: Brand.primaryFaded },
              ]}
            >
              {fb._avatarUrl ? (
                <Image
                  source={{ uri: fb._avatarUrl }}
                  style={{ width: '100%', height: '100%', borderRadius: 18 }}
                />
              ) : (
                <ThemedText
                  lightColor={Brand.primary}
                  darkColor={Brand.primary}
                  style={styles.reviewAvatarText}
                >
                  {fb._avatarText}
                </ThemedText>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.reviewHeader}>
                <ThemedText type="small" style={{ fontWeight: '600' }}>
                  {fb._displayName}
                </ThemedText>
                <View style={styles.reviewRating}>
                  <StarRating rating={fb.rating} size={12} />
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
          {i < resolvedFeedback.length - 1 && (
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
