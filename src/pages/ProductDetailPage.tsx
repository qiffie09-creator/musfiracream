import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingBag, Truck, ShieldCheck, RefreshCw, ArrowLeft, Check } from 'lucide-react';
import { Product, ProductBundle } from '../types';
import { useStore } from '../context/StoreContext';
import { UrduBenefitsSection } from '../components/UrduBenefitsSection';
import { UrduOrderNotice } from '../components/UrduOrderNotice';
import { ReviewsSection } from '../components/ReviewsSection';
import { BrandAssets } from '../assets/images';

interface ProductDetailPageProps {
  slug: string;
  onBack: () => void;
  onSelectProduct: (slug: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onBack, onSelectProduct }) => {
  const { products, openQuickOrder, addToCart } = useStore();

  const product = products.find((p) => p.slug === slug) || products[0];

  const images = product?.images && product.images.length > 0
    ? product.images
    : [BrandAssets.creamHero];

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Bundle selection
  const defaultBundle = product?.bundles?.find((b) => b.isDefault) || product?.bundles?.[0];
  const [selectedBundle, setSelectedBundle] = useState<ProductBundle | undefined>(defaultBundle);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-lg text-slate-700 font-serif-brand">Product not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg text-sm">
          Return to store
        </button>
      </div>
    );
  }

  const isSoldOut = product.stockStatus === 'sold_out' || product.stock <= 0;
  const currentPrice = selectedBundle ? selectedBundle.price : product.price;
  const originalPrice = selectedBundle?.originalPrice || product.salePrice;

  const handleOrderNow = () => {
    if (!isSoldOut) {
      openQuickOrder(product, selectedBundle);
    }
  };

  const handleAddToCart = () => {
    if (!isSoldOut) {
      addToCart(product, 1, selectedBundle);
    }
  };

  return (
    <div className="w-full bg-[#fdfdfd] pb-16">
      {/* Back button breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <button
          onClick={onBack}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Gallery */}
          <div className="flex flex-col items-center">
            <div className="relative w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              <img
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {isSoldOut && (
                <div className="absolute top-4 left-4 bg-[#2f3bbd] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                  Sold out
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-3 mt-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? 'border-blue-900 shadow-sm' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#2f3bbd]">
                {product.category}
              </span>
              <h1 className="font-serif-brand text-3xl font-bold text-[#1b2b88] mt-1 leading-tight">
                {product.name}
              </h1>

              {/* Star Rating */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {product.rating > 0 ? `${product.rating}.0 (${product.reviewCount} reviews)` : '(0 reviews)'}
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center ml-2">
                  <Check className="w-3.5 h-3.5 mr-0.5" /> 100% Authentic
                </span>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline space-x-3">
                <span className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#1b2b88]">
                  Rs.{currentPrice.toLocaleString()}.00 PKR
                </span>
                {originalPrice && originalPrice > currentPrice && (
                  <span className="text-base text-slate-400 line-through font-serif-brand">
                    Rs.{originalPrice.toLocaleString()}.00 PKR
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">Free Delivery across Pakistan • Cash on Delivery</p>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-700 leading-relaxed font-sans">
              {product.description || product.shortDescription}
            </p>

            {/* Bundles if any */}
            {product.bundles && product.bundles.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Select Pack:
                </label>
                {product.bundles.map((b) => {
                  const isSel = selectedBundle?.id === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBundle(b)}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        isSel ? 'border-[#1b2b88] bg-blue-50/40' : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSel ? 'border-[#1b2b88]' : 'border-slate-400'
                          }`}
                        >
                          {isSel && <div className="w-2 h-2 rounded-full bg-[#1b2b88]" />}
                        </div>
                        <span className="font-serif-brand text-sm font-bold text-slate-900">{b.name}</span>
                        {b.savingsText && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            {b.savingsText}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-900 font-serif-brand">
                        Rs.{b.price.toLocaleString()}.00 PKR
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleOrderNow}
                disabled={isSoldOut}
                className={`w-full py-4 px-6 rounded-full text-white font-bold text-center shadow-lg transition-all flex flex-col items-center justify-center ${
                  isSoldOut
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#2952ff] to-[#1e90ff] hover:from-blue-700 hover:to-blue-600 shadow-blue-500/25 active:scale-[0.99] cursor-pointer'
                }`}
              >
                <div className="flex items-center text-lg tracking-wide">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  <span>{isSoldOut ? 'Sold Out' : 'Order Now'}</span>
                </div>
                <span className="text-xs font-normal text-blue-100 mt-0.5">
                  Cash on Delivery - Free Shipping
                </span>
              </button>

              {!isSoldOut && (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 rounded-xl border border-[#1b2b88] text-[#1b2b88] hover:bg-blue-50 font-bold text-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              )}
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 text-center text-xs text-slate-600">
              <div className="p-2 bg-slate-50 rounded-lg">
                <Truck className="w-4 h-4 mx-auto mb-1 text-blue-900" />
                <span className="font-semibold block text-slate-800">Free Delivery</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-blue-900" />
                <span className="font-semibold block text-slate-800">100% Genuine</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <RefreshCw className="w-4 h-4 mx-auto mb-1 text-blue-900" />
                <span className="font-semibold block text-slate-800">7 Days Return</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Urdu Benefits if available */}
      {product.urduBenefits && product.urduBenefits.length > 0 && (
        <UrduBenefitsSection benefits={product.urduBenefits} usageSteps={product.urduUsage} />
      )}

      {/* Urdu Order Notice */}
      <UrduOrderNotice />

      {/* Reviews */}
      <ReviewsSection />
    </div>
  );
};
