import { useCallback, useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator,
  Animated as RNAnimated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { AdminMockDatasource, type AdminStats } from '../../src/data/datasources/AdminMockDatasource';
import { useAdmin } from '../../src/core/contexts/AdminContext';
import { StatCard } from '../../src/presentation/admin/components/StatCard';
import { ChartCard } from '../../src/presentation/admin/components/ChartCard';
import { BarChart } from '../../src/presentation/admin/components/BarChart';
import { DonutChart } from '../../src/presentation/admin/components/DonutChart';
import { TimelineList } from '../../src/presentation/admin/components/TimelineList';
import { TrendChart } from '../../src/presentation/admin/components/TrendChart';
import { StatDetailModal } from '../../src/presentation/admin/components/StatDetailModal';

const datasource = new AdminMockDatasource();
const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const { admin, logout } = useAdmin();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [selectedStat, setSelectedStat] = useState<{
    key: string; title: string; icon: string; total: string; color: string; fetch: () => Promise<any>;
  } | null>(null);

  const pulseAnim = useRef(new RNAnimated.Value(1)).current;
  const scrollY = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const pulse = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, { toValue: 0.3, duration: 1200, useNativeDriver: true }),
        RNAnimated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const load = useCallback(async () => {
    try {
      const data = await datasource.getStats();
      setStats(data);
    } catch { } finally {
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <LinearGradient
        colors={['#0F172A', '#0A0F1E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerWrap}
      >
        <View style={styles.headerBgPattern}>
          <View style={[styles.headerGlow1, { left: -60, top: -40 }]} />
          <View style={[styles.headerGlow2, { right: -30, bottom: -30 }]} />
          <View style={styles.gridOverlay} />
        </View>

        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.avatarWrap}>
                <LinearGradient colors={['#10B981', '#059669']} style={styles.avatarGradient}>
                  <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.avatarStatus} />
              </View>
              <View>
                <Text style={styles.greeting}>Bonjour, {admin?.name ?? 'Admin'}</Text>
                <View style={styles.timeRow}>
                  <RNAnimated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
                  <Text style={styles.liveLabel}>Live</Text>
                  <View style={styles.timeSep} />
                  <Text style={styles.timeText}>{currentTime}</Text>
                  <View style={styles.timeSep} />
                  <Text style={styles.timeText}>Tableau de bord</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.7}>
              <Ionicons name="log-out-outline" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{stats?.totalReports ?? 0}</Text>
              <Text style={styles.metricLabel}>Signalements</Text>
            </View>
            <View style={styles.metricDiv} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{stats?.activeUsers ?? 0}</Text>
              <Text style={styles.metricLabel}>Actifs</Text>
            </View>
            <View style={styles.metricDiv} />
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: '#FCD34D' }]}>
                {(stats?.totalPointsIssued ?? 0) > 1000
                  ? `${Math.round((stats?.totalPointsIssued ?? 0) / 1000)}k`
                  : stats?.totalPointsIssued ?? 0}
              </Text>
              <Text style={styles.metricLabel}>Points</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
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

  headerWrap: { position: 'relative', overflow: 'hidden' },
  headerBgPattern: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  headerGlow1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: '#10B98106',
  },
  headerGlow2: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#3B82F606',
  },
  gridOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    opacity: 0.03,
    borderWidth: 0,
  },

  headerContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 18 },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatarWrap: { position: 'relative' },
  avatarGradient: {
    width: 46, height: 46, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  avatarStatus: {
    position: 'absolute', bottom: -1, right: -1,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#10B981', borderWidth: 2, borderColor: '#0F172A',
  },
  greeting: { fontSize: 17, fontWeight: '700', color: '#F1F5F9', letterSpacing: -0.2 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#10B981' },
  liveLabel: { fontSize: 9, fontWeight: '700', color: '#10B981', letterSpacing: 0.5 },
  timeSep: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#475569' },
  timeText: { fontSize: 10, color: '#6B7AA8', fontWeight: '500' },
  logoutBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#334155',
  },

  headerMetrics: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#131A2E', borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 10,
    borderWidth: 1, borderColor: '#1E2A4A',
  },
  metricItem: { flex: 1, alignItems: 'center', gap: 2 },
  metricValue: { fontSize: 16, fontWeight: '800', color: '#F1F5F9', letterSpacing: -0.3, fontVariant: ['tabular-nums'] },
  metricLabel: { fontSize: 9, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.3 },
  metricDiv: { width: 1, height: 24, backgroundColor: '#1E2A4A' },

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
