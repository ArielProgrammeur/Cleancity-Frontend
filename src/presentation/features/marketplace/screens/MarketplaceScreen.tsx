import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet,
  RefreshControl, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MarketplaceMockDatasource } from '../../../../data/datasources/MarketplaceMockDatasource';
import { MarketplaceRepositoryImpl } from '../../../../data/repositories/MarketplaceRepositoryImpl';
import { useMarketplace, getCategoryLabel, type ProductSort } from '../hooks/useMarketplace';
import type { Product } from '../../../../domain/entities/Product';
import { ProductCard } from '../components/ProductCard';
import { CategoryFilter } from '../components/MarketplaceCategoryFilter';
import { colors, spacing, radius, typography, shadows } from '../theme';

const datasource = new MarketplaceMockDatasource();
const repository = new MarketplaceRepositoryImpl(datasource);

const SORT_OPTIONS: { key: ProductSort; label: string }[] = [
  { key: 'price-asc', label: 'Low Price' },
  { key: 'price-desc', label: 'High Price' },
  { key: 'co2', label: 'Eco Impact' },
  { key: 'name', label: 'A-Z' },
];

function renderSkeletons() {
  return (
    <View style={styles.skGrid}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={styles.skCard}>
          <View style={styles.skTop} />
          <View style={styles.skBody}>
            <View style={styles.skLine1} />
            <View style={styles.skLine2} />
            <View style={styles.skLine3} />
          </View>
        </View>
      ))}
    </View>
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

  const handleSort = useCallback((key: ProductSort) => { setSort(key); }, [setSort]);

  const listHeader = useCallback(() => (
    <View style={styles.listHeaderInner}>
      <View style={styles.resultsBar}>
        <View>
          <Text style={styles.resultsTitle}>
            {searchQuery.trim() ? `"${searchQuery}"` : getCategoryLabel(activeCategory)}
          </Text>
          <Text style={styles.resultsCount}>
            {products.length} material{products.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.sortRow}>
          {SORT_OPTIONS.map((o) => (
            <TouchableOpacity
              key={o.key}
              activeOpacity={0.7}
              onPress={() => handleSort(o.key)}
              style={[styles.sortPill, sortBy === o.key && styles.sortPillActive]}
            >
              <Text style={[styles.sortPillText, sortBy === o.key && styles.sortPillTextActive]}>
                {o.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  ), [activeCategory, searchQuery, products.length, sortBy, handleSort]);

  const empty = useCallback(() => (
    <View style={styles.emptyState}>
      <View style={styles.emptyCircle}>
        <Ionicons name="cube-outline" size={32} color={colors.textTertiary} />
      </View>
      <Text style={styles.emptyTitle}>Nothing here</Text>
      <Text style={styles.emptyDesc}>
        {searchQuery.trim() ? 'No match for your search.' : 'This category is empty.'}
      </Text>
    </View>
  ), [searchQuery]);

  if (isLoading) {
    return (
      <View style={styles.root}>
        <HeaderBar insets={insets} count={0} />
        {renderSkeletons()}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.root}>
        <HeaderBar insets={insets} count={0} />
        <View style={styles.errorBox}>
          <View style={styles.emptyCircle}>
            <Ionicons name="cloud-offline-outline" size={32} color={colors.textTertiary} />
          </View>
          <Text style={styles.errorTitle}>Connection issue</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refresh}>
            <Ionicons name="refresh" size={16} color={colors.white} />
            <Text style={styles.retryText}>  Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <HeaderBar insets={insets} count={products.length} />

      <View style={styles.searchWrap}>
        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color={colors.textTertiary} />
          <TextInput
            style={styles.searchField}
            placeholder="Search materials..."
            placeholderTextColor={colors.textTertiary}
            value={rawSearch}
            onChangeText={(t) => { setRawSearch(t); setSearch(t); }}
            autoCorrect={false}
            returnKeyType="search"
          />
          {rawSearch.length > 0 && (
            <TouchableOpacity onPress={() => { setRawSearch(''); setSearch(''); }}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
          <View style={styles.searchDivider} />
          <TouchableOpacity>
            <Ionicons name="options-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <CategoryFilter activeCategory={activeCategory} onCategoryChange={setCategory} />

      <FlatList
        data={products}
        keyExtractor={(p: Product) => p.id}
        numColumns={2}
        columnWrapperStyle={styles.col}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={empty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.white} colors={[colors.white]} />
        }
        renderItem={({ item, index }) => <ProductCard product={item} index={index} />}
      />
    </View>
  );
}

function HeaderBar({ insets, count }: { insets: any; count: number }) {
  return (
    <LinearGradient
      colors={['#1E3A8A', '#3B82F6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={[styles.headerContainer, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerGreeting}>Marketplace</Text>
            <View style={styles.headerSubRow}>
              <View style={styles.headerDot} />
              <Text style={styles.headerSub}>Browse recyclable materials</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="notifications-outline" size={22} color={colors.white} />
            <View style={styles.headerBadge} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  headerContainer: { paddingBottom: spacing.xxl, paddingHorizontal: spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { gap: 3 },
  headerGreeting: { fontSize: 26, fontWeight: '800', color: colors.white, letterSpacing: -0.5 },
  headerSubRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34D399' },
  headerSub: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerBadge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },

  searchWrap: {
    marginHorizontal: spacing.xl,
    marginTop: -16,
    marginBottom: spacing.xs,
    ...shadows.lg,
    borderRadius: radius.lg,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    height: 50,
    gap: spacing.sm,
  },
  searchField: { flex: 1, ...typography.body, paddingVertical: 0 },
  searchDivider: { width: 1, height: 24, backgroundColor: colors.border },

  list: { paddingBottom: 100, paddingHorizontal: spacing.xl, gap: spacing.md },
  col: { gap: spacing.md },
  listHeaderInner: {},

  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  resultsTitle: { ...typography.h3 },
  resultsCount: { ...typography.caption, marginTop: 1 },
  sortRow: { flexDirection: 'row', gap: 4 },
  sortPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortPillActive: { backgroundColor: colors.primaryLight, borderColor: colors.primaryBorder },
  sortPillText: { fontSize: 10, fontWeight: '700', color: colors.textTertiary },
  sortPillTextActive: { color: colors.primary },

  emptyState: { alignItems: 'center', paddingVertical: 56, gap: spacing.sm },
  emptyCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xs },
  emptyTitle: { ...typography.body, fontWeight: '700', color: colors.textSecondary },
  emptyDesc: { ...typography.caption, textAlign: 'center', paddingHorizontal: 32, lineHeight: 18 },

  skGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, gap: spacing.md },
  skCard: { width: '47%', flexGrow: 1, backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  skTop: { height: 56, backgroundColor: colors.skeleton },
  skBody: { padding: spacing.md, gap: spacing.sm },
  skLine1: { height: 12, width: '40%', backgroundColor: colors.skeleton, borderRadius: 4 },
  skLine2: { height: 14, width: '70%', backgroundColor: colors.skeleton, borderRadius: 4 },
  skLine3: { height: 22, width: '55%', backgroundColor: colors.skeleton, borderRadius: 4 },

  errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: spacing.sm },
  errorTitle: { ...typography.body, fontWeight: '700' },
  errorDesc: { ...typography.caption, textAlign: 'center', lineHeight: 18 },
  retryBtn: { flexDirection: 'row', backgroundColor: colors.primary, paddingHorizontal: spacing.xxl, height: 46, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: spacing.md },
  retryText: { fontSize: 14, fontWeight: '700', color: colors.white },
});
