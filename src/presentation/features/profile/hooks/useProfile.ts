import { useState, useCallback, useEffect } from 'react';
import type { UserProfile, Badge } from '../../../../domain/entities/Profile';
import type { IProfileRepository, ProfileUpdateData } from '../../../../domain/repositories/IProfileRepository';
import { Success } from '../../../../core/utils/Result';

export interface UseProfileReturn {
  profile: UserProfile | null;
  badges: Badge[];
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>;
  refresh: () => void;
}

export function useProfile(repository: IProfileRepository, userId: string): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [profileRes, badgesRes] = await Promise.all([
        repository.getProfile(userId),
        repository.getBadges(userId),
      ]);
      if (profileRes instanceof Success) setProfile(profileRes.value);
      else setError(profileRes.message);
      if (badgesRes instanceof Success) setBadges(badgesRes.value);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [repository, userId]);

  useEffect(() => { loadData(); }, [loadData]);

  const updateProfile = useCallback(async (data: ProfileUpdateData): Promise<boolean> => {
    const result = await repository.updateProfile(userId, data);
    if (result instanceof Success) {
      setProfile(result.value);
      return true;
    }
    return false;
  }, [repository, userId]);

  return { profile, badges, isLoading, error, updateProfile, refresh: loadData };
}
