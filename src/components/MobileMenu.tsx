import React from 'react';
import { X, Search, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandAssets } from '../assets/images';

interface MobileMenuProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ currentView, setCurrentView }) => {
  const { mobileMenuOpen, setMobileMenuOpen, cartCount, settings, setSearchOpen, products, openQuickOrder } = useStore();

  if (!mobileMenuOpen) return null;

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const handleOrderNowClick = () => {
    setMobileMenuOpen(false);
    const heroProduct = products.find((p) => p.slug === 'musfira-special-cream') || products[0];
    if (heroProduct) {
      openQuickOrder(heroProduct, heroProduct.bundles?.find((b) => b.isDefault));
    } else {
      setCurrentView('shop');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden animate-fadeIn">
      {/* Top Bar matching screenshot 5 */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 bg-white">
        <button
          id="close-mobile-menu-btn"
          onClick={() => setMobileMenuOpen(false)}
          className="p-2 text-slate-800 hover:text-blue-900 rounded-lg focus:outline-none"
          aria-label="Close menu"
        >
          <X className="w-6 h-6 stroke-[1.8]" />
        </button>

        {/* Brand Logo in center */}
        <div className="flex items-center space-x-2">
          <img
            src={settings?.logoUrl || BrandAssets.logo}
            alt="Musfira Beauty"
            className="h-10 w-auto object-contain rounded"
            referrerPolicy="no-referrer"
          />
          <span className="font-serif-brand text-2xl font-bold tracking-widest text-[#b8860b]">
            {settings?.brandName || 'MUSFIRA'}
          </span>
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchOpen(true);
            }}
            className="p-2 text-slate-800 focus:outline-none"
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
          </button>
          <button
            onClick={() => handleNavClick('cart')}
            className="relative p-2 text-slate-800 focus:outline-none"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#1b2b88] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Nav Links exactly matching screenshot 5 */}
      <div className="flex-1 px-8 py-8 flex flex-col justify-start space-y-6">
        <button
          id="m-nav-home"
          onClick={() => handleNavClick('home')}
          className="text-left text-2xl font-serif-brand font-medium text-[#2d3a94] hover:text-blue-950 transition-colors"
        >
          Home
        </button>

        <button
          id="m-nav-products"
          onClick={() => handleNavClick('shop')}
          className="text-left text-2xl font-serif-brand font-medium text-[#2d3a94] hover:text-blue-950 transition-colors"
        >
          Products
        </button>

        <button
          id="m-nav-contact"
          onClick={() => handleNavClick('contact')}
          className="text-left text-2xl font-serif-brand font-medium text-[#2d3a94] hover:text-blue-950 transition-colors"
        >
          Contact
        </button>

        <button
          id="m-nav-track"
          onClick={() => handleNavClick('track')}
          className="text-left text-2xl font-serif-brand font-medium text-[#2d3a94] hover:text-blue-950 transition-colors"
        >
          Track Order
        </button>
      </div>

      {/* Bottom Sticky Action Button matching screenshot */}
      <div className="p-4 bg-white/90 backdrop-blur border-t border-slate-100 pb-8">
        <button
          id="m-drawer-order-now-btn"
          onClick={handleOrderNowClick}
          className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#2952ff] to-[#1e90ff] text-white font-bold text-center shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="flex items-center text-lg tracking-wide">
            <ShoppingBag className="w-5 h-5 mr-2" />
            <span>Order Now</span>
          </div>
          <span className="text-xs font-normal text-blue-100 mt-0.5">
            Cash on Delivery - Free Shipping
          </span>
        </button>
      </div>
    </div>
  );
};
