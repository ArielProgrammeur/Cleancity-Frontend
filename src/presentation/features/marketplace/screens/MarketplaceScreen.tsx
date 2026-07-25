import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet,
  RefreshControl, StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { MarketplaceApiDatasource } from '../../../../data/datasources/MarketplaceApiDatasource';
import { MarketplaceRepositoryImpl } from '../../../../data/repositories/MarketplaceRepositoryImpl';
import { useMarketplace, getCategoryLabel, type ProductSort } from '../hooks/useMarketplace';
import type { Product } from '../../../../domain/entities/Product';
import { ProductCard } from '../components/ProductCard';
import { CategoryFilter } from '../components/MarketplaceCategoryFilter';
import { colors, spacing, radius, typography, shadows } from '../theme';
import i18n from '../../../../core/i18n';

const datasource = new MarketplaceApiDatasource();
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
  const { t } = useTranslation();
  const {
    products, activeCategory, searchQuery, sortBy,
    isLoading, isRefreshing, error, refresh,
    setCategory, setSearch, setSort,
  } = useMarketplace(repository);
  const [rawSearch, setRawSearch] = useState('');

  const handleSort = useCallback((key: ProductSort) => { setSort(key); }, [setSort]);

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
        <HeaderBar insets={insets} rawSearch="" setRawSearch={() => {}} setSearch={() => {}} />
        {renderSkeletons()}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.root}>
        <HeaderBar insets={insets} rawSearch="" setRawSearch={() => {}} setSearch={() => {}} />
        <View style={styles.errorBox}>
          <View style={styles.emptyCircle}>
            <Ionicons name="cube-outline" size={32} color={colors.textTertiary} />
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
      <StatusBar barStyle="light-content" backgroundColor="#1565C0" />
      <HeaderBar insets={insets} rawSearch={rawSearch} setRawSearch={setRawSearch} setSearch={setSearch} />

      <CategoryFilter activeCategory={activeCategory} onCategoryChange={setCategory} />

      <View style={styles.resultsBar}>
        <View>
          <Text style={styles.resultsTitle}>
            {searchQuery.trim() ? `"${searchQuery}"` : getCategoryLabel(activeCategory)}
          </Text>
          <Text style={styles.resultsCount}>
            {products.length} {t('common.material', { count: products.length })}
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
                {t('market.sort.' + o.key)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(p: Product) => p.id}
        numColumns={2}
        columnWrapperStyle={styles.col}
        ListEmptyComponent={empty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={colors.white} colors={[colors.white]} />
        }
        renderItem={({ item, index }) => <ProductCard product={item} index={index} onPress={() => router.push(`/marketplace/${item.id}`)} />}
      />
    </View>
  );
}

function HeaderBar({ insets, rawSearch, setRawSearch, setSearch }: { insets: any; rawSearch: string; setRawSearch: (t: string) => void; setSearch: (t: string) => void }) {
  const { t } = useTranslation();
  return (
    <LinearGradient
      colors={['#1565C0', '#1E88E5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={[styles.headerContainer, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerRow}>
          <View>
            <View style={styles.headerTitleRow}>
              <View style={styles.headerIconWrap}>
                <Ionicons name="storefront" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.headerGreeting}>{t('market.title')}</Text>
            </View>
            <Text style={styles.headerSub}>{t('market.subtitle')}</Text>
          </View>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="notifications-outline" size={22} color="rgba(255,255,255,0.9)" />
            <View style={styles.headerBadge} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchField}
            placeholder={t('market.search')}
            placeholderTextColor="#94A3B8"
            value={rawSearch}
            onChangeText={(t) => { setRawSearch(t); setSearch(t); }}
            autoCorrect={false}
            returnKeyType="search"
          />
          {rawSearch.length > 0 && (
            <TouchableOpacity onPress={() => { setRawSearch(''); setSearch(''); }}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
          <View style={styles.searchDivider} />
          <TouchableOpacity>
            <Ionicons name="options-outline" size={20} color="#1565C0" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  headerContainer: { paddingBottom: spacing.lg, paddingHorizontal: spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIconWrap: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerGreeting: { fontSize: 24, fontWeight: '800', color: colors.white, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.7)', marginTop: 2, marginLeft: 42 },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerBadge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    height: 48,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  searchField: { flex: 1, fontSize: 14, fontWeight: '500', color: '#0F172A', paddingVertical: 0 },
  searchDivider: { width: 1, height: 24, backgroundColor: colors.border },

  list: { paddingBottom: 100, paddingHorizontal: spacing.xl },
  col: { justifyContent: 'space-between' },

  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    marginTop: 2,
  },
  sortRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  sortPillActive: {
    backgroundColor: '#1565C0',
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  sortPillText: { fontSize: 11, fontWeight: '600', color: colors.textTertiary },
  sortPillTextActive: { color: colors.white },

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
  retryBtn: { flexDirection: 'row', backgroundColor: '#1565C0', paddingHorizontal: spacing.xxl, height: 46, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginTop: spacing.md },
  retryText: { fontSize: 14, fontWeight: '700', color: colors.white },
});
