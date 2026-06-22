import type { Reward, RewardCategory } from '../../domain/entities/Reward';
import type { ClaimedReward, UserRewardData } from '../../domain/repositories/IRewardRepository';

export interface IRewardRemoteDatasource {
  fetchAll(): Promise<Reward[]>;
  fetchById(id: string): Promise<Reward>;
  fetchCategories(): Promise<RewardCategory[]>;
  searchRewards(query: string): Promise<Reward[]>;
  claimReward(userId: string, rewardId: string): Promise<ClaimedReward>;
  fetchHistory(userId: string): Promise<ClaimedReward[]>;
  fetchUserData(userId: string): Promise<UserRewardData>;
}
