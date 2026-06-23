import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { Product } from '../../../../domain/entities/Product';
import { colors, spacing, radius, shadows, typography } from '../theme';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard = memo(function ProductCard({ product, index }: ProductCardProps) {
  return (
    <Animated.View
      entering={FadeInUp.delay(index * 50).springify().damping(18)}
      style={styles.wrapper}
    >
      <View style={[styles.topBar, { backgroundColor: product.color + '15' }]}>
        <View style={[styles.iconCircle, { backgroundColor: product.color + '25' }]}>
          <Ionicons name={product.icon as any} size={20} color={product.color} />
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceSymbol}>€</Text>
          <Text style={styles.priceValue}>{product.pricePerKg.toFixed(2)}</Text>
          <Text style={styles.priceUnit}>/{product.unit}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.badge}>
            <Ionicons name="leaf" size={10} color={colors.accent} />
            <Text style={styles.badgeText}>{product.co2SavedPerKg}kg CO₂</Text>
          </View>
          <Text style={styles.range}>
            {product.minKg}–{product.maxKg} {product.unit}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
});

const CARD_HEIGHT = 172;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: CARD_HEIGHT,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  topBar: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    justifyContent: 'space-between',
  },
  category: {
    ...typography.tiny,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: colors.textTertiary,
  },
  name: {
    ...typography.body,
    fontWeight: '700',
    marginBottom: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  priceSymbol: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginRight: 1,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textTertiary,
    marginLeft: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  badgeText: {
    ...typography.small,
    color: colors.accent,
  },
  range: {
    ...typography.small,
  },
});
