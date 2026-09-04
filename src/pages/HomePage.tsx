import React, { useState, useMemo, useEffect } from 'react';
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
  const { products, settings, openQuickOrder } = useStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Main product: dynamic based on Admin's selection (settings.featuredProductId or isFeatured)
  const mainProduct =
    (settings?.featuredProductId ? products.find((p) => p.id === settings.featuredProductId) : null) ||
    products.find((p) => p.isFeatured) ||
    products.find((p) => p.id === 'prod_musfira_cream') ||
    products[0];

  // Guaranteed 3 discount package bars for ANY active main product
  const bundles: ProductBundle[] = useMemo(() => {
    if (!mainProduct) return [];

    if (mainProduct.bundles && mainProduct.bundles.length >= 3) {
      return mainProduct.bundles;
    }

    const basePrice = Number(mainProduct.price) || 1499;
    const baseOrig = Number(mainProduct.originalPrice) && Number(mainProduct.originalPrice) > basePrice
      ? Number(mainProduct.originalPrice)
      : Math.round(basePrice * 1.35);

    // Deal 1: 1 Pack
    const b1Price = basePrice;
    const b1Orig = baseOrig;

    // Deal 2: 2 Packs (Most Popular Deal - Save Rs. 500 or 15-20%)
    const discount2 = basePrice >= 1000 ? 500 : Math.round(basePrice * 0.2);
    const b2Price = basePrice * 2 - discount2;
    const b2Orig = baseOrig * 2;

    // Deal 3: 3 Packs (Mega Saver Deal - Save Rs. 1000 or 25-30%)
    const discount3 = basePrice >= 1000 ? 1000 : Math.round(basePrice * 0.35);
    const b3Price = basePrice * 3 - discount3;
    const b3Orig = baseOrig * 3;

    return [
      {
        id: `${mainProduct.id}_bundle_1`,
        name: '1 Pack (Single Item)',
        urduName: '1 پیک (سنگل جار)',
        quantity: 1,
        price: b1Price,
        originalPrice: b1Orig,
        discountPercentage: Math.max(0, Math.round(((b1Orig - b1Price) / b1Orig) * 100)),
        badge: 'Starter Deal',
        isDefault: false,
      },
      {
        id: `${mainProduct.id}_bundle_2`,
        name: '2 Packs (Deal - Most Popular)',
        urduName: '2 پیکس (موسٹ پاپولر ڈیل)',
        quantity: 2,
        price: b2Price,
        originalPrice: b2Orig,
        discountPercentage: Math.round(((b2Orig - b2Price) / b2Orig) * 100),
        badge: '★ Most Popular Deal',
        isDefault: true,
      },
      {
        id: `${mainProduct.id}_bundle_3`,
        name: '3 Packs (Mega Saver Deal)',
        urduName: '3 پیکس (مکمل کورس - بڑی بچت)',
        quantity: 3,
        price: b3Price,
        originalPrice: b3Orig,
        discountPercentage: Math.round(((b3Orig - b3Price) / b3Orig) * 100),
        badge: `Save Rs. ${(b3Orig - b3Price).toLocaleString()}`,
        isDefault: false,
      },
    ];
  }, [mainProduct]);

  const [selectedBundle, setSelectedBundle] = useState<ProductBundle | undefined>(() => {
    return bundles.find((b) => b.isDefault) || bundles[1] || bundles[0];
  });

  // When mainProduct changes, reset current image index and choose the default bundle
  useEffect(() => {
    setCurrentImageIndex(0);
    if (bundles && bundles.length > 0) {
      setSelectedBundle(bundles.find((b) => b.isDefault) || bundles[1] || bundles[0]);
    }
  }, [mainProduct?.id, bundles]);

  const images = mainProduct?.images && mainProduct.images.length > 0 ? mainProduct.images : [];

  const handleNextImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleOrderNow = () => {
    if (mainProduct) {
      openQuickOrder(mainProduct, selectedBundle);
    }
  };

  const handleShare = () => {
    if (!mainProduct) return;
    if (navigator.share) {
      navigator.share({
        title: mainProduct.name,
        text: `${mainProduct.name} - 100% Original with Cash on Delivery in Pakistan`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!mainProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <p className="text-amber-950 font-bold">Loading product details...</p>
      </div>
    );
  }

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
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
              <span className="text-amber-800 font-medium">100% Original Musfira</span>
            </p>
          </div>
        </div>

        {/* 3 Package Deal Discount Bars */}
        {bundles && bundles.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-950 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" />
                <span>Select Package Deal (ڈیل منتخب کریں)</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Free Delivery Included
              </span>
            </div>

            {bundles.map((bundle) => {
              const isSelected = selectedBundle?.id === bundle.id;
              const savingsAmount =
                bundle.originalPrice > bundle.price ? bundle.originalPrice - bundle.price : 0;

              return (
                <div
                  key={bundle.id}
                  onClick={() => setSelectedBundle(bundle)}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#b8860b] bg-gradient-to-r from-[#fffdfa] to-[#fef8eb] shadow-gold-sm ring-1 ring-amber-400/40'
                      : 'border-amber-200/70 bg-white hover:border-amber-300'
                  }`}
                >
                  {/* Badge top-right */}
                  {bundle.badge && (
                    <span
                      className={`absolute -top-2.5 right-4 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs ${
                        bundle.badge.includes('Popular')
                          ? 'bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#b8860b]'
                          : 'bg-emerald-600'
                      }`}
                    >
                      {bundle.badge}
                    </span>
                  )}

                  {/* Left: Radio & Name */}
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#b8860b] bg-white' : 'border-amber-300 bg-amber-50/50'
                      }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#b8860b]" />}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-amber-950 block">
                          {bundle.name}
                        </span>
                        {savingsAmount > 0 && (
                          <span className="inline-block bg-amber-100 text-[#996515] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200/80">
                            Save Rs. {savingsAmount.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {bundle.urduName && (
                        <span className="text-xs text-amber-800 font-urdu font-medium block">
                          {bundle.urduName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Price */}
                  <div className="text-right shrink-0">
                    <span className="text-sm sm:text-base font-black text-amber-950 block">
                      Rs.{bundle.price.toLocaleString()}.00
                    </span>
                    {bundle.originalPrice > bundle.price && (
                      <span className="text-xs text-slate-400 line-through block">
                        Rs.{bundle.originalPrice.toLocaleString()}.00
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* In-Page Action Button in Metallic Gold Gradient with Luxury Shake */}
        <div className="pt-2">
          <button
            id="home-order-now-btn"
            type="button"
            onClick={handleOrderNow}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#b8860b] hover:opacity-95 text-white font-extrabold text-sm sm:text-base rounded-full shadow-gold-pulse animate-luxury-shake transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99] border-2 border-amber-200"
          >
            <ShoppingBag className="w-5 h-5 text-amber-100 shrink-0" />
            <span className="tracking-wide">
              ORDER NOW (ابھی آرڈر کریں) • Rs.{currentPrice.toLocaleString()}.00 PKR
            </span>
          </button>
          <div className="flex items-center justify-between text-[11px] text-amber-900/80 px-2 pt-2">
            <span className="flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 mr-1" />
              100% Herbal & Steroid-Free
            </span>
            <span className="text-emerald-700 font-bold">● In Stock - Dispatched Today</span>
          </div>
        </div>

        {/* Share Button */}
        <div className="pt-1 flex items-center justify-start">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-900 hover:text-[#b8860b] transition-colors cursor-pointer py-1"
          >
            <Share2 className="w-4 h-4 text-amber-700" />
            <span>Share {mainProduct.name}</span>
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

      {/* Dedicated Pre-Footer Shaking Order Card for Homepage Product */}
      <div className="max-w-xl mx-auto px-4 pt-6">
        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#fffdf9] to-[#fef8eb] border-2 border-amber-300 shadow-gold-sm space-y-3.5 text-center">
          <div className="flex items-center justify-center space-x-2 text-[#b8860b] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Official Guarantee</span>
            <Sparkles className="w-4 h-4" />
          </div>

          <h3 className="font-serif font-bold text-lg sm:text-xl text-amber-950">
            Get 100% Original {mainProduct.name}
          </h3>

          <p className="font-urdu text-sm text-amber-900 font-semibold">
            {mainProduct.urduDescription || 'صرف 7 دنوں میں داغ، دھبے اور جھائیاں ختم کریں۔ پورے پاکستان میں مفت ڈلیوری!'}
          </p>

          <div className="flex items-center justify-center space-x-3 text-sm">
            <span className="text-slate-400 line-through">
              Rs. {((selectedBundle?.originalPrice || mainProduct.originalPrice || currentPrice * 1.3)).toLocaleString()}
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#b8860b]">
              Rs. {currentPrice.toLocaleString()}.00 PKR
            </span>
          </div>

          <button
            type="button"
            onClick={handleOrderNow}
            className="w-full py-4 bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#b8860b] text-white font-black text-sm sm:text-base rounded-full shadow-gold-pulse animate-luxury-shake hover:opacity-95 transition-all flex items-center justify-center space-x-2 border-2 border-amber-200 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-amber-100" />
            <span>ORDER NOW (ابھی آرڈر کریں)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
