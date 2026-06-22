export interface MockReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  icon: string;
  color: string;
  bgColor: string;
  stock: number;
}

export const mockRewards: MockReward[] = [
  {
    id: 'r1',
    name: 'Eco Tote Bag',
    description: 'Sac réutilisable en coton bio',
    pointsCost: 500,
    icon: 'bag-handle-outline',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    stock: 25,
  },
  {
    id: 'r2',
    name: 'Reusable Bottle',
    description: 'Gourde en acier inoxydable 500ml',
    pointsCost: 800,
    icon: 'water-outline',
    color: '#059669',
    bgColor: '#ECFDF5',
    stock: 15,
  },
  {
    id: 'r3',
    name: 'Bamboo Toothbrush',
    description: 'Brosse à dents en bambou biodégradable',
    pointsCost: 300,
    icon: 'brush-outline',
    color: '#65A30D',
    bgColor: '#F7FEE7',
    stock: 40,
  },
  {
    id: 'r4',
    name: 'Plant a Tree',
    description: 'Un arbre planté en votre nom',
    pointsCost: 1200,
    icon: 'leaf-outline',
    color: '#2E7D32',
    bgColor: '#F0FDF4',
    stock: 99,
  },
  {
    id: 'r5',
    name: 'Gift Card 10€',
    description: 'Bon d\'achat valable en magasin partenaire',
    pointsCost: 2000,
    icon: 'card-outline',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    stock: 10,
  },
  {
    id: 'r6',
    name: 'Cleaning Kit',
    description: 'Kit de nettoyage écologique complet',
    pointsCost: 1500,
    icon: 'sparkles-outline',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    stock: 8,
  },
];
