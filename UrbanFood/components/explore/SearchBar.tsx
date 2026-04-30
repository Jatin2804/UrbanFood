import { Colors } from '@/constants/theme';
import { exploreStyles as screenStyles } from '@/styles/screens/exploreStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

const SearchBar = ({ value, onChangeText, onClear }: SearchBarProps) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <View
      style={[
        screenStyles.searchBar,
        { backgroundColor: theme.surfaceSecondary, borderColor: theme.border },
      ]}
    >
      <Ionicons name="search-outline" size={20} color={theme.textTertiary} />
      <TextInput
        style={[screenStyles.searchInput, { color: theme.inputText }]}
        placeholder="Search dishes, cuisines..."
        placeholderTextColor={theme.placeholder}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={18} color={theme.textTertiary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
