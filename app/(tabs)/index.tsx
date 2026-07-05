import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, type DimensionValue } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../src/core/contexts/UserContext';

const features = [
  {
    icon: 'add-circle' as const,
    label: 'Report Waste',
    desc: 'Signal waste in your area',
    color: '#2563EB',
    bg: '#EFF6FF',
    route: '/(tabs)/report',
  },
  {
    icon: 'gift' as const,
    label: 'Rewards',
    desc: 'Redeem your points',
    color: '#F59E0B',
    bg: '#FFFBEB',
    route: '/(tabs)/rewards',
  },
  {
    icon: 'storefront' as const,
    label: 'Marketplace',
    desc: 'Sell recyclable waste',
    color: '#059669',
    bg: '#ECFDF5',
    route: '/(tabs)/marketplace',
  },
  {
    icon: 'calendar' as const,
    label: 'Collection',
    desc: 'View pickup schedule',
    color: '#7C3AED',
    bg: '#F5F3FF',
    route: '/collection-schedule',
  },
];

const recentReports = [
  { id: 'r1', title: 'Plastic bottle near park', date: '2h ago', status: 'approved' as const },
  { id: 'r2', title: 'Glass on Main Street', date: '5h ago', status: 'pending' as const },
  { id: 'r3', title: 'Electronics downtown', date: '1d ago', status: 'collected' as const },
  { id: 'r4', title: 'Organic waste behind mall', date: '2d ago', status: 'collected' as const },
];
function ReportEntry({ id, title, date, status }: { id: string; title: string; date: string; status: string }) {
  return (
    <TouchableOpacity key={id} style={styles.reportRow} onPress={() => router.push(`/report/${id}`)}>
      <View style={styles.reportLeft}>
        <View style={styles.reportDot} />
        <View>
          <Text style={styles.reportTitle}>{title}</Text>
          <Text style={styles.reportDate}>{date}</Text>
        </View>
      </View>
      <StatusBadge status={status} />
    </TouchableOpacity>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { label: 'Pending', color: '#F59E0B', bg: '#FFFBEB' },
    approved: { label: 'Approved', color: '#2563EB', bg: '#EFF6FF' },
    collected: { label: 'Collected', color: '#059669', bg: '#ECFDF5' },
  } as const;
  const c = config[status as keyof typeof config] ?? config.pending;
  return (
    <View style={[styles.badgeSmall, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeSmallText, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

export default function Dashboard() {
  const { avatarUri } = useUser();
  const levelProgress = 0.65;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.name}>Ariel 👋</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifButton} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>
        <View style={styles.pointsRow}>
          <View style={styles.pointsCard}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.pointsValue}>240</Text>
            <Text style={styles.pointsLabel}>pts</Text>
          </View>
          <View style={styles.pointsCard}>
            <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
            <Text style={styles.pointsValue}>12</Text>
            <Text style={styles.pointsLabel}>reports</Text>
          </View>
          <View style={styles.pointsCard}>
            <Ionicons name="cash-outline" size={16} color="#FFFFFF" />
            <Text style={styles.pointsValue}>€8</Text>
            <Text style={styles.pointsLabel}>earned</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.levelCard}>
          <View style={styles.levelTop}>
            <View style={styles.levelBadge}>
              <Ionicons name="shield-checkmark" size={20} color="#2E7D32" />
              <Text style={styles.levelBadgeText}>Eco Warrior</Text>
            </View>
            <Text style={styles.levelXp}>480 / 750 XP</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${levelProgress * 100}%` as DimensionValue }]} />
          </View>
          <Text style={styles.levelHint}>150 XP to next level</Text>
        </View>

        <View style={styles.impactRow}>
          <View style={styles.impactCard}>
            <Ionicons name="leaf" size={22} color="#059669" />
            <Text style={styles.impactValue}>24 kg</Text>
            <Text style={styles.impactLabel}>CO₂ saved</Text>
          </View>
          <View style={styles.impactCard}>
            <Ionicons name="water" size={22} color="#2563EB" />
            <Text style={styles.impactValue}>340 L</Text>
            <Text style={styles.impactLabel}>Water saved</Text>
          </View>
          <View style={styles.impactCard}>
            <Ionicons name="trending-up" size={22} color="#D97706" />
            <Text style={styles.impactValue}>+15%</Text>
            <Text style={styles.impactLabel}>This month</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.grid}>
          {features.map((f) => (
            <TouchableOpacity
              key={f.label}
              style={[styles.featureCard, { backgroundColor: f.bg }]}
              onPress={() => router.navigate(f.route as any)}
            >
              <View style={[styles.featureIcon, { backgroundColor: f.color + '20' }]}>
                <Ionicons name={f.icon} size={28} color={f.color} />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.collectionCard}>
          <View style={styles.collectionHeader}>
            <Ionicons name="calendar-outline" size={20} color="#2E7D32" />
            <Text style={styles.collectionTitle}>Next Collection</Text>
          </View>
          <Text style={styles.collectionDate}>Wednesday, June 17</Text>
          <Text style={styles.collectionTime}>08:00 - 12:00</Text>
          <View style={styles.badge}>
            <Ionicons name="location" size={14} color="#2E7D32" />
            <Text style={styles.badgeText}>Your street</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          <TouchableOpacity onPress={() => router.push('/report-history')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        {recentReports.map((r) => (
          <ReportEntry key={r.id} {...r} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  greeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 1,
  },
  notifButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#2E7D32',
  },
  pointsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  pointsValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pointsLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  levelTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  levelBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
  },
  levelXp: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#2E7D32',
  },
  levelHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  impactRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  impactCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  impactValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 8,
  },
  impactLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '47%',
    padding: 18,
    borderRadius: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featureLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  featureDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  collectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  collectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  collectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  collectionDate: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
  },
  collectionTime: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 13,
    color: '#2E7D32',
    marginLeft: 6,
    fontWeight: '600',
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  reportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  reportDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  reportDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 1,
  },
  badgeSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeSmallText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
