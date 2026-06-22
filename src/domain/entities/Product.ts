export type ProductCategory = 'plastic' | 'glass' | 'paper' | 'electronics' | 'textile' | 'metal' | 'organic' | 'battery';

export type PriceTrend = 'up' | 'down' | 'stable';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  icon: string;
  color: string;
  bgColor: string;
  pricePerKg: number;
  unit: string;
  minKg: number;
  maxKg: number;
  available: boolean;
  priceTrend: PriceTrend;
  co2SavedPerKg: number;
  energySavedPerKg: number;
  tips?: string[];
}

export interface MarketListing {
  id: string;
  productId: string;
  sellerId: string;
  sellerName: string;
  quantityKg: number;
  pricePerKg: number;
  totalPrice: number;
  location: string;
  listedAt: string;
  status: 'active' | 'sold' | 'cancelled';
}
