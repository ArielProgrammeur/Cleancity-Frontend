import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';

const WISHLIST_ITEMS = [
  { id: 'r6', name: 'Reusable Water Bottle', pointsCost: 800, discountPrice: 650, icon: 'water-outline' as const, color: '#0284C7', bgColor: '#F0F9FF', category: 'premium' },
  { id: 'r8', name: 'Solar Power Bank', pointsCost: 2000, icon: 'sunny-outline' as const, color: '#EA580C', bgColor: '#FFF7ED', category: 'premium' },
  { id: 'r16', name: 'Zero-Waste Cooking Class', pointsCost: 1500, icon: 'flame-outline' as const, color: '#E11D48', bgColor: '#FFF1F2', category: 'experience' },
];

const CATEGORY_META: Record<string, string> = {
  eco: 'Eco', premium: 'Premium', limited: 'Limited', donation: 'Donation', experience: 'Experience',
};

export default function WishlistScreen() {
  const handleRemove = (name: string) => {
    Alert.alert('Remove from Wishlist', `Remove "${name}" from your wishlist?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => {} },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Wishlist', headerTintColor: colors.primary }} />
      <FlatList
        data={WISHLIST_ITEMS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={56} color={colors.divider} />
            <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
            <Text style={styles.emptyBody}>Browse rewards and add items you like</Text>
            <TouchableOpacity style={styles.browseButton} onPress={() => router.push('/(tabs)/rewards')}>
              <Text style={styles.browseText}>Browse Rewards</Text>
            </TouchableOpacity>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/rewards/${item.id}`)}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.bgColor }]}>
              <Ionicons name={item.icon} size={28} color={item.color} />
            </View>
            <View style={styles.content}>
              <Text style={styles.title}>{item.name}</Text>
              <View style={styles.metaRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{CATEGORY_META[item.category]}</Text>
                </View>
                <View style={styles.pointsRow}>
                  <Ionicons name="star" size={12} color={colors.secondary} />
                  <Text style={[styles.pointsText, item.discountPrice ? styles.pointsDiscounted : undefined]}>
                    {item.pointsCost}
                  </Text>
                  {item.discountPrice && (
                    <Text style={styles.pointsSale}>{item.discountPrice} pts</Text>
                  )}
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.name)}>
              <Ionicons name="heart" size={22} color={colors.error} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: spacing.sm },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  emptyBody: { fontSize: 14, color: colors.textSecondary },
  browseButton: { marginTop: spacing.md, backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: 12, borderRadius: borderRadius.lg },
  browseText: { fontSize: 15, fontWeight: '700', color: colors.white },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm, gap: spacing.sm, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  iconCircle: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, gap: spacing.sm },
  categoryBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.sm },
  categoryText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  pointsRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  pointsText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  pointsDiscounted: { textDecorationLine: 'line-through', color: colors.textSecondary },
  pointsSale: { fontSize: 13, fontWeight: '800', color: colors.error },
  removeButton: { padding: spacing.xs },
});
