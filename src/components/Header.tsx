import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Search, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandAssets } from '../assets/images';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  setCurrentPage,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const { cartCount, settings, products } = useStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.urduName.includes(searchQuery) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Top Bismillah Golden Bar */}
      <div className="bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#996515] text-white text-center py-1 px-4 font-serif text-xs md:text-sm tracking-widest shadow-xs flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
        <span className="font-urdu font-bold text-sm tracking-wider">بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيْمِ</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
      </div>

      {/* Main Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-amber-100 shadow-xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Left Hamburger */}
            <div className="flex items-center">
              <button
                id="header-mobile-menu-btn"
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-amber-950 hover:text-[#b8860b] hover:bg-amber-50/70 rounded-full transition-all cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Center Musfira Luxury Golden Lotus Logo */}
            <div className="flex items-center justify-center">
              <button
                id="header-brand-logo-btn"
                type="button"
                onClick={() => {
                  setCurrentPage('home');
                  setIsMobileMenuOpen(false);
                }}
                className="group flex items-center space-x-3 cursor-pointer py-1"
              >
                <img
                  src={BrandAssets.logo}
                  alt="Musfira Beauty Cream"
                  className="h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-xs"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to SVG if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </button>
            </div>

            {/* Right: Search & Cart */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                id="header-search-btn"
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 text-amber-950 hover:text-[#b8860b] hover:bg-amber-50/70 rounded-full transition-all cursor-pointer"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                id="header-cart-btn"
                type="button"
                onClick={() => {
                  setCurrentPage('cart');
                  setIsMobileMenuOpen(false);
                }}
                className="relative p-2.5 text-amber-950 hover:text-[#b8860b] hover:bg-amber-50/70 rounded-full transition-all cursor-pointer flex items-center"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-gradient-to-r from-[#b8860b] to-[#d4af37] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Announcement Ticker Bar in Gold & White */}
        <div className="bg-gradient-to-r from-[#fef8eb] via-[#fffdf9] to-[#fef8eb] border-t border-b border-amber-200/60 text-amber-900 overflow-hidden py-1.5 px-4 text-xs font-semibold tracking-wide shadow-2xs">
          <div className="whitespace-nowrap flex items-center justify-center space-x-4 text-[12px] md:text-[13px]">
            <span className="text-amber-700">★</span>
            <span>{settings.announcementText || '✨ Musfira Beauty Cream - 100% Herbal & Steroid Free • Cash on Delivery Across Pakistan ✨'}</span>
            <span className="text-amber-700">★</span>
          </div>
        </div>

        {/* Inline Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="border-t border-amber-200 bg-white px-4 py-3 shadow-lg animate-fade-in">
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Musfira products (e.g. Beauty Cream, Polish, Serum)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-amber-50/30 border border-amber-200 rounded-xl text-sm focus:outline-none focus:border-[#b8860b] focus:ring-2 focus:ring-amber-200 text-amber-950 placeholder-amber-700/50"
                  autoFocus
                />
                <Search className="w-4 h-4 text-amber-600 absolute left-3 top-3.5" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-amber-600 hover:text-amber-950 absolute right-3 top-2.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {searchQuery.trim() && (
                <div className="mt-2 divide-y divide-amber-100 max-h-60 overflow-y-auto rounded-lg border border-amber-100 bg-white shadow-xs">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((prod) => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => {
                          setCurrentPage(prod.id === 'prod_wiki_cream' ? 'home' : 'shop');
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left py-2.5 px-3 hover:bg-amber-50/60 flex items-center space-x-3 cursor-pointer transition-colors"
                      >
                        <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 object-contain rounded-lg bg-amber-50/50 border border-amber-100" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-amber-950">{prod.name}</p>
                          <p className="text-xs text-[#b8860b] font-bold">Rs.{prod.price.toLocaleString()}.00 PKR</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-amber-800/70 py-4 text-center">No products found matching "{searchQuery}"</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Drawer Menu in Luxury Gold & White */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-2xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-right border-r border-amber-100">
            {/* Drawer Header */}
            <div className="p-4 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50/50 via-white to-amber-50/50">
              <div className="flex items-center space-x-2">
                <img
                  src={BrandAssets.logoIcon || BrandAssets.logo}
                  alt="Musfira"
                  className="w-8 h-8 object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="font-serif font-bold text-lg text-amber-950 tracking-wider">
                  Musfira Skincare
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-amber-900 hover:text-amber-950 hover:bg-amber-100/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left text-base font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                  currentPage === 'home'
                    ? 'text-amber-950 bg-amber-100/60 border border-amber-300/60 shadow-2xs'
                    : 'text-slate-800 hover:text-amber-950 hover:bg-amber-50/50'
                }`}
              >
                <span>Home (Musfira Cream)</span>
                {currentPage === 'home' && <span className="w-2 h-2 rounded-full bg-[#b8860b]" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentPage('shop');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left text-base font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                  currentPage === 'shop'
                    ? 'text-amber-950 bg-amber-100/60 border border-amber-300/60 shadow-2xs'
                    : 'text-slate-800 hover:text-amber-950 hover:bg-amber-50/50'
                }`}
              >
                <span>All Products</span>
                {currentPage === 'shop' && <span className="w-2 h-2 rounded-full bg-[#b8860b]" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentPage('cart');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left text-base font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                  currentPage === 'cart'
                    ? 'text-amber-950 bg-amber-100/60 border border-amber-300/60 shadow-2xs'
                    : 'text-slate-800 hover:text-amber-950 hover:bg-amber-50/50'
                }`}
              >
                <span>Shopping Cart</span>
                <span className="text-xs bg-gradient-to-r from-[#b8860b] to-[#d4af37] text-white px-2 py-0.5 rounded-full font-bold">
                  {cartCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentPage('track');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left text-base font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                  currentPage === 'track'
                    ? 'text-amber-950 bg-amber-100/60 border border-amber-300/60 shadow-2xs'
                    : 'text-slate-800 hover:text-amber-950 hover:bg-amber-50/50'
                }`}
              >
                <span>Track My Order</span>
                {currentPage === 'track' && <span className="w-2 h-2 rounded-full bg-[#b8860b]" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentPage('contact');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left text-base font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                  currentPage === 'contact'
                    ? 'text-amber-950 bg-amber-100/60 border border-amber-300/60 shadow-2xs'
                    : 'text-slate-800 hover:text-amber-950 hover:bg-amber-50/50'
                }`}
              >
                <span>Help & Contact</span>
                {currentPage === 'contact' && <span className="w-2 h-2 rounded-full bg-[#b8860b]" />}
              </button>

              <div className="pt-6 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-xs font-semibold py-2 px-4 rounded-lg text-amber-800/70 hover:text-amber-950 hover:bg-amber-50 transition-colors cursor-pointer"
                >
                  ⚙️ Store Admin Portal
                </button>
              </div>
            </div>

            {/* Drawer Bottom Guarantee */}
            <div className="p-4 bg-gradient-to-r from-amber-50/90 to-yellow-50/90 border-t border-amber-200/60 text-center">
              <p className="text-xs font-bold text-amber-900 font-urdu">
                ✨ 100% اصلی اور محفوظ فارمولا • فری ہوم ڈلیوری ✨
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
