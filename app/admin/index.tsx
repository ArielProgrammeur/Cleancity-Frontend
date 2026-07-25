import { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AdminApiDatasource, type AdminStats } from '../../src/data/datasources/AdminApiDatasource';
import { useSidebar } from '../../src/core/contexts/SidebarContext';
import { AdminHeader } from '../../src/presentation/admin/components/AdminHeader';
import { StatCard } from '../../src/presentation/admin/components/StatCard';
import { ChartCard } from '../../src/presentation/admin/components/ChartCard';
import { BarChart } from '../../src/presentation/admin/components/BarChart';
import { DonutChart } from '../../src/presentation/admin/components/DonutChart';
import { TimelineList } from '../../src/presentation/admin/components/TimelineList';
import { TrendChart } from '../../src/presentation/admin/components/TrendChart';
import { StatDetailModal } from '../../src/presentation/admin/components/StatDetailModal';

const datasource = new AdminApiDatasource();

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const { toggle } = useSidebar();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStat, setSelectedStat] = useState<{
    key: string; title: string; icon: string; total: string; color: string; fetch: () => Promise<any>;
  } | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await datasource.getStats();
      setStats(data);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const statConfigs = stats ? [
    { key: 'reports', title: 'Signalements', icon: 'flag', total: `${stats.totalReports}`, color: '#3B82F6', fetch: () => datasource.getSignalementsDetail() },
    { key: 'users', title: 'Utilisateurs', icon: 'people', total: `${stats.activeUsers}`, color: '#10B981', fetch: () => datasource.getUtilisateursDetail() },
    { key: 'points', title: 'Points émis', icon: 'star', total: `${(stats.totalPointsIssued / 1000).toFixed(1)}k`, color: '#F59E0B', fetch: () => datasource.getPointsDetail() },
    { key: 'co2', title: 'CO₂ sauvé', icon: 'leaf', total: `${stats.totalCo2Saved} kg`, color: '#8B5CF6', fetch: () => datasource.getCo2Detail() },
  ] : [];

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="light" />
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Chargement du tableau de bord...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="light" />
        <View style={styles.loadingWrap}>
          <Ionicons name="alert-circle" size={40} color="#EF4444" />
          <Text style={[styles.loadingText, { color: '#EF4444' }]}>{error}</Text>
          <TouchableOpacity onPress={() => { setLoading(true); load(); }} style={{ marginTop: 12, backgroundColor: '#10B981', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <AdminHeader
        totalReports={stats?.totalReports ?? 0}
        activeUsers={stats?.activeUsers ?? 0}
        totalPoints={stats?.totalPointsIssued ?? 0}
        onMenuPress={toggle}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); load(); }}
            tintColor="#10B981"
            colors={['#10B981']}
            progressBackgroundColor="#131A2E"
          />
        }
      >
        {stats && (
          <>
            <Animated.View entering={FadeInDown.duration(500)} style={styles.statsRow}>
              <StatCard
                icon="flag" label="Signalements" value={stats.totalReports}
                color="#3B82F6" index={0}
                onPress={() => setSelectedStat(statConfigs[0])}
              />
              <StatCard
                icon="people" label="Utilisateurs" value={stats.activeUsers}
                color="#10B981" index={1}
                onPress={() => setSelectedStat(statConfigs[1])}
              />
              <StatCard
                icon="star" label="Points émis"
                value={Math.round(stats.totalPointsIssued / 1000)}
                color="#F59E0B" suffix="k" index={2}
                onPress={() => setSelectedStat(statConfigs[2])}
              />
              <StatCard
                icon="leaf" label="CO₂ sauvé" value={stats.totalCo2Saved}
                color="#8B5CF6" suffix="kg" index={3}
                onPress={() => setSelectedStat(statConfigs[3])}
              />
            </Animated.View>

            <ChartCard title="Signalements par catégorie" subtitle="Répartition des déchets signalés" icon="pie-chart" accentColor="#3B82F6">
              <BarChart data={stats.reportsByCategory} />
            </ChartCard>

            <ChartCard title="Statut des signalements" subtitle="État d'avancement" icon="checkmark-circle" accentColor="#10B981">
              <View style={styles.donutRow}>
                <DonutChart data={stats.reportsByStatus} size={150} />
                <View style={styles.legend}>
                  {stats.reportsByStatus.map((d) => (
                    <View key={d.status} style={styles.legendRow}>
                      <View style={styles.legendColorRow}>
                        <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                        <Text style={styles.legendLabel}>{d.status}</Text>
                      </View>
                      <Text style={styles.legendValue}>{d.count}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ChartCard>

            <ChartCard title="Tendance mensuelle" subtitle="Signalements sur 12 mois" icon="trending-up" accentColor="#10B981">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TrendChart data={stats.monthlyReports} />
              </ScrollView>
              <View style={styles.trendFooter}>
                <Text style={styles.trendLabel}>Moy. mensuelle</Text>
                <Text style={styles.trendValue}>
                  {Math.round(stats.monthlyReports.reduce((a: number, b: { count: number }) => a + b.count, 0) / stats.monthlyReports.length)}
                </Text>
                <View style={styles.trendBadge}>
                  <Ionicons name="arrow-up" size={10} color="#10B981" />
                  <Text style={styles.trendBadgeText}>+12%</Text>
                </View>
              </View>
            </ChartCard>

            <ChartCard title="Signalements récents" subtitle="Dernière activité" icon="time" accentColor="#F59E0B">
              <TimelineList reports={stats.recentReports} />
            </ChartCard>
          </>
        )}
      </ScrollView>

      <StatDetailModal
        visible={!!selectedStat}
        title={selectedStat?.title ?? ''}
        icon={selectedStat?.icon ?? ''}
        total={selectedStat?.total ?? ''}
        accentColor={selectedStat?.color ?? '#10B981'}
        fetchData={selectedStat?.fetch ?? (async () => [])}
        onClose={() => setSelectedStat(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  loadingText: { fontSize: 13, color: '#6B7AA8', fontWeight: '500', letterSpacing: 0.3 },

  statsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, marginTop: 16, marginBottom: 4 },
  donutRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  legend: { flex: 1, gap: 10 },
  legendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  legendColorRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 3 },
  legendLabel: { fontSize: 12, fontWeight: '500', color: '#94A3B8' },
  legendValue: { fontSize: 13, fontWeight: '700', color: '#F1F5F9', fontVariant: ['tabular-nums'] },

  trendFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#1E2A4A' },
  trendLabel: { fontSize: 11, color: '#6B7AA8', fontWeight: '500' },
  trendValue: { fontSize: 14, fontWeight: '700', color: '#F1F5F9', fontVariant: ['tabular-nums'] },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#10B98110', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  trendBadgeText: { fontSize: 10, fontWeight: '700', color: '#10B981' },
});
