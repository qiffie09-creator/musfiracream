import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Share2, Sparkles, ShoppingBag, Eye, Star, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductBundle, Product } from '../types';
import { UrduBenefitsSection } from '../components/UrduBenefitsSection';
import { UrduOrderNotice } from '../components/UrduOrderNotice';
import { ReviewsSection } from '../components/ReviewsSection';
import { ProductCard } from '../components/ProductCard';
import { BrandAssets } from '../assets/images';

interface HomePageProps {
  onSelectProduct: (slug: string) => void;
  setCurrentView: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectProduct, setCurrentView }) => {
  const { products, openQuickOrder, addToCart, showToast, settings } = useStore();

  // Find primary hero product (Musfira Special Cream)
  const heroProduct = products.find((p) => p.slug === 'musfira-special-cream') || products[0];

  // Carousel image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Bundle selection matching screenshot 10
  const defaultBundle = heroProduct?.bundles?.find((b) => b.isDefault) || heroProduct?.bundles?.[1] || {
    id: 'b-2',
    name: '2 Packs',
    packsCount: 2,
    price: 2499,
    originalPrice: 2998,
    badge: 'Most Popular',
    savingsText: 'Save Rs. 500',
    isDefault: true,
  };

  const [selectedBundle, setSelectedBundle] = useState<ProductBundle>(defaultBundle);

  // Live viewer counter simulation
  const [viewersCount, setViewersCount] = useState(129);
  useEffect(() => {
    const interval = setInterval(() => {
      setViewersCount((prev) => Math.min(185, Math.max(98, prev + Math.floor(Math.random() * 5) - 2)));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const heroImages = (settings?.landingImages && settings.landingImages.length > 0)
    ? settings.landingImages
    : (heroProduct?.images && heroProduct.images.length > 0
        ? heroProduct.images
        : [BrandAssets.creamHero, BrandAssets.skinPolish, BrandAssets.faceWash]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Musfira Special Beauty Cream',
          text: 'Check out 100% Original Musfira Beauty Cream with Free Delivery across Pakistan!',
          url: window.location.href,
        });
      } catch {
        // Ignored or cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  const handleOrderNowClick = () => {
    if (heroProduct) {
      openQuickOrder(heroProduct, selectedBundle);
    }
  };

  const handleAddToCartClick = () => {
    if (heroProduct) {
      addToCart(heroProduct, 1, selectedBundle);
    }
  };

  const otherProducts = products.filter((p) => p.id !== heroProduct?.id).slice(0, 4);

  return (
    <div className="w-full bg-[#fdfdfd] pb-16">
      {/* 1. Main Hero Product Section matching screenshots 10 & 11 */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Product Packshot & Carousel */}
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden shadow-sm border border-slate-100 group">
              <img
                src={heroImages[currentImageIndex] || BrandAssets.creamHero}
                alt={heroProduct?.name || 'Musfira Special Cream'}
                className="w-full h-full object-cover object-center transition-all duration-300"
                referrerPolicy="no-referrer"
              />

              {/* One Sold Every Minute Badge matching screenshot 10 */}
              <div className="absolute top-4 left-4 bg-[#1b2b88] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                One Sold Every Minute*
              </div>

              {/* Prev / Next Carousel Controls */}
              {heroImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-md transition-all focus:outline-none"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full shadow-md transition-all focus:outline-none"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Carousel Page Counter Indicator (e.g. 1/3) */}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {currentImageIndex + 1} / {heroImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail dots/previews */}
            {heroImages.length > 1 && (
              <div className="flex items-center space-x-3 mt-4">
                {heroImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === idx ? 'border-[#1b2b88] shadow-sm' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Title, Pricing, Bundles, CTA */}
          <div className="flex flex-col space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2f3bbd]">
                MY STORE · MUSFIRA BEAUTY
              </span>
              <h1 className="font-serif-brand text-3xl sm:text-4xl font-bold text-[#1b2b88] mt-1 leading-tight">
                {heroProduct?.name || 'Musfira Special Cream'}
              </h1>

              {/* Star Rating */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">5.0 (5 reviews)</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center">
                  <Check className="w-3.5 h-3.5 mr-0.5" /> 100% Original
                </span>
              </div>
            </div>

            {/* Live Viewer Counter matching screenshot 10 */}
            <div className="flex items-center space-x-2 text-xs font-medium text-slate-700 bg-slate-100/90 px-3 py-1.5 rounded-full w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{viewersCount} people are viewing this product</span>
            </div>

            {/* Price section matching screenshot 10 */}
            <div className="pt-1">
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#1b2b88]">
                  Rs.{selectedBundle.price.toLocaleString()}.00 PKR
                </span>
                {selectedBundle.originalPrice && selectedBundle.originalPrice > selectedBundle.price && (
                  <span className="text-base text-slate-400 line-through font-serif-brand">
                    Rs.{selectedBundle.originalPrice.toLocaleString()}.00 PKR
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">Shipping calculated at checkout (Free Delivery).</p>
            </div>

            {/* Bundle Selector Box exactly reproducing screenshot 10 */}
            <div className="space-y-2.5 pt-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Select Bundle & Save:
              </label>

              {heroProduct?.bundles?.map((b) => {
                const isSelected = selectedBundle.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBundle(b)}
                    className={`relative flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#1b2b88] bg-blue-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {/* Radio Button + Title */}
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#1b2b88]' : 'border-slate-400'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#1b2b88]" />}
                      </div>
                      <div>
                        <span className="font-serif-brand text-base font-bold text-slate-900 mr-2">
                          {b.name}
                        </span>
                        {b.savingsText && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                            {b.savingsText}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price + Badge */}
                    <div className="flex items-center space-x-2 text-right">
                      {b.badge && (
                        <span className="hidden sm:inline-block bg-[#1b2b88] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {b.badge}
                        </span>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 font-serif-brand">
                          Rs.{b.price.toLocaleString()}.00 PKR
                        </span>
                        {b.originalPrice && b.originalPrice > b.price && (
                          <span className="text-[11px] text-slate-400 line-through">
                            Rs.{b.originalPrice.toLocaleString()}.00
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-3 pt-4">
              {/* Vibrant Gradient Blue Order Button matching screenshot */}
              <button
                id="hero-order-now-btn"
                onClick={handleOrderNowClick}
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#2952ff] to-[#1e90ff] hover:from-[#1b43f0] hover:to-[#187bcd] text-white font-bold text-center shadow-lg shadow-blue-500/30 active:scale-[0.99] transition-all flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="flex items-center text-lg sm:text-xl tracking-wide">
                  <ShoppingBag className="w-5 h-5 mr-2.5" />
                  <span>Order Now</span>
                </div>
                <span className="text-xs font-normal text-blue-100 mt-0.5">
                  Cash on Delivery - Free Shipping
                </span>
              </button>

              <div className="flex items-center space-x-3">
                <button
                  id="hero-add-to-cart-btn"
                  onClick={handleAddToCartClick}
                  className="flex-1 py-3 px-4 rounded-xl border border-[#1b2b88] text-[#1b2b88] hover:bg-blue-50 font-bold text-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center justify-center"
                  aria-label="Share product"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Value Props Bar */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Truck className="w-4 h-4 mx-auto mb-1 text-blue-900" />
                <span className="font-semibold block text-slate-800">Free Delivery</span>
                <span>All Over Pakistan</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-blue-900" />
                <span className="font-semibold block text-slate-800">100% Original</span>
                <span>Steroid-Free</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <RefreshCw className="w-4 h-4 mx-auto mb-1 text-blue-900" />
                <span className="font-semibold block text-slate-800">Easy Returns</span>
                <span>7 Days Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Urdu Benefits & How To Use Section matching screenshot 9 */}
      <UrduBenefitsSection />

      {/* 3. Urdu Order Notice Caution Box matching screenshot 8 */}
      <UrduOrderNotice />

      {/* 4. Customer Reviews Section matching screenshots 6, 7, 8 */}
      <ReviewsSection />

      {/* 5. You May Also Like / More Musfira Products */}
      {otherProducts.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif-brand font-bold text-[#1b2b88]">
              You May Also Like
            </h2>
            <button
              onClick={() => setCurrentView('shop')}
              className="text-xs font-semibold text-blue-900 hover:underline"
            >
              View All Products →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {otherProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={(slug) => onSelectProduct(slug)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. Sticky Bottom Bar on Mobile View */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden flex items-center justify-between shadow-2xl">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-900 font-serif-brand leading-none">
            {selectedBundle.name}
          </span>
          <span className="text-sm font-bold text-[#1b2b88] font-serif-brand mt-0.5">
            Rs.{selectedBundle.price.toLocaleString()}.00 PKR
          </span>
        </div>

        <button
          onClick={handleOrderNowClick}
          className="py-2.5 px-6 rounded-full bg-gradient-to-r from-[#2952ff] to-[#1e90ff] text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center space-x-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Order Now (COD)</span>
        </button>
      </div>
    </div>
  );
};
