import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandAssets } from '../assets/images';

interface CartPageProps {
  setCurrentView: (view: string) => void;
  onProceedCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ setCurrentView, onProceedCheckout }) => {
  const { cart, updateCartQuantity, removeFromCart, cartTotal, clearCart } = useStore();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-blue-50 text-[#1b2b88] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-serif-brand font-bold text-slate-900 mb-3">Your cart is empty</h2>
        <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
          Explore our collection of authentic, 100% steroid-free skincare formulas with free delivery across Pakistan.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="py-3.5 px-8 bg-[#1b2b88] hover:bg-blue-950 text-white font-bold text-sm rounded-full shadow-lg transition-all"
        >
          Explore All Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Title & Continue Shopping matching screenshot 2 */}
      <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-slate-200">
        <h1 className="font-serif-brand text-3xl sm:text-4xl font-medium text-slate-900 tracking-tight">
          Your cart
        </h1>
        <button
          onClick={() => setCurrentView('shop')}
          className="text-xs sm:text-sm font-semibold text-blue-900 hover:underline flex items-center space-x-1"
        >
          <span>Continue shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table Header matching screenshot 2 */}
      <div className="hidden sm:grid grid-cols-12 text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
        <div className="col-span-8">PRODUCT</div>
        <div className="col-span-4 text-right">TOTAL</div>
      </div>

      {/* Cart Items List matching screenshot 2 */}
      <div className="divide-y divide-slate-100 mb-8">
        {cart.map((item) => {
          const itemImage = item.product.images[0] || BrandAssets.creamHero;
          const itemTotal = item.unitPrice * item.quantity;
          const bundleId = item.selectedBundle?.id;

          return (
            <div key={`${item.productId}-${bundleId || 'default'}`} className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Product Info */}
              <div className="flex items-center space-x-4 flex-1">
                <img
                  src={itemImage}
                  alt={item.product.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl bg-slate-50 border border-slate-100 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <h3 className="font-serif-brand text-base sm:text-lg font-bold text-[#1b2b88] leading-snug">
                    {item.product.name}
                  </h3>
                  {item.selectedBundle && (
                    <p className="text-xs font-semibold text-slate-500">
                      Pack: <span className="text-slate-800">{item.selectedBundle.name}</span>
                    </p>
                  )}
                  <p className="text-xs sm:text-sm font-serif-brand font-medium text-slate-700">
                    Rs.{item.unitPrice.toLocaleString()}.00 PKR
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Total */}
              <div className="flex items-center justify-between sm:justify-end sm:space-x-8">
                {/* Quantity box [ -  1  + ] matching screenshot 2 */}
                <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-xs">
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.quantity - 1, bundleId)}
                    className="p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.productId, item.quantity + 1, bundleId)}
                    className="p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right flex items-center space-x-3">
                  <span className="font-serif-brand font-bold text-base sm:text-lg text-slate-900">
                    Rs.{itemTotal.toLocaleString()}.00 PKR
                  </span>
                  <button
                    onClick={() => removeFromCart(item.productId, bundleId)}
                    className="text-slate-400 hover:text-red-500 p-1.5 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary matching screenshot 2 */}
      <div className="pt-6 border-t border-slate-200 flex flex-col items-end text-right space-y-3">
        <div className="flex items-baseline space-x-4">
          <span className="text-sm font-semibold text-slate-600">Estimated total</span>
          <span className="text-2xl sm:text-3xl font-serif-brand font-bold text-[#1b2b88]">
            Rs.{cartTotal.toLocaleString()}.00 PKR
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Taxes, discounts and shipping calculated at checkout (Free Cash on Delivery).
        </p>

        {/* Big CTA button matching screenshot 2 */}
        <div className="w-full sm:w-auto pt-4">
          <button
            id="cart-checkout-btn"
            onClick={onProceedCheckout}
            className="w-full sm:w-80 py-4 px-6 rounded-full bg-gradient-to-r from-[#2952ff] to-[#1e90ff] hover:from-blue-700 hover:to-blue-600 text-white font-bold text-center shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all flex flex-col items-center justify-center cursor-pointer"
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
    </div>
  );
};
