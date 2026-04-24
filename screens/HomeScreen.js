import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  SectionList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { PRODUCTS, CATEGORIES } from '../Data/products';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

const SORT_OPTIONS = [
  { key: 'default', label: 'Default' },
  { key: 'price_asc', label: 'Harga ↑' },
  { key: 'price_desc', label: 'Harga ↓' },
  { key: 'rating', label: 'Rating ↑' },
];

const HomeScreen = () => {
  console.log("Cek Data PRODUCTS:", PRODUCTS); // Tambahkan ini
  console.log("Cek Data CATEGORIES:", CATEGORIES); // Tambahkan ini
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isGrid, setIsGrid] = useState(false);
  const [isSectionMode, setIsSectionMode] = useState(false);
  const [sortKey, setSortKey] = useState('default');
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState(PRODUCTS);

  // FILTER + SEARCH + SORT
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'Semua') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    if (sortKey === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sortKey === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sortKey === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [products, selectedCategory, searchQuery, sortKey]);

// SECTION DATA for SectionList
const sectionData = useMemo(() => {
  // Pastikan filteredProducts ada dan merupakan array
  if (!filteredProducts || filteredProducts.length === 0) return [];

  const grouped = {};
  filteredProducts.forEach((p) => {
    // Tambahkan pengecekan p.category agar tidak error jika ada data produk tanpa kategori
    const category = p?.category || 'Lainnya'; 
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(p);
  });

  return Object.keys(grouped).map((cat) => ({
    title: cat,
    data: grouped[cat] || [], // Pastikan data selalu berupa array
  }));
}, [filteredProducts]);

  // PULL TO REFRESH
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // Simulate re-fetch: shuffle products slightly
      setProducts((prev) => [...prev].sort(() => Math.random() - 0.5));
      setRefreshing(false);
    }, 1500);
  }, []);

  // EMPTY STATE
  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🔭</Text>
      <Text style={styles.emptyTitle}>Produk tidak ditemukan</Text>
      <Text style={styles.emptyHint}>
        Coba gunakan kata kunci lain atau ubah filter kategori
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => { setSearchQuery(''); setSelectedCategory('Semua'); }}
      >
        <Text style={styles.emptyButtonText}>Reset Filter</Text>
      </TouchableOpacity>
    </View>
  );

  // HEADER (search + filter + sort + toggle)
  const ListHeader = () => (
    <View>
      {/* Search Bar */}
      <View style={styles.searchWrapper}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Cari gadget, brand, kategori..."
        />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, selectedCategory === cat && styles.chipActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort + View Toggle */}
      <View style={styles.controlRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScroll}>
          {SORT_OPTIONS.map((s) => (
            <TouchableOpacity
              key={s.key}
              style={[styles.sortBtn, sortKey === s.key && styles.sortBtnActive]}
              onPress={() => setSortKey(s.key)}
            >
              <Text style={[styles.sortText, sortKey === s.key && styles.sortTextActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.viewToggleGroup}>
          <TouchableOpacity
            style={[styles.toggleBtn, !isSectionMode && !isGrid && styles.toggleActive]}
            onPress={() => { setIsGrid(false); setIsSectionMode(false); }}
          >
            <Text style={styles.toggleIcon}>☰</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, isGrid && styles.toggleActive]}
            onPress={() => { setIsGrid(true); setIsSectionMode(false); }}
          >
            <Text style={styles.toggleIcon}>⊞</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, isSectionMode && styles.toggleActive]}
            onPress={() => setIsSectionMode(true)}
          >
            <Text style={styles.toggleIcon}>§</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // SECTION LIST MODE
  if (isSectionMode) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0A84FF" />
        <AppHeader count={filteredProducts.length} />
        <SectionList
          sections={sectionData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard item={item} isGrid={false} />
          )}
          renderSectionHeader={({ section: { title, data } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
              <Text style={styles.sectionCount}>{data.length} produk</Text>
            </View>
          )}
          ListHeaderComponent={<ListHeader />}
          ListEmptyComponent={<ListEmpty />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0A84FF"
              colors={['#0A84FF']}
            />
          }
          contentContainerStyle={filteredProducts.length === 0 ? styles.emptyFlex : styles.listContent}
          stickySectionHeadersEnabled
        />
      </View>
    );
  }

  // FLAT LIST MODE (list / grid)
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A84FF" />
      <AppHeader count={filteredProducts.length} />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={isGrid ? 2 : 1}
        key={isGrid ? 'grid' : 'list'} // force re-render on toggle
        renderItem={({ item }) => (
          <ProductCard item={item} isGrid={isGrid} />
        )}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<ListEmpty />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0A84FF"
            colors={['#0A84FF']}
          />
        }
        contentContainerStyle={
          filteredProducts.length === 0 ? styles.emptyFlex : isGrid ? styles.gridContent : styles.listContent
        }
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={isGrid ? styles.columnWrapper : null}
      />
    </View>
  );
};

const AppHeader = ({ count }) => (
  <View style={styles.header}>
    <View>
      <Text style={styles.headerTitle}>⚡ TechShop</Text>
      <Text style={styles.headerSubtitle}>Gadget & Elektronik Terbaik</Text>
    </View>
    <View style={styles.headerBadge}>
      <Text style={styles.headerBadgeText}>{count}</Text>
      <Text style={styles.headerBadgeLabel}>produk</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },

  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A84FF',
    paddingTop: 54,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    marginTop: 2,
  },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerBadgeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 26,
  },
  headerBadgeLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // SEARCH
  searchWrapper: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
  },

  // CATEGORY
  categoryScroll: {
    marginBottom: 8,
  },
  categoryContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0E8FF',
  },
  chipActive: {
    backgroundColor: '#0A84FF',
    borderColor: '#0A84FF',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666E8A',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  // CONTROLS
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    marginBottom: 8,
  },
  sortScroll: {
    flex: 1,
  },
  sortBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E8FF',
  },
  sortBtnActive: {
    backgroundColor: '#EEF4FF',
    borderColor: '#0A84FF',
  },
  sortText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E94A8',
  },
  sortTextActive: {
    color: '#0A84FF',
  },
  viewToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E8FF',
    overflow: 'hidden',
    marginLeft: 8,
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  toggleActive: {
    backgroundColor: '#0A84FF',
    borderRadius: 8,
  },
  toggleIcon: {
    fontSize: 14,
    color: '#666E8A',
  },

  // SECTION
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F7FF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEFF',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0D1B4B',
    letterSpacing: -0.3,
  },
  sectionCount: {
    fontSize: 12,
    color: '#8E94A8',
    fontWeight: '500',
  },

  // CONTENT
  listContent: {
    paddingBottom: 32,
  },
  gridContent: {
    paddingHorizontal: 10,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  emptyFlex: {
    flexGrow: 1,
  },

  // EMPTY STATE
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0D1B4B',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    color: '#8E94A8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 14,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default HomeScreen;
