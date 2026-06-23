import { TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { ProductCategory } from '../../../../domain/entities/Product';
import { PRODUCT_CATEGORIES, getCategoryLabel } from '../hooks/useMarketplace';
import { colors, spacing, radius, categoryColors } from '../theme';

interface CategoryFilterProps {
  activeCategory: ProductCategory | 'all';
  onCategoryChange: (category: ProductCategory | 'all') => void;
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const isAll = activeCategory === 'all';
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {PRODUCT_CATEGORIES.map((cat, idx) => {
        const isActive = cat === activeCategory;
        const isDimmed = !isActive && !isAll;
        const bg = categoryColors[cat] ?? '#4F46E5';
        return (
          <Animated.View key={cat} entering={FadeIn.delay(idx * 25).duration(200)}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onCategoryChange(cat)}
              style={[styles.chip, { backgroundColor: bg }, isActive && styles.chipActive, isDimmed && styles.chipDimmed]}
            >
              <Text style={styles.label}>{getCategoryLabel(cat)}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    gap: 8,
  },
  chip: {
    borderRadius: radius.full,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  chipDimmed: {
    borderColor: 'rgba(255,255,255,0.15)',
  },
  chipActive: {
    borderColor: colors.white,
    borderWidth: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
  },
});
