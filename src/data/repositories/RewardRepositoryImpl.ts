import type { IRewardRepository, ClaimedReward, UserRewardData } from '../../domain/repositories/IRewardRepository';
import type { Reward, RewardCategory } from '../../domain/entities/Reward';
import type { IRewardRemoteDatasource } from '../datasources/IRewardRemoteDatasource';
import { success, failure, type Result } from '../../core/utils/Result';
import { ServerFailure } from '../../core/errors/Failure';

export class RewardRepositoryImpl implements IRewardRepository {
  constructor(private datasource: IRewardRemoteDatasource) {}

  async getAll(): Promise<Result<Reward[]>> {
    try {
      const data = await this.datasource.fetchAll();
      return success(data);
    } catch (e: unknown) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Failed to fetch rewards'));
    }
  }

  async getById(id: string): Promise<Result<Reward>> {
    try {
      const data = await this.datasource.fetchById(id);
      return success(data);
    } catch (e: unknown) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Reward not found'));
    }
  }

  async getCategories(): Promise<Result<RewardCategory[]>> {
    try {
      const data = await this.datasource.fetchCategories();
      return success(data);
    } catch (e: unknown) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Failed to fetch categories'));
    }
  }

  async search(query: string): Promise<Result<Reward[]>> {
    try {
      const data = await this.datasource.searchRewards(query);
      return success(data);
    } catch (e: unknown) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Search failed'));
    }
  }

  async claimReward(userId: string, rewardId: string): Promise<Result<ClaimedReward>> {
    try {
      const data = await this.datasource.claimReward(userId, rewardId);
      return success(data);
    } catch (e: unknown) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Failed to claim reward'));
    }
  }

  async getHistory(userId: string): Promise<Result<ClaimedReward[]>> {
    try {
      const data = await this.datasource.fetchHistory(userId);
      return success(data);
    } catch (e: unknown) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Failed to fetch history'));
    }
  }

  async getUserData(userId: string): Promise<Result<UserRewardData>> {
    try {
      const data = await this.datasource.fetchUserData(userId);
      return success(data);
    } catch (e: unknown) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Failed to fetch user data'));
    }
  }
}
