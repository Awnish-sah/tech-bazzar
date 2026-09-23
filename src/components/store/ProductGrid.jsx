import React, { useMemo, useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { useAdmin } from '../../context/AdminContext';
import { ProductCard } from './ProductCard';
import {
  SlidersHorizontal,
  ArrowUpDown,
  SearchX,
  X,
  Sparkles,
  Check
} from 'lucide-react';

export const ProductGrid = () => {
  const { products } = useAdmin();
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    sortBy,
    setSortBy
  } = useShop();

  const [inStockOnly, setInStockOnly] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Extract unique brands from current products
  const availableBrands = useMemo(() => {
    const brandsSet = new Set(products.map(p => p.brand).filter(Boolean));
    return ['all', ...Array.from(brandsSet)];
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter (matches title, brand, category, specs, description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.shortDesc && p.shortDesc.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand && selectedBrand !== 'all') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // In Stock filter
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // 'featured'
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedBrand, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedBrand !== 'all' || inStockOnly;

  return (
    <section id="catalog-section" className="max-w-7xl mx-auto px-4 lg:px-8 py-10 scroll-mt-24">
      {/* Section Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80 mb-8 transition-colors">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 font-['Outfit'] transition-colors">
            <span>Electronics Catalog</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-mono">
              {filteredProducts.length} items
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse our full lineup of verified tech products with official manufacturer warranties
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-1.5 shadow-sm dark:shadow-none">
            <span className="text-xs text-slate-500 dark:text-slate-400">Brand:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              {availableBrands.map((b) => (
                <option key={b} value={b} className="bg-white dark:bg-[#121829] text-slate-800 dark:text-slate-200">
                  {b === 'all' ? 'All Brands' : b}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#121829] border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-1.5 shadow-sm dark:shadow-none">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-white dark:bg-[#121829] text-slate-800 dark:text-slate-200">Featured First</option>
              <option value="price-low" className="bg-white dark:bg-[#121829] text-slate-800 dark:text-slate-200">Price: Low to High</option>
              <option value="price-high" className="bg-white dark:bg-[#121829] text-slate-800 dark:text-slate-200">Price: High to Low</option>
              <option value="rating" className="bg-white dark:bg-[#121829] text-slate-800 dark:text-slate-200">Highest Rated</option>
            </select>
          </div>

          {/* In Stock Toggle */}
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              inStockOnly
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400 dark:border-emerald-500/40 shadow-sm'
                : 'bg-white dark:bg-[#121829] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm dark:shadow-none'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${inStockOnly ? 'bg-emerald-500 border-emerald-500' : 'border-slate-400 dark:border-slate-500'}`}>
              {inStockOnly && <Check className="w-2.5 h-2.5 text-white dark:text-black stroke-[3]" />}
            </div>
            <span>In Stock Only</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          <span className="text-slate-500">Active filters:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-cyan-900 dark:hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('all')} className="hover:text-cyan-900 dark:hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedBrand !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300">
              Brand: {selectedBrand}
              <button onClick={() => setSelectedBrand('all')} className="hover:text-cyan-900 dark:hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
              In Stock Only
              <button onClick={() => setInStockOnly(false)} className="hover:text-emerald-900 dark:hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline ml-2 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 px-4 rounded-3xl bg-white dark:bg-[#121829]/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <SearchX className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
              We couldn't find any electronics matching your criteria. Try adjusting your filters or search keywords.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-black font-semibold text-xs transition-colors shadow-sm dark:shadow-glow-cyan"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
