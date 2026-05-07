import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { User } from '@/src/features/auth/authTypes';
import { accountStyles as styles } from '@/styles/screens/accountStyles';
import React from 'react';
import { Image, View } from 'react-native';

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
      {user.image ? (
        <Image
          source={{ uri: user.image }}
          style={{ width: '100%', height: '100%', borderRadius: 44 }}
        />
      ) : (
        <ThemedText
          lightColor="#fff"
          darkColor="#fff"
          style={styles.avatarText}
        >
          {getInitials(user.name)}
        </ThemedText>
      )}
    </View>
    <ThemedText
      type="subtitle"
      lightColor="#fff"
      darkColor="#fff"
      style={styles.userName}
    >
      {user.name}
    </ThemedText>
    <ThemedText type="small" lightColor="#fff" darkColor="#fff">
      {user.email}
    </ThemedText>
  </ThemedView>
);

export default ProfileHeader;
