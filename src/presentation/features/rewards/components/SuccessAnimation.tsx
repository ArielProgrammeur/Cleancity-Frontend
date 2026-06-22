import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,

  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { ClaimedReward } from '../../../../domain/repositories/IRewardRepository';

interface SuccessAnimationProps {
  visible: boolean;
  claimed: ClaimedReward | null;
  onDismiss: () => void;
}

function Sparkle({ index, color }: { index: number; color: string }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);

  useEffect(() => {
    const angle = (index / 8) * Math.PI * 2;
    const distance = 60 + Math.random() * 40;

    scale.value = withDelay(
      index * 50,
      withSpring(1, { damping: 12, stiffness: 120 }, () => {
        translateX.value = withTiming(Math.cos(angle) * distance, { duration: 600 });
        translateY.value = withTiming(Math.sin(angle) * distance, { duration: 600 });
        opacity.value = withDelay(400, withTiming(0, { duration: 300 }));
        scale.value = withDelay(400, withTiming(0, { duration: 300 }));
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.sparkle, animatedStyle]}>
      <Ionicons name="sparkles" size={12} color={color} />
    </Animated.View>
  );
}

function Checkmark() {
  const circleScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    circleScale.value = withSpring(1, { damping: 10, stiffness: 120 });
    checkOpacity.value = withDelay(300, withTiming(1, { duration: 200 }));
    checkScale.value = withDelay(300, withSpring(1, { damping: 8, stiffness: 100 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <View style={styles.checkContainer}>
      <Animated.View style={[styles.checkCircle, circleStyle]}>
        <Ionicons name="checkmark" size={36} color="#FFFFFF" />
      </Animated.View>
      <Animated.View style={[styles.checkOverlay, checkStyle]}>
        <View style={styles.sparklesRow}>
          {['#FFD700', '#2E7D32', '#FF6B6B', '#4FC3F7', '#CE93D8', '#FF8F00'].map(
            (color, i) => (
              <Sparkle key={i} index={i} color={color} />
            ),
          )}
        </View>
      </Animated.View>
    </View>
  );
}

export function SuccessAnimation({ visible, claimed, onDismiss }: SuccessAnimationProps) {
  if (!visible || !claimed) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={styles.overlay}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onDismiss}
      />

      <Animated.View
        entering={SlideInDown.duration(500).springify().damping(15)}
        exiting={SlideOutDown.duration(300)}
        style={styles.card}
      >
        <Checkmark />

        <Text style={styles.title}>Reward Redeemed!</Text>

        <View style={[styles.rewardIconWrap, { backgroundColor: claimed.rewardBgColor }]}>
          <Ionicons name={claimed.rewardIcon as any} size={28} color={claimed.rewardColor} />
        </View>
        <Text style={styles.rewardName}>{claimed.rewardName}</Text>

        <View style={styles.pointsRow}>
          <Ionicons name="flash" size={16} color="#FF8F00" />
          <Text style={styles.pointsText}>-{claimed.pointsSpent.toLocaleString()} pts</Text>
        </View>

        <View style={styles.voucherCard}>
          <Text style={styles.voucherLabel}>Voucher Code</Text>
          <Text style={styles.voucherCode}>{claimed.voucherCode}</Text>
          <Text style={styles.voucherHint}>Show this code to claim your reward</Text>
        </View>

        <TouchableOpacity style={styles.doneBtn} onPress={onDismiss} activeOpacity={0.8}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    width: '85%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 15,
  },
  checkContainer: {
    width: 80,
    height: 80,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  checkOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sparklesRow: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sparkle: {
    position: 'absolute',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  rewardIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  rewardName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 8,
    textAlign: 'center',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF8F00',
  },
  voucherCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  voucherLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  voucherCode: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B5E20',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 6,
  },
  voucherHint: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  doneBtn: {
    backgroundColor: '#111827',
    paddingHorizontal: 48,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
