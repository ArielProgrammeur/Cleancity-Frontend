import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useSidebar } from '../../../src/core/contexts/SidebarContext';
import { SignalementApiDatasource, type Signalement } from '../../../src/data/datasources/SignalementApiDatasource';

const datasource = new SignalementApiDatasource();
const STATUS_CONFIG = datasource.getStatusConfig();
const CATEGORIES = datasource.getCategories();

const FILTERS = [
  { key: 'all', label: 'Tous', icon: 'list' },
  { key: 'pending', label: 'En attente', icon: 'time', color: '#F59E0B' },
  { key: 'approved', label: 'Approuvé', icon: 'checkmark-circle', color: '#3B82F6' },
  { key: 'collected', label: 'Collecté', icon: 'checkmark-done', color: '#10B981' },
  { key: 'rejected', label: 'Rejeté', icon: 'close-circle', color: '#EF4444' },
];

export default function SignalementsList() {
  const insets = useSafeAreaInsets();
  const { toggle } = useSidebar();
  const [signalements, setSignalements] = useState<Signalement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, collected: 0, rejected: 0 });

  const load = useCallback(async () => {
    try {
      const [data, s] = await Promise.all([datasource.getAll(), datasource.getStats()]);
      setSignalements(data);
      setStats(s);
    } catch {} finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = signalements
    .filter((s) => filter === 'all' || s.status === filter)
    .filter((s) =>
      `${s.user} ${s.category} ${s.location} ${s.id}`
        .toLowerCase().includes(search.toLowerCase()),
    );

  const renderBadge = (status: string) => {
    const sc = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? { label: status, color: '#6B7280', bg: '#6B728015' };
    return (
      <View style={[styles.badge, { backgroundColor: sc.bg }]}>
        <View style={[styles.badgeDot, { backgroundColor: sc.color }]} />
        <Text style={[styles.badgeText, { color: sc.color }]}>{sc.label}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={toggle} activeOpacity={0.7}>
          <Ionicons name="menu" size={18} color="#F1F5F9" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Signalements</Text>
          <Text style={styles.subtitle}>{stats.total} au total</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.statsRow}>
        {[
          { label: 'Total', value: stats.total, color: '#F1F5F9' },
          { label: 'En attente', value: stats.pending, color: '#F59E0B' },
          { label: 'Approuvé', value: stats.approved, color: '#3B82F6' },
          { label: 'Collecté', value: stats.collected, color: '#10B981' },
          { label: 'Rejeté', value: stats.rejected, color: '#EF4444' },
        ].map((s, i) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          const color = f.color || '#10B981';
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, isActive && { backgroundColor: color + '20', borderColor: color }]}
              onPress={() => setFilter(f.key)}
            >
              <Ionicons name={f.icon as any} size={14} color={isActive ? color : '#6B7AA8'} />
              <Text style={[styles.filterChipText, isActive && { color, fontWeight: '700' }]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color="#6B7AA8" />
        <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="Rechercher..." placeholderTextColor="#6B7AA8" />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={16} color="#6B7AA8" /></TouchableOpacity>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.loadingWrap}><ActivityIndicator size="large" color="#10B981" /></View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor="#10B981" colors={['#10B981']} progressBackgroundColor="#131A2E" />}
        >
          {filtered.map((s, idx) => (
            <Animated.View key={s.id} entering={FadeInRight.delay(idx * 30).springify().damping(20)}>
              <TouchableOpacity style={styles.card} onPress={() => router.push(`/admin/signalements/${s.id}` as any)} activeOpacity={0.85}>
                <View style={styles.cardLeft}>
                  <View style={[styles.cardIcon, { backgroundColor: s.categoryColor + '20' }]}>
                    <View style={[styles.cardIconBadge, { backgroundColor: STATUS_CONFIG[s.status]?.color || '#6B7280' }]} />
                    <Ionicons name="flag" size={16} color={s.categoryColor} />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardUser}>{s.user}</Text>
                    <Text style={styles.cardMeta}>{s.category} · {s.location}</Text>
                    <View style={styles.cardFooter}>
                      {renderBadge(s.status)}
                      <Text style={styles.cardDate}>{s.date}</Text>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={14} color="#475569" />
              </TouchableOpacity>
            </Animated.View>
          ))}
          {filtered.length === 0 && (
            <View style={styles.emptyWrap}>
              <Ionicons name="search-outline" size={40} color="#334155" />
              <Text style={styles.emptyText}>Aucun signalement trouvé</Text>
            </View>
          )}
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
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 12, backgroundColor: '#131A2E', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 6, borderWidth: 1, borderColor: '#1E2A4A' },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 15, fontWeight: '800', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 8, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.2 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 16, marginTop: 12, marginBottom: 4 },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E2A4A' },
  filterChipText: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 8, marginBottom: 8, backgroundColor: '#131A2E', borderRadius: 12, paddingHorizontal: 12, height: 40, gap: 8, borderWidth: 1, borderColor: '#1E2A4A' },
  searchInput: { flex: 1, fontSize: 13, color: '#F1F5F9', fontWeight: '500' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#131A2E', borderRadius: 16, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#1E2A4A' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  cardIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardIconBadge: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: '#0A0F1E' },
  cardInfo: { gap: 2, flex: 1 },
  cardUser: { fontSize: 14, fontWeight: '600', color: '#F1F5F9' },
  cardMeta: { fontSize: 11, color: '#6B7AA8', fontWeight: '500' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeDot: { width: 4, height: 4, borderRadius: 2 },
  badgeText: { fontSize: 9, fontWeight: '700' },
  cardDate: { fontSize: 10, color: '#475569', fontWeight: '500' },
  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 13, color: '#475569', fontWeight: '500' },
});
