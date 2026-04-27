import { ThemedText } from '@/components/themed-text';
import { Brand, Colors } from '@/constants/theme';
import { SHEET_HEIGHT, SORT_OPTIONS, SortOption } from '@/src/constants/explore';
import { exploreStyles as styles } from '@/styles/screens/exploreStyles';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
    Animated,
    Modal,
    PanResponder,
    Pressable,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

interface SortSheetProps {
  visible: boolean;
  slideAnim: Animated.Value;
  sortBy: SortOption;
  onSelect: (option: SortOption) => void;
  onClear: () => void;
  onClose: () => void;
}

const SortSheet = ({
  visible,
  slideAnim,
  sortBy,
  onSelect,
  onClear,
  onClose,
}: SortSheetProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) slideAnim.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 80) {
          onClose();
        } else {
          Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.surface,
            height: SHEET_HEIGHT,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />

        <ThemedText type="subtitle" style={styles.sheetTitle}>
          Sort & Filter
        </ThemedText>

        {SORT_OPTIONS.map((opt) => {
          const isActive = sortBy === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.sheetOption, { borderBottomColor: theme.border }]}
              onPress={() => onSelect(opt.key)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.sheetOptionIcon,
                  {
                    backgroundColor: isActive
                      ? `${Brand.primary}20`
                      : theme.surfaceSecondary,
                  },
                ]}
              >
                <Ionicons
                  name={opt.icon}
                  size={20}
                  color={isActive ? Brand.primary : theme.textSecondary}
                />
              </View>
              <ThemedText
                style={[
                  styles.sheetOptionText,
                  { color: isActive ? Brand.primary : theme.textPrimary },
                ]}
              >
                {opt.label}
              </ThemedText>
              {isActive && (
                <Ionicons name="checkmark-circle" size={22} color={Brand.primary} />
              )}
            </TouchableOpacity>
          );
        })}

        {sortBy !== 'none' && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={onClear}
            activeOpacity={0.8}
          >
            <ThemedText style={[styles.clearBtnText, { color: Brand.error }]}>
              Clear Sort
            </ThemedText>
          </TouchableOpacity>
        )}
      </Animated.View>
    </Modal>
  );
};

export default SortSheet;
