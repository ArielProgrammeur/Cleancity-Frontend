import { api } from "../../core/api/api";
import { IProfileRemoteDatasource, ProfileUpdateData } from "./IProfileRemoteDatasource";
import { UserProfile, Badge } from "../../domain/entities/Profile";

export class ProfileApiDatasource implements IProfileRemoteDatasource {
  async fetchProfile(userId: string): Promise<UserProfile> {
    return api.get<UserProfile>(`/api/profile/${userId}`);
  }

  async updateProfile(userId: string, data: ProfileUpdateData): Promise<UserProfile> {
    return api.patch<UserProfile>(`/api/profile/${userId}`, data);
  }

  async fetchBadges(userId: string): Promise<Badge[]> {
    return api.get<Badge[]>(`/api/profile/${userId}/badges`);
  }

  async updateAvatar(userId: string, avatarUri: string): Promise<string> {
    const response = await fetch(avatarUri);
    const blob = await response.blob();
    const uploadResult = await api.upload(blob, `avatar_${userId}.jpg`);
    await api.patch(`/api/profile/${userId}`, { avatarUrl: uploadResult.url });
    return uploadResult.url;
  }
}
