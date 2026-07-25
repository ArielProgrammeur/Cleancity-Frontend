import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSidebar } from '../../../src/core/contexts/SidebarContext';
import { useAdmin } from '../../../src/core/contexts/AdminContext';

const ZONES = ['Douala Nord', 'Douala Sud', 'Douala Centre', 'Douala Ouest', 'Douala Est', 'Bonapriso', 'Akwa', 'Bassa'];
const CATEGORIES = ['Plastique', 'Verre', 'Organique', 'Électronique', 'Dangereux', 'Autre'];

const SETTINGS_SECTIONS = [
  {
    title: 'Zones de collecte',
    icon: 'location',
    color: '#3B82F6',
    items: ZONES,
  },
  {
    title: 'Catégories de déchets',
    icon: 'layers',
    color: '#10B981',
    items: CATEGORIES,
  },
  {
    title: 'Informations générales',
    icon: 'information-circle',
    color: '#8B5CF6',
    items: [
      'Application : CleanCity',
      'Version back office : 1.0.0',
      'Environnement : Développement',
      'Base de données : Mock (simulée)',
    ],
  },
];

export default function Parametres() {
  const insets = useSafeAreaInsets();
  const { toggle } = useSidebar();
  const { admin } = useAdmin();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={toggle} activeOpacity={0.7}>
          <Ionicons name="menu" size={18} color="#F1F5F9" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Paramètres</Text>
          <Text style={styles.subtitle}>Configuration du back office</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.adminCard}>
          <View style={[styles.adminAvatar, { backgroundColor: '#10B98120' }]}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
          </View>
          <View>
            <Text style={styles.adminName}>{admin?.name ?? 'Admin'}</Text>
            <Text style={styles.adminEmail}>{admin?.email ?? 'admin@cleancity.cm'}</Text>
          </View>
        </View>

        {SETTINGS_SECTIONS.map((section) => {
          const isOpen = expanded === section.title;
          return (
            <View key={section.title} style={styles.sectionCard}>
              <TouchableOpacity style={styles.sectionHeader} onPress={() => setExpanded(isOpen ? null : section.title)} activeOpacity={0.7}>
                <View style={[styles.sectionIcon, { backgroundColor: section.color + '15' }]}>
                  <Ionicons name={section.icon as any} size={18} color={section.color} />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#6B7AA8" />
              </TouchableOpacity>
              {isOpen && (
                <View style={styles.sectionBody}>
                  {section.items.map((item, i) => (
                    <View key={i} style={[styles.itemRow, i < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#1E2A4A' }]}>
                      <View style={styles.itemDot} />
                      <Text style={styles.itemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.helpCard}>
          <Ionicons name="information-circle-outline" size={20} color="#3B82F6" />
          <Text style={styles.helpText}>
            Les paramètres avancés (gestion des administrateurs, notifications, API) seront disponibles dans une prochaine version.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1E2A4A' },
  menuBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: '#F1F5F9', letterSpacing: -0.2 },
  subtitle: { fontSize: 10, color: '#6B7AA8', fontWeight: '500', marginTop: 1 },
  adminCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#131A2E', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E2A4A', marginBottom: 16 },
  adminAvatar: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  adminName: { fontSize: 15, fontWeight: '700', color: '#F1F5F9' },
  adminEmail: { fontSize: 12, color: '#6B7AA8', fontWeight: '500', marginTop: 1 },
  sectionCard: { backgroundColor: '#131A2E', borderRadius: 16, borderWidth: 1, borderColor: '#1E2A4A', marginBottom: 10, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  sectionIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: '#F1F5F9' },
  sectionBody: { paddingHorizontal: 16, paddingBottom: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  itemDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#475569' },
  itemText: { fontSize: 13, color: '#94A3B8', fontWeight: '500', flex: 1 },
  helpCard: { flexDirection: 'row', gap: 12, backgroundColor: '#3B82F608', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#3B82F620', marginTop: 6 },
  helpText: { flex: 1, fontSize: 12, color: '#6B7AA8', fontWeight: '500', lineHeight: 18 },
});
