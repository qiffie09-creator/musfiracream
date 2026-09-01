import React from 'react';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { BrandAssets } from '../assets/images';

interface ProductCardProps {
  product: Product;
  onSelect: (slug: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { openQuickOrder } = useStore();
  const isSoldOut = product.stockStatus === 'sold_out' || product.stock <= 0;

  const handleCardClick = () => {
    onSelect(product.slug);
  };

  const handleOrderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSoldOut) return;
    openQuickOrder(product, product.bundles?.find((b) => b.isDefault));
  };

  const fallbackImage =
    product.slug === 'musfira-glow-skin-polish'
      ? BrandAssets.skinPolish
      : product.slug === 'musfira-acne-serum'
      ? BrandAssets.acneSerum
      : BrandAssets.creamHero;

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : fallbackImage;

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
    >
      {/* Product Image Box */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="eager"
        />

        {/* Sold out Badge matching screenshot 3 and 4 */}
        {isSoldOut ? (
          <div className="absolute bottom-3 left-3 bg-[#2f3bbd] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            Sold out
          </div>
        ) : product.isBestSeller ? (
          <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            Best Seller
          </div>
        ) : null}
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between text-center sm:text-left">
        <div>
          <h3 className="font-serif-brand text-base sm:text-lg text-[#202975] font-medium group-hover:text-blue-950 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Star Rating matching screenshots: 5 gold stars or 5 grey stars with (count) */}
          <div className="flex items-center justify-center sm:justify-start my-1.5 space-x-1">
            {product.reviewCount > 0 ? (
              <div className="flex items-center space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-200 text-slate-300'
                    }`}
                  />
                ))}
                <span className="text-xs text-[#202975] font-medium ml-1">({product.reviewCount})</span>
              </div>
            ) : (
              <div className="flex items-center space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3.5 h-3.5 fill-slate-200 text-slate-300" />
                ))}
                <span className="text-xs text-slate-500 font-medium ml-1">(0)</span>
              </div>
            )}
          </div>

          {/* Price matching screenshot: crossed sale price and bold active price */}
          <div className="mt-1 flex flex-col items-center sm:items-start">
            {product.salePrice && product.salePrice > product.price && (
              <span className="text-xs sm:text-sm text-[#4b58b4] line-through font-serif-brand">
                Rs.{product.salePrice.toLocaleString()}.00 PKR
              </span>
            )}
            <span className="text-sm sm:text-base text-[#1b2b88] font-bold tracking-tight font-serif-brand">
              Rs.{product.price.toLocaleString()}.00 PKR
            </span>
          </div>
        </div>

        {/* Quick Order Button */}
        {!isSoldOut && (
          <button
            onClick={handleOrderClick}
            className="mt-3 w-full py-2 px-3 text-xs font-semibold rounded-lg bg-blue-50 text-[#1b2b88] hover:bg-[#1b2b88] hover:text-white transition-all flex items-center justify-center space-x-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order Now</span>
          </button>
        )}
      </div>
    </div>
  );
};
