import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity, TextInput,
  StyleSheet,
  Alert,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RewardApiDatasource } from '../../../../data/datasources/RewardApiDatasource';
import { RewardRepositoryImpl } from '../../../../data/repositories/RewardRepositoryImpl';
import { useRewards } from '../hooks/useRewards';
import { useUser } from '../../../../core/contexts/UserContext';
import type { Reward } from '../../../../domain/entities/Reward';
import type { UserRewardData } from '../../../../domain/repositories/IRewardRepository';
import type { SortOption } from '../hooks/useRewards';
import { RewardHero } from '../components/RewardHero';
import { CategoryFilter } from '../components/CategoryFilter';
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

const datasource = new RewardApiDatasource();
const repository = new RewardRepositoryImpl(datasource);

export function RewardsScreen() {
  const { userId } = useUser();
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
  } = useRewards(repository, userId);

  const [showHistory, setShowHistory] = useState(false);
  const [rawSearch, setRawSearch] = useState(searchQuery);

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
    [userData, claimedIds, searchQuery, activeCategory, rewards.length],
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

  const tier = userData?.currentTier ?? 'bronze';
  const tierMeta = TIER_META[tier] ?? TIER_META.bronze;
  const points = userData?.totalPoints ?? 0;
  const isSorted = sortBy !== 'popular';

  const headerContent = (search: string, setSearchFn: (t: string) => void) => (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#FF8F00" />
      <RewardsHeader
        points={points}
        tierMeta={tierMeta}
        isSorted={isSorted}
        claimedCount={claimedIds.size}
        rawSearch={search}
        setRawSearch={setSearchFn}
        setSearch={setSearch}
        onSortPress={handleSortPress}
        onHistoryPress={() => setShowHistory(true)}
      />
    </>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        {headerContent('', () => {})}
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
        {headerContent('', () => {})}
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
      {headerContent(rawSearch, setRawSearch)}

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
            tintColor="#FF8F00"
            colors={['#FF8F00']}
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
            onPress={() => router.push(`/rewards/${item.id}`)}
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

const spacing = { md: 12, lg: 16, xl: 20 };

const TIER_META: Record<string, { label: string; icon: string; color: string }> = {
  bronze: { label: 'Bronze', icon: 'shield-outline', color: '#CD7F32' },
  silver: { label: 'Silver', icon: 'shield-half-outline', color: '#A0A0A0' },
  gold: { label: 'Gold', icon: 'shield-checkmark', color: '#FFD700' },
  platinum: { label: 'Platinum', icon: 'diamond', color: '#E5E4E2' },
};

function RewardsHeader({
  points, tierMeta, isSorted, claimedCount,
  rawSearch, setRawSearch, setSearch,
  onSortPress, onHistoryPress,
}: {
  points: number; tierMeta: { label: string; icon: string; color: string };
  isSorted: boolean; claimedCount: number;
  rawSearch: string; setRawSearch: (t: string) => void; setSearch: (t: string) => void;
  onSortPress: () => void; onHistoryPress: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={['#FF8F00', '#FFB300']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={[headerStyles.container, { paddingTop: insets.top + spacing.md }]}>
        <View style={headerStyles.mainRow}>
          <View style={headerStyles.leftCol}>
            <View style={headerStyles.iconWrap}>
              <Ionicons name="gift" size={18} color="#FFFFFF" />
            </View>
            <View>
              <View style={headerStyles.titleRow}>
                <Text style={headerStyles.title}>{t('rewards.title')}</Text>
                {points > 0 && (
                  <View style={headerStyles.pointsPill}>
                    <Ionicons name="flash" size={10} color="#FF8F00" />
                    <Text style={headerStyles.pointsPillText}>{points.toLocaleString()}</Text>
                  </View>
                )}
              </View>
              <View style={headerStyles.subtitleRow}>
                <Ionicons name={tierMeta.icon as any} size={11} color={tierMeta.color} />
                <Text style={[headerStyles.subtitle, { color: tierMeta.color }]}>
                  {tierMeta.label} Tier
                </Text>
                {claimedCount > 0 && (
                  <>
                    <Text style={headerStyles.subtitleDot}>•</Text>
                    <Text style={headerStyles.subtitle}>{claimedCount} redeemed</Text>
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
              <Ionicons name="options-outline" size={18} color={isSorted ? '#FFFFFF' : 'rgba(255,255,255,0.7)'} />
            </TouchableOpacity>
            <TouchableOpacity style={headerStyles.iconBtn} onPress={onHistoryPress} activeOpacity={0.7}>
              <Ionicons name="time-outline" size={18} color="rgba(255,255,255,0.7)" />
              {claimedCount > 0 && (
                <View style={headerStyles.badgeDot}>
                  <Text style={headerStyles.badgeText}>{claimedCount > 9 ? '9+' : claimedCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={headerStyles.searchRow}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            style={headerStyles.searchField}
            placeholder={t('rewards.search')}
            placeholderTextColor="#94A3B8"
            value={rawSearch}
            onChangeText={(t) => { setRawSearch(t); setSearch(t); }}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {rawSearch.length > 0 && (
            <TouchableOpacity onPress={() => { setRawSearch(''); setSearch(''); }}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  pointsPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFD700',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  subtitleDot: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 46,
    marginTop: spacing.md,
    gap: 8,
  },
  searchField: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    paddingVertical: 0,
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
    backgroundColor: '#FF8F00',
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
