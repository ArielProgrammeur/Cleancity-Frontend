import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';

interface Notification {
  id: string; title: string; body: string; time: string; read: boolean;
  icon: keyof typeof Ionicons.glyphMap; color: string; bgColor: string;
}

const NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Report Approved', body: 'Your report "Plastic bottle near park" has been approved.', time: '2h ago', read: false, icon: 'checkmark-circle', color: colors.success, bgColor: '#ECFDF5' },
  { id: 'n2', title: 'Reward Claimed', body: 'Your Eco Tote Bag reward is being processed.', time: '5h ago', read: false, icon: 'gift', color: colors.secondary, bgColor: '#FFFBEB' },
  { id: 'n3', title: 'Collection Reminder', body: 'Waste collection tomorrow at 08:00 on your street.', time: '1d ago', read: true, icon: 'calendar', color: colors.info, bgColor: '#EFF6FF' },
  { id: 'n4', title: 'New Badge Earned', body: 'Congratulations! You earned "Eco Warrior" badge!', time: '2d ago', read: true, icon: 'shield-checkmark', color: '#059669', bgColor: '#F0FDF4' },
  { id: 'n5', title: 'Points Earned', body: 'You earned 50 points for your recent waste report.', time: '3d ago', read: true, icon: 'star', color: colors.secondary, bgColor: '#FFFBEB' },
  { id: 'n6', title: 'Marketplace Listing Sold', body: 'Your PET plastic listing has been sold.', time: '5d ago', read: true, icon: 'storefront', color: '#7C3AED', bgColor: '#F5F3FF' },
  { id: 'n7', title: 'Level Up!', body: 'You reached "Eco Warrior" level. Keep it up!', time: '1w ago', read: true, icon: 'trending-up', color: colors.primary, bgColor: '#F0FDF4' },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Notifications', headerTintColor: colors.primary }} />
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.divider} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyBody}>You are all caught up!</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, !item.read && styles.cardUnread]}>
            <View style={[styles.iconCircle, { backgroundColor: item.bgColor }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <View style={styles.content}>
              <View style={styles.titleRow}>
                <Text style={[styles.title, !item.read && styles.titleUnread]}>{item.title}</Text>
                {!item.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: spacing.sm },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  emptyBody: { fontSize: 14, color: colors.textSecondary },
  card: { flexDirection: 'row', backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm, gap: spacing.sm, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  cardUnread: { borderLeftWidth: 3, borderLeftColor: colors.primary },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  title: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, flex: 1 },
  titleUnread: { fontWeight: '700' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  body: { fontSize: 13, color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
  time: { fontSize: 11, color: colors.divider, marginTop: 4 },
});
