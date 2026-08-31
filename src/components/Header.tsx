import React, { useState } from 'react';
import { Menu, Search, ShoppingBag, X, Phone, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandAssets } from '../assets/images';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onSelectProduct?: (slug: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, onSelectProduct }) => {
  const { cartCount, settings, setMobileMenuOpen, searchOpen, setSearchOpen, searchQuery, setSearchQuery, products } = useStore();
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const filteredProducts = searchQuery.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSearchResultClick = (slug: string) => {
    if (onSelectProduct) {
      onSelectProduct(slug);
    }
    setSearchOpen(false);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm transition-all">
      {/* 1. Top Bismillah Bar */}
      <div className="w-full bg-[#1b2b88] text-white py-1.5 px-4 text-center">
        <span className="font-urdu text-lg tracking-wide select-none drop-shadow-sm">
          {settings?.bismillahText || 'بِسْمِ اللَّهِ'}
        </span>
      </div>

      {/* 2. Main Brand Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Mobile Menu Toggle / Desktop Links */}
          <div className="flex items-center space-x-3">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-800 hover:text-blue-900 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6 stroke-[1.8]" />
            </button>

            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-700">
              <button
                id="nav-home-btn"
                onClick={() => setCurrentView('home')}
                className={`transition-colors hover:text-blue-900 ${currentView === 'home' ? 'text-blue-900 font-bold' : ''}`}
              >
                Home
              </button>
              <button
                id="nav-products-btn"
                onClick={() => setCurrentView('shop')}
                className={`transition-colors hover:text-blue-900 ${currentView === 'shop' ? 'text-blue-900 font-bold' : ''}`}
              >
                Products
              </button>
              <button
                id="nav-reviews-btn"
                onClick={() => {
                  setCurrentView('home');
                  setTimeout(() => {
                    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="transition-colors hover:text-blue-900"
              >
                Customer Reviews
              </button>
              <button
                id="nav-contact-btn"
                onClick={() => setCurrentView('contact')}
                className={`transition-colors hover:text-blue-900 ${currentView === 'contact' ? 'text-blue-900 font-bold' : ''}`}
              >
                Contact
              </button>
            </nav>
          </div>

          {/* Center: Luxury Golden Logo */}
          <div className="flex-1 flex justify-center items-center">
            <button
              id="header-brand-logo-btn"
              onClick={() => setCurrentView('home')}
              className="flex items-center space-x-2 focus:outline-none group text-left"
            >
              <div className="relative flex items-center">
                <img
                  src={settings?.logoUrl || BrandAssets.logo}
                  alt="Musfira Beauty"
                  className="h-10 sm:h-14 w-auto object-contain drop-shadow-sm rounded-md"
                  referrerPolicy="no-referrer"
                />
                <div className="ml-2 flex flex-col">
                  <span className="font-serif-brand text-2xl sm:text-3xl font-bold tracking-widest text-[#b8860b] group-hover:text-[#996515] transition-colors leading-none">
                    {settings?.brandName || 'MUSFIRA'}
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-slate-500 font-semibold uppercase leading-tight">
                    {settings?.brandTagline || 'SPECIAL SKINCARE'}
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Right: Search & Shopping Bag */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              id="header-search-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-800 hover:text-blue-900 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Search Store"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
            </button>

            <button
              id="header-cart-btn"
              onClick={() => setCurrentView('cart')}
              className="relative p-2 text-slate-800 hover:text-blue-900 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#1b2b88] text-white text-[10px] sm:text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar Overlay */}
        {searchOpen && (
          <div className="relative pb-4 pt-2 border-t border-slate-100 transition-all">
            <div className="relative max-w-xl mx-auto">
              <input
                id="search-input-field"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                placeholder="Search beauty cream, serums, skin polish, face wash..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-full text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1b2b88] focus:border-transparent transition-all"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Instant Search Results Dropdown */}
              {showSearchDropdown && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 max-h-72 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSearchResultClick(prod.slug)}
                        className="flex items-center p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                      >
                        <img
                          src={prod.images[0] || BrandAssets.creamHero}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded-md mr-3"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate font-serif-brand">{prod.name}</p>
                          <p className="text-xs text-blue-900 font-bold">Rs.{prod.price.toLocaleString()} PKR</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-500">
                      No products found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Royal Blue Announcement Marquee Ticker */}
      <div className="w-full bg-[#1b2b88] text-white py-2 overflow-hidden border-t border-blue-950/20">
        <div className="animate-ticker text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap">
          <span className="mx-6">★ {settings?.tickerText || 'Free shipping all over Pakistan'} ★</span>
          <span className="mx-6">★ 100% Original & Steroid-Free Skincare Formula ★</span>
          <span className="mx-6">★ Cash on Delivery Available Nationwide ★</span>
          <span className="mx-6">★ {settings?.tickerText || 'Free shipping all over Pakistan'} ★</span>
          <span className="mx-6">★ 100% Original & Steroid-Free Skincare Formula ★</span>
          <span className="mx-6">★ Cash on Delivery Available Nationwide ★</span>
        </div>
      </div>
    </header>
  );
};
