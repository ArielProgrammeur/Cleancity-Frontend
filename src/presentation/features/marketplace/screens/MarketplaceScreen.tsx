import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet,
  Alert, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MarketplaceMockDatasource } from '../../../../data/datasources/MarketplaceMockDatasource';
import { MarketplaceRepositoryImpl } from '../../../../data/repositories/MarketplaceRepositoryImpl';
import { useMarketplace, getCategoryLabel, type ProductSort } from '../hooks/useMarketplace';
import type { Product } from '../../../../domain/entities/Product';
import { ProductCard } from '../components/ProductCard';
import { CategoryFilter } from '../components/MarketplaceCategoryFilter';

const datasource = new MarketplaceMockDatasource();
const repository = new MarketplaceRepositoryImpl(datasource);

const SORT_OPTIONS: { key: ProductSort; label: string; icon: string }[] = [
  { key: 'price-asc', label: 'Price: Low to High', icon: 'arrow-up' },
  { key: 'price-desc', label: 'Price: High to Low', icon: 'arrow-down' },
  { key: 'co2', label: 'Best for Planet', icon: 'leaf' },
  { key: 'name', label: 'Name A–Z', icon: 'text' },
];

function SkeletonCard() {
  return (
    <View style={skeletonStyles.card}>
      <View style={skeletonStyles.topRow}>
        <View style={skeletonStyles.icon} />
        <View style={skeletonStyles.textBlock}>
          <View style={skeletonStyles.titleLine} />
          <View style={skeletonStyles.subtitleLine} />
        </View>
      </View>
      <View style={skeletonStyles.priceRow}>
        <View style={skeletonStyles.badge} />
        <View style={skeletonStyles.smallBadge} />
      </View>
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, marginHorizontal: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F0F1F3' },
  topRow: { flexDirection: 'row', marginBottom: 14 },
  icon: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#F3F4F6', marginRight: 14 },
  textBlock: { flex: 1, gap: 6, paddingTop: 4 },
  titleLine: { height: 16, width: '60%', backgroundColor: '#F3F4F6', borderRadius: 4 },
  subtitleLine: { height: 12, width: '40%', backgroundColor: '#F3F4F6', borderRadius: 4 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  badge: { width: 80, height: 32, backgroundColor: '#F3F4F6', borderRadius: 12 },
  smallBadge: { width: 60, height: 32, backgroundColor: '#F3F4F6', borderRadius: 12 },
});

function MPHeader({ insets, sortBy, onSort }: { insets: any; sortBy: string; onSort: () => void }) {
  return (
    <Animated.View entering={FadeInDown.duration(500).springify()} style={[hStyles.container, { paddingTop: insets.top + 12 }]}>
      <View style={hStyles.mainRow}>
        <View style={hStyles.leftCol}>
          <View style={hStyles.iconRing}>
            <View style={hStyles.iconInner}>
              <Ionicons name="storefront" size={20} color="#FFFFFF" />
            </View>
          </View>
          <View style={hStyles.titleBlock}>
            <Text style={hStyles.title}>Marketplace</Text>
            <View style={hStyles.subtitleRow}>
              <Ionicons name="trending-up" size={12} color="#059669" />
              <Text style={hStyles.subtitle}>Prices update daily</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={[hStyles.iconBtn, sortBy !== 'price-asc' && hStyles.iconBtnActive]} onPress={onSort} activeOpacity={0.7}>
          <Ionicons name="options-outline" size={19} color={sortBy !== 'price-asc' ? '#2563EB' : '#6B7280'} />
          {sortBy !== 'price-asc' && <View style={hStyles.activeDot} />}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export function MarketplaceScreen() {
  const insets = useSafeAreaInsets();
  const {
    products, activeCategory, searchQuery, sortBy,
    isLoading, isRefreshing, error, refresh,
    setCategory, setSearch, setSort,
  } = useMarketplace(repository);
  const [rawSearch, setRawSearch] = useState('');

  const handleSort = useCallback(() => {
    Alert.alert('Sort Products', '', [
      ...SORT_OPTIONS.map((o) => ({
        text: `${o.label}${o.key === sortBy ? ' ✓' : ''}`,
        onPress: () => setSort(o.key),
      })),
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [sortBy, setSort]);

  const header = useCallback(() => (
    <View>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            {searchQuery.trim() ? 'Search Results' : activeCategory === 'all' ? 'All Materials' : getCategoryLabel(activeCategory)}
          </Text>
          <Text style={styles.sectionCount}>{products.length} product{products.length !== 1 ? 's' : ''}</Text>
        </View>
      </View>
    </View>
  ), [activeCategory, searchQuery, products.length]);

  const empty = useCallback(() => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={48} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>No products found</Text>
      <Text style={styles.emptyDesc}>Try a different search or filter</Text>
    </View>
  ), []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <MPHeader insets={insets} sortBy={sortBy} onSort={handleSort} />
        <View style={{ paddingTop: 16 }}>{[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}</View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <MPHeader insets={insets} sortBy={sortBy} onSort={handleSort} />
        <View style={styles.errorState}>
          <Ionicons name="cloud-offline-outline" size={56} color="#D1D5DB" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refresh} activeOpacity={0.8}>
            <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MPHeader insets={insets} sortBy={sortBy} onSort={handleSort} />

      <View style={styles.searchRow}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={17} color="#9CA3AF" />
          <TextInput
            style={styles.searchField}
            placeholder="Search materials..."
            placeholderTextColor="#9CA3AF"
            value={rawSearch}
            onChangeText={(t) => { setRawSearch(t); setSearch(t); }}
            autoCorrect={false}
          />
          {rawSearch.length > 0 && (
            <TouchableOpacity onPress={() => { setRawSearch(''); setSearch(''); }}>
              <Ionicons name="close-circle" size={17} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <CategoryFilter activeCategory={activeCategory} onCategoryChange={setCategory} />

      <FlatList
        data={products}
        keyExtractor={(p: Product) => p.id}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor="#2563EB" colors={['#2563EB']} />}
        renderItem={({ item, index }) => <ProductCard product={item} index={index} />}
      />
    </View>
  );
}

const hStyles = StyleSheet.create({
  container: { paddingBottom: 14, paddingHorizontal: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F1F3' },
  mainRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  leftCol: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconRing: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#BFDBFE' },
  iconInner: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  titleBlock: { gap: 3 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', letterSpacing: -0.4 },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  subtitle: { fontSize: 12, fontWeight: '600', color: '#059669' },
  iconBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  iconBtnActive: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  activeDot: { position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: 3, backgroundColor: '#2563EB' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFB' },
  searchRow: { paddingHorizontal: 20, paddingVertical: 8 },
  searchInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, paddingHorizontal: 14, height: 44, borderWidth: 1, borderColor: '#E5E7EB', gap: 8 },
  searchField: { flex: 1, fontSize: 14, fontWeight: '500', color: '#111827', paddingVertical: 0 },
  list: { paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 4, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  sectionCount: { fontSize: 13, color: '#9CA3AF', fontWeight: '500', marginTop: 2 },
  emptyState: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#6B7280' },
  emptyDesc: { fontSize: 13, color: '#9CA3AF', textAlign: 'center' },
  errorState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 8 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 8 },
  errorDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
  retryBtn: { flexDirection: 'row', backgroundColor: '#2563EB', paddingHorizontal: 24, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  retryText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
