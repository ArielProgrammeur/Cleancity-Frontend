import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import type { Product } from '../../../../domain/entities/Product';

interface ProductCardProps {
  product: Product;
  index: number;
}

const TREND_ICONS: Record<string, string> = { up: 'trending-up', down: 'trending-down', stable: 'remove' };
const TREND_COLORS: Record<string, string> = { up: '#059669', down: '#DC2626', stable: '#6B7280' };

export const ProductCard = memo(function ProductCard({ product, index }: ProductCardProps) {
  return (
    <Animated.View
      entering={FadeInUp.delay(index * 70).springify().damping(15)}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: product.bgColor }]}>
          <Ionicons name={product.icon as any} size={24} color={product.color} />
        </View>
        <View style={styles.topInfo}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.desc} numberOfLines={1}>{product.description}</Text>
        </View>
      </View>

      <View style={styles.priceRow}>
        <View style={styles.priceBlock}>
          <Text style={styles.priceUnit}>Price</Text>
          <View style={styles.priceValueRow}>
            <Text style={styles.priceValue}>€{product.pricePerKg.toFixed(2)}</Text>
            <Text style={styles.priceUnitLabel}>/ {product.unit}</Text>
          </View>
          <View style={[styles.trendBadge, { backgroundColor: TREND_COLORS[product.priceTrend] + '15' }]}>
            <Ionicons name={TREND_ICONS[product.priceTrend] as any} size={12} color={TREND_COLORS[product.priceTrend]} />
            <Text style={[styles.trendText, { color: TREND_COLORS[product.priceTrend] }]}>
              {product.priceTrend === 'up' ? '+5.2%' : product.priceTrend === 'down' ? '-3.1%' : '0.0%'}
            </Text>
          </View>
        </View>

        <View style={styles.impactBlock}>
          <Text style={styles.impactTitle}>Impact</Text>
          <View style={styles.impactRow}>
            <Ionicons name="leaf-outline" size={12} color="#059669" />
            <Text style={styles.impactValue}>{product.co2SavedPerKg}kg CO₂</Text>
          </View>
          <View style={styles.impactRow}>
            <Ionicons name="flash-outline" size={12} color="#D97706" />
            <Text style={styles.impactValue}>{product.energySavedPerKg}kWh</Text>
          </View>
        </View>
      </View>

      {product.tips && product.tips.length > 0 && (
        <View style={styles.tipsSection}>
          {product.tips.slice(0, 2).map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Ionicons name="bulb-outline" size={11} color="#F59E0B" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.rangeRow}>
        <Ionicons name="scale-outline" size={13} color="#9CA3AF" />
        <Text style={styles.rangeText}>{product.minKg}–{product.maxKg} {product.unit} accepted</Text>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  topInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  desc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 12,
  },
  priceBlock: {
    flex: 1,
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  priceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  priceUnitLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
    marginTop: 4,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  impactBlock: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    minWidth: 90,
  },
  impactTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  impactValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  tipsSection: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    gap: 4,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tipText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '500',
    flex: 1,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rangeText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
