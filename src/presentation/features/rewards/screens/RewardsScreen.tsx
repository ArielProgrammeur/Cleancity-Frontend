import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import { RewardMockDatasource } from '../../../../data/datasources/RewardMockDatasource';
import { RewardRepositoryImpl } from '../../../../data/repositories/RewardRepositoryImpl';
import { useRewards } from '../hooks/useRewards';
import type { Reward } from '../../../../domain/entities/Reward';
import type { UserRewardData } from '../../../../domain/repositories/IRewardRepository';
import type { SortOption } from '../hooks/useRewards';
import { RewardHero } from '../components/RewardHero';
import { CategoryFilter } from '../components/CategoryFilter';
import { SearchBar } from '../components/SearchBar';
import { RewardCard } from '../components/RewardCard';
import { SuccessAnimation } from '../components/SuccessAnimation';
import { HistorySheet } from '../components/HistorySheet';

const SORT_OPTIONS: { key: SortOption; label: string; icon: string }[] = [
  { key: 'popular', label: 'Popular', icon: 'trending-up' },
  { key: 'low-high', label: 'Price: Low to High', icon: 'arrow-up' },
  { key: 'high-low', label: 'Price: High to Low', icon: 'arrow-down' },
];

function SkeletonCard() {
  return (
    <View style={skeletonStyles.card}>
      <View style={skeletonStyles.topRow}>
        <View style={skeletonStyles.icon} />
        <View style={skeletonStyles.textBlock}>
          <View style={skeletonStyles.titleLine} />
          <View style={skeletonStyles.subtitleLine} />
        </View>
      </View>
      <View style={skeletonStyles.descLine} />
      <View style={skeletonStyles.descLineShort} />
      <View style={skeletonStyles.bottomRow}>
        <View style={skeletonStyles.badge} />
        <View style={skeletonStyles.btn} />
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F1F3',
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 14,
  },
  textBlock: {
    flex: 1,
    gap: 6,
    paddingTop: 4,
  },
  titleLine: {
    height: 16,
    width: '60%',
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  subtitleLine: {
    height: 12,
    width: '40%',
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  descLine: {
    height: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 6,
  },
  descLineShort: {
    height: 12,
    width: '70%',
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    width: 80,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  btn: {
    width: 100,
    height: 42,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
});

const datasource = new RewardMockDatasource();
const repository = new RewardRepositoryImpl(datasource);

export function RewardsScreen() {
  const {
    rewards,
    history,
    userData,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    activeCategory,
    sortBy,
    claimedIds,
    wishlistIds,
    lastClaimed,
    showSuccess,
    refresh,
    claimReward,
    dismissSuccess,
    toggleWishlist,
    setCategory,
    setSearch,
    setSort,
  } = useRewards(repository);

  const [showHistory, setShowHistory] = useState(false);

  const handleClaim = useCallback(
    async (reward: Reward) => {
      if (claimedIds.has(reward.id)) return;

      const effectiveCost = reward.discountPrice ?? reward.pointsCost;

      Alert.alert(
        `Redeem ${reward.name}?`,
        `${effectiveCost.toLocaleString()} points will be deducted from your balance.${
          reward.terms ? `\n\n${reward.terms}` : ''
        }`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, redeem',
            style: 'default',
            onPress: async () => {
              const ok = await claimReward(reward);
              if (!ok) {
                Alert.alert('Error', 'Failed to redeem reward. Please try again.');
              }
            },
          },
        ],
      );
    },
    [claimedIds, claimReward],
  );

  const handleSortPress = useCallback(() => {
    Alert.alert('Sort by', '', [
      ...SORT_OPTIONS.map((opt) => ({
        text: `${opt.label}${opt.key === sortBy ? ' ✓' : ''}`,
        onPress: () => setSort(opt.key as SortOption),
      })),
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [sortBy, setSort]);

  const renderHeader = useCallback(
    () => (
      <View>
        <RewardHero userData={userData} claimedCount={claimedIds.size} />
        <SearchBar value={searchQuery} onChange={setSearch} />
        <CategoryFilter activeCategory={activeCategory} onCategoryChange={setCategory} />

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              {searchQuery.trim()
                ? 'Search Results'
                : activeCategory === 'all'
                  ? 'All Rewards'
                  : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Rewards`}
            </Text>
            <Text style={styles.sectionCount}>{rewards.length} item{rewards.length !== 1 ? 's' : ''}</Text>
          </View>
        </View>
      </View>
    ),
    [userData, claimedIds, searchQuery, activeCategory, rewards.length, setSearch, setCategory],
  );

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyState}>
        <Ionicons name="search-outline" size={48} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>No rewards found</Text>
        <Text style={styles.emptyDesc}>
          {searchQuery.trim()
            ? 'Try a different search or filter'
            : 'Try adjusting your filters'}
        </Text>
      </View>
    ),
    [searchQuery],
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <RewardsHeader
          userData={null}
          sortBy="popular"
          claimedCount={0}
          onSortPress={() => {}}
          onHistoryPress={() => {}}
        />
        <View style={styles.skeletonContainer}>
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <RewardsHeader
          userData={null}
          sortBy="popular"
          claimedCount={0}
          onSortPress={() => {}}
          onHistoryPress={() => {}}
        />
        <View style={styles.errorState}>
          <Ionicons name="cloud-offline-outline" size={56} color="#D1D5DB" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refresh} activeOpacity={0.8}>
            <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
      <View style={styles.container}>
      <RewardsHeader
        userData={userData}
        sortBy={sortBy}
        claimedCount={claimedIds.size}
        onSortPress={handleSortPress}
        onHistoryPress={() => setShowHistory(true)}
      />

      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor="#2E7D32"
            colors={['#2E7D32']}
          />
        }
        renderItem={({ item, index }) => (
          <RewardCard
            reward={item}
            userPoints={userData?.totalPoints ?? 0}
            isWishlisted={wishlistIds.has(item.id)}
            isClaimed={claimedIds.has(item.id)}
            onClaim={handleClaim}
            onToggleWishlist={toggleWishlist}
            index={index}
          />
        )}
      />

      <SuccessAnimation
        visible={showSuccess}
        claimed={lastClaimed}
        onDismiss={dismissSuccess}
      />

      <HistorySheet
        visible={showHistory}
        history={history}
        onClose={() => setShowHistory(false)}
      />
    </View>
  );
}

const TIER_META: Record<string, { label: string; icon: string; color: string }> = {
  bronze: { label: 'Bronze', icon: 'shield-outline', color: '#CD7F32' },
  silver: { label: 'Silver', icon: 'shield-half-outline', color: '#A0A0A0' },
  gold: { label: 'Gold', icon: 'shield-checkmark', color: '#FFD700' },
  platinum: { label: 'Platinum', icon: 'diamond', color: '#E5E4E2' },
};

function RewardsHeader({
  userData,
  sortBy,
  claimedCount,
  onSortPress,
  onHistoryPress,
}: {
  userData: UserRewardData | null;
  sortBy: SortOption;
  claimedCount: number;
  onSortPress: () => void;
  onHistoryPress: () => void;
}) {
  const insets = useSafeAreaInsets();
  const isSorted = sortBy !== 'popular';
  const tier = userData?.currentTier ?? 'bronze';
  const tierMeta = TIER_META[tier] ?? TIER_META.bronze;
  const points = userData?.totalPoints ?? 0;

  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      style={[headerStyles.container, { paddingTop: insets.top + 12 }]}
    >
      <View style={headerStyles.mainRow}>
        <View style={headerStyles.leftCol}>
          <View style={headerStyles.iconRing}>
            <View style={headerStyles.iconInner}>
              <Ionicons name="gift" size={20} color="#FFFFFF" />
            </View>
          </View>
          <View style={headerStyles.titleBlock}>
            <View style={headerStyles.titleRow}>
              <Text style={headerStyles.title}>Rewards</Text>
              {points > 0 && (
                <View style={headerStyles.pointsPill}>
                  <Ionicons name="flash" size={10} color="#FF8F00" />
                  <Text style={headerStyles.pointsPillText}>{points.toLocaleString()}</Text>
                </View>
              )}
            </View>
            <View style={headerStyles.subtitleRow}>
              <Ionicons name={tierMeta.icon as any} size={12} color={tierMeta.color} />
              <Text style={[headerStyles.subtitle, { color: tierMeta.color }]}>
                {tierMeta.label} Tier
              </Text>
              {claimedCount > 0 && (
                <>
                  <Text style={headerStyles.subtitleDot}>•</Text>
                  <Text style={headerStyles.subtitle}>
                    {claimedCount} redeemed
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={headerStyles.rightCol}>
          <TouchableOpacity
            style={[headerStyles.iconBtn, isSorted && headerStyles.iconBtnActive]}
            onPress={onSortPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name="options-outline"
              size={19}
              color={isSorted ? '#2E7D32' : '#6B7280'}
            />
            {isSorted && <View style={headerStyles.activeDot} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={headerStyles.iconBtn}
            onPress={onHistoryPress}
            activeOpacity={0.7}
          >
            <Ionicons name="time-outline" size={19} color="#6B7280" />
            {claimedCount > 0 && (
              <View style={headerStyles.badgeDot}>
                <Text style={headerStyles.badgeText}>{claimedCount > 9 ? '9+' : claimedCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    paddingBottom: 14,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F3',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconRing: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  iconInner: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.4,
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  pointsPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  subtitleDot: {
    fontSize: 12,
    color: '#D1D5DB',
    marginHorizontal: 2,
  },
  rightCol: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    position: 'relative',
  },
  iconBtnActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  activeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },
  badgeDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  list: {
    paddingBottom: 100,
  },
  skeletonContainer: {
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sectionCount: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 2,
  },
  emptyState: {
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
    textAlign: 'center',
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  errorDesc: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  retryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
