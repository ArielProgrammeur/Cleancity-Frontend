import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';
import { SignalementApiDatasource } from '../../../data/datasources/SignalementApiDatasource';
import { useReportHistory, type FilterStatus } from '../../shared/hooks/useReportHistory';

const datasource = new SignalementApiDatasource();

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: colors.warning, bg: '#FFFBEB', icon: 'time-outline' as const },
  in_progress: { label: 'In Progress', color: colors.info, bg: '#EFF6FF', icon: 'construct-outline' as const },
  resolved: { label: 'Resolved', color: colors.success, bg: '#ECFDF5', icon: 'checkmark-circle-outline' as const },
};

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
];

export default function ReportHistoryScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const { reports, isLoading, getFiltered } = useReportHistory(datasource);
  const filtered = getFiltered(activeFilter);

  if (isLoading) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Stack.Screen options={{ title: 'Report History', headerTintColor: colors.primary }} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Report History', headerTintColor: colors.primary }} />
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.key)}
          >
            <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color={colors.divider} />
            <Text style={styles.emptyTitle}>No reports found</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const status = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/report/${item.id}`)}
            >
              <View style={[styles.iconCircle, { backgroundColor: status.bg }]}>
                <Ionicons name={status.icon} size={22} color={status.color} />
              </View>
              <View style={styles.content}>
                <Text style={styles.title}>{item.description}</Text>
                <View style={styles.metaRow}>
                  <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                  </View>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.divider} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filterRow: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: borderRadius.full, backgroundColor: '#F3F4F6' },
  filterChipActive: { backgroundColor: colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  filterTextActive: { color: colors.white },
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: spacing.sm },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm, gap: spacing.sm, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, gap: spacing.sm },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.sm },
  statusText: { fontSize: 11, fontWeight: '700' },
  date: { fontSize: 12, color: colors.textSecondary },
});
