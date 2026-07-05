import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';

interface DayRoute {
  day: string; date: string; active: boolean;
  routes: { id: string; name: string; time: string; waypoints: number; color: string }[];
}

const SCHEDULE: DayRoute[] = [
  { day: 'Mon', date: 'June 15', active: false, routes: [] },
  { day: 'Tue', date: 'June 16', active: false, routes: [] },
  { day: 'Wed', date: 'June 17', active: true, routes: [
    { id: 'w1', name: 'Sector A - Downtown', time: '08:00 - 10:00', waypoints: 12, color: '#2563EB' },
    { id: 'w2', name: 'Sector B - Riverside', time: '10:30 - 12:00', waypoints: 8, color: '#059669' },
  ]},
  { day: 'Thu', date: 'June 18', active: false, routes: [
    { id: 'th1', name: 'Sector C - Industrial', time: '09:00 - 11:00', waypoints: 15, color: '#7C3AED' },
  ]},
  { day: 'Fri', date: 'June 19', active: false, routes: [] },
  { day: 'Sat', date: 'June 20', active: false, routes: [
    { id: 'sa1', name: 'Sector D - Market Area', time: '07:00 - 09:00', waypoints: 6, color: '#D97706' },
  ]},
  { day: 'Sun', date: 'June 21', active: false, routes: [] },
];

export default function CollectionScheduleScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Collection Schedule', headerTintColor: colors.primary }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.weekHeader}>
          {SCHEDULE.map((d) => (
            <View key={d.day} style={[styles.dayCol, d.active && styles.dayColActive]}>
              <Text style={[styles.dayName, d.active && styles.dayTextActive]}>{d.day}</Text>
              <Text style={[styles.dayDate, d.active && styles.dayTextActive]}>{d.date.split(' ')[1]}</Text>
              {d.active && <View style={styles.activeDot} />}
            </View>
          ))}
        </View>

        <View style={styles.todaySection}>
          <View style={styles.todayHeader}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={styles.todayTitle}>Wednesday, June 17</Text>
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>Today</Text>
            </View>
          </View>

          {SCHEDULE[2].routes.map((route) => (
            <TouchableOpacity key={route.id} style={styles.routeCard}>
              <View style={[styles.routeColor, { backgroundColor: route.color }]} />
              <View style={styles.routeContent}>
                <Text style={styles.routeName}>{route.name}</Text>
                <View style={styles.routeMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.metaText}>{route.time}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.metaText}>{route.waypoints} stops</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.divider} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.weekOverview}>
          <Text style={styles.sectionTitle}>This Week</Text>
          {SCHEDULE.filter((d) => d.routes.length > 0 && d.day !== 'Wed').map((d) => (
            <TouchableOpacity key={d.day} style={styles.dayRouteCard}>
              <View style={styles.dayRouteLeft}>
                <Text style={styles.dayRouteDay}>{d.day}</Text>
                <Text style={styles.dayRouteDate}>{d.date}</Text>
              </View>
              <View style={styles.dayRouteRight}>
                <Text style={styles.dayRouteCount}>{d.routes.length} route{d.routes.length > 1 ? 's' : ''}</Text>
                <Text style={styles.dayRouteTime}>{d.routes[0].time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.divider} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Collection times may vary. Place your waste out by 07:00 on collection day.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xxl },
  weekHeader: { flexDirection: 'row', backgroundColor: colors.surface, paddingVertical: spacing.md, paddingHorizontal: spacing.sm, marginHorizontal: spacing.md, marginTop: spacing.md, borderRadius: borderRadius.lg, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  dayCol: { flex: 1, alignItems: 'center', paddingVertical: spacing.xs, gap: 2 },
  dayColActive: { backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingVertical: spacing.xs + 2 },
  dayName: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  dayTextActive: { color: colors.white },
  dayDate: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.white, marginTop: 2 },
  todaySection: { marginTop: spacing.lg, marginHorizontal: spacing.md },
  todayHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm },
  todayTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  todayBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.md },
  todayBadgeText: { fontSize: 12, fontWeight: '700', color: colors.success },
  routeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, marginBottom: spacing.sm, overflow: 'hidden', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  routeColor: { width: 4, height: '100%' },
  routeContent: { flex: 1, padding: spacing.md },
  routeName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  routeMeta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: colors.textSecondary },
  weekOverview: { marginTop: spacing.lg, marginHorizontal: spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  dayRouteCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  dayRouteLeft: { alignItems: 'center', marginRight: spacing.md, width: 50 },
  dayRouteDay: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  dayRouteDate: { fontSize: 11, color: colors.textSecondary },
  dayRouteRight: { flex: 1 },
  dayRouteCount: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  dayRouteTime: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  infoCard: { flexDirection: 'row', backgroundColor: '#EFF6FF', padding: spacing.md, borderRadius: borderRadius.lg, marginTop: spacing.lg, marginHorizontal: spacing.md, gap: spacing.sm, alignItems: 'flex-start' },
  infoText: { fontSize: 13, color: colors.info, lineHeight: 18, flex: 1 },
});
