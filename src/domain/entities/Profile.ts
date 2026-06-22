export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserImpact {
  co2Saved: number;
  waterSaved: number;
  energySaved: number;
  wasteDiverted: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarUrl?: string;
  joinDate: string;
  totalReports: number;
  totalPoints: number;
  lifetimePoints: number;
  totalRewards: number;
  impact: UserImpact;
  badges: Badge[];
}
