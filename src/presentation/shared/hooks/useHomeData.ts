import { useState, useCallback, useEffect, useRef } from 'react';
import type { UserProfile, Badge } from '../../../domain/entities/Profile';
import type { IProfileRepository } from '../../../domain/repositories/IProfileRepository';
import { Success } from '../../../core/utils/Result';
import { SignalementApiDatasource } from '../../../data/datasources/SignalementApiDatasource';
import type { Signalement } from '../../../data/datasources/SignalementApiDatasource';

export interface HomeData {
  profile: UserProfile | null;
  badges: Badge[];
  recentReports: Signalement[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useHomeData(repository: IProfileRepository, userId: string): HomeData {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [recentReports, setRecentReports] = useState<Signalement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const signalementDSRef = useRef(new SignalementApiDatasource());

  const loadData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [profileRes, badgesRes, signalements] = await Promise.all([
        repository.getProfile(userId),
        repository.getBadges(userId),
        signalementDSRef.current.getAll(),
      ]);

      if (profileRes instanceof Success) setProfile(profileRes.value);
      else setError(profileRes.message);

      if (badgesRes instanceof Success) setBadges(badgesRes.value);

      setRecentReports(signalements.slice(0, 4));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load home data');
    } finally {
      setIsLoading(false);
    }
  }, [repository, userId]);

  useEffect(() => { loadData(); }, [loadData]);

  return { profile, badges, recentReports, isLoading, error, refresh: loadData };
}
