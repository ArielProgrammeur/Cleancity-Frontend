import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';
import { api } from '../../../core/api/api';

interface Prediction {
  id: string;
  zone_id: string;
  zone_name: string;
  date: string;
  predicted_volume_kg: number;
  confidence: number;
  waste_type: string;
  created_at: string;
  model_version: string;
}

const ZONES = [
  { id: 'bonamoussadi', name: 'Bonamoussadi' },
  { id: 'bonapriso', name: 'Bonapriso' },
  { id: 'deido', name: 'Deido' },
  { id: 'bonaberi', name: 'Bonaberi' },
  { id: 'makepe', name: 'Makepe' },
  { id: 'logbaba', name: 'Logbaba' },
];

const WASTE_TYPE_LABELS: Record<string, string> = {
  organique: 'Organique',
  plastique: 'Plastique',
  verre: 'Verre',
  metal: 'Métal',
  papier: 'Papier',
  electronique: 'Électronique',
};

export default function PredictionsScreen() {
  const { t } = useTranslation();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const fetchPredictions = async (zone?: string) => {
    try {
      let endpoint = '/api/predictions/?limit=50';
      if (zone) endpoint += `&zone_id=${zone}`;
      const data = await api.get<Prediction[]>(endpoint);
      setPredictions(data);
    } catch (err: any) {
      console.error('Erreur predictions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPredictions(selectedZone || undefined);
  }, [selectedZone]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPredictions(selectedZone || undefined);
  };

  const generatePredictions = async (zoneId: string, zoneName: string) => {
    setGenerating(true);
    try {
      await api.post('/api/predictions/generate', {
        zone_id: zoneId,
        zone_name: zoneName,
        waste_type: 'organique',
        days: 7,
      });
      fetchPredictions(selectedZone || undefined);
    } catch (err: any) {
      console.error('Erreur génération:', err);
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return colors.success;
    if (confidence >= 0.6) return colors.warning;
    return colors.error;
  };

  const zonePredictions = selectedZone
    ? predictions.filter(p => p.zone_id === selectedZone)
    : predictions;

  const totalVolume = zonePredictions.reduce((sum, p) => sum + p.predicted_volume_kg, 0);
  const avgConfidence = zonePredictions.length > 0
    ? zonePredictions.reduce((sum, p) => sum + p.confidence, 0) / zonePredictions.length
    : 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ title: 'Prédictions IA', headerTintColor: colors.primary }} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement des prédictions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Prédictions IA', headerTintColor: colors.primary }} />

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="stats-chart" size={24} color={colors.primary} />
              <Text style={styles.summaryValue}>{totalVolume.toFixed(0)} kg</Text>
              <Text style={styles.summaryLabel}>Volume total prédit</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <Text style={styles.summaryValue}>{(avgConfidence * 100).toFixed(0)}%</Text>
              <Text style={styles.summaryLabel}>Confiance moyenne</Text>
            </View>
          </View>
        </View>

        <View style={styles.zonesSection}>
          <Text style={styles.sectionTitle}>Zones</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.zonesScroll}>
            <TouchableOpacity
              style={[styles.zoneChip, !selectedZone && styles.zoneChipActive]}
              onPress={() => setSelectedZone(null)}
            >
              <Text style={[styles.zoneChipText, !selectedZone && styles.zoneChipTextActive]}>Toutes</Text>
            </TouchableOpacity>
            {ZONES.map(zone => (
              <TouchableOpacity
                key={zone.id}
                style={[styles.zoneChip, selectedZone === zone.id && styles.zoneChipActive]}
                onPress={() => setSelectedZone(zone.id)}
              >
                <Text style={[styles.zoneChipText, selectedZone === zone.id && styles.zoneChipTextActive]}>
                  {zone.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.generateSection}>
          {ZONES.filter(z => !selectedZone || z.id === selectedZone).map(zone => (
            <TouchableOpacity
              key={zone.id}
              style={styles.generateButton}
              onPress={() => generatePredictions(zone.id, zone.name)}
              disabled={generating}
            >
              <Ionicons name="sparkles" size={16} color={colors.primary} />
              <Text style={styles.generateText}>
                Générer pour {zone.name}
              </Text>
              {generating && <ActivityIndicator size="small" color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.predictionsSection}>
          <Text style={styles.sectionTitle}>Prédictions ({zonePredictions.length})</Text>
          {zonePredictions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="analytics-outline" size={48} color={colors.border} />
              <Text style={styles.emptyText}>Aucune prédiction disponible</Text>
              <Text style={styles.emptySubtext}>Générez des prédictions pour une zone</Text>
            </View>
          ) : (
            zonePredictions.map((pred) => (
              <View key={pred.id} style={styles.predictionCard}>
                <View style={styles.predictionHeader}>
                  <View style={styles.predictionZone}>
                    <Ionicons name="location" size={14} color={colors.primary} />
                    <Text style={styles.predictionZoneName}>{pred.zone_name || pred.zone_id}</Text>
                  </View>
                  <View style={[styles.confidenceBadge, { backgroundColor: getConfidenceColor(pred.confidence) + '20' }]}>
                    <Text style={[styles.confidenceText, { color: getConfidenceColor(pred.confidence) }]}>
                      {(pred.confidence * 100).toFixed(0)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.predictionBody}>
                  <Text style={styles.predictionDate}>{formatDate(pred.date)}</Text>
                  <Text style={styles.predictionVolume}>{pred.predicted_volume_kg.toFixed(1)} kg</Text>
                  <Text style={styles.predictionType}>
                    {WASTE_TYPE_LABELS[pred.waste_type] || pred.waste_type}
                  </Text>
                </View>

                <View style={styles.predictionFooter}>
                  <Text style={styles.modelVersion}>{pred.model_version}</Text>
                  <Text style={styles.predictionTime}>
                    {new Date(pred.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  loadingText: { marginTop: spacing.md, color: colors.textSecondary, fontSize: 14 },
  summaryCard: { backgroundColor: colors.white, margin: spacing.md, padding: spacing.lg, borderRadius: borderRadius.lg, elevation: 2 },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.xs },
  summaryLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  summaryDivider: { width: 1, height: 40, backgroundColor: colors.border },
  zonesSection: { paddingHorizontal: spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.sm },
  zonesScroll: { marginBottom: spacing.md },
  zoneChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.white, marginRight: spacing.sm, borderWidth: 1, borderColor: colors.border },
  zoneChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  zoneChipText: { fontSize: 13, color: colors.textSecondary },
  zoneChipTextActive: { color: colors.white, fontWeight: '600' },
  generateSection: { paddingHorizontal: spacing.md, marginBottom: spacing.md },
  generateButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.sm, gap: spacing.sm, borderWidth: 1, borderColor: colors.primary + '30' },
  generateText: { flex: 1, fontSize: 13, color: colors.primary, fontWeight: '500' },
  predictionsSection: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { marginTop: spacing.sm, fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  emptySubtext: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs },
  predictionCard: { backgroundColor: colors.white, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, elevation: 1 },
  predictionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  predictionZone: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  predictionZoneName: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  confidenceBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  confidenceText: { fontSize: 12, fontWeight: '600' },
  predictionBody: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.md, marginBottom: spacing.sm },
  predictionDate: { fontSize: 13, color: colors.textSecondary },
  predictionVolume: { fontSize: 22, fontWeight: '700', color: colors.primary },
  predictionType: { fontSize: 12, color: colors.textSecondary, backgroundColor: colors.surfaceVariant, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  predictionFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  modelVersion: { fontSize: 11, color: colors.textSecondary },
  predictionTime: { fontSize: 11, color: colors.textSecondary },
});
