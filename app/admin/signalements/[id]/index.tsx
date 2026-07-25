import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SignalementApiDatasource, type Signalement } from '../../../../src/data/datasources/SignalementApiDatasource';
import { AssignmentApiDatasource } from '../../../../src/data/datasources/AssignmentApiDatasource';
import { ConducteurApiDatasource } from '../../../../src/data/datasources/ConducteurApiDatasource';
import { ASSIGNMENT_STATUS_CONFIG, type Assignment, type AssignmentStatus } from '../../../../src/domain/entities/Assignment';

const signalementDS = new SignalementApiDatasource();
const STATUS_CONFIG = signalementDS.getStatusConfig();
const assignmentDS = new AssignmentApiDatasource();
const conducteurDS = new ConducteurApiDatasource();

const STATUS_ACTIONS: { status: Signalement['status']; label: string; icon: string; color: string }[] = [
  { status: 'approved', label: 'Approuver', icon: 'checkmark-circle', color: '#3B82F6' },
  { status: 'collected', label: 'Collecté', icon: 'checkmark-done', color: '#10B981' },
  { status: 'rejected', label: 'Rejeter', icon: 'close-circle', color: '#EF4444' },
];

export default function SignalementDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [signalement, setSignalement] = useState<Signalement | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [data, asg] = await Promise.all([
        signalementDS.getById(id),
        assignmentDS.getByReport(id),
      ]);
      setSignalement(data);
      setAssignment(asg);
    } catch {} finally {
      setLoading(false);
    }
  }, [id]);

  const handleStatus = async (status: Signalement['status']) => {
    const sc = STATUS_CONFIG[status];
    Alert.alert('Changer le statut', `Marquer ce signalement comme "${sc.label}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: sc.label, onPress: async () => {
        await signalementDS.updateStatus(id, status);
        load();
      }},
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Supprimer', 'Supprimer ce signalement ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => {
        await signalementDS.delete(id);
        router.back();
      }},
    ]);
  };

  const handleAssign = async () => {
    const drivers = (await conducteurDS.getAllSync()).filter((d) => d.statut === 'actif');
    const options = drivers.map((d) => ({
      text: `${d.prenom} ${d.nom} — ${d.zone}`,
      onPress: async () => {
        setAssignLoading(true);
        try {
          await assignmentDS.assign(id, d.id, `${d.prenom} ${d.nom}`);
          await signalementDS.updateStatus(id, 'approved');
          load();
        } finally {
          setAssignLoading(false);
        }
      },
    }));
    Alert.alert('Assigner un conducteur', 'Sélectionnez un conducteur actif :', [
      ...options,
      { text: 'Annuler', style: 'cancel' },
    ]);
  };

  const handleUnassign = () => {
    Alert.alert('Désassigner', 'Retirer ce conducteur du signalement ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Désassigner', style: 'destructive', onPress: async () => {
        if (assignment) {
          await assignmentDS.updateStatus(assignment.id, 'cancelled');
          setAssignment(null);
        }
      }},
    ]);
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

  if (!signalement) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingWrap}>
          <Ionicons name="alert-circle" size={40} color="#EF4444" />
          <Text style={styles.errorText}>Signalement introuvable</Text>
        </View>
      </View>
    );
  }

  const sc = STATUS_CONFIG[signalement.status] ?? { label: signalement.status, color: '#6B7280', bg: '#6B728015' };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Signalement</Text>
          <Text style={styles.subtitle}>{signalement.id}</Text>
        </View>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.statusCard}>
          <View style={[styles.statusDot, { backgroundColor: sc.color }]} />
          <View>
            <Text style={styles.statusLabel}>Statut actuel</Text>
            <Text style={[styles.statusValue, { color: sc.color }]}>{sc.label}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Détails</Text>
          <View style={styles.infoGrid}>
            <InfoRow icon="person" label="Signalé par" value={signalement.user} />
            <InfoRow icon="flag" label="Catégorie" value={signalement.category} />
            <InfoRow icon="location" label="Lieu" value={signalement.location} />
            <InfoRow icon="calendar" label="Date" value={signalement.date} />
            <InfoRow icon="id-card" label="ID" value={signalement.id} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{signalement.description}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Assignation conducteur</Text>
          {assignment ? (
            <View>
              <View style={styles.assignInfo}>
                <View style={styles.assignAvatar}>
                  <Text style={styles.assignAvatarText}>
                    {assignment.conducteurNom.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.assignDetails}>
                  <Text style={styles.assignName}>{assignment.conducteurNom}</Text>
                  <Text style={styles.assignStatus}>
                    {ASSIGNMENT_STATUS_CONFIG[assignment.status]?.label ?? assignment.status}
                  </Text>
                </View>
                <View style={[styles.assignBadge, { backgroundColor: (ASSIGNMENT_STATUS_CONFIG[assignment.status]?.bg ?? '#6B728015') }]}>
                  <Text style={[styles.assignBadgeText, { color: ASSIGNMENT_STATUS_CONFIG[assignment.status]?.color ?? '#6B7280' }]}>
                    {assignment.id}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.assignActionBtn} onPress={handleUnassign}>
                <Ionicons name="close-circle" size={16} color="#EF4444" />
                <Text style={styles.assignActionBtnText}>Désassigner</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.assignBtn, assignLoading && { opacity: 0.5 }]}
              onPress={handleAssign}
              disabled={assignLoading}
            >
              {assignLoading ? (
                <ActivityIndicator size="small" color="#F1F5F9" />
              ) : (
                <>
                  <Ionicons name="person-add" size={18} color="#F1F5F9" />
                  <Text style={styles.assignBtnText}>Assigner un conducteur</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </Animated.View>

        {signalement.status !== 'collected' && signalement.status !== 'rejected' && (
          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <View style={styles.actionsRow}>
              {STATUS_ACTIONS.filter((a) => a.status !== signalement.status).map((action) => (
                <TouchableOpacity
                  key={action.status}
                  style={[styles.actionBtn, { backgroundColor: action.color + '15', borderColor: action.color + '30' }]}
                  onPress={() => handleStatus(action.status)}
                >
                  <Ionicons name={action.icon as any} size={18} color={action.color} />
                  <Text style={[styles.actionBtnText, { color: action.color }]}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}
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
  subtitle: { fontSize: 10, color: '#6B7AA8', fontWeight: '500', marginTop: 1 },
  deleteBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EF444415', alignItems: 'center', justifyContent: 'center' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 14, color: '#6B7AA8', fontWeight: '500', marginTop: 8 },
  statusCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#131A2E', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E2A4A' },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  statusLabel: { fontSize: 10, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.3 },
  statusValue: { fontSize: 16, fontWeight: '700', marginTop: 1 },
  section: { marginTop: 16, backgroundColor: '#131A2E', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E2A4A' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  infoGrid: { gap: 0 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1E2A4A' },
  infoIconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 10, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.3 },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#F1F5F9', marginTop: 1 },
  description: { fontSize: 13, color: '#94A3B8', fontWeight: '500', lineHeight: 20 },
  actionsRow: { gap: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  actionBtnText: { fontSize: 14, fontWeight: '700' },
  assignInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  assignAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#10B98120', alignItems: 'center', justifyContent: 'center' },
  assignAvatarText: { fontSize: 14, fontWeight: '700', color: '#10B981' },
  assignDetails: { flex: 1 },
  assignName: { fontSize: 14, fontWeight: '600', color: '#F1F5F9' },
  assignStatus: { fontSize: 11, color: '#6B7AA8', fontWeight: '500', marginTop: 1 },
  assignBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  assignBadgeText: { fontSize: 9, fontWeight: '700' },
  assignActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#EF444410', borderRadius: 8, alignSelf: 'flex-start' },
  assignActionBtnText: { fontSize: 12, fontWeight: '600', color: '#EF4444' },
  assignBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 16, backgroundColor: '#10B98120', borderRadius: 12, borderWidth: 1, borderColor: '#10B98130', justifyContent: 'center' },
  assignBtnText: { fontSize: 14, fontWeight: '600', color: '#F1F5F9' },
});
