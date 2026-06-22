import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { Product, ProductCategory } from '../../../../domain/entities/Product';
import type { PriceSummary, IMarketplaceRepository } from '../../../../domain/repositories/IMarketplaceRepository';
import { Success } from '../../../../core/utils/Result';

export type ProductSort = 'price-asc' | 'price-desc' | 'co2' | 'name';

export interface UseMarketplaceReturn {
  products: Product[];
  categories: ProductCategory[];
  priceSummary: PriceSummary[];
  activeCategory: ProductCategory | 'all';
  searchQuery: string;
  sortBy: ProductSort;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  filteredCount: number;
  refresh: () => void;
  setCategory: (cat: ProductCategory | 'all') => void;
  setSearch: (query: string) => void;
  setSort: (sort: ProductSort) => void;
}

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  plastic: 'Plastic',
  glass: 'Glass',
  paper: 'Paper',
  electronics: 'Electronics',
  textile: 'Textile',
  metal: 'Metal',
  organic: 'Organic',
  battery: 'Battery',
};

const CATEGORY_ICONS: Record<ProductCategory, string> = {
  plastic: 'water',
  glass: 'wine',
  paper: 'newspaper',
  electronics: 'laptop',
  textile: 'shirt',
  metal: 'hammer',
  organic: 'leaf',
  battery: 'battery-charging',
};

export function getCategoryLabel(cat: ProductCategory | 'all'): string {
  if (cat === 'all') return 'All';
  return CATEGORY_LABELS[cat] ?? cat;
}

export function getCategoryIcon(cat: ProductCategory | 'all'): string {
  if (cat === 'all') return 'grid';
  return CATEGORY_ICONS[cat] ?? 'ellipse';
}

export const PRODUCT_CATEGORIES: (ProductCategory | 'all')[] = [
  'all', 'plastic', 'glass', 'paper', 'electronics', 'textile', 'metal', 'organic', 'battery',
];

export function useMarketplace(repository: IMarketplaceRepository): UseMarketplaceReturn {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [priceSummary, setPriceSummary] = useState<PriceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<ProductSort>('price-asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [rawSearch, setRawSearch] = useState('');
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);
    try {
      const [productsRes, catsRes, pricesRes] = await Promise.all([
        repository.getAllProducts(),
        repository.getCategories(),
        repository.getPriceSummary(),
      ]);
      if (productsRes instanceof Success) setAllProducts(productsRes.value);
      else setError(productsRes.message);
      if (catsRes instanceof Success) setCategories(catsRes.value);
      if (pricesRes instanceof Success) setPriceSummary(pricesRes.value);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [repository]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setSearchQuery(rawSearch), 300);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [rawSearch]);

  const products = useMemo(() => {
    let result = [...allProducts];
    if (activeCategory !== 'all') result = result.filter((p) => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
      );
    }
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.pricePerKg - b.pricePerKg); break;
      case 'price-desc': result.sort((a, b) => b.pricePerKg - a.pricePerKg); break;
      case 'co2': result.sort((a, b) => b.co2SavedPerKg - a.co2SavedPerKg); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return result;
  }, [allProducts, activeCategory, searchQuery, sortBy]);

  return {
    products, categories, priceSummary, activeCategory, searchQuery: rawSearch, sortBy,
    isLoading, isRefreshing, error, filteredCount: products.length,
    refresh: () => loadData(true),
    setCategory: setActiveCategory,
    setSearch: setRawSearch,
    setSort: setSortBy,
  };
}
