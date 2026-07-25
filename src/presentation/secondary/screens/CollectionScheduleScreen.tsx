import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';
import { api } from '../../../core/api/api';

interface CollectionRoute {
  id: string;
  name: string;
  description: string;
  day_of_week: number;
  time: string;
  waypoints: Waypoint[];
}

interface Waypoint {
  latitude: number;
  longitude: number;
  address: string;
  order: number;
}

interface OptimizedRoute {
  id: string;
  zone: string;
  optimized_distance_km: number;
  original_distance_km: number;
  reduction_percent: number;
  waypoints: OptimizedWaypoint[];
  created_at: string;
  day_of_week: number;
  estimated_duration_min: number;
}

interface OptimizedWaypoint {
  report_id: string;
  latitude: number;
  longitude: number;
  address: string;
  order: number;
  waste_type: string;
}

const DAYS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function CollectionScheduleScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [routes, setRoutes] = useState<CollectionRoute[]>([]);
  const [optimizedRoutes, setOptimizedRoutes] = useState<OptimizedRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [routesData, optimizedData] = await Promise.all([
        api.get<CollectionRoute[]>('/api/routes/optimizations?limit=5').catch(() => []),
        api.get<OptimizedRoute[]>('/api/routes/optimizations?limit=10').catch(() => []),
      ]);
      setRoutes(routesData);
      setOptimizedRoutes(optimizedData);
    } catch (err) {
      console.error('Erreur chargement planning:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const today = new Date().getDay();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ title: 'Planning de collecte', headerTintColor: colors.primary }} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Planning de collecte', headerTintColor: colors.primary }} />

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.todayCard}>
          <View style={styles.todayHeader}>
            <Ionicons name="today" size={20} color={colors.primary} />
            <Text style={styles.todayTitle}>Aujourd'hui</Text>
          </View>
          <Text style={styles.todayDay}>{DAYS_FR[today]}</Text>
          <Text style={styles.todayDate}>
            {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Routes optimisées par l'IA</Text>
          {optimizedRoutes.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="git-network-outline" size={40} color={colors.border} />
              <Text style={styles.emptyText}>Aucune route optimisée</Text>
              <TouchableOpacity
                style={styles.optimizeButton}
                onPress={() => router.push('/(tabs)/admin' as any)}
              >
                <Ionicons name="sparkles" size={16} color={colors.primary} />
                <Text style={styles.optimizeButtonText}>Optimiser les routes</Text>
              </TouchableOpacity>
            </View>
          ) : (
            optimizedRoutes.map((route) => (
              <View key={route.id} style={styles.routeCard}>
                <View style={styles.routeHeader}>
                  <View style={styles.routeZone}>
                    <Ionicons name="location" size={14} color={colors.primary} />
                    <Text style={styles.routeZoneName}>{route.zone}</Text>
                  </View>
                  <View style={styles.reductionBadge}>
                    <Text style={styles.reductionText}>-{route.reduction_percent.toFixed(0)}%</Text>
                  </View>
                </View>

                <View style={styles.routeStats}>
                  <View style={styles.routeStat}>
                    <Text style={styles.routeStatValue}>{route.optimized_distance_km.toFixed(1)} km</Text>
                    <Text style={styles.routeStatLabel}>Distance optimisée</Text>
                  </View>
                  <View style={styles.routeStat}>
                    <Text style={styles.routeStatValue}>{route.original_distance_km.toFixed(1)} km</Text>
                    <Text style={styles.routeStatLabel}>Distance originale</Text>
                  </View>
                  <View style={styles.routeStat}>
                    <Text style={styles.routeStatValue}>{route.estimated_duration_min.toFixed(0)} min</Text>
                    <Text style={styles.routeStatLabel}>Durée estimée</Text>
                  </View>
                </View>

                <View style={styles.waypointsList}>
                  {route.waypoints.slice(0, 5).map((wp, idx) => (
                    <View key={wp.report_id || idx} style={styles.waypointItem}>
                      <View style={[styles.waypointNumber, { backgroundColor: colors.primary }]}>
                        <Text style={styles.waypointNumberText}>{wp.order}</Text>
                      </View>
                      <Text style={styles.waypointAddress} numberOfLines={1}>
                        {wp.address || `Point ${wp.order}`}
                      </Text>
                      <View style={[styles.wasteTypeBadge, { backgroundColor: getWasteColor(wp.waste_type) + '20' }]}>
                        <Text style={[styles.wasteTypeText, { color: getWasteColor(wp.waste_type) }]}>
                          {wp.waste_type}
                        </Text>
                      </View>
                    </View>
                  ))}
                  {route.waypoints.length > 5 && (
                    <Text style={styles.moreWaypoints}>
                      +{route.waypoints.length - 5} autres points
                    </Text>
                  )}
                </View>

                <Text style={styles.routeDate}>
                  {new Date(route.created_at).toLocaleDateString('fr-FR')}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horaires habituels</Text>
          <View style={styles.scheduleGrid}>
            {DAYS_FR.map((day, idx) => (
              <View key={day} style={[styles.scheduleDay, idx === today && styles.scheduleDayActive]}>
                <Text style={[styles.scheduleDayName, idx === today && styles.scheduleDayNameActive]}>
                  {day.slice(0, 3)}
                </Text>
                <Ionicons
                  name={idx === today ? "checkmark-circle" : "time-outline"}
                  size={16}
                  color={idx === today ? colors.primary : colors.textSecondary}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="bulb" size={20} color={colors.warning} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Optimisation IA</Text>
              <Text style={styles.infoText}>
                Les routes sont calculées par un algorithme génétique qui réduit les distances de collecte de 30%.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function getWasteColor(type: string): string {
  const colors: Record<string, string> = {
    organique: '#84CC16',
    plastique: '#3B82F6',
    verre: '#10B981',
    metal: '#6366F1',
    papier: '#F59E0B',
    electronique: '#8B5CF6',
  };
  return colors[type] || '#6B7280';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  todayCard: { backgroundColor: colors.primary, margin: spacing.md, padding: spacing.lg, borderRadius: borderRadius.lg },
  todayHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  todayTitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  todayDay: { fontSize: 24, fontWeight: '700', color: colors.white },
  todayDate: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: spacing.xs },
  section: { paddingHorizontal: spacing.md, marginBottom: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.md },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl, backgroundColor: colors.white, borderRadius: borderRadius.lg },
  emptyText: { marginTop: spacing.sm, fontSize: 14, color: colors.textSecondary },
  optimizeButton: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.primary + '10', borderRadius: borderRadius.full, gap: spacing.xs },
  optimizeButtonText: { fontSize: 13, color: colors.primary, fontWeight: '500' },
  routeCard: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, elevation: 1 },
  routeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  routeZone: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  routeZoneName: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  reductionBadge: { backgroundColor: colors.success + '20', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  reductionText: { fontSize: 12, fontWeight: '600', color: colors.success },
  routeStats: { flexDirection: 'row', marginBottom: spacing.md, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  routeStat: { flex: 1, alignItems: 'center' },
  routeStatValue: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  routeStatLabel: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  waypointsList: { marginBottom: spacing.sm },
  waypointItem: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm },
  waypointNumber: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  waypointNumberText: { fontSize: 10, color: colors.white, fontWeight: '600' },
  waypointAddress: { flex: 1, fontSize: 13, color: colors.textSecondary },
  wasteTypeBadge: { paddingHorizontal: spacing.xs, paddingVertical: 1, borderRadius: borderRadius.sm },
  wasteTypeText: { fontSize: 10, fontWeight: '500' },
  moreWaypoints: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  routeDate: { fontSize: 11, color: colors.textSecondary, textAlign: 'right' },
  scheduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  scheduleDay: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.md, minWidth: '48%', flex: 1 },
  scheduleDayActive: { backgroundColor: colors.primary + '10', borderWidth: 1, borderColor: colors.primary },
  scheduleDayName: { fontSize: 13, color: colors.textSecondary },
  scheduleDayNameActive: { color: colors.primary, fontWeight: '600' },
  infoSection: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  infoCard: { flexDirection: 'row', backgroundColor: colors.warning + '10', padding: spacing.md, borderRadius: borderRadius.lg, gap: spacing.md },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.xs },
  infoText: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
});
