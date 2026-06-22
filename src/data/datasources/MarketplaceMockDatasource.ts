import type { Product, ProductCategory, MarketListing } from '../../domain/entities/Product';
import type { PriceSummary } from '../../domain/repositories/IMarketplaceRepository';
import type { IMarketplaceRemoteDatasource } from './IMarketplaceRemoteDatasource';

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'PET Plastic Bottles',
    description: 'Bouteilles en plastique transparent, bouchons compris. Bien rincer et aplatir avant dépôt.',
    category: 'plastic',
    icon: 'water-outline',
    color: '#2563EB',
    bgColor: '#EFF6FF',
    pricePerKg: 0.50,
    unit: 'kg',
    minKg: 1,
    maxKg: 50,
    available: true,
    priceTrend: 'up',
    co2SavedPerKg: 1.5,
    energySavedPerKg: 2.3,
    tips: ['Rincez les bouteilles', 'Aplatissez pour gagner de la place', 'Séparez les bouchons'],
  },
  {
    id: 'p2',
    name: 'Mixed Glass',
    description: 'Verre d\'emballage (bouteilles, pots, bocaux). Pas de vaisselle, miroirs ou verre trempé.',
    category: 'glass',
    icon: 'wine-outline',
    color: '#059669',
    bgColor: '#ECFDF5',
    pricePerKg: 0.30,
    unit: 'kg',
    minKg: 2,
    maxKg: 100,
    available: true,
    priceTrend: 'stable',
    co2SavedPerKg: 0.6,
    energySavedPerKg: 1.2,
    tips: ['Pas de vaisselle', 'Séparez par couleur si possible', 'Retirez les bouchons'],
  },
  {
    id: 'p3',
    name: 'Cardboard & Paper',
    description: 'Cartons bruns, papiers imprimés, magazines. Pas de papiers souillés ou plastifiés.',
    category: 'paper',
    icon: 'newspaper-outline',
    color: '#D97706',
    bgColor: '#FFFBEB',
    pricePerKg: 0.20,
    unit: 'kg',
    minKg: 5,
    maxKg: 200,
    available: true,
    priceTrend: 'down',
    co2SavedPerKg: 0.9,
    energySavedPerKg: 1.8,
    tips: ['Aplatissez les cartons', 'Pas de papier sulfurisé', 'Retirez le scotch'],
  },
  {
    id: 'p4',
    name: 'Small Electronics',
    description: 'Petits appareils électroniques (smartphones, chargeurs, écouteurs). Données effacées requises.',
    category: 'electronics',
    icon: 'laptop-outline',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    pricePerKg: 2.00,
    unit: 'kg',
    minKg: 0.5,
    maxKg: 20,
    available: true,
    priceTrend: 'up',
    co2SavedPerKg: 4.2,
    energySavedPerKg: 8.5,
    tips: ['Effacez vos données personnelles', 'Retirez les batteries', 'Groupez par type'],
  },
  {
    id: 'p5',
    name: 'Textile & Clothing',
    description: 'Vêtements propres et secs, chaussures par paires, linge de maison. Pas de textile humide.',
    category: 'textile',
    icon: 'shirt-outline',
    color: '#DB2777',
    bgColor: '#FDF2F8',
    pricePerKg: 0.80,
    unit: 'kg',
    minKg: 2,
    maxKg: 30,
    available: true,
    priceTrend: 'stable',
    co2SavedPerKg: 3.1,
    energySavedPerKg: 5.4,
    tips: ['Vêtements propres uniquement', 'Chaussures par paires attachées', 'Pas de textile humide'],
  },
  {
    id: 'p6',
    name: 'Aluminum & Metal',
    description: 'Canettes aluminium, conserves, petits métaux non-ferreux. Pas d\'acier ou fer brut.',
    category: 'metal',
    icon: 'hammer-outline',
    color: '#6B7280',
    bgColor: '#F3F4F6',
    pricePerKg: 1.20,
    unit: 'kg',
    minKg: 1,
    maxKg: 60,
    available: true,
    priceTrend: 'up',
    co2SavedPerKg: 2.8,
    energySavedPerKg: 5.6,
    tips: ['Rincez les conserves', 'Écrasez les canettes', 'Séparez fer et aluminium'],
  },
  {
    id: 'p7',
    name: 'Organic Waste',
    description: 'Déchets de cuisine et de jardin (épluchures, marc de café, feuilles). Végétal uniquement.',
    category: 'organic',
    icon: 'leaf-outline',
    color: '#16A34A',
    bgColor: '#F0FDF4',
    pricePerKg: 0.15,
    unit: 'kg',
    minKg: 5,
    maxKg: 500,
    available: true,
    priceTrend: 'stable',
    co2SavedPerKg: 0.4,
    energySavedPerKg: 0.3,
    tips: ['Déchets végétaux uniquement', 'Pas de viande ou poisson', 'Sac compostable obligatoire'],
  },
  {
    id: 'p8',
    name: 'Batteries',
    description: 'Piles et batteries rechargeables (AA, AAA, lithium). Protégez les bornes avec du scotch.',
    category: 'battery',
    icon: 'battery-charging-outline',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    pricePerKg: 3.50,
    unit: 'kg',
    minKg: 0.2,
    maxKg: 10,
    available: true,
    priceTrend: 'up',
    co2SavedPerKg: 5.1,
    energySavedPerKg: 0.0,
    tips: ['Scotchez les bornes', 'Pas de batteries endommagées', 'Stockez au sec'],
  },
  {
    id: 'p9',
    name: 'HDPE Plastic',
    description: 'Plastique dur (bidons, flacons de lessive, bouteilles de lait). Bien rincer.',
    category: 'plastic',
    icon: 'flask-outline',
    color: '#0284C7',
    bgColor: '#F0F9FF',
    pricePerKg: 0.45,
    unit: 'kg',
    minKg: 2,
    maxKg: 80,
    available: true,
    priceTrend: 'stable',
    co2SavedPerKg: 1.2,
    energySavedPerKg: 2.0,
    tips: ['Rincez abondamment', 'Retirez les étiquettes si possible', 'Écrasez pour réduire le volume'],
  },
  {
    id: 'p10',
    name: 'Cables & Wires',
    description: 'Câbles électriques, fils de cuivre, ​​câbles réseau. Dénudez les extrémités si possible.',
    category: 'electronics',
    icon: 'git-branch-outline',
    color: '#9333EA',
    bgColor: '#FAF5FF',
    pricePerKg: 1.80,
    unit: 'kg',
    minKg: 1,
    maxKg: 25,
    available: true,
    priceTrend: 'up',
    co2SavedPerKg: 3.6,
    energySavedPerKg: 7.2,
    tips: ['Séparez cuivre et aluminium', 'Pas de câbles sous gaine PVC', 'Dénudez si possible'],
  },
  {
    id: 'p11',
    name: 'Glass Jars',
    description: 'Pots en verre avec couvercles. Idéal pour le recyclage en boucle fermée.',
    category: 'glass',
    icon: 'cube-outline',
    color: '#10B981',
    bgColor: '#ECFDF5',
    pricePerKg: 0.35,
    unit: 'kg',
    minKg: 2,
    maxKg: 80,
    available: true,
    priceTrend: 'stable',
    co2SavedPerKg: 0.7,
    energySavedPerKg: 1.4,
    tips: ['Retirez les couvercles métal', 'Rincez avant dépôt', 'Triez par couleur si possible'],
  },
  {
    id: 'p12',
    name: 'Mixed Paper',
    description: 'Papier de bureau, enveloppes, cahiers, journaux. Pas de papier plastifié.',
    category: 'paper',
    icon: 'document-text-outline',
    color: '#B45309',
    bgColor: '#FFFBEB',
    pricePerKg: 0.18,
    unit: 'kg',
    minKg: 3,
    maxKg: 150,
    available: true,
    priceTrend: 'down',
    co2SavedPerKg: 0.7,
    energySavedPerKg: 1.5,
    tips: ['Retirez les agrafes', 'Pas de plastique', 'Séparez les magazines'],
  },
  {
    id: 'p13',
    name: 'Steel Cans',
    description: 'Boîtes de conserve en acier, cannettes de soda. Rincer et écraser.',
    category: 'metal',
    icon: 'cylinder-outline',
    color: '#4B5563',
    bgColor: '#F3F4F6',
    pricePerKg: 0.90,
    unit: 'kg',
    minKg: 2,
    maxKg: 50,
    available: true,
    priceTrend: 'down',
    co2SavedPerKg: 1.9,
    energySavedPerKg: 3.8,
    tips: ['Rincez avant dépôt', 'Écrasez pour gagner de la place', 'Retirez les opercules'],
  },
];

const CATEGORIES: ProductCategory[] = ['plastic', 'glass', 'paper', 'electronics', 'textile', 'metal', 'organic', 'battery'];

const PRICE_SUMMARY: PriceSummary[] = [
  { category: 'plastic', avgPricePerKg: 0.48, trend: 'up', changePercent: 5.2 },
  { category: 'glass', avgPricePerKg: 0.33, trend: 'stable', changePercent: 0.8 },
  { category: 'paper', avgPricePerKg: 0.19, trend: 'down', changePercent: -3.1 },
  { category: 'electronics', avgPricePerKg: 1.90, trend: 'up', changePercent: 8.4 },
  { category: 'textile', avgPricePerKg: 0.80, trend: 'stable', changePercent: 1.2 },
  { category: 'metal', avgPricePerKg: 1.05, trend: 'up', changePercent: 4.6 },
  { category: 'organic', avgPricePerKg: 0.15, trend: 'stable', changePercent: 0.0 },
  { category: 'battery', avgPricePerKg: 3.50, trend: 'up', changePercent: 12.3 },
];

const ACTIVE_LISTINGS: MarketListing[] = [
  {
    id: 'l1', productId: 'p1', sellerId: 'u2', sellerName: 'Marie L.',
    quantityKg: 12, pricePerKg: 0.55, totalPrice: 6.60,
    location: 'Rue de la Paix, 75002', listedAt: '2026-06-20T09:00:00Z', status: 'active',
  },
  {
    id: 'l2', productId: 'p6', sellerId: 'u3', sellerName: 'Thomas R.',
    quantityKg: 8, pricePerKg: 1.30, totalPrice: 10.40,
    location: 'Avenue des Ternes, 75017', listedAt: '2026-06-19T14:30:00Z', status: 'active',
  },
];

export class MarketplaceMockDatasource implements IMarketplaceRemoteDatasource {
  private delay = 150;

  private wait(): Promise<void> {
    return new Promise((r) => setTimeout(r, this.delay + Math.random() * 100));
  }

  async fetchAllProducts(): Promise<Product[]> {
    await this.wait();
    return PRODUCTS.map((p) => ({ ...p }));
  }

  async fetchProductById(id: string): Promise<Product> {
    await this.wait();
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) throw new Error(`Product ${id} not found`);
    return { ...p };
  }

  async fetchCategories(): Promise<ProductCategory[]> {
    await this.wait();
    return [...CATEGORIES];
  }

  async searchProducts(query: string): Promise<Product[]> {
    await this.wait();
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    ).map((p) => ({ ...p }));
  }

  async fetchProductsByCategory(category: ProductCategory): Promise<Product[]> {
    await this.wait();
    return PRODUCTS.filter((p) => p.category === category).map((p) => ({ ...p }));
  }

  async fetchPriceSummary(): Promise<PriceSummary[]> {
    await this.wait();
    return PRICE_SUMMARY.map((p) => ({ ...p }));
  }

  async fetchActiveListings(): Promise<MarketListing[]> {
    await this.wait();
    return ACTIVE_LISTINGS.map((l) => ({ ...l }));
  }

  async createListing(
    data: Omit<MarketListing, 'id' | 'listedAt' | 'status'>,
  ): Promise<MarketListing> {
    await this.wait();
    const listing: MarketListing = {
      ...data,
      id: `l_${Date.now()}`,
      listedAt: new Date().toISOString(),
      status: 'active',
    };
    ACTIVE_LISTINGS.push(listing);
    return { ...listing };
  }
}
