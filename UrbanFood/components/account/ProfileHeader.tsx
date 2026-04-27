import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { User } from '@/src/features/auth/authTypes';
import { accountStyles as styles } from '@/styles/screens/accountStyles';
import React from 'react';
import { View } from 'react-native';

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => (
  <ThemedView variant="surface" style={styles.header}>
    <View style={styles.avatar}>
      <ThemedText lightColor="#fff" darkColor="#fff" style={styles.avatarText}>
        {getInitials(user.name)}
      </ThemedText>
    </View>
    <ThemedText type="subtitle" style={styles.userName}>
      {user.name}
    </ThemedText>
    <ThemedText type="caption">{user.email}</ThemedText>
  </ThemedView>
);

export default ProfileHeader;
