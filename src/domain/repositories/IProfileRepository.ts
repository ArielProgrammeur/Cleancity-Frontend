import type { Result } from '../../core/utils/Result';
import type { UserProfile, Badge } from '../entities/Profile';

export type ProfileUpdateData = Partial<Pick<UserProfile, 'name' | 'avatarUrl' | 'email'>>;

export interface IProfileRepository {
  getProfile(userId: string): Promise<Result<UserProfile>>;
  updateProfile(userId: string, data: ProfileUpdateData): Promise<Result<UserProfile>>;
  getBadges(userId: string): Promise<Result<Badge[]>>;
}
