import { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { Product } from '../../../../domain/entities/Product';
import { colors, spacing, radius, shadows } from '../theme';
import { formatPricePerUnit } from '../../../../core/utils/format';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const SIDE_PADDING = spacing.xl * 2;
const CARD_WIDTH = (SCREEN_WIDTH - SIDE_PADDING - CARD_GAP) / 2;

interface ProductCardProps {
  product: Product;
  index: number;
  onPress?: () => void;
}

export const ProductCard = memo(function ProductCard({ product, index, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ width: CARD_WIDTH, marginBottom: CARD_GAP }}>
      <Animated.View
        entering={FadeInUp.delay(index * 50).springify().damping(18)}
        style={styles.card}
      >
        <View style={[styles.iconWrap, { backgroundColor: product.color + '10' }]}>
          <View style={[styles.iconCircle, { backgroundColor: product.color + '20' }]}>
            <Ionicons name={product.icon as any} size={22} color={product.color} />
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>

          <Text style={styles.price}>
            {formatPricePerUnit(product.pricePerKg, product.unit)}
          </Text>

          <View style={styles.meta}>
            <View style={styles.co2Badge}>
              <Ionicons name="leaf" size={10} color={colors.accent} />
              <Text style={styles.co2Text}>{product.co2SavedPerKg}kg</Text>
            </View>
            <Text style={styles.range}>{product.minKg}–{product.maxKg} {product.unit}</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  iconWrap: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 17,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  co2Badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.accentLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  co2Text: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
  },
  range: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textTertiary,
  },
});
