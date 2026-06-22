import type { Result } from '../../core/utils/Result';
import type { Reward, RewardCategory } from '../entities/Reward';

export interface ClaimedReward {
  id: string;
  rewardId: string;
  rewardName: string;
  rewardIcon: string;
  rewardColor: string;
  rewardBgColor: string;
  pointsSpent: number;
  claimedAt: string;
  voucherCode: string;
  status: 'pending' | 'fulfilled' | 'cancelled';
}

export interface UserRewardData {
  totalPoints: number;
  lifetimePoints: number;
  totalClaimed: number;
  currentTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierProgress: number;
  nextTierPoints: number;
}

export interface IRewardRepository {
  getAll(): Promise<Result<Reward[]>>;
  getById(id: string): Promise<Result<Reward>>;
  getCategories(): Promise<Result<RewardCategory[]>>;
  search(query: string): Promise<Result<Reward[]>>;
  claimReward(userId: string, rewardId: string): Promise<Result<ClaimedReward>>;
  getHistory(userId: string): Promise<Result<ClaimedReward[]>>;
  getUserData(userId: string): Promise<Result<UserRewardData>>;
}
