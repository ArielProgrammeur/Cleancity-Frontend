import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import type { Badge } from '../../../../domain/entities/Profile';

interface AchievementSectionProps {
  badges: Badge[];
}

export function AchievementSection({ badges }: AchievementSectionProps) {
  const unlocked = badges.filter((b) => b.unlockedAt);
  const progress = badges.length > 0 ? Math.round((unlocked.length / badges.length) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Achievements</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{unlocked.length}/{badges.length}</Text>
        </View>
      </View>

      <View style={styles.progressBarWrap}>
        <View style={styles.progressBg}>
          <Animated.View
            entering={FadeIn.duration(800)}
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
        <Text style={styles.progressLabel}>{progress}% complete</Text>
      </View>

      <View style={styles.grid}>
        {badges.map((badge, idx) => {
          const isUnlocked = !!badge.unlockedAt;
          return (
            <Animated.View
              key={badge.id}
              entering={FadeInUp.delay(idx * 50).springify().damping(15)}
              style={[styles.badgeCard, !isUnlocked && styles.badgeCardLocked]}
            >
              <View style={[styles.iconWrap, { backgroundColor: isUnlocked ? badge.color + '18' : '#F3F4F6' }]}>
                <Ionicons
                  name={(isUnlocked ? badge.icon : 'lock-closed') as any}
                  size={22}
                  color={isUnlocked ? badge.color : '#D1D5DB'}
                />
              </View>
              <Text style={[styles.badgeName, !isUnlocked && styles.textLocked]} numberOfLines={1}>
                {badge.name}
              </Text>
              {isUnlocked && badge.unlockedAt && (
                <Text style={styles.dateText}>
                  {new Date(badge.unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              )}
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  progressBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  progressBarWrap: {
    marginBottom: 16,
    gap: 6,
  },
  progressBg: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeCard: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  badgeCardLocked: {
    backgroundColor: '#F9FAFB',
    opacity: 0.7,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  textLocked: {
    color: '#D1D5DB',
  },
  dateText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#9CA3AF',
  },
});
