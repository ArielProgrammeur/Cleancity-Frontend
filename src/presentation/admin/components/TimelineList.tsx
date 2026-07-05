import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface Report {
  id: string;
  user: string;
  category: string;
  status: string;
  date: string;
  location: string;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: '#F59E0B', bg: '#F59E0B15' },
  approved: { label: 'Approuvé', color: '#3B82F6', bg: '#3B82F615' },
  collected: { label: 'Collecté', color: '#10B981', bg: '#10B98115' },
};

interface TimelineListProps {
  reports: Report[];
}

export function TimelineList({ reports }: TimelineListProps) {
  return (
    <View style={styles.container}>
      {reports.map((r, idx) => {
        const status = STATUS_MAP[r.status] || STATUS_MAP.pending;
        return (
          <Animated.View
            key={r.id}
            entering={FadeInRight.delay(idx * 50).springify().damping(18)}
            style={styles.row}
          >
            <View style={styles.timeline}>
              <View style={[styles.dot, { backgroundColor: status.color }]} />
              {idx < reports.length - 1 && <View style={styles.line} />}
            </View>
            <View style={styles.content}>
              <View style={styles.topRow}>
                <Text style={styles.id}>{r.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                  <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                  <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
              </View>
              <Text style={styles.user}>{r.user}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{r.category}</Text>
                <View style={styles.metaDot} />
                <Text style={styles.meta}>{r.location}</Text>
              </View>
            </View>
            <Text style={styles.date}>{r.date}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  row: { flexDirection: 'row', gap: 14, paddingVertical: 10 },
  timeline: { alignItems: 'center', width: 16 },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  line: { width: 1, flex: 1, backgroundColor: '#1E2A4A', marginTop: 4 },
  content: { flex: 1, gap: 2 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  id: { fontSize: 11, fontWeight: '700', color: '#475569', letterSpacing: 0.3 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusDot: { width: 5, height: 5, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '700' },
  user: { fontSize: 14, fontWeight: '600', color: '#F1F5F9' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  meta: { fontSize: 11, color: '#6B7AA8', fontWeight: '500' },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#475569' },
  date: { fontSize: 10, color: '#475569', fontWeight: '600', marginTop: 4, fontVariant: ['tabular-nums'] },
});
