import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInRight, FadeOut } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import type { StatDetailItem } from '../../../data/datasources/AdminMockDatasource';

interface StatDetailModalProps {
  visible: boolean;
  title: string;
  icon: string;
  total: string;
  accentColor: string;
  fetchData: () => Promise<StatDetailItem[]>;
  onClose: () => void;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: '#F59E0B' },
  approved: { label: 'Approuvé', color: '#3B82F6' },
  collected: { label: 'Collecté', color: '#10B981' },
};

export function StatDetailModal({ visible, title, icon, total, accentColor, fetchData, onClose }: StatDetailModalProps) {
  const [data, setData] = useState<StatDetailItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      fetchData().then((d) => { setData(d); setLoading(false); });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={styles.overlay}>
      <Animated.View entering={FadeIn.duration(300).delay(50)} style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIcon, { backgroundColor: accentColor + '15' }]}>
              <Ionicons name={icon as any} size={18} color={accentColor} />
            </View>
            <View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.total}>{total} au total</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={18} color="#6B7AA8" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color={accentColor} />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            {data.map((item, idx) => (
              <Animated.View
                key={item.id}
                entering={FadeInRight.delay(idx * 40).springify().damping(20)}
              >
                <TouchableOpacity style={styles.row} activeOpacity={0.7}>
                  <View style={[styles.rowIcon, { backgroundColor: item.color + '15' }]}>
                    <Ionicons name={item.icon as any} size={16} color={item.color} />
                  </View>
                  <View style={styles.rowContent}>
                    <View style={styles.rowTop}>
                      <Text style={styles.rowLabel} numberOfLines={1}>{item.label}</Text>
                      <Text style={[styles.rowValue, { color: item.color }]}>{item.value}</Text>
                    </View>
                    <Text style={styles.rowSublabel} numberOfLines={1}>{item.sublabel}</Text>
                    <View style={styles.rowBottom}>
                      <Text style={styles.rowDate}>{item.date}</Text>
                      {item.status && (
                        <View style={[styles.badge, { backgroundColor: (STATUS_LABELS[item.status]?.color ?? '#6B7280') + '15' }]}>
                          <View style={[styles.badgeDot, { backgroundColor: STATUS_LABELS[item.status]?.color ?? '#6B7280' }]} />
                          <Text style={[styles.badgeText, { color: STATUS_LABELS[item.status]?.color ?? '#6B7280' }]}>
                            {STATUS_LABELS[item.status]?.label ?? item.status}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
                {idx < data.length - 1 && <View style={styles.rowDivider} />}
              </Animated.View>
            ))}
          </ScrollView>
        )}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', zIndex: 100,
  },
  sheet: {
    backgroundColor: '#0F172A', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    maxHeight: '85%', paddingTop: 8,
    borderTopWidth: 1, borderColor: '#1E2A4A',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: '#334155',
    alignSelf: 'center', marginBottom: 12,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 14,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: '#F1F5F9', letterSpacing: -0.3 },
  total: { fontSize: 12, color: '#6B7AA8', fontWeight: '500', marginTop: 1 },
  closeBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
  divider: { height: 1, backgroundColor: '#1E2A4A', marginHorizontal: 20 },
  loadingWrap: { paddingVertical: 40, alignItems: 'center', gap: 8 },
  loadingText: { fontSize: 12, color: '#6B7AA8', fontWeight: '500' },
  list: { paddingHorizontal: 20, marginTop: 8 },
  row: { flexDirection: 'row', gap: 12, paddingVertical: 12 },
  rowIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  rowContent: { flex: 1, gap: 3 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: 14, fontWeight: '600', color: '#F1F5F9', flex: 1, marginRight: 8 },
  rowValue: { fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'] },
  rowSublabel: { fontSize: 11, color: '#6B7AA8', fontWeight: '500' },
  rowBottom: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  rowDate: { fontSize: 10, color: '#475569', fontWeight: '600', fontVariant: ['tabular-nums'] },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  badgeDot: { width: 4, height: 4, borderRadius: 2 },
  badgeText: { fontSize: 9, fontWeight: '700' },
  rowDivider: { height: 1, backgroundColor: '#1E2A4A', marginLeft: 48 },
});
