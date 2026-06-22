import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
  FadeInDown,
  FadeIn,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { UserRewardData } from '../../../../domain/repositories/IRewardRepository';

interface RewardHeroProps {
  userData: UserRewardData | null;
  claimedCount: number;
}

const TIER_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  bronze: { label: 'Bronze', icon: 'shield-outline', color: '#CD7F32', bg: '#7B5B3A' },
  silver: { label: 'Silver', icon: 'shield-half-outline', color: '#E8E8E8', bg: '#717171' },
  gold: { label: 'Gold', icon: 'shield-checkmark', color: '#FFD700', bg: '#B8860B' },
  platinum: { label: 'Platinum', icon: 'diamond', color: '#E5E4E2', bg: '#6B6B6B' },
};

function PointsCounter({ value }: { value: number }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(1.15, { damping: 8, stiffness: 150 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    });
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Text style={styles.pointsValue}>{value.toLocaleString()}</Text>
    </Animated.View>
  );
}

export function RewardHero({ userData, claimedCount }: RewardHeroProps) {
  const pulseValue = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    pulseValue.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  useEffect(() => {
    if (userData) {
      const progress = Math.min(userData.tierProgress / userData.nextTierPoints, 1);
      progressWidth.value = withSpring(progress, { damping: 20, stiffness: 100 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.tierProgress, userData?.nextTierPoints]);

  const circleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 0.06 + pulseValue.value * 0.1,
    transform: [
      { scale: 1 + pulseValue.value * 0.2 },
      { translateX: pulseValue.value * 40 },
    ],
  }));

  const circle2AnimatedStyle = useAnimatedStyle(() => ({
    opacity: 0.04 + (1 - pulseValue.value) * 0.08,
    transform: [
      { scale: 1 + (1 - pulseValue.value) * 0.25 },
      { translateX: -(1 - pulseValue.value) * 30 },
    ],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const tier = userData?.currentTier ?? 'bronze';
  const tierInfo = TIER_CONFIG[tier] ?? TIER_CONFIG.bronze;

  return (
    <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.container}>
      <View style={styles.bgContainer}>
        <Animated.View style={[styles.circle, circleAnimatedStyle]} />
        <Animated.View style={[styles.circle2, circle2AnimatedStyle]} />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.tierBadge, { backgroundColor: tierInfo.bg + '40' }]}>
            <Ionicons name={tierInfo.icon as any} size={14} color={tierInfo.color} />
            <Text style={[styles.tierLabel, { color: tierInfo.color }]}>{tierInfo.label}</Text>
          </View>
          <Text style={styles.pointsHeader}>Available Points</Text>
        </View>

        <PointsCounter value={userData?.totalPoints ?? 0} />

        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
          <Text style={styles.progressText}>
            {userData
              ? `${(userData.nextTierPoints - userData.tierProgress).toLocaleString()} pts to next tier`
              : '---'}
          </Text>
        </View>

        <Animated.View entering={FadeIn.delay(400)} style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="gift" size={13} color="rgba(255,255,255,0.6)" />
            <Text style={styles.statValue}>{userData?.totalClaimed ?? 0}</Text>
            <Text style={styles.statLabel}>Redeemed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Ionicons name="flash" size={13} color="rgba(255,255,255,0.6)" />
            <Text style={styles.statValue}>
              {userData ? userData.lifetimePoints.toLocaleString() : '0'}
            </Text>
            <Text style={styles.statLabel}>Earned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Ionicons name="trending-up" size={13} color="rgba(255,255,255,0.6)" />
            <Text style={styles.statValue}>{claimedCount}</Text>
            <Text style={styles.statLabel}>Claimed</Text>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#1B5E20',
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  bgContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  circle: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
  },
  circle2: {
    position: 'absolute',
    bottom: -70,
    left: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  tierLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  pointsHeader: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  pointsValue: {
    fontSize: 52,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -2,
    marginVertical: 8,
  },
  progressSection: {
    gap: 8,
    marginBottom: 20,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 16,
    padding: 14,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
