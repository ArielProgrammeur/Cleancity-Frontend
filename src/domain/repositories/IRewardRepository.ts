import type { Result } from '../../core/utils/Result';
import type { Reward } from '../entities/Reward';

export interface IRewardRepository {
  getAll(): Promise<Result<Reward[]>>;
  claimReward(userId: string, rewardId: string): Promise<Result<Reward>>;
}
