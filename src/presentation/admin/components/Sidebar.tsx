import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import Animated, { FadeIn, FadeOut, SlideInLeft, SlideOutLeft } from 'react-native-reanimated';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const SECTIONS: { key: string; icon: string; label: string; route: string; badge?: string }[] = [
  { key: 'dashboard', icon: 'grid', label: 'Tableau de bord', route: '/admin' },
  { key: 'conducteurs', icon: 'people', label: 'Conducteurs', route: '/admin/conducteurs', badge: '10' },
  { key: 'signalements', icon: 'flag', label: 'Signalements', route: '/admin/signalements' },
  { key: 'utilisateurs', icon: 'person', label: 'Utilisateurs', route: '/admin/utilisateurs' },
  { key: 'recompenses', icon: 'gift', label: 'Récompenses', route: '/admin/recompenses' },
  { key: 'parametres', icon: 'settings', label: 'Paramètres', route: '/admin/parametres' },
];

export function Sidebar({ visible, onClose, onLogout }: SidebarProps) {
  const pathname = usePathname();

  if (!visible) return null;

  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={styles.overlay}>
      <Animated.View entering={SlideInLeft.duration(250)} exiting={SlideOutLeft.duration(200)} style={styles.drawer}>
        <View style={styles.drawerHeader}>
          <View style={styles.logoWrap}>
            <Ionicons name="shield-checkmark" size={24} color="#10B981" />
          </View>
          <Text style={styles.drawerTitle}>CleanCity</Text>
          <Text style={styles.drawerSubtitle}>Administration</Text>
        </View>

        <View style={styles.divider} />

        <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
          {SECTIONS.map((sec) => {
            const isActive = pathname === sec.route || pathname.startsWith(sec.route + '/');
            return (
              <TouchableOpacity
                key={sec.key}
                style={[styles.menuItem, isActive && styles.menuItemActive]}
                onPress={() => { onClose(); router.push(sec.route as any); }}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIcon, isActive && { backgroundColor: '#10B98115' }]}>
                  <Ionicons name={sec.icon as any} size={18} color={isActive ? '#10B981' : '#6B7AA8'} />
                </View>
                <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>{sec.label}</Text>
                {sec.badge && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{sec.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.divider} />

        <View style={{ paddingHorizontal: 12, paddingBottom: 8 }}>
          <TouchableOpacity
            style={styles.switchBtn}
            onPress={() => { onClose(); router.push('/driver/login' as any); }}
            activeOpacity={0.7}
          >
            <View style={styles.switchIcon}>
              <Ionicons name="car" size={16} color="#10B981" />
            </View>
            <Text style={styles.switchLabel}>Mode conducteur</Text>
            <Ionicons name="arrow-forward" size={14} color="#10B981" />
          </TouchableOpacity>
        </View>

        <View style={styles.drawerFooter}>
          <TouchableOpacity style={styles.footerBtn} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text style={styles.footerBtnText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <TouchableOpacity style={styles.overlayTouch} onPress={onClose} activeOpacity={1} />
    </Animated.View>
  );
}

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.72;

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, flexDirection: 'row' },
  overlayTouch: { flex: 1 },
  drawer: { width: DRAWER_WIDTH, backgroundColor: '#0F172A', paddingTop: 50, borderRightWidth: 1, borderColor: '#1E2A4A' },
  drawerHeader: { paddingHorizontal: 20, paddingBottom: 20 },
  logoWrap: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#131A2E', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1E2A4A', marginBottom: 12 },
  drawerTitle: { fontSize: 20, fontWeight: '800', color: '#F1F5F9', letterSpacing: -0.3 },
  drawerSubtitle: { fontSize: 11, color: '#6B7AA8', fontWeight: '500', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#1E2A4A', marginHorizontal: 20 },
  menu: { flex: 1, paddingVertical: 12, paddingHorizontal: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 13, borderRadius: 12, gap: 12, marginBottom: 2 },
  menuItemActive: { backgroundColor: '#131A2E' },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#94A3B8' },
  menuLabelActive: { color: '#F1F5F9', fontWeight: '700' },
  menuBadge: { backgroundColor: '#10B98120', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  menuBadgeText: { fontSize: 11, fontWeight: '700', color: '#10B981' },
  drawerFooter: { padding: 16 },
  footerBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 12 },
  footerBtnText: { fontSize: 14, fontWeight: '600', color: '#EF4444' },
  switchBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#10B98108', borderWidth: 1, borderColor: '#10B98115' },
  switchIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#10B98115', alignItems: 'center', justifyContent: 'center' },
  switchLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: '#10B981' },
});
