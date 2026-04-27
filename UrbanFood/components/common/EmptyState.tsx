import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  iconSize?: number;
}

const EmptyState = ({
  icon,
  title,
  subtitle,
  iconSize = 48,
}: EmptyStateProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={iconSize} color={theme.textTertiary} />
      <ThemedText
        type="subtitle"
        style={{ marginTop: Spacing.md, color: theme.textSecondary }}
      >
        {title}
      </ThemedText>
      {subtitle && (
        <ThemedText
          type="caption"
          style={{ color: theme.textTertiary, marginTop: 4, textAlign: 'center' }}
        >
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
