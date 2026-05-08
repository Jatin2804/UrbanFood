import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { useLocation } from '@/src/hooks/useLocation';
import { useTranslation } from '@/src/hooks/useTranslation';
import { addressesStyles as styles } from '@/styles/screens/addressesStyles';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Addresses() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();
  const { t } = useTranslation();

  const {
    status: locationStatus,
    address: locationAddress,
    coords,
    city,
    district,
    requestLocation,
    openSettings,
  } = useLocation();

  useEffect(() => {
    if (locationStatus === 'idle') {
      requestLocation();
    }
  }, [locationStatus, requestLocation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={theme.textPrimary} />
          </TouchableOpacity>
          <ThemedText
            style={[styles.headerTitle, { color: theme.textPrimary }]}
          >
            {t('addresses.title')}
          </ThemedText>
          <View style={styles.backBtn} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Current Location Section */}
          <View
            style={[
              styles.section,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons
                name="location-outline"
                size={22}
                color={Brand.primary}
              />
              <ThemedText
                style={[styles.sectionTitle, { color: theme.textPrimary }]}
              >
                {t('addresses.currentLocation')}
              </ThemedText>
            </View>

            {/* Location Status */}
            {locationStatus === 'requesting' && (
              <View style={styles.statusContainer}>
                <ActivityIndicator color={Brand.primary} size="small" />
                <ThemedText
                  style={[styles.statusText, { color: theme.textSecondary }]}
                >
                  {t('addresses.detectingLocation')}
                </ThemedText>
              </View>
            )}

            {locationStatus === 'denied' && (
              <View style={styles.deniedContainer}>
                <View style={styles.deniedContent}>
                  <Ionicons
                    name="location-outline"
                    size={24}
                    color={Brand.error}
                  />
                  <View style={styles.deniedTextContainer}>
                    <ThemedText
                      style={[styles.deniedTitle, { color: theme.textPrimary }]}
                    >
                      {t('addresses.locationAccessDenied')}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.deniedDescription,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {t('addresses.enableLocation')}
                    </ThemedText>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={openSettings}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    style={[
                      styles.settingsButtonText,
                      { color: Brand.primary },
                    ]}
                  >
                    {t('addresses.openSettings')}
                  </ThemedText>
                  <Ionicons
                    name="settings-outline"
                    size={18}
                    color={Brand.primary}
                  />
                </TouchableOpacity>
              </View>
            )}

            {locationStatus === 'granted' && coords && (
              <View style={styles.addressDetails}>
                <View style={styles.addressRow}>
                  <View
                    style={[
                      styles.addressIconBox,
                      { backgroundColor: Brand.primaryFaded },
                    ]}
                  >
                    <Ionicons name="location" size={20} color={Brand.primary} />
                  </View>
                  <View style={styles.addressTextContainer}>
                    <ThemedText
                      style={[
                        styles.addressLabel,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {t('addresses.deliveryAddress')}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.addressValue,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {locationAddress}
                    </ThemedText>
                    {(city || district) && (
                      <ThemedText
                        style={[
                          styles.addressCity,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {[district, city].filter(Boolean).join(', ')}
                      </ThemedText>
                    )}
                  </View>
                </View>

                <View
                  style={[styles.divider, { backgroundColor: theme.border }]}
                />

                <View style={styles.addressRow}>
                  <View
                    style={[
                      styles.addressIconBox,
                      { backgroundColor: '#E5F4FF' },
                    ]}
                  >
                    <Ionicons name="navigate" size={20} color={Brand.info} />
                  </View>
                  <View style={styles.addressTextContainer}>
                    <ThemedText
                      style={[
                        styles.addressLabel,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {t('addresses.coordinates')}
                    </ThemedText>
                    <ThemedText
                      style={[
                        styles.addressValue,
                        { color: theme.textPrimary },
                      ]}
                    >
                      {coords.latitude.toFixed(6)},{' '}
                      {coords.longitude.toFixed(6)}
                    </ThemedText>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={requestLocation}
                  activeOpacity={0.8}
                >
                  <Ionicons name="refresh" size={18} color={Brand.primary} />
                  <ThemedText
                    style={[styles.refreshButtonText, { color: Brand.primary }]}
                  >
                    {t('addresses.refresh')}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
