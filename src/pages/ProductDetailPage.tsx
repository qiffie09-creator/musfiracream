import React, { useState } from 'react';
import { Star, ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react';
import { Product, ProductBundle } from '../types';
import { useStore } from '../context/StoreContext';
import { UrduBenefitsSection } from '../components/UrduBenefitsSection';
import { UrduOrderNotice } from '../components/UrduOrderNotice';
import { ReviewsSection } from '../components/ReviewsSection';

interface ProductDetailPageProps {
  product: Product;
  onBack?: () => void;
  setCurrentPage?: (page: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  setCurrentPage,
}) => {
  const { openQuickOrder } = useStore();
  const [selectedBundle, setSelectedBundle] = useState<ProductBundle | undefined>(
    product.bundles?.find((b) => b.isDefault) || product.bundles?.[0]
  );
  const [activeImage, setActiveImage] = useState<string>(product.images[0]);

  const displayPrice = selectedBundle ? selectedBundle.price : product.price;

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else if (setCurrentPage) {
      setCurrentPage('shop');
    }
  };

  const handleOrderNow = () => {
    openQuickOrder(product, selectedBundle);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
        <button
          type="button"
          onClick={handleGoBack}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-900 hover:text-[#b8860b] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Products</span>
        </button>

        {/* Product Image */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#fffdf9] to-[#fef8eb] border border-amber-200/80 shadow-gold-sm flex items-center justify-center p-4">
          <img
            src={activeImage}
            alt={product.name}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex space-x-3 overflow-x-auto pb-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer p-1 bg-white ${
                  activeImage === img ? 'border-[#b8860b] shadow-gold-xs' : 'border-amber-200/60 opacity-70'
                }`}
              >
                <img src={img} alt="Thumb" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        )}

        {/* Title and Ratings */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1 text-[#b8860b]">
            <Sparkles className="w-3.5 h-3.5" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#b8860b]">
              MUSFIRA BEAUTY ESSENTIALS
            </p>
          </div>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-amber-950 tracking-tight">
            {product.name}
          </h1>

          {/* Ratings */}
          <div className="flex items-center space-x-2">
            <div className="flex text-[#d4af37]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-[#d4af37] text-[#d4af37]'
                      : 'text-slate-200 fill-none'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-amber-900 font-medium">({product.reviewCount} Verified Reviews)</span>
          </div>

          {/* Price */}
          <div className="pt-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#b8860b]">
              Rs.{displayPrice.toLocaleString()}.00 PKR
            </span>
            <p className="text-xs text-slate-500 mt-1">
              <span className="font-bold text-emerald-700">Free Express Delivery</span> across Pakistan. Cash on Delivery supported.
            </p>
          </div>
        </div>

        {/* Bundle Deals */}
        {product.bundles && product.bundles.length > 0 && (
          <div className="space-y-3 pt-2">
            {product.bundles.map((bundle) => {
              const isSelected = selectedBundle?.id === bundle.id;

              return (
                <div
                  key={bundle.id}
                  onClick={() => setSelectedBundle(bundle)}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-[#b8860b] bg-gradient-to-r from-[#fffdf7] to-[#fef8eb] shadow-gold-sm'
                      : 'border-amber-200/70 bg-white hover:border-amber-300'
                  }`}
                >
                  {bundle.badge === 'Most Popular' && (
                    <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-[#b8860b] to-[#996515] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                      ⭐ Most Popular
                    </span>
                  )}

                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#b8860b]' : 'border-amber-300'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-[#b8860b]" />}
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-amber-950 block">
                        {bundle.name}
                      </span>
                      {bundle.badge && bundle.badge !== 'Most Popular' && (
                        <span className="inline-block bg-amber-100 text-amber-950 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300/60">
                          {bundle.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm sm:text-base font-bold text-[#b8860b] block">
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

        {/* Order Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleOrderNow}
            className="w-full py-4 bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#b8860b] hover:opacity-95 text-white font-extrabold text-sm sm:text-base rounded-full shadow-gold-pulse animate-luxury-shake transition-all flex items-center justify-center space-x-2 cursor-pointer border-2 border-amber-200 active:scale-[0.99]"
          >
            <ShoppingBag className="w-5 h-5 text-amber-100" />
            <span>ORDER NOW (ابھی آرڈر کریں) • FREE CASH ON DELIVERY</span>
          </button>
        </div>
      </div>

      {/* Urdu Benefits */}
      <UrduBenefitsSection />

      {/* Order Notice */}
      <div className="max-w-xl mx-auto px-4">
        <UrduOrderNotice />
      </div>

      {/* Reviews */}
      <ReviewsSection />
    </div>
  );
};
