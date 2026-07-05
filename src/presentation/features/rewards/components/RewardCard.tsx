import { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInUp,
} from 'react-native-reanimated';
import type { Reward } from '../../../../domain/entities/Reward';

interface RewardCardProps {
  reward: Reward;
  userPoints: number;
  isWishlisted: boolean;
  isClaimed: boolean;
  onClaim: (reward: Reward) => void;
  onToggleWishlist: (rewardId: string) => void;
  index: number;
  onPress?: () => void;
}

export const RewardCard = memo(function RewardCard({
  reward,
  userPoints,
  isWishlisted,
  isClaimed,
  onClaim,
  onToggleWishlist,
  index,
  onPress,
}: RewardCardProps) {
  const scale = useSharedValue(1);

  const effectiveCost = reward.discountPrice ?? reward.pointsCost;
  const canAfford = userPoints >= effectiveCost;
  const lowStock = reward.stock > 0 && reward.stock <= 5;
  const stockPercent = reward.totalStock > 0 ? reward.stock / reward.totalStock : 0;
  const hasDiscount = reward.discountPrice != null && reward.discountPrice < reward.pointsCost;

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 150 });
  }, []);

  if (isClaimed) {
    return (
      <Animated.View
        entering={FadeInUp.delay(index * 80).springify().damping(15)}
      >
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          <View style={styles.claimedCard}>
            <View style={styles.claimedLeft}>
              <View style={[styles.claimedIconWrap, { backgroundColor: reward.bgColor }]}>
                <Ionicons name={reward.icon as any} size={20} color={reward.color} />
              </View>
              <View>
                <Text style={styles.claimedName}>{reward.name}</Text>
                <Text style={styles.claimedLabel}>Redeemed</Text>
              </View>
            </View>
            <Ionicons name="checkmark-circle" size={22} color="#2E7D32" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).springify().damping(15)}
      style={cardAnimatedStyle}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.95}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={() => onToggleWishlist(reward.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.6}
        >
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={18}
            color={isWishlisted ? '#DC2626' : '#D1D5DB'}
          />
        </TouchableOpacity>

        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{Math.round((1 - reward.discountPrice! / reward.pointsCost) * 100)}%
            </Text>
          </View>
        )}

        <View style={styles.cardTop}>
          <View style={[styles.iconWrap, { backgroundColor: reward.bgColor }]}>
            <Ionicons name={reward.icon as any} size={24} color={reward.color} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.name} numberOfLines={1}>{reward.name}</Text>
            {reward.partnerName && (
              <View style={styles.partnerRow}>
                <Ionicons name="storefront-outline" size={11} color="#9CA3AF" />
                <Text style={styles.partnerText}>{reward.partnerName}</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.desc} numberOfLines={2}>{reward.description}</Text>

        <View style={styles.cardBottom}>
          <View style={styles.pointsSection}>
            <View style={styles.pointsBadge}>
              <Ionicons name="flash" size={13} color="#FF8F00" />
              {hasDiscount ? (
                <View style={styles.priceRow}>
                  <Text style={styles.oldPrice}>{reward.pointsCost.toLocaleString()}</Text>
                  <Text style={styles.pointsText}>{reward.discountPrice!.toLocaleString()} pts</Text>
                </View>
              ) : (
                <Text style={styles.pointsText}>{reward.pointsCost.toLocaleString()} pts</Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.claimBtn, !canAfford && styles.claimBtnDisabled]}
            onPress={() => onClaim(reward)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
            disabled={!canAfford}
          >
            <Ionicons
              name={canAfford ? 'gift' : 'lock-closed'}
              size={14}
              color={canAfford ? '#FFFFFF' : '#9CA3AF'}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.claimText, !canAfford && styles.claimTextDisabled]}>
              {canAfford ? 'Redeem' : `Need ${(reward.pointsCost - userPoints).toLocaleString()} more`}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stockSection}>
          <View style={styles.stockBarTrack}>
            <View
              style={[
                styles.stockBarFill,
                {
                  width: `${Math.min(stockPercent * 100, 100)}%`,
                  backgroundColor: lowStock ? '#DC2626' : stockPercent < 0.5 ? '#F59E0B' : '#2E7D32',
                },
              ]}
            />
          </View>
          <Text style={styles.stockLabel}>
            {lowStock
              ? `Only ${reward.stock} left`
              : `${reward.stock} / ${reward.totalStock} available`}
          </Text>
        </View>
      </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    position: 'relative',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    zIndex: 2,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  partnerText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  desc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 14,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsSection: {
    flex: 1,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  oldPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  claimBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingHorizontal: 18,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimBtnDisabled: {
    backgroundColor: '#F3F4F6',
  },
  claimText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  claimTextDisabled: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  stockSection: {
    marginTop: 12,
    gap: 4,
  },
  stockBarTrack: {
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  stockBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  stockLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  claimedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  claimedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  claimedIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimedName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
  },
  claimedLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
});
