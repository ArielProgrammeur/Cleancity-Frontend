import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  onClear?: () => void;
}

export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search rewards..."
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChange}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {value.length > 0 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <TouchableOpacity
              onPress={() => {
                onChange('');
                onClear?.();
              }}
              style={styles.clearBtn}
              activeOpacity={0.6}
            >
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
});
