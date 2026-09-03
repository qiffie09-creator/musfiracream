import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Share2, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UrduBenefitsSection } from '../components/UrduBenefitsSection';
import { UrduOrderNotice } from '../components/UrduOrderNotice';
import { ReviewsSection } from '../components/ReviewsSection';
import { Product, ProductBundle } from '../types';

interface HomePageProps {
  onSelectProduct?: (product: Product) => void;
  setCurrentPage?: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectProduct, setCurrentPage }) => {
  const { products, openQuickOrder } = useStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Main product is Musfira Special Cream
  const mainProduct = products.find((p) => p.id === 'prod_wiki_cream') || products[0];

  const [selectedBundle, setSelectedBundle] = useState<ProductBundle | undefined>(
    mainProduct.bundles?.find((b) => b.isDefault) || mainProduct.bundles?.[1] || mainProduct.bundles?.[0]
  );

  const images = mainProduct.images || [];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleOrderNow = () => {
    openQuickOrder(mainProduct, selectedBundle);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Musfira Beauty Cream',
        text: 'Musfira Beauty Cream - 100% Herbal & Steroid-Free Formula with Cash on Delivery in Pakistan',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const currentPrice = selectedBundle ? selectedBundle.price : mainProduct.price;

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6 pt-4 space-y-5">
        {/* Product Carousel Header / Pagination */}
        <div className="flex items-center justify-between text-xs text-amber-800/80 px-1">
          <button
            type="button"
            className="p-1 hover:text-amber-950 transition-colors cursor-pointer"
            aria-label="Zoom image"
          >
            <Search className="w-4 h-4 text-amber-600" />
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handlePrevImage}
              className="p-1.5 text-amber-800 hover:text-amber-950 hover:bg-amber-50 rounded-full transition-colors cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-amber-950 text-xs px-2 py-0.5 bg-amber-50 border border-amber-200/60 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={handleNextImage}
              className="p-1.5 text-amber-800 hover:text-amber-950 hover:bg-amber-50 rounded-full transition-colors cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Main Image in White & Gold Luxury Frame */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-b from-white via-[#fdfbf7] to-[#fef8eb] shadow-md border border-amber-200/80 group">
          <img
            src={images[currentImageIndex]}
            alt={mainProduct.name}
            className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />

          {/* Gold Badge in corner */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#b8860b] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>24k Gold Glow</span>
          </div>

          {/* Left / Right Click overlay for smooth mobile swipe */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
            onClick={handlePrevImage}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
            onClick={handleNextImage}
          />
        </div>

        {/* Product Title and Brand */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center space-x-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#b8860b]">
              MUSFIRA SKINCARE • ORIGINAL
            </p>
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 mr-1" />
              100% Certified Herbal
            </span>
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-amber-950 tracking-tight">
            {mainProduct.name}
          </h1>

          {/* Real-time viewer count badge in warm gold */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-amber-200/80 bg-[#fffdf9] text-xs text-amber-900 shadow-2xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="font-semibold">142 people are viewing this product</span>
          </div>

          {/* Price in Rich Gold */}
          <div className="pt-2">
            <span className="text-2xl sm:text-3xl font-bold text-[#b8860b]">
              Rs.{currentPrice.toLocaleString()}.00 PKR
            </span>
            <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
              <span className="text-emerald-700 font-semibold">Free Delivery Across Pakistan</span>
              <span>•</span>
              <span>Cash on Delivery</span>
            </p>
          </div>
        </div>

        {/* Package Deal Radio Cards in Gold & White */}
        {mainProduct.bundles && mainProduct.bundles.length > 0 && (
          <div className="space-y-3 pt-2">
            {mainProduct.bundles.map((bundle) => {
              const isSelected = selectedBundle?.id === bundle.id;

              return (
                <div
                  key={bundle.id}
                  onClick={() => setSelectedBundle(bundle)}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#b8860b] bg-gradient-to-r from-[#fffdfa] to-[#fef8eb] shadow-gold-sm'
                      : 'border-amber-100/90 bg-white hover:border-amber-300'
                  }`}
                >
                  {/* Badge top-right */}
                  {bundle.badge === 'Most Popular' && (
                    <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-[#996515] to-[#b8860b] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      ★ Most Popular Deal
                    </span>
                  )}

                  {/* Left: Radio & Name */}
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#b8860b]' : 'border-amber-200'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-[#b8860b]" />}
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-amber-950 block">
                        {bundle.name}
                      </span>
                      {bundle.badge && bundle.badge !== 'Most Popular' && (
                        <span className="inline-block bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200/60">
                          {bundle.badge}
                        </span>
                      )}
                      {bundle.id === 'bundle_2' && (
                        <span className="inline-block bg-amber-100 text-[#996515] text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200/60">
                          Save Rs. 500
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Price */}
                  <div className="text-right">
                    <span className="text-sm sm:text-base font-bold text-amber-950 block">
                      Rs.{bundle.price.toLocaleString()}.00 PKR
                    </span>
                    {bundle.originalPrice > bundle.price && (
                      <span className="text-xs text-slate-400 line-through">
                        Rs.{bundle.originalPrice.toLocaleString()}.00 PKR
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* In-Page Action Button in Metallic Gold Gradient */}
        <div className="pt-2">
          <button
            id="home-order-now-btn"
            type="button"
            onClick={handleOrderNow}
            className="w-full py-4 bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#b8860b] hover:opacity-95 text-white font-bold text-sm sm:text-base rounded-full shadow-gold-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99] border border-amber-200"
          >
            <ShoppingBag className="w-5 h-5 text-amber-100" />
            <span className="tracking-wide">Order Now | Cash on Delivery - Free Shipping</span>
          </button>
        </div>

        {/* Share Button */}
        <div className="pt-1 flex items-center justify-start">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-900 hover:text-[#b8860b] transition-colors cursor-pointer py-1"
          >
            <Share2 className="w-4 h-4 text-amber-700" />
            <span>Share Musfira Beauty Cream</span>
          </button>
        </div>
      </div>

      {/* Urdu Benefits Section */}
      <UrduBenefitsSection />

      {/* Urdu Order Notice Box */}
      <div className="max-w-xl mx-auto px-4">
        <UrduOrderNotice />
      </div>

      {/* Reviews Section */}
      <ReviewsSection />
    </div>
  );
};
