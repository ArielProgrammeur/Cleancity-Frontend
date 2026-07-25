import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';
import { api } from '../../../core/api/api';

const { width, height } = Dimensions.get('window');

interface DriverPosition {
  driver_id: string;
  truck_id: string | null;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
  assignment_id: string | null;
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  en_route: '#4CAF50',
  collecting: '#FF9800',
  idle: '#9E9E9E',
  out_of_service: '#F44336',
};

const STATUS_LABELS: Record<string, string> = {
  en_route: 'En route',
  collecting: 'Collecte',
  idle: 'Arrêté',
  out_of_service: 'Hors service',
};

export default function TrackingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [positions, setPositions] = useState<DriverPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<DriverPosition | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPositions = async () => {
    try {
      const data = await api.get<{ positions: DriverPosition[]; count: number }>('/api/tracking/positions');
      setPositions(data.positions);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
    intervalRef.current = setInterval(fetchPositions, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const getStatusColor = (status: string) => STATUS_COLORS[status] || '#9E9E9E';
  const getStatusLabel = (status: string) => STATUS_LABELS[status] || status;

  const formatTime = (timestamp: string) => {
    if (!timestamp) return '--:--';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ title: 'Suivi temps réel', headerTintColor: colors.primary }} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement des positions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Suivi temps réel', headerTintColor: colors.primary }} />

      {error && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning" size={16} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={80} color={colors.border} />
          <Text style={styles.mapPlaceholderText}>Carte Google Maps</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            Intégration react-native-maps
          </Text>

          {positions.map((pos) => (
            <TouchableOpacity
              key={pos.driver_id}
              style={[
                styles.mapMarker,
                { backgroundColor: getStatusColor(pos.status) },
                selectedDriver?.driver_id === pos.driver_id && styles.mapMarkerSelected,
              ]}
              onPress={() => setSelectedDriver(pos)}
            >
              <Ionicons name="car" size={14} color="white" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{positions.length}</Text>
          <Text style={styles.statLabel}>Véhicules</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#4CAF50' }]}>
            {positions.filter(p => p.status === 'en_route').length}
          </Text>
          <Text style={styles.statLabel}>En route</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#FF9800' }]}>
            {positions.filter(p => p.status === 'collecting').length}
          </Text>
          <Text style={styles.statLabel}>Collecte</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#F44336' }]}>
            {positions.filter(p => p.status === 'out_of_service').length}
          </Text>
          <Text style={styles.statLabel}>Hors service</Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Liste des véhicules</Text>
        {positions.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={48} color={colors.border} />
            <Text style={styles.emptyText}>Aucun véhicule actif</Text>
          </View>
        ) : (
          positions.map((pos) => (
            <TouchableOpacity
              key={pos.driver_id}
              style={[
                styles.driverCard,
                selectedDriver?.driver_id === pos.driver_id && styles.driverCardSelected,
              ]}
              onPress={() => setSelectedDriver(pos)}
            >
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(pos.status) }]} />
              <View style={styles.driverInfo}>
                <Text style={styles.driverId}>{pos.driver_id.slice(0, 8)}...</Text>
                <Text style={styles.driverStatus}>{getStatusLabel(pos.status)}</Text>
                <Text style={styles.driverTime}>MAJ: {formatTime(pos.timestamp)}</Text>
              </View>
              <View style={styles.driverCoords}>
                <Text style={styles.coordText}>{pos.latitude.toFixed(4)}</Text>
                <Text style={styles.coordText}>{pos.longitude.toFixed(4)}</Text>
                <Text style={styles.speedText}>{pos.speed.toFixed(1)} km/h</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ))
        )}
      </View>

      {selectedDriver && (
        <View style={styles.detailPanel}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>
              Détails - {selectedDriver.driver_id.slice(0, 8)}...
            </Text>
            <TouchableOpacity onPress={() => setSelectedDriver(null)}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text style={styles.detailText}>
              {selectedDriver.latitude.toFixed(6)}, {selectedDriver.longitude.toFixed(6)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="speedometer" size={16} color={colors.primary} />
            <Text style={styles.detailText}>Vitesse: {selectedDriver.speed.toFixed(1)} km/h</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color={colors.primary} />
            <Text style={styles.detailText}>Dernière MAJ: {formatTime(selectedDriver.timestamp)}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  loadingText: { marginTop: spacing.md, color: colors.textSecondary, fontSize: 14 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', padding: spacing.sm, gap: spacing.xs, marginHorizontal: spacing.md, marginTop: spacing.sm, borderRadius: borderRadius.md },
  errorText: { color: colors.error, fontSize: 12 },
  mapContainer: { height: height * 0.35, margin: spacing.md, borderRadius: borderRadius.lg, overflow: 'hidden' },
  mapPlaceholder: { flex: 1, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  mapPlaceholderText: { fontSize: 16, fontWeight: '600', color: colors.textSecondary, marginTop: spacing.sm },
  mapPlaceholderSubtext: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs },
  mapMarker: { position: 'absolute', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
  mapMarkerSelected: { transform: [{ scale: 1.3 }], borderWidth: 3 },
  statsBar: { flexDirection: 'row', backgroundColor: colors.white, marginHorizontal: spacing.md, padding: spacing.md, borderRadius: borderRadius.lg, alignItems: 'center', elevation: 2 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: colors.border },
  listContainer: { flex: 1, marginTop: spacing.md, paddingHorizontal: spacing.md },
  listTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.sm },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { marginTop: spacing.sm, color: colors.textSecondary, fontSize: 14 },
  driverCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.sm, elevation: 1 },
  driverCardSelected: { borderWidth: 2, borderColor: colors.primary },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
  driverInfo: { flex: 1 },
  driverId: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  driverStatus: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  driverTime: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  driverCoords: { alignItems: 'flex-end', marginRight: spacing.sm },
  coordText: { fontSize: 11, color: colors.textSecondary, fontFamily: 'monospace' },
  speedText: { fontSize: 11, color: colors.primary, fontWeight: '600', marginTop: 2 },
  detailPanel: { backgroundColor: colors.white, padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  detailTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  detailText: { fontSize: 13, color: colors.textSecondary },
});
