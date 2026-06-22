import { useRef, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { RewardCategory } from '../../../../domain/entities/Reward';
import { REWARD_CATEGORIES, getCategoryLabel, getCategoryIcon } from '../hooks/useRewards';

interface CategoryFilterProps {
  activeCategory: RewardCategory | 'all';
  onCategoryChange: (category: RewardCategory | 'all') => void;
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const scrollRef = useRef<ScrollView>(null);
  const positions = useRef<Record<string, number>>({});

  useEffect(() => {
    const idx = REWARD_CATEGORIES.indexOf(activeCategory);
    if (idx >= 0 && scrollRef.current) {
      const x = positions.current[activeCategory] ?? idx * 100;
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
      {REWARD_CATEGORIES.map((cat, idx) => {
        const isActive = cat === activeCategory;
        const icon = getCategoryIcon(cat);
        const label = getCategoryLabel(cat);

        return (
          <TouchableOpacity
            key={cat}
            activeOpacity={0.7}
            onPress={() => onCategoryChange(cat)}
            onLayout={(e) => {
              positions.current[cat] = e.nativeEvent.layout.x;
            }}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Animated.View
              entering={FadeIn.delay(idx * 50).duration(300)}
              style={styles.chipInner}
            >
              <Ionicons
                name={icon as any}
                size={15}
                color={isActive ? '#FFFFFF' : '#6B7280'}
              />
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  chipActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  chipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
