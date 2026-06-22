import type { Product, ProductCategory, MarketListing } from '../../domain/entities/Product';
import type { PriceSummary } from '../../domain/repositories/IMarketplaceRepository';

export interface IMarketplaceRemoteDatasource {
  fetchAllProducts(): Promise<Product[]>;
  fetchProductById(id: string): Promise<Product>;
  fetchCategories(): Promise<ProductCategory[]>;
  searchProducts(query: string): Promise<Product[]>;
  fetchProductsByCategory(category: ProductCategory): Promise<Product[]>;
  fetchPriceSummary(): Promise<PriceSummary[]>;
  fetchActiveListings(): Promise<MarketListing[]>;
  createListing(listing: Omit<MarketListing, 'id' | 'listedAt' | 'status'>): Promise<MarketListing>;
}
