import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useSidebar } from '../../../src/core/contexts/SidebarContext';
import { RecompenseApiDatasource, type Recompense } from '../../../src/data/datasources/RecompenseApiDatasource';

const datasource = new RecompenseApiDatasource();
const CATEGORY_LABELS = datasource.getCategoryLabels();
const CATEGORY_COLORS = datasource.getCategoryColors();

export default function RecompensesList() {
  const insets = useSafeAreaInsets();
  const { toggle } = useSidebar();
  const [recompenses, setRecompenses] = useState<Recompense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ total: 0, actives: 0, totalRedeemed: 0, valeurMoyenne: 0 });

  const load = useCallback(async () => {
    try {
      const [data, s] = await Promise.all([datasource.getAll(), datasource.getStats()]);
      setRecompenses(data);
      setStats(s);
    } catch {} finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={toggle} activeOpacity={0.7}>
          <Ionicons name="menu" size={18} color="#F1F5F9" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Récompenses</Text>
          <Text style={styles.subtitle}>{stats.total} articles</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/admin/recompenses/creer' as any)} activeOpacity={0.7}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {[
          { label: 'Total', value: stats.total, color: '#F1F5F9' },
          { label: 'Actives', value: stats.actives, color: '#10B981' },
          { label: 'Échangés', value: stats.totalRedeemed, color: '#3B82F6' },
          { label: 'Moy. pts', value: stats.valeurMoyenne, color: '#F59E0B' },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingWrap}><ActivityIndicator size="large" color="#10B981" /></View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor="#10B981" colors={['#10B981']} progressBackgroundColor="#131A2E" />}
        >
          {recompenses.map((r, idx) => {
            const catColor = CATEGORY_COLORS[r.category] || '#6B7280';
            return (
              <Animated.View key={r.id} entering={FadeInRight.delay(idx * 30).springify().damping(20)}>
                <TouchableOpacity style={styles.card} onPress={() => router.push(`/admin/recompenses/${r.id}` as any)} activeOpacity={0.85}>
                  <View style={[styles.cardIcon, { backgroundColor: catColor + '20' }]}>
                    <Ionicons name={r.imageUrl as any} size={18} color={catColor} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{r.title}</Text>
                    <Text style={styles.cardMeta}>{CATEGORY_LABELS[r.category] || r.category} · {r.pointsCost} pts</Text>
                    <View style={styles.cardFooter}>
                      <View style={styles.stockRow}>
                        <Ionicons name="cube" size={10} color="#6B7AA8" />
                        <Text style={styles.stockText}>{r.stock > 999 ? '∞' : `${r.stock} en stock`}</Text>
                      </View>
                      {r.statut === 'inactive' && <Text style={styles.inactiveLabel}>Inactive</Text>}
                    </View>
                  </View>
                  <Text style={styles.cardRedeemed}>{r.totalRedeemed}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1E2A4A' },
  menuBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: '#F1F5F9', letterSpacing: -0.2 },
  subtitle: { fontSize: 10, color: '#6B7AA8', fontWeight: '500', marginTop: 1 },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 12, backgroundColor: '#131A2E', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 6, borderWidth: 1, borderColor: '#1E2A4A' },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 14, fontWeight: '800', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 7, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.2 },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#131A2E', borderRadius: 16, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#1E2A4A' },
  cardIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1, marginLeft: 12, gap: 2 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#F1F5F9' },
  cardMeta: { fontSize: 11, color: '#6B7AA8', fontWeight: '500' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  stockText: { fontSize: 10, color: '#6B7AA8', fontWeight: '500' },
  inactiveLabel: { fontSize: 9, color: '#EF4444', fontWeight: '600' },
  cardRedeemed: { fontSize: 14, fontWeight: '800', color: '#3B82F6', fontVariant: ['tabular-nums'], marginLeft: 8 },
});
