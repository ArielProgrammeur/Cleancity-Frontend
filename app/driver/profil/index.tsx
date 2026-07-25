import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDriver } from '../../../src/core/contexts/DriverContext';

export default function DriverProfil() {
  const { driver, logout } = useDriver();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Quitter l\'espace conducteur ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: () => {
        logout();
        router.replace('/' as any);
      }},
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Mon profil</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#10B981" />
        </View>
        <Text style={styles.name}>{driver?.name}</Text>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>Connecté</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <View style={styles.infoGrid}>
          <Row icon="id-card" label="ID" value={driver?.id ?? '-'} />
          <Row icon="mail" label="Email" value={driver?.email ?? '-'} />
          <Row icon="location" label="Zone" value={driver?.zone ?? '-'} />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out" size={18} color="#EF4444" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/driver' as any)}>
          <Ionicons name="home" size={20} color="#6B7AA8" />
          <Text style={styles.navLabel}>Accueil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/driver/taches' as any)}>
          <Ionicons name="list" size={20} color="#6B7AA8" />
          <Text style={styles.navLabel}>Tournées</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemActive}>
          <Ionicons name="person" size={20} color="#10B981" />
          <Text style={styles.navLabelActive}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIconWrap}><Ionicons name={icon as any} size={14} color="#6B7AA8" /></View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
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
  profileCard: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#10B98120', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#10B98130' },
  name: { fontSize: 22, fontWeight: '700', color: '#F1F5F9' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8, backgroundColor: '#10B98115' },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#10B981' },
  section: { marginHorizontal: 16, backgroundColor: '#131A2E', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E2A4A' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  infoGrid: { gap: 0 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1E2A4A' },
  rowIconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 10, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.3 },
  rowValue: { fontSize: 14, fontWeight: '600', color: '#F1F5F9', marginTop: 1 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 24, paddingVertical: 14, backgroundColor: '#EF444410', borderRadius: 14, borderWidth: 1, borderColor: '#EF444420' },
  logoutText: { fontSize: 14, fontWeight: '700', color: '#EF4444' },
  bottomNav: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#1E2A4A', backgroundColor: '#0F172A', paddingBottom: 12, paddingTop: 8, marginTop: 'auto' },
  navItem: { flex: 1, alignItems: 'center', gap: 2 },
  navItemActive: { flex: 1, alignItems: 'center', gap: 2 },
  navLabel: { fontSize: 10, fontWeight: '600', color: '#6B7AA8' },
  navLabelActive: { fontSize: 10, fontWeight: '600', color: '#10B981' },
});
