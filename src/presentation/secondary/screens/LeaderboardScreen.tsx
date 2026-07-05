import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';

interface LeaderboardUser {
  id: string; rank: number; name: string; points: number; reports: number;
  avatarColor: string; isCurrentUser?: boolean;
}

const LEADERBOARD: LeaderboardUser[] = [
  { id: 'u1', rank: 1, name: 'Sophie M.', points: 8450, reports: 67, avatarColor: '#F59E0B' },
  { id: 'u2', rank: 2, name: 'Lucas B.', points: 7200, reports: 54, avatarColor: '#9CA3AF' },
  { id: 'u3', rank: 3, name: 'Emma R.', points: 6890, reports: 51, avatarColor: '#D97706' },
  { id: 'u4', rank: 4, name: 'Hugo P.', points: 5430, reports: 38, avatarColor: '#2563EB' },
  { id: 'u5', rank: 5, name: 'Ariel', points: 4150, reports: 12, avatarColor: colors.primary, isCurrentUser: true },
  { id: 'u6', rank: 6, name: 'Camille D.', points: 3890, reports: 29, avatarColor: '#7C3AED' },
  { id: 'u7', rank: 7, name: 'Nathan T.', points: 3200, reports: 23, avatarColor: '#DC2626' },
  { id: 'u8', rank: 8, name: 'Léa J.', points: 2800, reports: 19, avatarColor: '#059669' },
  { id: 'u9', rank: 9, name: 'Tom S.', points: 2100, reports: 15, avatarColor: '#D97706' },
  { id: 'u10', rank: 10, name: 'Jade K.', points: 1500, reports: 8, avatarColor: '#0284C7' },
];

function getMedal(rank: number): { icon: keyof typeof Ionicons.glyphMap; color: string } | null {
  if (rank === 1) return { icon: 'trophy', color: '#F59E0B' };
  if (rank === 2) return { icon: 'shield', color: '#9CA3AF' };
  if (rank === 3) return { icon: 'shield', color: '#D97706' };
  return null;
}

export default function LeaderboardScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Leaderboard', headerTintColor: colors.primary }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.podium}>
          {[1, 0, 2].map((idx) => {
            const user = LEADERBOARD[idx];
            const heights = [140, 180, 100];
            return (
              <View key={user.id} style={[styles.podiumItem, idx === 0 ? styles.podiumCenter : null]}>
                <View style={[styles.podiumAvatar, { backgroundColor: user.avatarColor, borderColor: user.rank === 1 ? '#F59E0B' : 'transparent', borderWidth: user.rank === 1 ? 3 : 0 }]}>
                  <Text style={styles.podiumAvatarText}>{user.name.charAt(0)}</Text>
                </View>
                <Text style={styles.podiumName}>{user.name.split(' ')[0]}</Text>
                <Text style={styles.podiumPoints}>{user.points.toLocaleString()} pts</Text>
                <View style={[styles.podiumBar, { height: heights[idx], backgroundColor: user.rank === 1 ? '#F59E0B' : user.rank === 2 ? '#9CA3AF' : '#D97706' }]} />
              </View>
            );
          })}
        </View>

        <View style={styles.list}>
          {LEADERBOARD.slice(3).map((user) => {
            const medal = getMedal(user.rank);
            return (
              <View key={user.id} style={[styles.row, user.isCurrentUser && styles.rowHighlight]}>
                <View style={styles.rankCol}>
                  {medal ? (
                    <Ionicons name={medal.icon} size={22} color={medal.color} />
                  ) : (
                    <Text style={styles.rankText}>{user.rank}</Text>
                  )}
                </View>
                <View style={[styles.avatar, { backgroundColor: user.avatarColor }]}>
                  <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userReports}>{user.reports} reports</Text>
                </View>
                <View style={styles.pointsCol}>
                  <Text style={styles.pointsValue}>{user.points.toLocaleString()}</Text>
                  <Text style={styles.pointsLabel}>pts</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xxl },
  podium: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingTop: spacing.xl, paddingBottom: spacing.md, paddingHorizontal: spacing.md, backgroundColor: colors.surface, marginHorizontal: spacing.md, marginTop: spacing.md, borderRadius: borderRadius.xl, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  podiumItem: { flex: 1, alignItems: 'center', gap: spacing.xs },
  podiumCenter: { marginTop: -20 },
  podiumAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  podiumAvatarText: { fontSize: 20, fontWeight: '800', color: colors.white },
  podiumName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  podiumPoints: { fontSize: 11, color: colors.textSecondary },
  podiumBar: { width: 40, borderRadius: 8, marginTop: spacing.xs },
  list: { paddingHorizontal: spacing.md, marginTop: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg, marginBottom: spacing.sm, gap: spacing.sm, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  rowHighlight: { borderLeftWidth: 3, borderLeftColor: colors.primary },
  rankCol: { width: 28, alignItems: 'center' },
  rankText: { fontSize: 16, fontWeight: '700', color: colors.textSecondary },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700', color: colors.white },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  userReports: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  pointsCol: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  pointsValue: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  pointsLabel: { fontSize: 11, color: colors.textSecondary },
});
