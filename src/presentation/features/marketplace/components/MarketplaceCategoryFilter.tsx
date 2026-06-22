import { useRef, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { ProductCategory } from '../../../../domain/entities/Product';
import { PRODUCT_CATEGORIES, getCategoryLabel, getCategoryIcon } from '../hooks/useMarketplace';

interface CategoryFilterProps {
  activeCategory: ProductCategory | 'all';
  onCategoryChange: (category: ProductCategory | 'all') => void;
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const scrollRef = useRef<ScrollView>(null);
  const positions = useRef<Record<string, number>>({});

  useEffect(() => {
    const idx = PRODUCT_CATEGORIES.indexOf(activeCategory);
    if (idx >= 0 && scrollRef.current) {
      const x = positions.current[activeCategory] ?? idx * 90;
      scrollRef.current.scrollTo({ x: Math.max(0, x - 20), animated: true });
    }
  }, [activeCategory]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {PRODUCT_CATEGORIES.map((cat, idx) => {
        const isActive = cat === activeCategory;
        return (
          <TouchableOpacity
            key={cat}
            activeOpacity={0.7}
            onPress={() => onCategoryChange(cat)}
            onLayout={(e) => { positions.current[cat] = e.nativeEvent.layout.x; }}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Animated.View entering={FadeIn.delay(idx * 40).duration(250)} style={styles.chipInner}>
              <Ionicons
                name={getCategoryIcon(cat) as any}
                size={14}
                color={isActive ? '#FFFFFF' : '#6B7280'}
              />
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {getCategoryLabel(cat)}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 8, gap: 7 },
  chip: {
    paddingHorizontal: 13, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
  },
  chipActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  chipInner: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  chipText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  chipTextActive: { color: '#FFFFFF' },
});
