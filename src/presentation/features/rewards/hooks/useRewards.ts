import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { Reward, RewardCategory } from '../../../../domain/entities/Reward';
import type { ClaimedReward, UserRewardData, IRewardRepository } from '../../../../domain/repositories/IRewardRepository';
import { Success } from '../../../../core/utils/Result';

export type SortOption = 'popular' | 'low-high' | 'high-low';

export interface UseRewardsReturn {
  rewards: Reward[];
  categories: RewardCategory[];
  history: ClaimedReward[];
  userData: UserRewardData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  activeCategory: RewardCategory | 'all';
  searchQuery: string;
  sortBy: SortOption;
  claimedIds: Set<string>;
  wishlistIds: Set<string>;
  filteredCount: number;
  lastClaimed: ClaimedReward | null;
  showSuccess: boolean;
  refresh: () => void;
  claimReward: (reward: Reward) => Promise<boolean>;
  dismissSuccess: () => void;
  toggleWishlist: (rewardId: string) => void;
  setCategory: (category: RewardCategory | 'all') => void;
  setSearch: (query: string) => void;
  setSort: (sort: SortOption) => void;
}

const CATEGORY_LABELS: Record<RewardCategory, string> = {
  eco: 'Eco',
  premium: 'Premium',
  limited: 'Limited',
  donation: 'Donation',
  experience: 'Experience',
};

const CATEGORY_ICONS: Record<RewardCategory, string> = {
  eco: 'leaf',
  premium: 'diamond',
  limited: 'timer',
  donation: 'heart',
  experience: 'compass',
};

export const REWARD_CATEGORIES: (RewardCategory | 'all')[] = [
  'all',
  'eco',
  'premium',
  'limited',
  'donation',
  'experience',
];

export function getCategoryLabel(category: RewardCategory | 'all'): string {
  if (category === 'all') return 'All';
  return CATEGORY_LABELS[category] ?? category;
}

export function getCategoryIcon(category: RewardCategory | 'all'): string {
  if (category === 'all') return 'grid';
  return CATEGORY_ICONS[category] ?? 'ellipse';
}

export function useRewards(repository: IRewardRepository, userId: string = 'user_1'): UseRewardsReturn {
  const [allRewards, setAllRewards] = useState<Reward[]>([]);
  const [categories, setCategories] = useState<RewardCategory[]>([]);
  const [history, setHistory] = useState<ClaimedReward[]>([]);
  const [userData, setUserData] = useState<UserRewardData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<RewardCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  const [lastClaimed, setLastClaimed] = useState<ClaimedReward | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [rawSearch, setRawSearch] = useState('');
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      try {
        const [rewardsRes, categoriesRes, historyRes, userDataRes] = await Promise.all([
          repository.getAll(),
          repository.getCategories(),
          repository.getHistory(userId),
          repository.getUserData(userId),
        ]);

        if (rewardsRes instanceof Success) {
          setAllRewards(rewardsRes.value);
        } else {
          setError(rewardsRes.message);
        }

        if (categoriesRes instanceof Success) {
          setCategories(categoriesRes.value);
        }

        if (historyRes instanceof Success) {
          setHistory(historyRes.value);
          setClaimedIds(new Set(historyRes.value.map((h) => h.rewardId)));
        }

        if (userDataRes instanceof Success) {
          setUserData(userDataRes.value);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [repository, userId],
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearchQuery(rawSearch);
    }, 300);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [rawSearch]);

  const rewards = useMemo(() => {
    let result = [...allRewards];

    if (activeCategory !== 'all') {
      result = result.filter((r) => r.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.partnerName?.toLowerCase().includes(q),
      );
    }

    switch (sortBy) {
      case 'low-high':
        result.sort((a, b) => a.pointsCost - b.pointsCost);
        break;
      case 'high-low':
        result.sort((a, b) => b.pointsCost - a.pointsCost);
        break;
      case 'popular':
        result.sort((a, b) => {
          const aRatio = a.totalStock > 0 ? a.stock / a.totalStock : 0;
          const bRatio = b.totalStock > 0 ? b.stock / b.totalStock : 0;
          return aRatio - bRatio;
        });
        break;
    }

    return result;
  }, [allRewards, activeCategory, searchQuery, sortBy]);

  const claimReward = useCallback(
    async (reward: Reward): Promise<boolean> => {
      if (claimedIds.has(reward.id)) return false;

      const result = await repository.claimReward(userId, reward.id);

      if (result instanceof Success) {
        const claimed = result.value;
        setLastClaimed(claimed);
        setClaimedIds((prev) => new Set(prev).add(reward.id));
        setHistory((prev) => [claimed, ...prev]);
        setUserData((prev) => {
          if (!prev) return prev;
          const spent = reward.discountPrice ?? reward.pointsCost;
          return {
            ...prev,
            totalPoints: Math.max(0, prev.totalPoints - spent),
            lifetimePoints: prev.lifetimePoints + spent,
            totalClaimed: prev.totalClaimed + 1,
          };
        });
        setShowSuccess(true);
        return true;
      }

      return false;
    },
    [claimedIds, repository, userId],
  );

  const dismissSuccess = useCallback(() => {
    setShowSuccess(false);
    setLastClaimed(null);
  }, []);

  const toggleWishlist = useCallback((rewardId: string) => {
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(rewardId)) next.delete(rewardId);
      else next.add(rewardId);
      return next;
    });
  }, []);

  const refresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  return {
    rewards,
    categories,
    history,
    userData,
    isLoading,
    isRefreshing,
    error,
    activeCategory,
    searchQuery: rawSearch,
    sortBy,
    claimedIds,
    wishlistIds,
    filteredCount: rewards.length,
    lastClaimed,
    showSuccess,
    refresh,
    claimReward,
    dismissSuccess,
    toggleWishlist,
    setCategory: setActiveCategory,
    setSearch: setRawSearch,
    setSort: setSortBy,
  };
}
