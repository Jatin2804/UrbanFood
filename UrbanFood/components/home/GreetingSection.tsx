import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { homeStyles as styles } from '@/styles/screens/homeStyles';
import React from 'react';
import { useColorScheme, View } from 'react-native';

interface GreetingSectionProps {
  firstName: string;
}

const GreetingSection = ({ firstName }: GreetingSectionProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <View style={styles.greeting}>
      <ThemedText type="title">Hey, {firstName}</ThemedText>
      <ThemedText
        type="caption"
        style={{ color: theme.textSecondary, marginTop: 4 }}
      >
        What are you craving today?
      </ThemedText>
    </View>
  );
};

export default GreetingSection;
