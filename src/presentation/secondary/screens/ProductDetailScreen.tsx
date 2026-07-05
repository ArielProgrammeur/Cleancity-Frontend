import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';
import { formatPrice, formatPricePerUnit } from '../../../core/utils/format';

const PRODUCTS = [
  { id: 'p1', name: 'PET Plastic Bottles', description: 'Bouteilles en plastique transparent, bouchons compris. Bien rincer et aplatir avant dépôt.', category: 'plastic', icon: 'water-outline' as const, color: '#2563EB', bgColor: '#EFF6FF', pricePerKg: 0.50, unit: 'kg', minKg: 1, maxKg: 50, co2SavedPerKg: 1.5, energySavedPerKg: 2.3, priceTrend: 'up' as const, tips: ['Rincez les bouteilles', 'Aplatissez pour gagner de la place', 'Séparez les bouchons'] },
  { id: 'p2', name: 'Mixed Glass', description: 'Verre d\'emballage (bouteilles, pots, bocaux). Pas de vaisselle, miroirs ou verre trempé.', category: 'glass', icon: 'wine-outline' as const, color: '#059669', bgColor: '#ECFDF5', pricePerKg: 0.30, unit: 'kg', minKg: 2, maxKg: 100, co2SavedPerKg: 0.6, energySavedPerKg: 1.2, priceTrend: 'stable' as const, tips: ['Pas de vaisselle', 'Séparez par couleur si possible', 'Retirez les bouchons'] },
  { id: 'p4', name: 'Small Electronics', description: 'Petits appareils électroniques (smartphones, chargeurs, écouteurs). Données effacées requises.', category: 'electronics', icon: 'laptop-outline' as const, color: '#7C3AED', bgColor: '#F5F3FF', pricePerKg: 2.00, unit: 'kg', minKg: 0.5, maxKg: 20, co2SavedPerKg: 4.2, energySavedPerKg: 8.5, priceTrend: 'up' as const, tips: ['Effacez vos données personnelles', 'Retirez les batteries', 'Groupez par type'] },
  { id: 'p6', name: 'Aluminum & Metal', description: 'Canettes aluminium, conserves, petits métaux non-ferreux.', category: 'metal', icon: 'hammer-outline' as const, color: '#6B7280', bgColor: '#F3F4F6', pricePerKg: 1.20, unit: 'kg', minKg: 1, maxKg: 60, co2SavedPerKg: 2.8, energySavedPerKg: 5.6, priceTrend: 'up' as const, tips: ['Rincez les conserves', 'Écrasez les canettes', 'Séparez fer et aluminium'] },
  { id: 'p8', name: 'Batteries', description: 'Piles et batteries rechargeables (AA, AAA, lithium). Protégez les bornes avec du scotch.', category: 'battery', icon: 'battery-charging-outline' as const, color: '#DC2626', bgColor: '#FEF2F2', pricePerKg: 3.50, unit: 'kg', minKg: 0.2, maxKg: 10, co2SavedPerKg: 5.1, energySavedPerKg: 0.0, priceTrend: 'up' as const, tips: ['Scotchez les bornes', 'Pas de batteries endommagées', 'Stockez au sec'] },
];

const CATEGORY_LABELS: Record<string, string> = {
  plastic: 'Plastique', glass: 'Verre', paper: 'Papier', electronics: 'Électronique',
  textile: 'Textile', metal: 'Métal', organic: 'Organique', battery: 'Batterie',
};

const TREND_CONFIG = {
  up: { icon: 'trending-up' as const, color: colors.success },
  down: { icon: 'trending-down' as const, color: colors.error },
  stable: { icon: 'remove' as const, color: colors.textSecondary },
};

const LISTINGS = [
  { id: 'l1', sellerName: 'Marie L.', quantityKg: 12, pricePerKg: 0.55, totalPrice: 6.60, location: 'Rue de la Paix, 75002' },
  { id: 'l2', sellerName: 'Thomas R.', quantityKg: 8, pricePerKg: 1.30, totalPrice: 10.40, location: 'Avenue des Ternes, 75017' },
];

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Product' }} />
        <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const trend = TREND_CONFIG[product.priceTrend];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name, headerTintColor: colors.primary }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={[styles.hero, { backgroundColor: product.bgColor }]}>
          <View style={[styles.iconCircle, { backgroundColor: product.color + '20' }]}>
            <Ionicons name={product.icon} size={56} color={product.color} />
          </View>
          <Text style={styles.heroCategory}>{CATEGORY_LABELS[product.category]}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Current Price</Text>
              <View style={styles.priceMain}>
                <Text style={styles.priceValue}>{formatPricePerUnit(product.pricePerKg, product.unit)}</Text>
              </View>
            </View>
            <View style={[styles.trendBadge, { backgroundColor: trend.color + '15' }]}>
              <Ionicons name={trend.icon} size={18} color={trend.color} />
              <Text style={[styles.trendText, { color: trend.color }]}>{product.priceTrend}</Text>
            </View>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.statsGrid}>
            <StatCard icon="leaf-outline" value={`${product.co2SavedPerKg}kg`} label="CO₂ saved/kg" color="#059669" />
            <StatCard icon="flash-outline" value={`${product.energySavedPerKg}kWh`} label="Energy/kg" color="#D97706" />
            <StatCard icon="resize-outline" value={`${product.minKg}-${product.maxKg}kg`} label="Quantity range" color={colors.info} />
          </View>

          {product.tips && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tips for Recycling</Text>
              {product.tips.map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <Ionicons name="bulb-outline" size={16} color={colors.secondary} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Listings</Text>
            {LISTINGS.map((l) => (
              <View key={l.id} style={styles.listingCard}>
                <View style={styles.listingLeft}>
                  <View style={[styles.listingAvatar, { backgroundColor: product.color + '20' }]}>
                    <Ionicons name="person" size={16} color={product.color} />
                  </View>
                  <View>
                    <Text style={styles.listingSeller}>{l.sellerName}</Text>
                    <Text style={styles.listingLocation}>{l.location}</Text>
                  </View>
                </View>
                <View style={styles.listingRight}>
                  <Text style={styles.listingQty}>{l.quantityKg} kg</Text>
                  <Text style={styles.listingPrice}>{formatPrice(l.totalPrice)}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.sellButton} onPress={() => router.push('/marketplace/create-listing')}>
            <Ionicons name="add-circle-outline" size={20} color={colors.white} />
            <Text style={styles.sellButtonText}>Sell This Material</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ icon, value, label, color }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string; color: string }) {
  return (
    <View style={statStyles.card}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: { flex: 1, backgroundColor: colors.surface, padding: spacing.sm, borderRadius: borderRadius.md, alignItems: 'center', gap: 4, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  value: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  label: { fontSize: 10, color: colors.textSecondary, textAlign: 'center' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, gap: spacing.sm },
  errorText: { fontSize: 16, color: colors.textSecondary },
  scroll: { paddingBottom: spacing.xxl },
  hero: { height: 200, alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  heroCategory: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginTop: spacing.sm },
  content: { padding: spacing.md },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  priceLabel: { fontSize: 13, color: colors.textSecondary },
  priceMain: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  priceValue: { fontSize: 32, fontWeight: '800', color: colors.textPrimary },
  priceUnit: { fontSize: 16, color: colors.textSecondary },
  trendBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: borderRadius.md, gap: 4 },
  trendText: { fontSize: 13, fontWeight: '700', textTransform: 'capitalize' },
  description: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginTop: spacing.md },
  statsGrid: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  section: { marginTop: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  tipRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.sm, borderRadius: borderRadius.md, marginBottom: spacing.xs, gap: spacing.sm },
  tipText: { fontSize: 14, color: colors.textPrimary, flex: 1 },
  listingCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.sm, borderRadius: borderRadius.md, marginBottom: spacing.sm, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  listingLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  listingAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  listingSeller: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  listingLocation: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  listingRight: { alignItems: 'flex-end' },
  listingQty: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  listingPrice: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  sellButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingVertical: 16, borderRadius: borderRadius.lg, marginTop: spacing.md, gap: spacing.sm },
  sellButtonText: { fontSize: 16, fontWeight: '700', color: colors.white },
});
