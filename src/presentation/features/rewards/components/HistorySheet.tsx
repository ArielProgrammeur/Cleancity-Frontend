import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import type { ClaimedReward } from '../../../../domain/repositories/IRewardRepository';

interface HistorySheetProps {
  visible: boolean;
  history: ClaimedReward[];
  onClose: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  pending: { label: 'Pending', icon: 'time-outline', color: '#F59E0B', bg: '#FFFBEB' },
  fulfilled: { label: 'Fulfilled', icon: 'checkmark-circle', color: '#059669', bg: '#ECFDF5' },
  cancelled: { label: 'Cancelled', icon: 'close-circle', color: '#DC2626', bg: '#FEF2F2' },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function HistoryItem({ item, isLast }: { item: ClaimedReward; isLast: boolean }) {
  const statusConfig = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.pending;

  return (
    <View style={styles.itemRow}>
      <View style={styles.timelineCol}>
        <View style={[styles.timelineDot, { backgroundColor: item.rewardColor }]} />
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      <View style={[styles.itemIcon, { backgroundColor: item.rewardBgColor }]}>
        <Ionicons name={item.rewardIcon as any} size={20} color={item.rewardColor} />
      </View>

      <View style={styles.itemContent}>
        <View style={styles.itemTop}>
          <Text style={styles.itemName} numberOfLines={1}>{item.rewardName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Ionicons name={statusConfig.icon as any} size={11} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <View style={styles.itemMeta}>
          <View style={styles.metaChip}>
            <Ionicons name="flash" size={12} color="#FF8F00" />
            <Text style={styles.metaText}>-{item.pointsSpent.toLocaleString()} pts</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="calendar-outline" size={12} color="#6B7280" />
            <Text style={styles.metaText}>{formatDate(item.claimedAt)}</Text>
          </View>
        </View>

        <View style={styles.voucherRow}>
          <Ionicons name="pricetag-outline" size={12} color="#9CA3AF" />
          <Text style={styles.voucherText}>{item.voucherCode}</Text>
        </View>
      </View>
    </View>
  );
}

export function HistorySheet({ visible, history, onClose }: HistorySheetProps) {
  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      <Animated.View
        entering={SlideInDown.duration(400).springify().damping(20)}
        exiting={SlideOutDown.duration(250)}
        style={styles.sheet}
      >
        <View style={styles.handle} />

        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Redemption History</Text>
            <Text style={styles.headerSub}>{history.length} reward{history.length !== 1 ? 's' : ''} claimed</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {history.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptyDesc}>Your redeemed rewards will appear here</Text>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <HistoryItem item={item} isLast={index === history.length - 1} />
            )}
          />
        )}
      </Animated.View>
    </Animated.View>
  );
}



const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  headerSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timelineCol: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 22,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 6,
  },
  itemContent: {
    flex: 1,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 4,
  },
  itemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 6,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 6,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  voucherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  voucherText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#9CA3AF',
  },
});
