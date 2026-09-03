import React, { useState } from 'react';
import { SlidersHorizontal, X, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  onSelectProduct: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onSelectProduct }) => {
  const { products } = useStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Filter products
  let displayProducts = [...products];

  if (filterAvailability === 'in_stock') {
    displayProducts = displayProducts.filter((p) => p.stockStatus === 'in_stock');
  } else if (filterAvailability === 'out_of_stock') {
    displayProducts = displayProducts.filter((p) => p.stockStatus === 'out_of_stock');
  }

  // Sort products
  if (sortBy === 'price-asc') {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    displayProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-[#b8860b]" />
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-amber-950 tracking-tight">
          All Products & Packages
        </h1>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex items-center justify-between py-2 border-b border-amber-100">
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-amber-950 hover:text-[#b8860b] transition-colors cursor-pointer py-1"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#b8860b]" />
          <span>Filter and sort</span>
        </button>

        <span className="text-xs text-amber-800/70 font-medium">
          {displayProducts.length} items available
        </span>
      </div>

      {/* Products Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelectProduct={onSelectProduct}
          />
        ))}
      </div>

      {/* Filter & Sort Drawer Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-2xs">
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slide-left border-l border-amber-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-amber-100">
                <h3 className="font-serif font-bold text-xl text-amber-950">
                  Filter & Sort
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="p-1 text-amber-800 hover:text-amber-950"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sort By Options */}
              <div className="py-5 border-b border-amber-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900/70">
                  Sort By
                </h4>
                <div className="space-y-2">
                  {[
                    { id: 'featured', label: 'Featured' },
                    { id: 'price-asc', label: 'Price: Low to High' },
                    { id: 'price-desc', label: 'Price: High to Low' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSortBy(opt.id as any)}
                      className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer ${
                        sortBy === opt.id
                          ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                          : 'text-slate-700 hover:bg-amber-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.id && <Check className="w-4 h-4 text-[#b8860b]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="py-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900/70">
                  Availability
                </h4>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Products' },
                    { id: 'in_stock', label: 'In Stock Only' },
                    { id: 'out_of_stock', label: 'Out of Stock' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setFilterAvailability(opt.id as any)}
                      className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer ${
                        filterAvailability === opt.id
                          ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                          : 'text-slate-700 hover:bg-amber-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {filterAvailability === opt.id && (
                        <Check className="w-4 h-4 text-[#b8860b]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-4 border-t border-amber-100">
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="w-full py-3.5 bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#b8860b] text-white font-bold text-sm rounded-xl hover:opacity-95 transition-all cursor-pointer shadow-gold-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
