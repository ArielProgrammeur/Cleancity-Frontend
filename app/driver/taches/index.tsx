import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useDriver } from '../../../src/core/contexts/DriverContext';
import { AssignmentApiDatasource } from '../../../src/data/datasources/AssignmentApiDatasource';
import { ASSIGNMENT_STATUS_CONFIG, type Assignment } from '../../../src/domain/entities/Assignment';

const assignmentDS = new AssignmentApiDatasource();

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'active', label: 'En cours' },
  { key: 'completed', label: 'Terminées' },
];

export default function DriverTaches() {
  const { driver, logout } = useDriver();
  const insets = useSafeAreaInsets();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    if (!driver) return;
    try {
      const data = await assignmentDS.getByConducteur(driver.id);
      setAssignments(data);
    } catch {} finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [driver]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(); };

  const filtered = assignments.filter((a) => {
    if (filter === 'active') return !['completed', 'cancelled'].includes(a.status);
    if (filter === 'completed') return a.status === 'completed';
    return true;
  });

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mes tournées</Text>
        </View>
        <View style={styles.loadingWrap}><ActivityIndicator size="large" color="#10B981" /></View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes tournées</Text>
        <Text style={styles.headerCount}>{filtered.length} signalement{filtered.length > 1 ? 's' : ''}</Text>
      </View>

      <View style={styles.filterRow}>
        {STATUS_FILTERS.map((f) => {
          const isActive = filter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterBtn, isActive && styles.filterBtnActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl tintColor="#10B981" refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={48} color="#2A3A5A" />
            <Text style={styles.emptyTitle}>Aucune tournée</Text>
            <Text style={styles.emptySub}>Vous n'avez pas de tournée dans cette catégorie</Text>
            <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
              <Ionicons name="refresh" size={16} color="#F1F5F9" />
              <Text style={styles.refreshText}>Actualiser</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {filtered.map((a, i) => {
              const asc = ASSIGNMENT_STATUS_CONFIG[a.status];
              return (
                <Animated.View key={a.id} entering={FadeInDown.delay(i * 50).duration(400)}>
                  <TouchableOpacity
                    style={styles.taskCard}
                    onPress={() => router.push(`/driver/taches/${a.id}` as any)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.taskTop}>
                      <View style={[styles.taskBadge, { backgroundColor: asc?.bg ?? '#6B728015' }]}>
                        <Text style={[styles.taskBadgeText, { color: asc?.color ?? '#6B7280' }]}>
                          {asc?.label ?? a.status}
                        </Text>
                      </View>
                      <Text style={styles.taskId}>{a.id}</Text>
                    </View>
                    <Text style={styles.taskTitle}>{a.reportTitle}</Text>
                    <View style={styles.taskMeta}>
                      <Ionicons name="location" size={12} color="#6B7AA8" />
                      <Text style={styles.taskMetaText}>{a.reportLocation}</Text>
                    </View>
                    <View style={styles.taskFooter}>
                      <View style={styles.taskMeta}>
                        <Ionicons name="flag" size={12} color="#6B7AA8" />
                        <Text style={styles.taskMetaText}>{a.reportCategory}</Text>
                      </View>
                      <View style={styles.taskMeta}>
                        <Ionicons name="calendar" size={12} color="#6B7AA8" />
                        <Text style={styles.taskMetaText}>{a.reportDate}</Text>
                      </View>
                    </View>
                    <View style={styles.taskAction}>
                      <Text style={styles.taskActionText}>Voir les détails</Text>
                      <Ionicons name="chevron-forward" size={14} color="#10B981" />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/driver' as any)}>
          <Ionicons name="home" size={20} color="#6B7AA8" />
          <Text style={styles.navLabel}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive} onPress={() => router.push('/driver/taches' as any)}>
          <Ionicons name="list" size={20} color="#10B981" />
          <Text style={styles.navLabelActive}>Tournées</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/driver/profil' as any)}>
          <Ionicons name="person" size={20} color="#6B7AA8" />
          <Text style={styles.navLabel}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1E2A4A' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#F1F5F9' },
  headerCount: { fontSize: 12, color: '#6B7AA8', fontWeight: '500' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1E2A4A' },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: '#131A2E', borderWidth: 1, borderColor: '#1E2A4A' },
  filterBtnActive: { backgroundColor: '#10B98120', borderColor: '#10B98130' },
  filterText: { fontSize: 12, fontWeight: '600', color: '#6B7AA8' },
  filterTextActive: { color: '#10B981' },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#94A3B8' },
  emptySub: { fontSize: 13, color: '#6B7AA8', fontWeight: '500', textAlign: 'center' },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1E293B', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, marginTop: 12 },
  refreshText: { fontSize: 13, fontWeight: '600', color: '#F1F5F9' },
  taskCard: { backgroundColor: '#131A2E', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E2A4A', gap: 8 },
  taskTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  taskBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  taskBadgeText: { fontSize: 10, fontWeight: '700' },
  taskId: { fontSize: 9, color: '#6B7AA8', fontWeight: '500', marginLeft: 'auto' },
  taskTitle: { fontSize: 16, fontWeight: '700', color: '#F1F5F9' },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  taskMetaText: { fontSize: 11, color: '#6B7AA8', fontWeight: '500', flex: 1 },
  taskFooter: { flexDirection: 'row', gap: 16 },
  taskAction: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  taskActionText: { fontSize: 12, fontWeight: '600', color: '#10B981' },
  bottomNav: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#1E2A4A', backgroundColor: '#0F172A', paddingBottom: 12, paddingTop: 8 },
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navItemActive: { flex: 1, alignItems: 'center', gap: 2 },
  navLabel: { fontSize: 10, fontWeight: '600', color: '#6B7AA8' },
  navLabelActive: { fontSize: 10, fontWeight: '600', color: '#10B981' },
});
