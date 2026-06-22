import type { Result } from '../../core/utils/Result';
import type { ProductCategory, Product, MarketListing } from '../entities/Product';

export interface PriceSummary {
  category: ProductCategory;
  avgPricePerKg: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
}

export interface IMarketplaceRepository {
  getAllProducts(): Promise<Result<Product[]>>;
  getProductById(id: string): Promise<Result<Product>>;
  getCategories(): Promise<Result<ProductCategory[]>>;
  searchProducts(query: string): Promise<Result<Product[]>>;
  getProductsByCategory(category: ProductCategory): Promise<Result<Product[]>>;
  getPriceSummary(): Promise<Result<PriceSummary[]>>;
  getActiveListings(): Promise<Result<MarketListing[]>>;
  createListing(listing: Omit<MarketListing, 'id' | 'listedAt' | 'status'>): Promise<Result<MarketListing>>;
}
