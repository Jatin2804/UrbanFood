import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { ROUTES } from '@/src/constants/navigation';
import { useTranslation } from '@/src/hooks/useTranslation';
import { helpSupportStyles as styles } from '@/styles/screens/helpSupportStyles';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Linking,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpSupport() {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const router = useRouter();
  const { t } = useTranslation();

  const handleChatPress = () => {
    router.push(ROUTES.CHATBOT);
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:support@urbanfood.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+919876543210');
  };

  const faqItems = [
    {
      question: t('helpSupport.howToOrder'),
      answer: t('helpSupport.howToOrderAnswer'),
      icon: 'cart-outline' as const,
    },
    {
      question: t('helpSupport.trackOrder'),
      answer: t('helpSupport.trackOrderAnswer'),
      icon: 'location-outline' as const,
    },
    {
      question: t('helpSupport.cancelOrder'),
      answer: t('helpSupport.cancelOrderAnswer'),
      icon: 'close-circle-outline' as const,
    },
    {
      question: t('helpSupport.paymentMethods'),
      answer: t('helpSupport.paymentMethodsAnswer'),
      icon: 'cash-outline' as const,
    },
  ];

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
            {t('helpSupport.title')}
          </ThemedText>
          <View style={styles.backBtn} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Chatbot Card */}
          <TouchableOpacity
            style={[
              styles.chatbotCard,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
            onPress={handleChatPress}
            activeOpacity={0.8}
          >
            <View style={styles.chatbotContent}>
              <Image
                source={require('@/assets/images/samosa-bot.png')}
                style={styles.chatbotAvatar}
                contentFit="cover"
              />
              <View style={styles.chatbotTextContainer}>
                <ThemedText
                  style={[styles.chatbotTitle, { color: theme.textPrimary }]}
                >
                  {t('helpSupport.chatWithUs')}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.chatbotDescription,
                    { color: theme.textSecondary },
                  ]}
                >
                  {t('helpSupport.chatDescription')}
                </ThemedText>
              </View>
            </View>
            <View style={styles.chatbotButton}>
              <ThemedText
                style={[styles.chatbotButtonText, { color: Brand.primary }]}
              >
                {t('helpSupport.talkToSamosa')}
              </ThemedText>
              <Ionicons
                name="chatbubble-ellipses"
                size={20}
                color={Brand.primary}
              />
            </View>
          </TouchableOpacity>

          {/* FAQ Section */}
          <View
            style={[
              styles.section,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons
                name="help-circle-outline"
                size={22}
                color={Brand.primary}
              />
              <ThemedText
                style={[styles.sectionTitle, { color: theme.textPrimary }]}
              >
                {t('helpSupport.faq')}
              </ThemedText>
            </View>

            {faqItems.map((item, index) => (
              <View key={index}>
                <View style={styles.faqItem}>
                  <View style={styles.faqIconContainer}>
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={Brand.primary}
                    />
                  </View>
                  <View style={styles.faqTextContainer}>
                    <ThemedText
                      style={[styles.faqQuestion, { color: theme.textPrimary }]}
                    >
                      {item.question}
                    </ThemedText>
                    <ThemedText
                      style={[styles.faqAnswer, { color: theme.textSecondary }]}
                    >
                      {item.answer}
                    </ThemedText>
                  </View>
                </View>
                {index < faqItems.length - 1 && (
                  <View
                    style={[styles.divider, { backgroundColor: theme.border }]}
                  />
                )}
              </View>
            ))}
          </View>

          {/* Contact Section */}
          <View
            style={[
              styles.section,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="call-outline" size={22} color={Brand.primary} />
              <ThemedText
                style={[styles.sectionTitle, { color: theme.textPrimary }]}
              >
                {t('helpSupport.contactUs')}
              </ThemedText>
            </View>

            {/* Email */}
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleEmailPress}
              activeOpacity={0.7}
            >
              <View style={styles.contactLeft}>
                <View
                  style={[
                    styles.contactIconBox,
                    { backgroundColor: Brand.primaryFaded },
                  ]}
                >
                  <Ionicons name="mail" size={20} color={Brand.primary} />
                </View>
                <View>
                  <ThemedText
                    style={[
                      styles.contactLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {t('helpSupport.email')}
                  </ThemedText>
                  <ThemedText
                    style={[styles.contactValue, { color: theme.textPrimary }]}
                  >
                    {t('helpSupport.emailAddress')}
                  </ThemedText>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.iconMuted}
              />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Phone */}
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handlePhonePress}
              activeOpacity={0.7}
            >
              <View style={styles.contactLeft}>
                <View
                  style={[
                    styles.contactIconBox,
                    { backgroundColor: '#E5F4FF' },
                  ]}
                >
                  <Ionicons name="call" size={20} color={Brand.info} />
                </View>
                <View>
                  <ThemedText
                    style={[
                      styles.contactLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {t('helpSupport.phone')}
                  </ThemedText>
                  <ThemedText
                    style={[styles.contactValue, { color: theme.textPrimary }]}
                  >
                    {t('helpSupport.phoneNumber')}
                  </ThemedText>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.iconMuted}
              />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            {/* Working Hours */}
            <View style={styles.contactItem}>
              <View style={styles.contactLeft}>
                <View
                  style={[
                    styles.contactIconBox,
                    { backgroundColor: '#FFF4E5' },
                  ]}
                >
                  <Ionicons name="time" size={20} color={Brand.warning} />
                </View>
                <View>
                  <ThemedText
                    style={[
                      styles.contactLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {t('helpSupport.workingHours')}
                  </ThemedText>
                  <ThemedText
                    style={[styles.contactValue, { color: theme.textPrimary }]}
                  >
                    {t('helpSupport.workingHoursTime')}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
