import { api } from "../../core/api/api";
import { IMarketplaceRemoteDatasource } from "./IMarketplaceRemoteDatasource";
import { Product, MarketListing, ProductCategory } from "../../domain/entities/Product";
import { PriceSummary } from "../../domain/repositories/IMarketplaceRepository";

export class MarketplaceApiDatasource implements IMarketplaceRemoteDatasource {
  async fetchAllProducts(): Promise<Product[]> {
    return api.get<Product[]>("/api/marketplace/products");
  }

  async fetchProductById(id: string): Promise<Product> {
    return api.get<Product>(`/api/marketplace/products/${id}`);
  }

  async fetchCategories(): Promise<ProductCategory[]> {
    return api.get<ProductCategory[]>("/api/marketplace/products/categories");
  }

  async searchProducts(query: string): Promise<Product[]> {
    return api.get<Product[]>(`/api/marketplace/products/search?q=${encodeURIComponent(query)}`);
  }

  async fetchProductsByCategory(category: ProductCategory): Promise<Product[]> {
    return api.get<Product[]>(`/api/marketplace/products/category/${category}`);
  }

  async fetchPriceSummary(): Promise<PriceSummary[]> {
    return api.get<PriceSummary[]>("/api/marketplace/prices");
  }

  async fetchActiveListings(): Promise<MarketListing[]> {
    return api.get<MarketListing[]>("/api/marketplace/listings");
  }

  async createListing(listing: Omit<MarketListing, "id" | "listedAt" | "status">): Promise<MarketListing> {
    return api.post<MarketListing>("/api/marketplace/listings", listing);
  }
}
