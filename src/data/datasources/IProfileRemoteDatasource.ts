import type { Badge, UserProfile } from '../../domain/entities/Profile';

export type ProfileUpdateData = Partial<Pick<UserProfile, 'name' | 'avatarUrl' | 'email'>>;

export interface IProfileRemoteDatasource {
  fetchProfile(userId: string): Promise<UserProfile>;
  updateProfile(userId: string, data: ProfileUpdateData): Promise<UserProfile>;
  fetchBadges(userId: string): Promise<Badge[]>;
  updateAvatar(userId: string, avatarUri: string): Promise<string>;
}
