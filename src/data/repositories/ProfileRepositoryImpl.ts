import type { IProfileRepository, ProfileUpdateData } from '../../domain/repositories/IProfileRepository';
import type { UserProfile, Badge } from '../../domain/entities/Profile';
import type { IProfileRemoteDatasource } from '../datasources/IProfileRemoteDatasource';
import { success, failure, type Result } from '../../core/utils/Result';
import { ServerFailure } from '../../core/errors/Failure';

export class ProfileRepositoryImpl implements IProfileRepository {
  constructor(private datasource: IProfileRemoteDatasource) {}

  async getProfile(userId: string): Promise<Result<UserProfile>> {
    try {
      return success(await this.datasource.fetchProfile(userId));
    } catch (e) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Failed to load profile'));
    }
  }

  async updateProfile(userId: string, data: ProfileUpdateData): Promise<Result<UserProfile>> {
    try {
      return success(await this.datasource.updateProfile(userId, data));
    } catch (e) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Failed to update profile'));
    }
  }

  async getBadges(userId: string): Promise<Result<Badge[]>> {
    try {
      return success(await this.datasource.fetchBadges(userId));
    } catch (e) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Failed to load badges'));
    }
  }
}
