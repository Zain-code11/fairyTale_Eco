import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, RotateCcw, Loader2 } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from './ProductCard';
import { ProductCategory } from '../types';
import { useTheme } from '../context/ThemeContext';

export const ProductGrid: React.FC = () => {
  const { products, loading, activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useProducts();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const categories: ProductCategory[] = [
    'All',
    'Chunri',
    'Dupattas',
    'Suits',
    'Unstitched',
    'Ready to Wear',
    'New Arrivals',
  ];

  // Filtering and Sorting logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory === 'New Arrivals') {
      result = result.filter((p) => p.newArrival);
    } else if (activeCategory !== 'All') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.fabric && p.fabric.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // In Stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.available);
    }

    // Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, activeCategory, searchQuery, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setInStockOnly(false);
    setSortBy('newest');
  };

  return (
    <section id="products" className="py-12 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
      
      {/* Catalog Title and Description */}
      <div
        className={`flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b pb-6 text-left ${
          isDark ? 'border-[#3D2E32]' : 'border-[#EAE2D6]'
        }`}
      >
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#651F32] dark:text-[#DEC596] font-semibold mb-1">
            <span className="w-5 h-px bg-[#C9A96E]" />
            <span>Bahawalpur Boutique Catalog</span>
          </div>
          <h2
            className={`font-serif text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight break-words ${
              isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
            }`}
          >
            Our Traditional Collection
          </h2>
          <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'}`}>
            Browse through pure handcrafted Chunri dupattas, festive unstitched suits, and luxury pret.
          </p>
        </div>
        
        {/* Product Count */}
        <div className={`text-xs sm:text-sm shrink-0 ${isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'}`}>
          Showing <span className="font-semibold tabular-nums text-[#651F32] dark:text-[#DEC596]">{filteredProducts.length}</span> pieces
        </div>
      </div>

      {/* Control Bar: Categories Filter Chips - Fully Flexible & Responsive Wrapping */}
      <div className="mb-6 w-full">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count =
              cat === 'All'
                ? products.length
                : cat === 'New Arrivals'
                  ? products.filter((p) => p.newArrival).length
                  : products.filter((p) => p.category === cat).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`group px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                  isActive
                    ? 'bg-[#651F32] text-white border-[#651F32] shadow-sm font-semibold'
                    : isDark
                      ? 'bg-[#261D1F] border-[#3D2E32] text-[#D8C7B5] hover:text-white hover:border-[#DEC596] hover:bg-[#35282B] font-medium'
                      : 'bg-white border-[#EAE2D6] text-[#2B211E] hover:text-[#651F32] hover:border-[#DEC596] hover:bg-[#FAF7F2] font-medium'
                }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full tabular-nums transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white font-bold'
                        : isDark
                          ? 'bg-[#1D1718] text-[#DEC596]'
                          : 'bg-[#F3EDE4] text-[#651F32]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search, In-Stock Toggle, and Sort Controls */}
      <div
        className={`p-3 sm:p-4 rounded-xl border mb-8 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between w-full max-w-full overflow-hidden ${
          isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
        }`}
      >
        {/* Search input */}
        <div className="relative flex-1 w-full min-w-0">
          <Search className="w-4 h-4 text-[#6B5B53] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by suit name, fabric (e.g. Chunri, Silk)..."
            className={`w-full pl-9 pr-14 py-2 text-xs sm:text-sm rounded-md border focus:outline-hidden focus:ring-1 focus:ring-[#651F32] transition-all min-w-0 ${
              isDark
                ? 'bg-[#1D1718] border-[#3D2E32] text-[#F7EFE8] focus:border-[#C9A96E]'
                : 'bg-[#FAF7F2] border-[#D8C7B5] text-[#2B211E] focus:border-[#651F32]'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-70 hover:opacity-100 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full md:w-auto">
          {/* Availability checkbox */}
          <label
            className={`flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer select-none px-3 py-2 rounded-md border flex-1 sm:flex-none justify-center sm:justify-start ${
              isDark ? 'bg-[#1D1718] border-[#3D2E32] text-[#F7EFE8]' : 'bg-[#FAF7F2] border-[#D8C7B5] text-[#2B211E]'
            }`}
          >
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-[#651F32] rounded"
            />
            <span className="whitespace-nowrap">In Stock Only</span>
          </label>

          {/* Sort By Dropdown */}
          <div
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs sm:text-sm flex-1 sm:flex-none justify-center sm:justify-start ${
              isDark ? 'bg-[#1D1718] border-[#3D2E32] text-[#F7EFE8]' : 'bg-[#FAF7F2] border-[#D8C7B5] text-[#2B211E]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9A96E] shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs sm:text-sm focus:outline-hidden cursor-pointer"
            >
              <option value="newest" className={isDark ? 'bg-[#1D1718] text-white' : ''}>Newest First</option>
              <option value="price-asc" className={isDark ? 'bg-[#1D1718] text-white' : ''}>Price: Low to High</option>
              <option value="price-desc" className={isDark ? 'bg-[#1D1718] text-white' : ''}>Price: High to Low</option>
            </select>
          </div>

          {/* Reset Filters if modified */}
          {(activeCategory !== 'All' || searchQuery || inStockOnly || sortBy !== 'newest') && (
            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="p-2 text-xs text-[#651F32] dark:text-[#DEC596] hover:bg-[#651F32]/10 rounded-md transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

        </div>
      </div>

      {/* Loading state */}
      {loading && products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#651F32] dark:text-[#DEC596]">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <p className="text-sm font-medium">Loading Fairytale Chunri Collection...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        /* Product Grid Area with responsive 2 to 4 columns */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div
          className={`text-center py-16 px-4 rounded-xl border max-w-lg mx-auto ${
            isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
          }`}
        >
          <p
            className={`font-serif text-xl mb-2 font-medium ${
              isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
            }`}
          >
            No matching pieces found
          </p>
          <p className={`text-xs sm:text-sm mb-6 ${isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'}`}>
            We couldn't find any clothing items matching your current filters. Try changing your search query or category.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 bg-[#651F32] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-[#4E1525] transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Show All Products</span>
          </button>
        </div>
      )}

    </section>
  );
};
