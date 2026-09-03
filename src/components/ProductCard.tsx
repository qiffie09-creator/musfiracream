import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { openQuickOrder } = useStore();
  const isSoldOut = product.stockStatus === 'out_of_stock';

  const handleClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else if (!isSoldOut) {
      openQuickOrder(product);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleClick}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border border-amber-100/80 hover:border-amber-400 hover:shadow-gold-sm p-2"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-gradient-to-b from-[#fffdf9] to-[#fef8eb] rounded-xl overflow-hidden flex items-center justify-center p-3 border border-amber-100/50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Sold out badge */}
        {isSoldOut && (
          <div className="absolute bottom-3 left-3 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Sold out
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="pt-3 pb-2 px-1 flex-1 flex flex-col justify-between space-y-1">
        <div>
          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-amber-950 group-hover:text-[#b8860b] transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex items-center space-x-1 my-1">
            <div className="flex items-center text-xs">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-[#d4af37] text-[#d4af37]'
                      : 'text-slate-200 fill-none'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-amber-800/70 font-medium">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing in Gold */}
        <div className="pt-1">
          {product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through mr-2">
              Rs.{product.originalPrice.toLocaleString()}.00 PKR
            </span>
          )}
          <span className="text-sm sm:text-base font-bold text-[#b8860b]">
            Rs.{product.price.toLocaleString()}.00 PKR
          </span>
        </div>
      </div>
    </div>
  );
};
