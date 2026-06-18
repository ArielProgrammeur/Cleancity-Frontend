import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '../data/categories';
import type { ReportCategory } from '../data/categories';

interface CategorySelectorProps {
  selected: string | null;
  onSelect: (category: ReportCategory) => void;
}

export function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <View style={styles.grid}>
        {categories.map((cat) => {
          const isActive = selected === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.card,
                { backgroundColor: cat.bgColor },
                isActive && { backgroundColor: cat.color, borderColor: cat.color },
              ]}
              onPress={() => onSelect(cat)}
            >
              <Ionicons
                name={cat.icon}
                size={24}
                color={isActive ? '#FFFFFF' : cat.color}
              />
              <Text
                style={[
                  styles.cardLabel,
                  isActive && { color: '#FFFFFF' },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});
