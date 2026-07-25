import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useDriver } from '../../src/core/contexts/DriverContext';
import { AssignmentApiDatasource } from '../../src/data/datasources/AssignmentApiDatasource';
import { ASSIGNMENT_STATUS_CONFIG, type Assignment } from '../../src/domain/entities/Assignment';

const assignmentDS = new AssignmentApiDatasource();

export default function DriverDashboard() {
  const { driver } = useDriver();
  const insets = useSafeAreaInsets();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const active = assignments.filter((a) => !['completed', 'cancelled'].includes(a.status));
  const completed = assignments.filter((a) => a.status === 'completed');
  const total = assignments.length;

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bonjour, {driver?.name?.split(' ')[0]}</Text>
        </View>
        <View style={styles.loadingWrap}><ActivityIndicator size="large" color="#10B981" /></View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Bonjour, {driver?.name?.split(' ')[0]}</Text>
          <Text style={styles.headerSub}>Zone: {driver?.zone}</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/driver/profil' as any)}>
          <Ionicons name="person-circle" size={32} color="#10B981" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl tintColor="#10B981" refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Animated.View entering={FadeInDown.duration(400)} style={styles.statsRow}>
          <View style={[styles.statCard, { borderLeftColor: '#3B82F6' }]}>
            <Text style={styles.statValue}>{active.length}</Text>
            <Text style={styles.statLabel}>En cours</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
            <Text style={styles.statValue}>{completed.length}</Text>
            <Text style={styles.statLabel}>Terminées</Text>
          </View>
          <View style={[styles.statCard, { borderLeftColor: '#8B5CF6' }]}>
            <Text style={styles.statValue}>{total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tournées actives</Text>
            {active.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/driver/taches' as any)}>
                <Text style={styles.seeAll}>Voir tout</Text>
              </TouchableOpacity>
            )}
          </View>
          {active.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle" size={36} color="#10B981" />
              <Text style={styles.emptyTitle}>Aucune tournée active</Text>
              <Text style={styles.emptySub}>En attente d'assignation</Text>
            </View>
          ) : (
            <View style={styles.taskList}>
              {active.slice(0, 5).map((a) => {
                const asc = ASSIGNMENT_STATUS_CONFIG[a.status];
                return (
                  <TouchableOpacity
                    key={a.id}
                    style={styles.taskCard}
                    onPress={() => router.push(`/driver/taches/${a.id}` as any)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.taskLeft}>
                      <Text style={styles.taskTitle} numberOfLines={1}>{a.reportTitle}</Text>
                      <Text style={styles.taskLocation}>{a.reportLocation}</Text>
                    </View>
                    <View>
                      <View style={[styles.taskBadge, { backgroundColor: asc?.bg ?? '#6B728015' }]}>
                        <Text style={[styles.taskBadgeText, { color: asc?.color ?? '#6B7280' }]}>
                          {asc?.label ?? a.status}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Dernières tournées terminées</Text>
          {completed.length === 0 ? (
            <Text style={styles.noData}>Aucune tournée terminée</Text>
          ) : (
            completed.slice(0, 3).map((a) => {
              const asc = ASSIGNMENT_STATUS_CONFIG[a.status];
              return (
                <View key={a.id} style={styles.historyItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text style={styles.historyTitle} numberOfLines={1}>{a.reportTitle}</Text>
                  <Text style={styles.historyDate}>{a.assignedAt?.split('T')[0]}</Text>
                </View>
              );
            })
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive} onPress={() => router.push('/driver' as any)}>
          <Ionicons name="home" size={20} color="#10B981" />
          <Text style={styles.navLabelActive}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/driver/taches' as any)}>
          <Ionicons name="list" size={20} color="#6B7AA8" />
          <Text style={styles.navLabel}>Tournées</Text>
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
  headerSub: { fontSize: 12, color: '#6B7AA8', fontWeight: '500', marginTop: 1 },
  profileBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, backgroundColor: '#131A2E', borderRadius: 14, padding: 14, borderLeftWidth: 3, borderWidth: 1, borderColor: '#1E2A4A', gap: 4 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#F1F5F9', fontVariant: ['tabular-nums'] },
  statLabel: { fontSize: 10, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.3 },
  section: { marginTop: 20, backgroundColor: '#131A2E', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E2A4A' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  seeAll: { fontSize: 12, fontWeight: '600', color: '#10B981' },
  emptyState: { alignItems: 'center', paddingVertical: 24, gap: 6 },
  emptyTitle: { fontSize: 15, fontWeight: '600', color: '#94A3B8' },
  emptySub: { fontSize: 12, color: '#6B7AA8', fontWeight: '500' },
  taskList: { gap: 8 },
  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#1E2A4A' },
  taskLeft: { flex: 1, gap: 3 },
  taskTitle: { fontSize: 14, fontWeight: '600', color: '#F1F5F9' },
  taskLocation: { fontSize: 11, color: '#6B7AA8', fontWeight: '500' },
  taskBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  taskBadgeText: { fontSize: 10, fontWeight: '700' },
  noData: { fontSize: 13, color: '#6B7AA8', fontWeight: '500', textAlign: 'center', paddingVertical: 12 },
  historyItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#1E2A4A' },
  historyTitle: { flex: 1, fontSize: 13, fontWeight: '500', color: '#F1F5F9' },
  historyDate: { fontSize: 10, color: '#6B7AA8', fontWeight: '500' },
  bottomNav: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#1E2A4A', backgroundColor: '#0F172A', paddingBottom: 12, paddingTop: 8 },
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navItemActive: { flex: 1, alignItems: 'center', gap: 2 },
  navLabel: { fontSize: 10, fontWeight: '600', color: '#6B7AA8' },
  navLabelActive: { fontSize: 10, fontWeight: '600', color: '#10B981' },
});
