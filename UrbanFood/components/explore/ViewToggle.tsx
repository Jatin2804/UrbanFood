import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ViewMode } from '@/src/constants/explore';
import { useTranslation } from '@/src/hooks/useTranslation';
import { viewToggleStyles as styles } from '@/styles/components/viewToggleStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  itemCount: number;
}

const ViewToggle = ({
  viewMode,
  onViewModeChange,
  itemCount,
}: ViewToggleProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const { t } = useTranslation();

  const itemText =
    itemCount === 1
      ? t('explore.itemAvailable', { count: itemCount })
      : t('explore.itemsAvailable', { count: itemCount });

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.itemCount}>{itemText}</ThemedText>
      <View style={styles.toggleGroup}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onViewModeChange('grid')}
          style={[
            styles.toggleBtn,
            {
              borderColor:
                viewMode === 'grid'
                  ? theme.primary
                  : scheme === 'dark'
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(0,0,0,0.1)',
            },
            viewMode === 'grid' && {
              backgroundColor: theme.primary,
            },
          ]}
        >
          <Ionicons
            name="grid-outline"
            size={18}
            color={viewMode === 'grid' ? '#fff' : theme.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onViewModeChange('list')}
          style={[
            styles.toggleBtn,
            {
              borderColor:
                viewMode === 'list'
                  ? theme.primary
                  : scheme === 'dark'
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(0,0,0,0.1)',
            },
            viewMode === 'list' && {
              backgroundColor: theme.primary,
            },
          ]}
        >
          <Ionicons
            name="list-outline"
            size={18}
            color={viewMode === 'list' ? '#fff' : theme.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

export default ViewToggle;
