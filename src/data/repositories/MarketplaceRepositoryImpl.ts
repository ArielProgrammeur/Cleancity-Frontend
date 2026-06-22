import type { IMarketplaceRepository, PriceSummary } from '../../domain/repositories/IMarketplaceRepository';
import type { Product, ProductCategory, MarketListing } from '../../domain/entities/Product';
import type { IMarketplaceRemoteDatasource } from '../datasources/IMarketplaceRemoteDatasource';
import { success, failure, type Result } from '../../core/utils/Result';
import { ServerFailure } from '../../core/errors/Failure';

export class MarketplaceRepositoryImpl implements IMarketplaceRepository {
  constructor(private datasource: IMarketplaceRemoteDatasource) {}

  async getAllProducts(): Promise<Result<Product[]>> {
    try {
      return success(await this.datasource.fetchAllProducts());
    } catch (e) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Failed to fetch products'));
    }
  }

  async getProductById(id: string): Promise<Result<Product>> {
    try {
      return success(await this.datasource.fetchProductById(id));
    } catch (e) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Product not found'));
    }
  }

  async getCategories(): Promise<Result<ProductCategory[]>> {
    try {
      return success(await this.datasource.fetchCategories());
    } catch (e) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Failed to fetch categories'));
    }
  }

  async searchProducts(query: string): Promise<Result<Product[]>> {
    try {
      return success(await this.datasource.searchProducts(query));
    } catch (e) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Search failed'));
    }
  }

  async getProductsByCategory(category: ProductCategory): Promise<Result<Product[]>> {
    try {
      return success(await this.datasource.fetchProductsByCategory(category));
    } catch (e) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Failed to fetch category'));
    }
  }

  async getPriceSummary(): Promise<Result<PriceSummary[]>> {
    try {
      return success(await this.datasource.fetchPriceSummary());
    } catch (e) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Failed to fetch prices'));
    }
  }

  async getActiveListings(): Promise<Result<MarketListing[]>> {
    try {
      return success(await this.datasource.fetchActiveListings());
    } catch (e) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Failed to fetch listings'));
    }
  }

  async createListing(data: Omit<MarketListing, 'id' | 'listedAt' | 'status'>): Promise<Result<MarketListing>> {
    try {
      return success(await this.datasource.createListing(data));
    } catch (e) {
      return failure(new ServerFailure(e instanceof Error ? e.message : 'Failed to create listing'));
    }
  }
}
