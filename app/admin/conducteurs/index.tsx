import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInRight, FadeInDown } from 'react-native-reanimated';
import { useSidebar } from '../../../src/core/contexts/SidebarContext';
import { ConducteurApiDatasource } from '../../../src/data/datasources/ConducteurApiDatasource';
import type { Conducteur } from '../../../src/domain/entities/Conducteur';

const datasource = new ConducteurApiDatasource();

const STATUT_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  actif: { label: 'Actif', color: '#10B981', bg: '#10B98115' },
  inactif: { label: 'Inactif', color: '#6B7280', bg: '#6B728015' },
  suspendu: { label: 'Suspendu', color: '#EF4444', bg: '#EF444415' },
};

export default function ConducteurList() {
  const insets = useSafeAreaInsets();
  const { toggle } = useSidebar();
  const [conducteurs, setConducteurs] = useState<Conducteur[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, actifs: 0, totalTraites: 0 });

  const load = useCallback(async () => {
    try {
      const [data, s] = await Promise.all([datasource.getAll(), datasource.getStats()]);
      setConducteurs(data);
      setStats(s);
    } catch {} finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = conducteurs.filter((c) =>
    `${c.nom} ${c.prenom} ${c.email} ${c.zone} ${c.vehiculeImmatriculation}`
      .toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={toggle} activeOpacity={0.7}>
          <Ionicons name="menu" size={18} color="#F1F5F9" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Conducteurs</Text>
          <Text style={styles.subtitle}>{stats.total} inscrits</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/admin/conducteurs/creer' as any)} activeOpacity={0.7}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDiv} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#10B981' }]}>{stats.actifs}</Text>
          <Text style={styles.statLabel}>Actifs</Text>
        </View>
        <View style={styles.statDiv} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalTraites.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Traités</Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color="#6B7AA8" />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher un conducteur..."
          placeholderTextColor="#6B7AA8"
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color="#6B7AA8" />
          </TouchableOpacity>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor="#10B981" colors={['#10B981']} progressBackgroundColor="#131A2E" />}
        >
          {filtered.map((c, idx) => {
            const sc = STATUT_CONFIG[c.statut] ?? STATUT_CONFIG.inactif;
            return (
              <Animated.View key={c.id} entering={FadeInRight.delay(idx * 30).springify().damping(20)}>
                <TouchableOpacity style={styles.card} onPress={() => router.push(`/admin/conducteurs/${c.id}` as any)} activeOpacity={0.85}>
                  <View style={styles.cardLeft}>
                    <View style={[styles.avatar, { backgroundColor: c.statut === 'actif' ? '#10B98120' : '#1E293B' }]}>
                      <Text style={[styles.avatarText, { color: c.statut === 'actif' ? '#10B981' : '#6B7AA8' }]}>
                        {c.prenom.charAt(0)}{c.nom.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardName}>{c.prenom} {c.nom}</Text>
                      <Text style={styles.cardZone}>{c.zone}</Text>
                      <View style={styles.cardMeta}>
                        <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                          <View style={[styles.badgeDot, { backgroundColor: sc.color }]} />
                          <Text style={[styles.badgeText, { color: sc.color }]}>{sc.label}</Text>
                        </View>
                        <Text style={styles.cardTraites}>{c.signalementsTraites} traités</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.cardRight}>
                    <Text style={styles.cardCompletion}>{c.tauxCompletion}%</Text>
                    <Ionicons name="chevron-forward" size={14} color="#475569" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
          {filtered.length === 0 && (
            <View style={styles.emptyWrap}>
              <Ionicons name="search-outline" size={40} color="#334155" />
              <Text style={styles.emptyText}>Aucun conducteur trouvé</Text>
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
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginTop: 12, backgroundColor: '#131A2E', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#1E2A4A' },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#F1F5F9', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 10, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.3 },
  statDiv: { width: 1, height: 28, backgroundColor: '#1E2A4A' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 12, marginBottom: 8, backgroundColor: '#131A2E', borderRadius: 12, paddingHorizontal: 12, height: 42, gap: 8, borderWidth: 1, borderColor: '#1E2A4A' },
  searchInput: { flex: 1, fontSize: 13, color: '#F1F5F9', fontWeight: '500' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#131A2E', borderRadius: 16, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#1E2A4A' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 15, fontWeight: '700' },
  cardInfo: { gap: 2, flex: 1 },
  cardName: { fontSize: 14, fontWeight: '600', color: '#F1F5F9' },
  cardZone: { fontSize: 11, color: '#6B7AA8', fontWeight: '500' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeDot: { width: 4, height: 4, borderRadius: 2 },
  badgeText: { fontSize: 9, fontWeight: '700' },
  cardTraites: { fontSize: 10, color: '#475569', fontWeight: '500' },
  cardRight: { alignItems: 'flex-end', gap: 4, marginLeft: 8 },
  cardCompletion: { fontSize: 15, fontWeight: '800', color: '#F1F5F9', fontVariant: ['tabular-nums'] },
  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 13, color: '#475569', fontWeight: '500' },
});
