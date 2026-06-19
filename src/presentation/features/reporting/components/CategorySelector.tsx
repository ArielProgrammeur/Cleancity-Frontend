import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '../data/categories';
import type { ReportCategory } from '../data/categories';

interface CategorySelectorProps {
  selected: string | null;
  onSelect: (category: ReportCategory) => void;
}

export const CategorySelector = memo(function CategorySelector({
  selected,
  onSelect,
}: CategorySelectorProps) {
  return (
    <View style={styles.grid}>
      {categories.map((cat) => {
        const active = selected === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.card,
              { backgroundColor: cat.bgColor },
              active && { backgroundColor: cat.color, borderColor: cat.color },
            ]}
            onPress={() => onSelect(cat)}
            activeOpacity={0.75}
          >
            <Ionicons
              name={cat.icon}
              size={22}
              color={active ? '#FFFFFF' : cat.color}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '30.5%',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  labelActive: {
    color: '#FFFFFF',
  },
});
