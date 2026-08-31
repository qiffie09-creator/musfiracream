import React, { useState } from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  onSelectProduct: (slug: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onSelectProduct }) => {
  const { products, categories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Filter products
  let filtered = products.filter((p) => p.active !== false);

  if (selectedCategory !== 'all') {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase() || p.category.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }

  // Sort products
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'title-asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'title-desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title Section matching screenshot 4 */}
      <div className="mb-6">
        <h1 className="font-serif-brand text-4xl sm:text-5xl font-medium text-slate-900 tracking-tight mb-2">
          {selectedCategory === 'all' ? 'All' : selectedCategory}
        </h1>
        <p className="text-sm text-slate-500">
          Discover genuine Musfira Beauty skincare products with 100% natural formula and free nationwide shipping.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#1b2b88] text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Products ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.name
                ? 'bg-[#1b2b88] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Filter and Sort bar matching screenshot 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-y border-slate-200 mb-8 text-xs font-medium text-slate-600 gap-3">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-700" />
          <span className="font-semibold text-slate-800">Filter and sort</span>
        </div>

        <div className="flex items-center justify-between sm:justify-end space-x-4">
          <span className="text-slate-500">{filtered.length} products</span>

          <div className="flex items-center space-x-1.5">
            <label htmlFor="sort-select" className="text-slate-500 hidden sm:inline">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-slate-900 border-0 focus:ring-0 cursor-pointer text-xs"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price, low to high</option>
              <option value="price-high">Price, high to low</option>
              <option value="title-asc">Alphabetically, A-Z</option>
              <option value="title-desc">Alphabetically, Z-A</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Grid matching screenshot 4 */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={(slug) => onSelectProduct(slug)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-base text-slate-600 font-serif-brand">No products found in this category.</p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="mt-4 px-4 py-2 bg-[#1b2b88] text-white text-xs font-bold rounded-lg"
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
};
