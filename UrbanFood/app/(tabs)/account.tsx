import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { selectCurrentUser } from '@/src/features/auth/authSlice';
import { checkAuthStatus, logoutUser } from '@/src/features/auth/authThunks';
import { AppDispatch } from '@/src/store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  iconBg: string;
  iconColor: string;
};

const MENU_ITEMS: MenuItem[] = [
  { icon: 'receipt-outline',     label: 'My Orders',      iconBg: Brand.primaryFaded, iconColor: Brand.primary  },
  { icon: 'heart-outline',       label: 'Favourites',     iconBg: '#FFF4E5',          iconColor: Brand.warning  },
  { icon: 'location-outline',    label: 'Addresses',      iconBg: '#E5F4FF',          iconColor: Brand.info     },
  { icon: 'settings-outline',    label: 'Settings',       iconBg: '#F0E5FF',          iconColor: '#8B5CF6'      },
  { icon: 'help-circle-outline', label: 'Help & Support', iconBg: '#E5FFE5',          iconColor: Brand.success  },
];

const Account = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  useEffect(() => {
    if (!user) {
      dispatch(checkAuthStatus()).then((result) => {
        if (!checkAuthStatus.fulfilled.match(result) || !result.payload) {
          router.replace('/Login');
        }
      });
    }
  }, []);

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await dispatch(logoutUser());
          router.replace('/Login');
        },
      },
    ]);
  };

  if (!user) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Brand.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Header ── */}
        <ThemedView variant="surface" style={styles.header}>
          <View style={styles.avatar}>
            <ThemedText lightColor="#fff" darkColor="#fff" style={styles.avatarText}>
              {getInitials(user.name)}
            </ThemedText>
          </View>
          <ThemedText type="subtitle" style={styles.userName}>{user.name}</ThemedText>
          <ThemedText type="caption">{user.email}</ThemedText>
        </ThemedView>

        {/* ── Info Card ── */}
        <ThemedView variant="surface" style={styles.card}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: Brand.primaryFaded }]}>
              <Ionicons name="mail-outline" size={18} color={Brand.primary} />
            </View>
            <View style={styles.infoTextBox}>
              <ThemedText type="small" style={{ color: theme.textTertiary }}>Email</ThemedText>
              <ThemedText type="defaultSemiBold">{user.email}</ThemedText>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, { backgroundColor: Brand.primaryFaded }]}>
              <Ionicons name="call-outline" size={18} color={Brand.primary} />
            </View>
            <View style={styles.infoTextBox}>
              <ThemedText type="small" style={{ color: theme.textTertiary }}>Phone</ThemedText>
              <ThemedText type="defaultSemiBold">{user.phone}</ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* ── Menu ── */}
        <ThemedView variant="surface" style={styles.card}>
          {MENU_ITEMS.map((item, index) => (
            <View key={item.label}>
              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuLeft}>
                  <View style={[styles.menuIconBox, { backgroundColor: item.iconBg }]}>
                    <Ionicons name={item.icon} size={22} color={item.iconColor} />
                  </View>
                  <ThemedText type="defaultSemiBold">{item.label}</ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.iconMuted} />
              </TouchableOpacity>
              {index < MENU_ITEMS.length - 1 && (
                <View style={[styles.divider, { backgroundColor: theme.border, marginLeft: 60 }]} />
              )}
            </View>
          ))}
        </ThemedView>

        {/* ── Logout ── */}
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: Brand.error, backgroundColor: theme.surface }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={22} color={Brand.error} />
          <ThemedText lightColor={Brand.error} darkColor={Brand.error} style={styles.logoutText}>
            Logout
          </ThemedText>
        </TouchableOpacity>

        <ThemedText type="small" style={styles.version}>Version 1.0.0</ThemedText>
      </ScrollView>
    </ThemedView>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xl },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: {
    paddingTop: 56,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.primary,
  },
  avatarText: { fontSize: 32, fontWeight: '700' },
  userName: { marginBottom: 4 },

  card: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    ...Shadows.sm,
  },

  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md },
  infoIconBox: {
    width: 36, height: 36, borderRadius: Radius.sm,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },
  infoTextBox: { flex: 1 },
  divider: { height: 1 },

  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: Spacing.md,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIconBox: {
    width: 44, height: 44, borderRadius: Radius.md,
    justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md,
  },

  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: Spacing.md, marginBottom: Spacing.md,
    paddingVertical: Spacing.md, borderRadius: Radius.lg,
    borderWidth: 1.5, gap: Spacing.sm, ...Shadows.sm,
  },
  logoutText: { ...Typography.bodySemiBold },
  version: { textAlign: 'center', paddingBottom: Spacing.md },
});
