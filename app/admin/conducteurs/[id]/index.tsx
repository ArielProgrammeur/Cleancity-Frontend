import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { ConducteurApiDatasource } from '../../../../src/data/datasources/ConducteurApiDatasource';
import { AssignmentApiDatasource } from '../../../../src/data/datasources/AssignmentApiDatasource';
import { ASSIGNMENT_STATUS_CONFIG, type Assignment } from '../../../../src/domain/entities/Assignment';
import type { Conducteur } from '../../../../src/domain/entities/Conducteur';
import { useSidebar } from '../../../../src/core/contexts/SidebarContext';

const datasource = new ConducteurApiDatasource();
const assignmentDS = new AssignmentApiDatasource();

const STATUT_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  actif: { label: 'Actif', color: '#10B981', bg: '#10B98115' },
  inactif: { label: 'Inactif', color: '#6B7280', bg: '#6B728015' },
  suspendu: { label: 'Suspendu', color: '#EF4444', bg: '#EF444415' },
};

export default function ConducteurDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { toggle } = useSidebar();
  const [conducteur, setConducteur] = useState<Conducteur | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [data, asgs] = await Promise.all([
        datasource.getById(id),
        assignmentDS.getByConducteur(id),
      ]);
      setConducteur(data);
      setAssignments(asgs);
    } catch {} finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = () => {
    Alert.alert('Supprimer le conducteur', `Êtes-vous sûr de vouloir supprimer ${conducteur?.prenom} ${conducteur?.nom} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        await datasource.delete(id);
        router.back();
      }},
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingWrap}><ActivityIndicator size="large" color="#10B981" /></View>
      </View>
    );
  }

  if (!conducteur) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingWrap}>
          <Ionicons name="alert-circle" size={40} color="#EF4444" />
          <Text style={styles.errorText}>Conducteur introuvable</Text>
        </View>
      </View>
    );
  }

  const sc = STATUT_CONFIG[conducteur.statut] ?? STATUT_CONFIG.inactif;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Détail conducteur</Text>
        </View>
        <TouchableOpacity style={styles.editBtn} onPress={() => router.push(`/admin/conducteurs/${id}/editer` as any)}>
          <Ionicons name="create-outline" size={16} color="#10B981" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.profileCard}>
          <View style={styles.profileGlow} />
          <View style={styles.profileTop}>
            <View style={[styles.profileAvatar, { backgroundColor: sc.color + '20' }]}>
              <Text style={[styles.profileAvatarText, { color: sc.color }]}>
                {conducteur.prenom.charAt(0)}{conducteur.nom.charAt(0)}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{conducteur.prenom} {conducteur.nom}</Text>
              <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                <View style={[styles.badgeDot, { backgroundColor: sc.color }]} />
                <Text style={[styles.badgeText, { color: sc.color }]}>{sc.label}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>

          <View style={styles.quickStats}>
            <View style={styles.qsItem}>
              <Text style={styles.qsValue}>{conducteur.signalementsTraites}</Text>
              <Text style={styles.qsLabel}>Traités</Text>
            </View>
            <View style={styles.qsDiv} />
            <View style={styles.qsItem}>
              <Text style={styles.qsValue}>{conducteur.tauxCompletion}%</Text>
              <Text style={styles.qsLabel}>Completion</Text>
            </View>
            <View style={styles.qsDiv} />
            <View style={styles.qsItem}>
              <Text style={styles.qsValue}>{conducteur.rotation}</Text>
              <Text style={styles.qsLabel}>Tournées</Text>
            </View>
            <View style={styles.qsDiv} />
            <View style={styles.qsItem}>
              <Text style={styles.qsValue}>{conducteur.tempsMoyen}min</Text>
              <Text style={styles.qsLabel}>Moyenne</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <View style={styles.infoGrid}>
            <InfoRow icon="mail" label="Email" value={conducteur.email} />
            <InfoRow icon="call" label="Téléphone" value={conducteur.telephone} />
            <InfoRow icon="home" label="Adresse" value={conducteur.adresse} />
            <InfoRow icon="calendar" label="Date de naissance" value={conducteur.dateNaissance} />
            <InfoRow icon="card" label="Permis" value={`${conducteur.permis} (${conducteur.categoriePermis})`} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Véhicule</Text>
          <View style={styles.infoGrid}>
            <InfoRow icon="car" label="Véhicule" value={`${conducteur.vehiculeMarque} ${conducteur.vehiculeModele}`} />
            <InfoRow icon="barcode" label="Immatriculation" value={conducteur.vehiculeImmatriculation} />
            <InfoRow icon="cog" label="Type" value={conducteur.vehiculeType} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Activité</Text>
          <View style={styles.infoGrid}>
            <InfoRow icon="location" label="Zone assignée" value={conducteur.zone} />
            <InfoRow icon="briefcase" label="Date d'embauche" value={conducteur.dateEmbauche} />
            <InfoRow icon="time" label="Dernière activité" value={conducteur.derniereActivite} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Tournées assignées ({assignments.length})</Text>
          {assignments.length === 0 ? (
            <Text style={styles.emptyText}>Aucune tournée assignée</Text>
          ) : (
            <View style={styles.assignList}>
              {assignments.map((a) => {
                const asc = ASSIGNMENT_STATUS_CONFIG[a.status];
                return (
                  <TouchableOpacity
                    key={a.id}
                    style={styles.assignItem}
                    onPress={() => router.push(`/admin/signalements/${a.reportId}` as any)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.assignLeft}>
                      <Text style={styles.assignReportTitle} numberOfLines={1}>{a.reportTitle}</Text>
                      <Text style={styles.assignReportId}>{a.reportId}</Text>
                    </View>
                    <View style={[styles.assignStatusBadge, { backgroundColor: asc?.bg ?? '#6B728015' }]}>
                      <Text style={[styles.assignStatusText, { color: asc?.color ?? '#6B7280' }]}>
                        {asc?.label ?? a.status}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color="#6B7AA8" />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <Animated.View entering={FadeIn.delay(400)} style={styles.bottomBar}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push(`/admin/conducteurs/${id}/editer` as any)} activeOpacity={0.85}>
          <Ionicons name="create-outline" size={16} color="#FFFFFF" />
          <Text style={styles.actionBtnText}>Modifier</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon as any} size={14} color="#6B7AA8" />
      </View>
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
  menuBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: '#F1F5F9' },
  editBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#10B98115', alignItems: 'center', justifyContent: 'center' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText: { fontSize: 14, color: '#6B7AA8', fontWeight: '500' },
  deleteBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EF444415', alignItems: 'center', justifyContent: 'center' },

  profileCard: { marginHorizontal: 16, marginTop: 16, backgroundColor: '#131A2E', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#1E2A4A', overflow: 'hidden' },
  profileGlow: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: '#10B98106' },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  profileAvatar: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  profileAvatarText: { fontSize: 20, fontWeight: '800' },
  profileInfo: { flex: 1, gap: 4 },
  profileName: { fontSize: 20, fontWeight: '700', color: '#F1F5F9', letterSpacing: -0.3 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start' },
  badgeDot: { width: 5, height: 5, borderRadius: 3 },
  badgeText: { fontSize: 10, fontWeight: '700' },

  quickStats: { flexDirection: 'row', marginTop: 20, backgroundColor: '#0F172A', borderRadius: 14, padding: 14 },
  qsItem: { flex: 1, alignItems: 'center', gap: 2 },
  qsValue: { fontSize: 18, fontWeight: '800', color: '#F1F5F9', fontVariant: ['tabular-nums'] },
  qsLabel: { fontSize: 10, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.3 },
  qsDiv: { width: 1, height: 30, backgroundColor: '#1E2A4A' },

  section: { marginHorizontal: 16, marginTop: 16, backgroundColor: '#131A2E', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E2A4A' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  infoGrid: { gap: 0 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1E2A4A' },
  infoIconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 10, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.3 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#F1F5F9', marginTop: 1 },

  bottomBar: { paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#1E2A4A', backgroundColor: '#0F172A' },
  actionBtn: { flexDirection: 'row', height: 48, backgroundColor: '#10B981', borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },

  assignList: { gap: 8 },
  assignItem: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#0F172A', borderRadius: 12, padding: 12 },
  assignLeft: { flex: 1, gap: 2 },
  assignReportTitle: { fontSize: 13, fontWeight: '600', color: '#F1F5F9' },
  assignReportId: { fontSize: 10, fontWeight: '500', color: '#6B7AA8' },
  assignStatusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  assignStatusText: { fontSize: 9, fontWeight: '700' },
  emptyText: { fontSize: 13, color: '#6B7AA8', fontWeight: '500', textAlign: 'center', paddingVertical: 16 },
});
