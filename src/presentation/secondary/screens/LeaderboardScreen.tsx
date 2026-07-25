import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';
import { useUser } from '../../../core/contexts/UserContext';
import { api } from '../../../core/api/api';

interface LeaderboardUser {
  id: string; rank: number; name: string; points: number; avatarColor: string; isCurrentUser?: boolean;
}

const AVATAR_COLORS = ['#F59E0B', '#9CA3AF', '#D97706', '#2563EB', '#7C3AED', '#DC2626', '#059669', '#0284C7'];

function getMedal(rank: number): { icon: keyof typeof Ionicons.glyphMap; color: string } | null {
  if (rank === 1) return { icon: 'trophy', color: '#F59E0B' };
  if (rank === 2) return { icon: 'shield', color: '#9CA3AF' };
  if (rank === 3) return { icon: 'shield', color: '#D97706' };
  return null;
}

export default function LeaderboardScreen() {
  const { t } = useTranslation();
  const { userId, userName, profile } = useUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${api.baseUrl}/api/leaderboard/`);
        if (!res.ok) throw new Error(t('leaderboard.error'));
        const data = await res.json();
        if (!cancelled) {
          const users: LeaderboardUser[] = data.map((u: any, i: number) => ({
            id: u.id,
            rank: i + 1,
            name: u.name || t('leaderboard.user'),
            points: u.points || 0,
            avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
            isCurrentUser: u.id === userId,
          }));
          setLeaderboard(users);
        }
      } catch {
        if (!cancelled) setLeaderboard([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: t('leaderboard.title') }} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: t('leaderboard.title') }} />
        <Ionicons name="trophy-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.emptyText}>{t('leaderboard.noParticipants')}</Text>
      </View>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t('leaderboard.title'), headerTintColor: colors.primary }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {top3.length >= 3 && (
          <View style={styles.podium}>
            {[1, 0, 2].map((idx) => {
              const user = top3[idx];
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
        )}

        <View style={styles.list}>
          {(top3.length < 3 ? leaderboard : rest).map((user) => {
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, gap: spacing.sm },
  emptyText: { fontSize: 16, color: colors.textSecondary },
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
  pointsCol: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  pointsValue: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  pointsLabel: { fontSize: 11, color: colors.textSecondary },
});
