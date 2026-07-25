import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';
import { api } from '../../../core/api/api';
import { auth } from '../../../core/firebase';
import type { WasteReport } from '../../../domain/entities/WasteReport';

export default function ReportDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const STATUS_CONFIG = {
    pending: { label: t('reportDetail.status.pending'), color: colors.warning, bg: '#FFFBEB', icon: 'time-outline' as const },
    in_progress: { label: t('reportDetail.status.in_progress'), color: colors.info, bg: '#EFF6FF', icon: 'construct-outline' as const },
    resolved: { label: t('reportDetail.status.resolved'), color: colors.success, bg: '#ECFDF5', icon: 'checkmark-circle-outline' as const },
  };

  const CATEGORY_LABELS: Record<string, string> = {
    plastic: t('reportDetail.categories.plastic'), glass: t('reportDetail.categories.glass'), organic: t('reportDetail.categories.organic'),
    electronic: t('reportDetail.categories.electronic'), hazardous: t('reportDetail.categories.hazardous'), other: t('reportDetail.categories.other'),
  };
  const [report, setReport] = useState<WasteReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const token = auth?.currentUser ? await auth.currentUser.getIdToken() : null;
        const res = await fetch(`${api.baseUrl}/api/reports/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(t('reportDetail.notFound'));
        const data = await res.json();
        if (!cancelled) {
          setReport({
            id: data.id,
            userId: data.userId,
            title: data.title,
            description: data.description,
            category: data.category,
            latitude: data.latitude,
            longitude: data.longitude,
            imageUrl: data.imageUrl,
            status: data.status,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
          });
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Erreur de chargement');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: t('reportDetail.title') }} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.errorText}>{t('common.loading')}</Text>
      </View>
    );
  }

  if (!report || error) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: t('reportDetail.title') }} />
        <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.errorText}>{error || t('reportDetail.notFound')}</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: spacing.md }}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>{t('common.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const status = STATUS_CONFIG[report.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
  const timeAgo = getTimeAgo(report.createdAt);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t('reportDetail.title'), headerTintColor: colors.primary }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {report.imageUrl ? (
          <Image source={{ uri: report.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: status.bg }]}>
            <Ionicons name="camera-outline" size={48} color={status.color} />
            <Text style={[styles.noImageText, { color: status.color }]}>{t('reportDetail.noPhoto')}</Text>
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{report.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Ionicons name={status.icon} size={14} color={status.color} />
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>{timeAgo}</Text>
            <View style={styles.metaDot} />
            <Ionicons name="pricetag-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>{CATEGORY_LABELS[report.category] ?? report.category}</Text>
          </View>

          <Text style={styles.description}>{report.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('reportDetail.location')}</Text>
            <View style={styles.locationCard}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
              <Text style={styles.locationText}>
                {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('reportDetail.chronology')}</Text>
            <TimelineItem
              icon="flag-outline" label={t('reportDetail.reported')} time={getTimeAgo(report.createdAt)}
              isFirst color={colors.primary}
            />
            {report.status !== 'pending' && (
              <TimelineItem
                icon="construct-outline" label={t('reportDetail.status.in_progress')} time={getTimeAgo(report.updatedAt)}
                color={colors.info}
              />
            )}
            {report.status === 'resolved' && (
              <TimelineItem
                icon="checkmark-circle-outline" label={t('reportDetail.status.resolved')} time={getTimeAgo(report.updatedAt)}
                isLast color={colors.success}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function TimelineItem({ icon, label, time, color, isFirst, isLast }: {
  icon: keyof typeof Ionicons.glyphMap; label: string; time: string; color: string;
  isFirst?: boolean; isLast?: boolean;
}) {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineLeft}>
        {!isLast && <View style={[styles.timelineLine, { backgroundColor: color }]} />}
        <View style={[styles.timelineDot, { backgroundColor: color }]}>
          <Ionicons name={icon} size={12} color={colors.white} />
        </View>
      </View>
      <View style={styles.timelineContent}>
        <Text style={styles.timelineLabel}>{label}</Text>
        <Text style={styles.timelineTime}>{time}</Text>
      </View>
    </View>
  );
}

function getTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, gap: spacing.sm },
  errorText: { fontSize: 16, color: colors.textSecondary },
  scroll: { paddingBottom: spacing.xxl },
  image: { width: '100%', height: 240, resizeMode: 'cover' },
  imagePlaceholder: { width: '100%', height: 200, alignItems: 'center', justifyContent: 'center' },
  noImageText: { fontSize: 14, fontWeight: '600', marginTop: spacing.sm },
  content: { padding: spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm },
  title: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: borderRadius.md, gap: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: 4 },
  metaText: { fontSize: 13, color: colors.textSecondary, marginRight: spacing.sm },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.divider, marginRight: spacing.sm },
  description: { fontSize: 15, color: colors.textPrimary, lineHeight: 22, marginTop: spacing.md },
  section: { marginTop: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  locationCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg, gap: spacing.sm, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  locationText: { fontSize: 14, color: colors.textSecondary, flex: 1 },
  timelineRow: { flexDirection: 'row', marginBottom: spacing.xs },
  timelineLeft: { width: 28, alignItems: 'center' },
  timelineDot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  timelineLine: { position: 'absolute', top: 20, bottom: -8, width: 2 },
  timelineContent: { marginLeft: spacing.sm, paddingBottom: spacing.md },
  timelineLabel: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  timelineTime: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
