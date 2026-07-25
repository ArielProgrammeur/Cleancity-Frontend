import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useSidebar } from '../../../src/core/contexts/SidebarContext';
import { UtilisateurApiDatasource, type Utilisateur } from '../../../src/data/datasources/UtilisateurApiDatasource';

const datasource = new UtilisateurApiDatasource();
const NIVEAU_COLORS = datasource.getNiveauColors();

export default function UtilisateursList() {
  const insets = useSafeAreaInsets();
  const { toggle } = useSidebar();
  const [users, setUsers] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, actifs: 0, totalPoints: 0, totalSignalements: 0, totalCo2: 0 });

  const load = useCallback(async () => {
    try {
      const [data, s] = await Promise.all([datasource.getAll(), datasource.getStats()]);
      setUsers(data);
      setStats(s);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter((u) =>
    `${u.nom} ${u.prenom} ${u.email} ${u.zone} ${u.niveau}`
      .toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={toggle} activeOpacity={0.7}>
          <Ionicons name="menu" size={18} color="#F1F5F9" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Utilisateurs</Text>
          <Text style={styles.subtitle}>{stats.total} inscrits</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.statsRow}>
        {[
          { label: 'Total', value: stats.total, color: '#F1F5F9' },
          { label: 'Actifs', value: stats.actifs, color: '#10B981' },
          { label: 'Points', value: stats.totalPoints.toLocaleString(), color: '#F59E0B' },
          { label: 'Signalements', value: stats.totalSignalements, color: '#3B82F6' },
          { label: 'CO₂ kg', value: stats.totalCo2.toLocaleString(), color: '#8B5CF6' },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color="#6B7AA8" />
        <TextInput style={styles.searchInput} value={search} onChangeText={setSearch} placeholder="Rechercher un utilisateur..." placeholderTextColor="#6B7AA8" />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={16} color="#6B7AA8" /></TouchableOpacity>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.loadingWrap}><ActivityIndicator size="large" color="#10B981" /></View>
      ) : error ? (
        <View style={styles.loadingWrap}>
          <Ionicons name="alert-circle" size={40} color="#EF4444" />
          <Text style={{ color: '#EF4444', fontSize: 13, marginTop: 8 }}>{error}</Text>
          <TouchableOpacity onPress={() => { setLoading(true); load(); }} style={{ marginTop: 12, backgroundColor: '#10B981', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor="#10B981" colors={['#10B981']} progressBackgroundColor="#131A2E" />}
        >
          {filtered.map((u, idx) => (
            <Animated.View key={u.id} entering={FadeInRight.delay(idx * 30).springify().damping(20)}>
              <TouchableOpacity style={styles.card} onPress={() => router.push(`/admin/utilisateurs/${u.id}` as any)} activeOpacity={0.85}>
                <View style={[styles.avatar, { backgroundColor: (NIVEAU_COLORS[u.niveau] || '#6B7280') + '20' }]}>
                  <Text style={[styles.avatarText, { color: NIVEAU_COLORS[u.niveau] || '#6B7280' }]}>{u.avatar}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{u.prenom} {u.nom}</Text>
                  <Text style={styles.cardMeta}>{u.zone} · {u.email}</Text>
                  <View style={styles.cardFooter}>
                    <View style={[styles.niveauBadge, { backgroundColor: (NIVEAU_COLORS[u.niveau] || '#6B7280') + '15' }]}>
                      <Text style={[styles.niveauText, { color: NIVEAU_COLORS[u.niveau] || '#6B7280' }]}>{u.niveau}</Text>
                    </View>
                    <Text style={styles.cardPoints}>{u.points} pts</Text>
                    {u.statut === 'inactif' && <Text style={styles.inactifLabel}>Inactif</Text>}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={14} color="#475569" />
              </TouchableOpacity>
            </Animated.View>
          ))}
          {filtered.length === 0 && (
            <View style={styles.emptyWrap}>
              <Ionicons name="search-outline" size={40} color="#334155" />
              <Text style={styles.emptyText}>Aucun utilisateur trouvé</Text>
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
  statValue: { fontSize: 13, fontWeight: '800', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 7, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.2 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 12, marginBottom: 8, backgroundColor: '#131A2E', borderRadius: 12, paddingHorizontal: 12, height: 40, gap: 8, borderWidth: 1, borderColor: '#1E2A4A' },
  searchInput: { flex: 1, fontSize: 13, color: '#F1F5F9', fontWeight: '500' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#131A2E', borderRadius: 16, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#1E2A4A' },
  avatar: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: '700' },
  cardInfo: { flex: 1, marginLeft: 12, gap: 2 },
  cardName: { fontSize: 14, fontWeight: '600', color: '#F1F5F9' },
  cardMeta: { fontSize: 11, color: '#6B7AA8', fontWeight: '500' },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 },
  niveauBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  niveauText: { fontSize: 9, fontWeight: '700' },
  cardPoints: { fontSize: 10, color: '#F59E0B', fontWeight: '600' },
  inactifLabel: { fontSize: 9, color: '#6B7280', fontWeight: '600' },
  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 13, color: '#475569', fontWeight: '500' },
});
