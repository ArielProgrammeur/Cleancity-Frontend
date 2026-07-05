import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ProductCategory } from '../../../../domain/entities/Product';
import { PRODUCT_CATEGORIES, getCategoryLabel, getCategoryIcon } from '../hooks/useMarketplace';
import { colors, spacing, radius, categoryColors } from '../theme';

interface CategoryFilterProps {
  activeCategory: ProductCategory | 'all';
  onCategoryChange: (category: ProductCategory | 'all') => void;
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {PRODUCT_CATEGORIES.map((cat) => {
          const isActive = cat === activeCategory;
          const bg = categoryColors[cat] ?? '#4F46E5';
          return (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.8}
              onPress={() => onCategoryChange(cat)}
              style={[
                styles.chip,
                { backgroundColor: isActive ? bg : bg + '18', borderColor: isActive ? bg : bg + '30' },
              ]}
            >
              <Ionicons
                name={getCategoryIcon(cat) as any}
                size={15}
                color={isActive ? colors.white : bg}
              />
              <Text style={[styles.label, { color: isActive ? colors.white : bg }]}>
                {getCategoryLabel(cat)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: spacing.sm,
  },
  row: {
    paddingHorizontal: spacing.xl,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    height: 38,
    gap: 6,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
});
