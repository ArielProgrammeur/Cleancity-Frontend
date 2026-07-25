import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { UtilisateurApiDatasource, type Utilisateur } from '../../../../src/data/datasources/UtilisateurApiDatasource';

const datasource = new UtilisateurApiDatasource();
const NIVEAU_COLORS = datasource.getNiveauColors();

export default function UtilisateurDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await datasource.getById(id);
      setUser(data);
    } catch {} finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

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

  if (!user) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingWrap}>
          <Ionicons name="alert-circle" size={40} color="#EF4444" />
          <Text style={styles.errorText}>Utilisateur introuvable</Text>
        </View>
      </View>
    );
  }

  const niveauColor = NIVEAU_COLORS[user.niveau] || '#6B7280';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Profil utilisateur</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.profileCard}>
          <View style={[styles.profileAvatar, { backgroundColor: niveauColor + '20' }]}>
            <Text style={[styles.profileAvatarText, { color: niveauColor }]}>{user.avatar}</Text>
          </View>
          <Text style={styles.profileName}>{user.prenom} {user.nom}</Text>
          <View style={[styles.niveauBadge, { backgroundColor: niveauColor + '15' }]}>
            <Text style={[styles.niveauText, { color: niveauColor }]}>{user.niveau}</Text>
          </View>
          <View style={styles.quickStats}>
            <View style={styles.qsItem}>
              <Text style={styles.qsValue}>{user.points}</Text>
              <Text style={styles.qsLabel}>Points</Text>
            </View>
            <View style={styles.qsDiv} />
            <View style={styles.qsItem}>
              <Text style={styles.qsValue}>{user.signalements}</Text>
              <Text style={styles.qsLabel}>Signalements</Text>
            </View>
            <View style={styles.qsDiv} />
            <View style={styles.qsItem}>
              <Text style={styles.qsValue}>{user.collectes}</Text>
              <Text style={styles.qsLabel}>Collectes</Text>
            </View>
            <View style={styles.qsDiv} />
            <View style={styles.qsItem}>
              <Text style={styles.qsValue}>{user.co2Sauve}kg</Text>
              <Text style={styles.qsLabel}>CO₂</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          <View style={styles.infoGrid}>
            <InfoRow icon="mail" label="Email" value={user.email} />
            <InfoRow icon="call" label="Téléphone" value={user.telephone} />
            <InfoRow icon="location" label="Zone" value={user.zone} />
            <InfoRow icon="calendar" label="Inscrit depuis" value={user.dateInscription} />
            <InfoRow icon="time" label="Dernière activité" value={user.derniereActivite} />
            <InfoRow icon="person" label="Statut" value={user.statut === 'actif' ? 'Actif' : 'Inactif'} />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}><Ionicons name={icon as any} size={14} color="#6B7AA8" /></View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1E2A4A' },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: '#F1F5F9' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 14, color: '#6B7AA8', fontWeight: '500', marginTop: 8 },
  profileCard: { alignItems: 'center', backgroundColor: '#131A2E', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#1E2A4A' },
  profileAvatar: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  profileAvatarText: { fontSize: 24, fontWeight: '800' },
  profileName: { fontSize: 20, fontWeight: '700', color: '#F1F5F9', letterSpacing: -0.3 },
  niveauBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginTop: 6 },
  niveauText: { fontSize: 11, fontWeight: '700' },
  quickStats: { flexDirection: 'row', marginTop: 20, backgroundColor: '#0F172A', borderRadius: 14, padding: 14, width: '100%' },
  qsItem: { flex: 1, alignItems: 'center', gap: 2 },
  qsValue: { fontSize: 16, fontWeight: '800', color: '#F1F5F9', fontVariant: ['tabular-nums'] },
  qsLabel: { fontSize: 9, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.3 },
  qsDiv: { width: 1, height: 24, backgroundColor: '#1E2A4A' },
  section: { marginTop: 16, backgroundColor: '#131A2E', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E2A4A' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  infoGrid: { gap: 0 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1E2A4A' },
  infoIconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 10, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.3 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#F1F5F9', marginTop: 1 },
});
