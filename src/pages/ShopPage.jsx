import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/initialData';
import { Search, SlidersHorizontal, RotateCcw, PackageOpen, Check } from 'lucide-react';

export default function ShopPage() {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [priceMax, setPriceMax] = useState(2000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'name' | 'rating'

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category match
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesSku) {
          return false;
        }
      }
      // Price range
      if (product.price > priceMax) {
        return false;
      }
      // In stock
      if (inStockOnly && product.stock <= 0) {
        return false;
      }
      // Discount only
      if (discountOnly && (!product.originalPrice || product.originalPrice <= product.price)) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, priceMax, inStockOnly, discountOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceMax(2000);
    setInStockOnly(false);
    setDiscountOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header Banner */}
      <div className="border-b border-neutral-200 pb-8 animate-fade-down">
        <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
          Retail Collection
        </span>
        <h1 className="text-3xl sm:text-4xl font-light font-editorial text-black tracking-wide mt-1 uppercase">
          Product Catalog
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-light mt-2 max-w-xl">
          Curated everyday essentials for students, teachers, and offices. All products are in stock at our Banago, Nagcarlan store ready for immediate pickup or delivery.
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none animate-fade-up delay-75">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all duration-200 border hover:scale-105 active:scale-95 ${
              selectedCategory === cat
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-white text-neutral-600 border-neutral-300 hover:border-black hover:text-black'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 sm:p-6 bg-[#FAF9F5] border border-neutral-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-center animate-fade-up delay-150 card-interactive">
        
        {/* Real-time Search Input */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, SKU, or keyword..."
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-neutral-300 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        {/* Sort By Dropdown */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full text-xs px-3 py-2.5 bg-white border border-neutral-300 focus:outline-none focus:border-black transition-colors cursor-pointer"
          >
            <option value="featured">Sort: Featured &amp; Best Sellers</option>
            <option value="price-asc">Sort: Price (Low to High)</option>
            <option value="price-desc">Sort: Price (High to Low)</option>
            <option value="name">Sort: Product Name (A to Z)</option>
            <option value="rating">Sort: Highest Rated</option>
          </select>
        </div>

        {/* Reset Filter Action */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          <span className="text-xs text-neutral-500 font-light">
            Showing <strong className="text-black font-semibold">{filteredProducts.length}</strong> items
          </span>
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-neutral-600 hover:text-black transition-all hover:scale-105 active:scale-95"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

      </div>

      {/* Secondary Filter Toggles: Price Slider & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-6 py-2 px-1 text-xs animate-fade-up delay-200">
        
        {/* Price Slider */}
        <div className="flex items-center gap-3">
          <span className="text-neutral-500">Max Price:</span>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-32 sm:w-48 accent-black cursor-pointer"
          />
          <span className="font-mono font-medium text-black">₱{priceMax.toLocaleString()}</span>
        </div>

        {/* Checkbox Toggles */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none hover:text-black transition-colors">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-black w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-neutral-700">In Stock Only</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none hover:text-black transition-colors">
            <input
              type="checkbox"
              checked={discountOnly}
              onChange={(e) => setDiscountOnly(e.target.checked)}
              className="accent-black w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-neutral-700">Special Discounts Only</span>
          </label>
        </div>

      </div>

      {/* Product Grid with Smooth Transition */}
      {filteredProducts.length > 0 ? (
        <div 
          key={`${selectedCategory}-${sortBy}-${priceMax}-${inStockOnly}-${discountOnly}-${searchQuery}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in"
        >
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#FAF9F5] border border-neutral-200 p-8 space-y-4 animate-pop-in">
          <PackageOpen className="w-12 h-12 text-neutral-400 stroke-[1] mx-auto animate-float" />
          <h3 className="font-editorial text-xl text-black">No matching products found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto font-light">
            We could not find any items matching your selected filters. Try clearing your search term or broadening the price range.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95 shadow-xs"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
}
