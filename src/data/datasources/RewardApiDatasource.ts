import { api } from "../../core/api/api";
import { IRewardRemoteDatasource } from "./IRewardRemoteDatasource";
import { Reward, RewardCategory } from "../../domain/entities/Reward";
import type { ClaimedReward, UserRewardData } from "../../domain/repositories/IRewardRepository";

export class RewardApiDatasource implements IRewardRemoteDatasource {
  async fetchAll(): Promise<Reward[]> {
    return api.get<Reward[]>("/api/rewards/");
  }

  async fetchById(id: string): Promise<Reward> {
    return api.get<Reward>(`/api/rewards/${id}`);
  }

  async fetchCategories(): Promise<RewardCategory[]> {
    return api.get<RewardCategory[]>("/api/rewards/categories");
  }

  async searchRewards(query: string): Promise<Reward[]> {
    return api.get<Reward[]>(`/api/rewards/search?q=${encodeURIComponent(query)}`);
  }

  async claimReward(userId: string, rewardId: string): Promise<ClaimedReward> {
    return api.post<ClaimedReward>("/api/rewards/claim", { userId, rewardId });
  }

  async fetchHistory(userId: string): Promise<ClaimedReward[]> {
    return api.get<ClaimedReward[]>(`/api/rewards/history/${userId}`);
  }

  async fetchUserData(userId: string): Promise<UserRewardData> {
    return api.get<UserRewardData>(`/api/rewards/userdata/${userId}`);
  }
}
