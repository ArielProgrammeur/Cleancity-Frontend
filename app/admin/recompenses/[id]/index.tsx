import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RecompenseApiDatasource } from '../../../../src/data/datasources/RecompenseApiDatasource';

const datasource = new RecompenseApiDatasource();
const CATEGORY_LABELS = datasource.getCategoryLabels();
const CATEGORY_COLORS = datasource.getCategoryColors();

export default function RecompenseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [recompense, setRecompense] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await datasource.getById(id);
      setRecompense(data);
    } catch {} finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = () => {
    Alert.alert('Supprimer', 'Supprimer cette récompense ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        await datasource.delete(id);
        router.back();
      }},
    ]);
  };

  const handleToggle = async () => {
    if (!recompense) return;
    await datasource.update(id, { statut: recompense.statut === 'active' ? 'inactive' : 'active' });
    load();
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingWrap}><ActivityIndicator size="large" color="#10B981" /></View>
      </View>
    );
  }

  if (!recompense) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingWrap}>
          <Ionicons name="alert-circle" size={40} color="#EF4444" />
          <Text style={styles.errorText}>Récompense introuvable</Text>
        </View>
      </View>
    );
  }

  const catColor = (CATEGORY_COLORS as Record<string, string>)[recompense.category] || '#6B7280';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Récompense</Text>
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={() => router.push(`/admin/recompenses/${id}/editer` as any)}>
          <Ionicons name="create-outline" size={16} color="#10B981" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.heroCard}>
          <View style={[styles.heroIcon, { backgroundColor: catColor + '20' }]}>
            <Ionicons name={recompense.imageUrl as any} size={32} color={catColor} />
          </View>
          <Text style={styles.heroTitle}>{recompense.title}</Text>
          <Text style={styles.heroPoints}>{recompense.pointsCost} points</Text>
          <View style={[styles.heroBadge, { backgroundColor: catColor + '15' }]}>
            <Text style={[styles.heroBadgeText, { color: catColor }]}>{(CATEGORY_LABELS as Record<string, string>)[recompense.category] || recompense.category}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{recompense.description}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          <View style={styles.infoGrid}>
            <InfoRow label="Stock" value={recompense.stock > 999 ? 'Illimité' : `${recompense.stock}`} />
            <InfoRow label="Échangés" value={`${recompense.totalRedeemed}`} />
            <InfoRow label="Statut" value={recompense.statut === 'active' ? 'Active' : 'Inactive'} />
            <InfoRow label="Créée le" value={recompense.dateCreation} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <TouchableOpacity style={styles.toggleBtn} onPress={handleToggle}>
            <Ionicons name={recompense.statut === 'active' ? 'pause-circle' : 'play-circle'} size={18} color="#F1F5F9" />
            <Text style={styles.toggleBtnText}>
              {recompense.statut === 'active' ? 'Désactiver' : 'Activer'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
            <Text style={styles.deleteBtnText}>Supprimer</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1E2A4A' },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: '#F1F5F9' },
  editBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#10B98115', alignItems: 'center', justifyContent: 'center' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 14, color: '#6B7AA8', fontWeight: '500', marginTop: 8 },
  heroCard: { alignItems: 'center', backgroundColor: '#131A2E', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#1E2A4A', gap: 8 },
  heroIcon: { width: 72, height: 72, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 20, fontWeight: '700', color: '#F1F5F9', textAlign: 'center' },
  heroPoints: { fontSize: 24, fontWeight: '800', color: '#F59E0B' },
  heroBadge: { paddingHorizontal: 14, paddingVertical: 4, borderRadius: 8 },
  heroBadgeText: { fontSize: 11, fontWeight: '700' },
  section: { marginTop: 16, backgroundColor: '#131A2E', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E2A4A' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  description: { fontSize: 13, color: '#94A3B8', fontWeight: '500', lineHeight: 20 },
  infoGrid: { gap: 0 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1E2A4A' },
  infoLabel: { fontSize: 13, color: '#6B7AA8', fontWeight: '500' },
  infoValue: { fontSize: 13, fontWeight: '700', color: '#F1F5F9' },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, backgroundColor: '#1E293B', borderRadius: 14, marginTop: 16, borderWidth: 1, borderColor: '#334155' },
  toggleBtnText: { fontSize: 15, fontWeight: '600', color: '#F1F5F9' },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, borderRadius: 14, marginTop: 8 },
  deleteBtnText: { fontSize: 14, fontWeight: '600', color: '#EF4444' },
});
