import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CART_OFFERS } from '@/src/data/cartOffers';
import { offersStyles } from '@/styles/screens/offersStyles';

export default function Offers() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={offersStyles.container}>
      {/* Header */}
      <View style={[offersStyles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={offersStyles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <ThemedText style={offersStyles.headerTitle}>
          Available Offers
        </ThemedText>
        <View style={offersStyles.headerSpacer} />
      </View>

      {/* Offers List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={offersStyles.scrollContent}
      >
        {CART_OFFERS.map((offer) => (
          <View
            key={offer.id}
            style={[
              offersStyles.offerCard,
              { backgroundColor: colors.surfaceSecondary },
            ]}
          >
            <View style={offersStyles.offerHeader}>
              <View
                style={[
                  offersStyles.iconContainer,
                  { backgroundColor: Brand.primaryFaded },
                ]}
              >
                <Ionicons name="pricetag" size={24} color={Brand.primary} />
              </View>
              <View style={offersStyles.offerHeaderText}>
                <ThemedText style={offersStyles.offerTitle}>
                  {offer.title}
                </ThemedText>
                <View style={offersStyles.codeContainer}>
                  <ThemedText style={offersStyles.codeText}>
                    {offer.code}
                  </ThemedText>
                </View>
              </View>
            </View>

            <ThemedText style={offersStyles.offerDescription}>
              {offer.description}
            </ThemedText>

            {offer.minOrderValue > 0 && (
              <View style={offersStyles.minOrderContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <ThemedText style={offersStyles.minOrderText}>
                  Min order value: ₹{offer.minOrderValue}
                </ThemedText>
              </View>
            )}

            <View style={offersStyles.discountBadge}>
              <ThemedText style={offersStyles.discountText}>
                {offer.discountType === 'percentage'
                  ? `${offer.discountValue}% OFF`
                  : `₹${offer.discountValue} OFF`}
              </ThemedText>
            </View>
          </View>
        ))}

        {/* Info Section */}
        <View style={offersStyles.infoSection}>
          <Ionicons name="information-circle" size={20} color={Brand.primary} />
          <ThemedText style={offersStyles.infoText}>
            Apply these offers at checkout to get amazing discounts on your
            orders!
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
