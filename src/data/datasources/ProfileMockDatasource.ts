import type { Badge, UserProfile } from '../../domain/entities/Profile';
import type { IProfileRemoteDatasource, ProfileUpdateData } from './IProfileRemoteDatasource';

const MOCK_BADGES: Badge[] = [
  {
    id: 'b1', name: 'First Report',
    description: 'Signalé votre premier dépôt sauvage',
    icon: 'flag', color: '#2563EB', bgColor: '#EFF6FF',
    unlocked: true, unlockedAt: '2026-05-10T08:30:00Z',
  },
  {
    id: 'b2', name: 'Eco Warrior',
    description: 'Atteint 10 signalements',
    icon: 'shield-checkmark', color: '#059669', bgColor: '#ECFDF5',
    unlocked: true, unlockedAt: '2026-06-01T14:00:00Z',
  },
  {
    id: 'b3', name: 'Recycling Star',
    description: 'Recyclé plus de 50kg de déchets',
    icon: 'star', color: '#F59E0B', bgColor: '#FFFBEB',
    unlocked: true, unlockedAt: '2026-06-15T10:00:00Z',
  },
  {
    id: 'b4', name: 'Point Collector',
    description: 'Gagné plus de 5000 points',
    icon: 'diamond', color: '#7C3AED', bgColor: '#F5F3FF',
    unlocked: false,
  },
  {
    id: 'b5', name: 'Community Hero',
    description: 'Contribué à 50 signalements',
    icon: 'people', color: '#DC2626', bgColor: '#FEF2F2',
    unlocked: false,
  },
  {
    id: 'b6', name: 'Green Thumb',
    description: 'Planté un arbre via le programme rewards',
    icon: 'leaf', color: '#16A34A', bgColor: '#F0FDF4',
    unlocked: true, unlockedAt: '2026-06-18T11:00:00Z',
  },
];

const MOCK_PROFILE: UserProfile = {
  id: 'user_1',
  name: 'Ariel',
  email: 'ariel@ecocitizen.com',
  initials: 'AR',
  joinDate: '2026-03-15T00:00:00Z',
  totalReports: 12,
  totalPoints: 2450,
  lifetimePoints: 4150,
  totalRewards: 3,
  impact: {
    co2Saved: 24,
    waterSaved: 340,
    energySaved: 180,
    wasteDiverted: 56,
  },
  badges: MOCK_BADGES,
};

export class ProfileMockDatasource implements IProfileRemoteDatasource {
  private delay = 150;

  private wait(): Promise<void> {
    return new Promise((r) => setTimeout(r, this.delay + Math.random() * 100));
  }

  private profile = { ...MOCK_PROFILE, badges: MOCK_BADGES.map((b) => ({ ...b })) };

  async fetchProfile(_userId: string): Promise<UserProfile> {
    await this.wait();
    return {
      ...this.profile,
      badges: this.profile.badges.map((b) => ({ ...b })),
      impact: { ...this.profile.impact },
    };
  }

  async updateProfile(_userId: string, data: ProfileUpdateData): Promise<UserProfile> {
    await this.wait();
    Object.assign(this.profile, data);
    return {
      ...this.profile,
      badges: this.profile.badges.map((b) => ({ ...b })),
      impact: { ...this.profile.impact },
    };
  }

  async fetchBadges(_userId: string): Promise<Badge[]> {
    await this.wait();
    return MOCK_BADGES.map((b) => ({ ...b }));
  }

  async updateAvatar(_userId: string, _avatarUri: string): Promise<string> {
    await this.wait();
    return `https://api.dicebear.com/9.x/initials/svg?seed=${this.profile.initials}`;
  }
}
