import type { Reward, RewardCategory } from '../../domain/entities/Reward';
import type { ClaimedReward, UserRewardData } from '../../domain/repositories/IRewardRepository';
import type { IRewardRemoteDatasource } from './IRewardRemoteDatasource';

const MOCK_REWARDS: Reward[] = [
  {
    id: 'r1',
    name: 'Eco Tote Bag',
    description: 'Sac réutilisable en coton bio certifié. Pratique pour vos courses et réduit les déchets plastiques.',
    pointsCost: 500,
    icon: 'bag-handle-outline',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    category: 'eco',
    stock: 25,
    totalStock: 50,
    isLimited: false,
    partnerName: 'EcoWear',
  },
  {
    id: 'r2',
    name: 'Bamboo Toothbrush Set',
    description: 'Lot de 4 brosses à dents en bambou biodégradable. Manchon en bambou naturel, poils en charbon de bois.',
    pointsCost: 300,
    icon: 'brush-outline',
    color: '#65A30D',
    bgColor: '#F7FEE7',
    category: 'eco',
    stock: 40,
    totalStock: 60,
    isLimited: false,
  },
  {
    id: 'r3',
    name: 'Seed Starter Kit',
    description: 'Kit complet de 6 variétés de graines bio + godets biodégradables + terreau. Lancez votre potager !',
    pointsCost: 400,
    icon: 'leaf-outline',
    color: '#059669',
    bgColor: '#ECFDF5',
    category: 'eco',
    stock: 30,
    totalStock: 40,
    isLimited: false,
    discountPrice: 350,
    partnerName: 'GrowGreen',
  },
  {
    id: 'r4',
    name: 'Beeswax Food Wraps',
    description: 'Lot de 3 emballages alimentaires en cire d\'abeille. Réutilisables, lavables, durée de vie 1 an.',
    pointsCost: 600,
    icon: 'nutrition-outline',
    color: '#D97706',
    bgColor: '#FFFBEB',
    category: 'eco',
    stock: 20,
    totalStock: 35,
    isLimited: false,
  },
  {
    id: 'r5',
    name: 'Compost Bin',
    description: ' composteur de cuisine 5L en céramique avec filtre à charbon. Sans odeur, design élégant.',
    pointsCost: 1000,
    icon: 'trash-bin-outline',
    color: '#92400E',
    bgColor: '#FEF3C7',
    category: 'eco',
    stock: 15,
    totalStock: 25,
    isLimited: false,
    partnerName: 'CompostPro',
  },
  {
    id: 'r6',
    name: 'Reusable Water Bottle',
    description: 'Gourde isotherme en acier inoxydable 500ml. Garde vos boissons froides 24h ou chaudes 12h.',
    pointsCost: 800,
    icon: 'water-outline',
    color: '#0284C7',
    bgColor: '#F0F9FF',
    category: 'premium',
    stock: 15,
    totalStock: 30,
    isLimited: false,
    discountPrice: 650,
    partnerName: 'AquaSave',
  },
  {
    id: 'r7',
    name: 'Eco Cleaning Kit',
    description: 'Kit ménage zéro déchet : éponges naturelles, brosses en bois, savon noir, vinaigre et bicarbonate.',
    pointsCost: 1500,
    icon: 'sparkles-outline',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    category: 'premium',
    stock: 8,
    totalStock: 20,
    isLimited: false,
  },
  {
    id: 'r8',
    name: 'Solar Power Bank',
    description: 'Batterie externe 20000mAh avec panneau solaire intégré. Chargez vos appareils en énergie propre.',
    pointsCost: 2000,
    icon: 'sunny-outline',
    color: '#EA580C',
    bgColor: '#FFF7ED',
    category: 'premium',
    stock: 10,
    totalStock: 15,
    isLimited: false,
    partnerName: 'SunCharge',
  },
  {
    id: 'r9',
    name: 'Smart Waste Sensor',
    description: 'Capteur intelligent pour votre poubelle. Suivez votre production de déchets et obtenez des conseils via l\'app.',
    pointsCost: 2500,
    icon: 'hardware-chip-outline',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    category: 'limited',
    stock: 5,
    totalStock: 10,
    isLimited: true,
    expiresAt: '2026-08-15T00:00:00Z',
  },
  {
    id: 'r10',
    name: 'Signed Eco Book',
    description: '"The Zero Waste Home" édition limitée dédicacée par l\'auteure Béa Johnson. + guide pratique offert.',
    pointsCost: 1800,
    icon: 'book-outline',
    color: '#92400E',
    bgColor: '#FEF3C7',
    category: 'limited',
    stock: 3,
    totalStock: 5,
    isLimited: true,
    expiresAt: '2026-07-01T00:00:00Z',
    partnerName: 'EcoReads',
  },
  {
    id: 'r11',
    name: 'VIP Recycling Tour',
    description: 'Visite privée du centre de recyclage ultramoderne avec un ingénieur. Transport et déjeuner inclus.',
    pointsCost: 3000,
    icon: 'bus-outline',
    color: '#2E7D32',
    bgColor: '#F0FDF4',
    category: 'limited',
    stock: 5,
    totalStock: 8,
    isLimited: true,
    expiresAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'r12',
    name: 'Exclusive Workshop Pass',
    description: 'Atelier "Zéro Déchet" animé par un expert national. Techniques avancées, goodies et certificat inclus.',
    pointsCost: 2200,
    icon: 'school-outline',
    color: '#0D9488',
    bgColor: '#F0FDFA',
    category: 'limited',
    stock: 4,
    totalStock: 10,
    isLimited: true,
    expiresAt: '2026-08-20T00:00:00Z',
  },
  {
    id: 'r13',
    name: 'Plant a Tree',
    description: 'Un arbre planté en votre nom dans une forêt urbaine. Recevez des photos et les coordonnées GPS.',
    pointsCost: 1200,
    icon: 'leaf-outline',
    color: '#16A34A',
    bgColor: '#F0FDF4',
    category: 'donation',
    stock: 99,
    totalStock: 999,
    isLimited: false,
    partnerName: 'ReforestAction',
  },
  {
    id: 'r14',
    name: 'School Garden Donation',
    description: 'Financez un potager pédagogique dans une école primaire. Suivez le projet en photos toute l\'année.',
    pointsCost: 2500,
    icon: 'school-outline',
    color: '#CA8A04',
    bgColor: '#FEFCE8',
    category: 'donation',
    stock: 50,
    totalStock: 100,
    isLimited: false,
    partnerName: 'EduGreen',
    terms: 'Donation ponctuelle. Reçu fiscal disponible sur demande.',
  },
  {
    id: 'r15',
    name: 'Ocean Cleanup Contribution',
    description: 'Participez au nettoyage des océans. 1kg de plastique retiré pour chaque donation. Certificat inclus.',
    pointsCost: 3000,
    icon: 'boat-outline',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    category: 'donation',
    stock: 100,
    totalStock: 500,
    isLimited: false,
    partnerName: 'OceanCare',
    terms: 'Contribution mensuelle récurrente. Annulable à tout moment.',
  },
  {
    id: 'r16',
    name: 'Zero-Waste Cooking Class',
    description: 'Cours de cuisine anti-gaspi avec un chef étoilé. Apprenez à cuisiner épluchures, fanes et restes.',
    pointsCost: 1500,
    icon: 'flame-outline',
    color: '#E11D48',
    bgColor: '#FFF1F2',
    category: 'experience',
    stock: 10,
    totalStock: 15,
    isLimited: false,
    partnerName: 'Chef Green',
  },
  {
    id: 'r17',
    name: 'Guided Nature Hike',
    description: 'Randonnée guidée en forêt avec un naturaliste. Apprenez à identifier plantes, oiseaux et champignons.',
    pointsCost: 1000,
    icon: 'trail-sign-outline',
    color: '#65A30D',
    bgColor: '#F7FEE7',
    category: 'experience',
    stock: 12,
    totalStock: 20,
    isLimited: false,
    discountPrice: 800,
    partnerName: 'NatureWalk',
  },
];

const CATEGORIES: RewardCategory[] = ['eco', 'premium', 'limited', 'donation', 'experience'];

function makeVoucherCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'RWD-';
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) code += chars[Math.floor(Math.random() * chars.length)];
    if (i < 2) code += '-';
  }
  return code;
}

const MOCK_HISTORY: ClaimedReward[] = [
  {
    id: 'ch1',
    rewardId: 'r3',
    rewardName: 'Seed Starter Kit',
    rewardIcon: 'leaf-outline',
    rewardColor: '#059669',
    rewardBgColor: '#ECFDF5',
    pointsSpent: 400,
    claimedAt: '2026-06-15T10:30:00Z',
    voucherCode: 'RWD-7K9M-2P1X-8Q4Z',
    status: 'fulfilled',
  },
  {
    id: 'ch2',
    rewardId: 'r6',
    rewardName: 'Reusable Water Bottle',
    rewardIcon: 'water-outline',
    rewardColor: '#0284C7',
    rewardBgColor: '#F0F9FF',
    pointsSpent: 800,
    claimedAt: '2026-06-10T14:15:00Z',
    voucherCode: 'RWD-3B6N-9W2E-1R8T',
    status: 'pending',
  },
  {
    id: 'ch3',
    rewardId: 'r1',
    rewardName: 'Eco Tote Bag',
    rewardIcon: 'bag-handle-outline',
    rewardColor: '#2563EB',
    rewardBgColor: '#EFF6FF',
    pointsSpent: 500,
    claimedAt: '2026-05-28T09:00:00Z',
    voucherCode: 'RWD-5H7J-4K2L-9M3N',
    status: 'fulfilled',
  },
];

const MOCK_USER_DATA: UserRewardData = {
  totalPoints: 2450,
  lifetimePoints: 4150,
  totalClaimed: 3,
  currentTier: 'silver',
  tierProgress: 2450,
  nextTierPoints: 3000,
};

export class RewardMockDatasource implements IRewardRemoteDatasource {
  private delay = 200;

  private wait(): Promise<void> {
    return new Promise((r) => setTimeout(r, this.delay + Math.random() * 150));
  }

  async fetchAll(): Promise<Reward[]> {
    await this.wait();
    return [...MOCK_REWARDS];
  }

  async fetchById(id: string): Promise<Reward> {
    await this.wait();
    const reward = MOCK_REWARDS.find((r) => r.id === id);
    if (!reward) throw new Error(`Reward ${id} not found`);
    return { ...reward };
  }

  async fetchCategories(): Promise<RewardCategory[]> {
    await this.wait();
    return [...CATEGORIES];
  }

  async searchRewards(query: string): Promise<Reward[]> {
    await this.wait();
    const q = query.toLowerCase();
    return MOCK_REWARDS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.partnerName?.toLowerCase().includes(q),
    );
  }

  async claimReward(_userId: string, rewardId: string): Promise<ClaimedReward> {
    await this.wait();
    const reward = MOCK_REWARDS.find((r) => r.id === rewardId);
    if (!reward) throw new Error('Reward not found');
    if (reward.stock <= 0) throw new Error('Reward out of stock');

    reward.stock -= 1;

    return {
      id: `ch_${Date.now()}`,
      rewardId: reward.id,
      rewardName: reward.name,
      rewardIcon: reward.icon,
      rewardColor: reward.color,
      rewardBgColor: reward.bgColor,
      pointsSpent: reward.discountPrice ?? reward.pointsCost,
      claimedAt: new Date().toISOString(),
      voucherCode: makeVoucherCode(),
      status: 'pending',
    };
  }

  async fetchHistory(_userId: string): Promise<ClaimedReward[]> {
    await this.wait();
    return [...MOCK_HISTORY];
  }

  async fetchUserData(_userId: string): Promise<UserRewardData> {
    await this.wait();
    return { ...MOCK_USER_DATA };
  }
}
