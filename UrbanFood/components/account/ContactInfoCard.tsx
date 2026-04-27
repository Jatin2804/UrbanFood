import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { User } from '@/src/features/auth/authTypes';
import { accountStyles as styles } from '@/styles/screens/accountStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useColorScheme, View } from 'react-native';

interface ContactInfoCardProps {
  user: User;
}

const ContactInfoCard = ({ user }: ContactInfoCardProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <ThemedView variant="surface" style={styles.card}>
      <View style={styles.infoRow}>
        <View style={[styles.infoIconBox, { backgroundColor: Brand.primaryFaded }]}>
          <Ionicons name="mail-outline" size={18} color={Brand.primary} />
        </View>
        <View style={styles.infoTextBox}>
          <ThemedText type="small" style={{ color: theme.textTertiary }}>
            Email
          </ThemedText>
          <ThemedText type="defaultSemiBold">{user.email}</ThemedText>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.infoRow}>
        <View style={[styles.infoIconBox, { backgroundColor: Brand.primaryFaded }]}>
          <Ionicons name="call-outline" size={18} color={Brand.primary} />
        </View>
        <View style={styles.infoTextBox}>
          <ThemedText type="small" style={{ color: theme.textTertiary }}>
            Phone
          </ThemedText>
          <ThemedText type="defaultSemiBold">{user.phone}</ThemedText>
        </View>
      </View>
    </ThemedView>
  );
};

export default ContactInfoCard;
