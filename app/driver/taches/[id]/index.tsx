import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AssignmentApiDatasource } from '../../../../src/data/datasources/AssignmentApiDatasource';
import { ASSIGNMENT_STATUS_CONFIG, type AssignmentStatus, type Assignment } from '../../../../src/domain/entities/Assignment';

const assignmentDS = new AssignmentApiDatasource();

const DRIVER_ACTIONS: { status: AssignmentStatus; label: string; icon: string; color: string }[] = [
  { status: 'en_route', label: 'En route', icon: 'navigate', color: '#F59E0B' },
  { status: 'collecting', label: 'En collecte', icon: 'trash', color: '#8B5CF6' },
  { status: 'completed', label: 'Terminer', icon: 'checkmark-circle', color: '#10B981' },
];

export default function DriverTacheDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await assignmentDS.getById(id);
      setAssignment(data);
    } catch {} finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleStatus = (status: AssignmentStatus) => {
    const sc = ASSIGNMENT_STATUS_CONFIG[status];
    Alert.alert('Mettre à jour', `Passer cette tournée à "${sc.label}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: sc.label, onPress: async () => {
        await assignmentDS.updateStatus(id, status);
        load();
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

  if (!assignment) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingWrap}>
          <Ionicons name="alert-circle" size={40} color="#EF4444" />
          <Text style={styles.errorText}>Tournée introuvable</Text>
        </View>
      </View>
    );
  }

  const asc = ASSIGNMENT_STATUS_CONFIG[assignment.status];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Détail tournée</Text>
          <Text style={styles.subtitle}>{assignment.id}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.statusCard}>
          <View style={[styles.statusDot, { backgroundColor: asc?.color ?? '#6B7280' }]} />
          <View>
            <Text style={styles.statusLabel}>Statut</Text>
            <Text style={[styles.statusValue, { color: asc?.color ?? '#6B7280' }]}>{asc?.label ?? assignment.status}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Signalement</Text>
          <View style={styles.infoGrid}>
            <InfoRow icon="flag" label="Titre" value={assignment.reportTitle} />
            <InfoRow icon="location" label="Lieu" value={assignment.reportLocation} />
            <InfoRow icon="calendar" label="Date" value={assignment.reportDate} />
            <InfoRow icon="folder" label="Catégorie" value={assignment.reportCategory} />
            <InfoRow icon="id-card" label="Référence" value={assignment.reportId} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Assignation</Text>
          <View style={styles.infoGrid}>
            <InfoRow icon="calendar" label="Assigné le" value={assignment.assignedAt?.split('T')[0] ?? assignment.assignedAt} />
            {assignment.completedAt && <InfoRow icon="checkmark" label="Terminé le" value={assignment.completedAt?.split('T')[0] ?? assignment.completedAt} />}
            {assignment.notes && <InfoRow icon="document-text" label="Notes" value={assignment.notes} />}
          </View>
        </Animated.View>

        {assignment.status !== 'completed' && assignment.status !== 'cancelled' && (
          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <View style={styles.actionsRow}>
              {DRIVER_ACTIONS.filter((a) => a.status !== assignment.status).map((action) => (
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
  actionsRow: { gap: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  actionBtnText: { fontSize: 14, fontWeight: '700' },
});
