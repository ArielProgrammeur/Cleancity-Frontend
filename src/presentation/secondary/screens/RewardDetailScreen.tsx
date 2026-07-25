import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';
import { useUser } from '../../../core/contexts/UserContext';

const MOCK_REWARDS = [
  { id: 'r1', name: 'Eco Tote Bag', description: 'Sac réutilisable en coton bio certifié. Pratique pour vos courses et réduit les déchets plastiques.', pointsCost: 500, icon: 'bag-handle-outline' as const, color: '#2563EB', bgColor: '#EFF6FF', category: 'eco', stock: 25, totalStock: 50, isLimited: false, partnerName: 'EcoWear' },
  { id: 'r2', name: 'Bamboo Toothbrush Set', description: 'Lot de 4 brosses à dents en bambou biodégradable.', pointsCost: 300, icon: 'brush-outline' as const, color: '#65A30D', bgColor: '#F7FEE7', category: 'eco', stock: 40, totalStock: 60, isLimited: false },
  { id: 'r3', name: 'Seed Starter Kit', description: 'Kit complet de 6 variétés de graines bio.', pointsCost: 400, icon: 'leaf-outline' as const, color: '#059669', bgColor: '#ECFDF5', category: 'eco', stock: 30, totalStock: 40, isLimited: false, discountPrice: 350, partnerName: 'GrowGreen' },
  { id: 'r5', name: 'Compost Bin', description: 'Composteur de cuisine 5L en céramique avec filtre à charbon.', pointsCost: 1000, icon: 'trash-bin-outline' as const, color: '#92400E', bgColor: '#FEF3C7', category: 'eco', stock: 15, totalStock: 25, isLimited: false, partnerName: 'CompostPro' },
  { id: 'r6', name: 'Reusable Water Bottle', description: 'Gourde isotherme en acier inoxydable 500ml.', pointsCost: 800, icon: 'water-outline' as const, color: '#0284C7', bgColor: '#F0F9FF', category: 'premium', stock: 15, totalStock: 30, isLimited: false, discountPrice: 650, partnerName: 'AquaSave' },
  { id: 'r8', name: 'Solar Power Bank', description: 'Batterie externe 20000mAh avec panneau solaire intégré.', pointsCost: 2000, icon: 'sunny-outline' as const, color: '#EA580C', bgColor: '#FFF7ED', category: 'premium', stock: 10, totalStock: 15, isLimited: false, partnerName: 'SunCharge' },
  { id: 'r9', name: 'Smart Waste Sensor', description: 'Capteur intelligent pour votre poubelle.', pointsCost: 2500, icon: 'hardware-chip-outline' as const, color: '#7C3AED', bgColor: '#F5F3FF', category: 'limited', stock: 5, totalStock: 10, isLimited: true, expiresAt: '2026-08-15' },
  { id: 'r13', name: 'Plant a Tree', description: 'Un arbre planté en votre nom dans une forêt urbaine.', pointsCost: 1200, icon: 'leaf-outline' as const, color: '#16A34A', bgColor: '#F0FDF4', category: 'donation', stock: 99, totalStock: 999, isLimited: false, partnerName: 'ReforestAction' },
  { id: 'r16', name: 'Zero-Waste Cooking Class', description: 'Cours de cuisine anti-gaspi avec un chef étoilé.', pointsCost: 1500, icon: 'flame-outline' as const, color: '#E11D48', bgColor: '#FFF1F2', category: 'experience', stock: 10, totalStock: 15, isLimited: false, partnerName: 'Chef Green' },
];

const CATEGORY_META: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  eco: { label: 'Eco-Friendly', icon: 'leaf-outline' },
  premium: { label: 'Premium', icon: 'diamond-outline' },
  limited: { label: 'Limited Edition', icon: 'flame-outline' },
  donation: { label: 'Donation', icon: 'heart-outline' },
  experience: { label: 'Experience', icon: 'star-outline' },
};

export default function RewardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile } = useUser();
  const reward = MOCK_REWARDS.find((r) => r.id === id);

  if (!reward) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Reward' }} />
        <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.errorText}>Reward not found</Text>
      </View>
    );
  }

  const cat = CATEGORY_META[reward.category];
  const stockPercent = reward.stock / reward.totalStock;
  const userPoints = profile?.totalPoints ?? 0;
  const canAfford = userPoints >= (reward.discountPrice ?? reward.pointsCost);

  const handleClaim = () => {
    Alert.alert(
      'Claim Reward',
      `Redeem ${reward.name} for ${reward.discountPrice ?? reward.pointsCost} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Claim', onPress: () => {
          Alert.alert('Success!', `🎉 You claimed "${reward.name}"!\n\nVoucher: RWD-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
          router.back();
        }},
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: reward.name, headerTintColor: colors.primary }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={[styles.hero, { backgroundColor: reward.bgColor }]}>
          <View style={[styles.iconCircle, { backgroundColor: reward.color + '20' }]}>
            <Ionicons name={reward.icon} size={56} color={reward.color} />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.titleArea}>
              <Text style={styles.title}>{reward.name}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: reward.bgColor }]}>
                <Ionicons name={cat.icon} size={12} color={reward.color} />
                <Text style={[styles.categoryText, { color: reward.color }]}>{cat.label}</Text>
              </View>
            </View>
            <View style={styles.pointsBadge}>
              <Ionicons name="star" size={18} color={colors.secondary} />
              <Text style={styles.pointsValue}>{reward.discountPrice ?? reward.pointsCost}</Text>
            </View>
          </View>

          <Text style={styles.description}>{reward.description}</Text>

          {reward.discountPrice && (
            <View style={styles.discountBanner}>
              <Ionicons name="pricetag" size={16} color={colors.error} />
              <Text style={styles.discountText}>
                -{Math.round((1 - reward.discountPrice / reward.pointsCost) * 100)}% OFF
              </Text>
              <Text style={styles.originalPrice}>{reward.pointsCost} pts</Text>
            </View>
          )}

          <View style={styles.infoGrid}>
            <InfoCard icon="cube-outline" label="Stock" value={`${reward.stock}/${reward.totalStock}`} color={reward.color} />
            <InfoCard icon="people-outline" label="Partner" value={reward.partnerName ?? 'CleanCity'} color={reward.color} />
            {reward.expiresAt && (
              <InfoCard icon="time-outline" label="Expires" value={reward.expiresAt} color={colors.error} />
            )}
          </View>

          {!reward.isLimited && (
            <View style={styles.stockSection}>
              <View style={styles.stockHeader}>
                <Text style={styles.stockLabel}>Availability</Text>
                <Text style={styles.stockPercent}>{Math.round(stockPercent * 100)}%</Text>
              </View>
              <View style={styles.stockBar}>
                <View style={[styles.stockFill, {
                  width: `${stockPercent * 100}%`,
                  backgroundColor: stockPercent > 0.5 ? colors.success : stockPercent > 0.2 ? colors.warning : colors.error,
                }]} />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.claimButton, !canAfford && styles.claimButtonDisabled]}
            onPress={handleClaim}
            disabled={!canAfford}
          >
            <Ionicons name={canAfford ? 'gift' : 'lock-closed'} size={20} color={colors.white} />
            <Text style={styles.claimText}>
              {canAfford ? 'Claim This Reward' : `Need ${(reward.discountPrice ?? reward.pointsCost) - userPoints} more points`}
            </Text>
          </TouchableOpacity>

          {(reward as any).terms && (
            <Text style={styles.terms}>{(reward as any).terms}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function InfoCard({ icon, label, value, color }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; color: string }) {
  return (
    <View style={infoStyles.card}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={infoStyles.value}>{value}</Text>
      <Text style={infoStyles.label}>{label}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  card: { flex: 1, backgroundColor: colors.surface, padding: spacing.sm, borderRadius: borderRadius.md, alignItems: 'center', gap: 4, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  value: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  label: { fontSize: 11, color: colors.textSecondary },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, gap: spacing.sm },
  errorText: { fontSize: 16, color: colors.textSecondary },
  scroll: { paddingBottom: spacing.xxl },
  hero: { height: 220, alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm },
  titleArea: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.md, marginTop: spacing.xs, gap: 4 },
  categoryText: { fontSize: 12, fontWeight: '600' },
  pointsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 12, paddingVertical: 8, borderRadius: borderRadius.lg, gap: 4 },
  pointsValue: { fontSize: 20, fontWeight: '800', color: colors.secondaryDark },
  description: { fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginTop: spacing.md },
  discountBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: spacing.sm, borderRadius: borderRadius.md, marginTop: spacing.md, gap: spacing.xs },
  discountText: { fontSize: 14, fontWeight: '700', color: colors.error, flex: 1 },
  originalPrice: { fontSize: 13, color: colors.textSecondary, textDecorationLine: 'line-through' },
  infoGrid: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  stockSection: { marginTop: spacing.lg },
  stockHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  stockLabel: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  stockPercent: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  stockBar: { height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', overflow: 'hidden' },
  stockFill: { height: '100%', borderRadius: 4 },
  claimButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingVertical: 16, borderRadius: borderRadius.lg, marginTop: spacing.lg, gap: spacing.sm },
  claimButtonDisabled: { backgroundColor: '#9CA3AF' },
  claimText: { fontSize: 16, fontWeight: '700', color: colors.white },
  terms: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, fontStyle: 'italic' },
});
