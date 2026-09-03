import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CartPageProps {
  setCurrentPage: (page: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ setCurrentPage }) => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, openQuickOrder } = useStore();

  const handleOrderCart = () => {
    if (cart.length > 0) {
      openQuickOrder(cart[0].product, cart[0].bundle);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto text-amber-950 border border-amber-300/60 shadow-gold-xs">
          <ShoppingBag className="w-8 h-8 text-[#b8860b]" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-amber-950">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500">There are no items in your shopping cart.</p>
        <div>
          <button
            type="button"
            onClick={() => setCurrentPage('shop')}
            className="px-6 py-3 bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#b8860b] text-white font-bold text-xs rounded-full hover:opacity-95 shadow-gold-xs transition-all cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-baseline justify-between pb-4 border-b border-amber-100">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[#b8860b]" />
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-amber-950">
            Your Cart
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setCurrentPage('shop')}
          className="text-xs text-amber-800 hover:text-[#b8860b] underline font-medium cursor-pointer"
        >
          Continue shopping
        </button>
      </div>

      {/* Cart Table Header */}
      <div className="flex justify-between text-[11px] font-bold tracking-wider text-amber-900/60 uppercase pb-2 border-b border-amber-100">
        <span>PRODUCT</span>
        <span>TOTAL</span>
      </div>

      {/* Cart Items List */}
      <div className="divide-y divide-amber-100">
        {cart.map((item, idx) => {
          const unitPrice = item.bundle ? item.bundle.price : item.product.price;
          const itemTotal = unitPrice * item.quantity;

          return (
            <div
              key={`${item.product.id}-${item.bundle?.id || 'single'}-${idx}`}
              className="py-5 flex items-center justify-between"
            >
              {/* Product Info & Quantity Controls */}
              <div className="flex items-center space-x-3.5 sm:space-x-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#fffdf9] to-[#fef8eb] rounded-2xl overflow-hidden shrink-0 border border-amber-200 p-1 flex items-center justify-center">
                  <span className="absolute top-1 left-1 bg-amber-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.quantity}
                  </span>
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-amber-950 leading-snug">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-amber-800 font-semibold">
                    Rs.{unitPrice.toLocaleString()}.00
                  </p>

                  {/* Quantity bar */}
                  <div className="flex items-center space-x-3 pt-1">
                    <div className="flex items-center border border-amber-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.quantity - 1, item.bundle?.id)
                        }
                        className="px-2.5 py-1 hover:bg-amber-50 text-amber-950 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-2 text-amber-950">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.quantity + 1, item.bundle?.id)
                        }
                        className="px-2.5 py-1 hover:bg-amber-50 text-amber-950 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id, item.bundle?.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <span className="text-sm sm:text-base font-bold text-[#b8860b]">
                  Rs.{itemTotal.toLocaleString()}.00
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtotal & Estimated Total */}
      <div className="pt-6 border-t border-amber-200 space-y-4 text-right">
        <div className="space-y-1 bg-gradient-to-br from-[#fffdfa] to-[#fef8eb] p-4 rounded-2xl border border-amber-200/80">
          <p className="text-sm font-bold text-amber-950 flex justify-between items-center">
            <span>Estimated Total:</span>
            <span className="text-lg text-[#b8860b] font-extrabold">
              Rs.{cartTotal.toLocaleString()}.00 PKR
            </span>
          </p>
          <p className="text-xs text-slate-500 text-right">
            Free shipping across Pakistan. Cash on Delivery supported.
          </p>
        </div>

        {/* Order Now Button */}
        <div>
          <button
            type="button"
            onClick={handleOrderCart}
            className="w-full py-4 bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#b8860b] hover:opacity-95 text-white font-bold text-sm sm:text-base rounded-2xl shadow-gold-md transition-all flex items-center justify-center space-x-2 cursor-pointer border border-amber-200 active:scale-[0.99]"
          >
            <ShoppingBag className="w-5 h-5 text-amber-100" />
            <span>Order Now | Cash on Delivery (Free Shipping)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
