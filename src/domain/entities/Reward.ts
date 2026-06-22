export type RewardCategory = 'eco' | 'premium' | 'limited' | 'donation' | 'experience';

export type RewardTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  discountPrice?: number;
  icon: string;
  color: string;
  bgColor: string;
  category: RewardCategory;
  stock: number;
  totalStock: number;
  isLimited: boolean;
  expiresAt?: string;
  partnerName?: string;
  terms?: string;
}
