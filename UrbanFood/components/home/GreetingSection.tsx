import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useTranslation } from '@/src/hooks/useTranslation';
import { homeStyles as styles } from '@/styles/screens/homeStyles';
import React from 'react';
import { useColorScheme, View } from 'react-native';

interface GreetingSectionProps {
  firstName: string;
}

const GreetingSection = ({ firstName }: GreetingSectionProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const { t } = useTranslation();

  return (
    <View style={styles.greeting}>
      <ThemedText type="title">
        {t('home.greetingFirstName', { firstName })}
      </ThemedText>
      <ThemedText
        type="caption"
        style={{ color: theme.textSecondary, marginTop: 4 }}
      >
        {t('home.cravingToday')}
      </ThemedText>
    </View>
  );
};

export default GreetingSection;
