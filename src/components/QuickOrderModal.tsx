import React, { useState } from 'react';
import { X, User, Phone, MapPin, ShoppingBag, Loader2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { api } from '../lib/api';
import { BrandAssets } from '../assets/images';

interface QuickOrderModalProps {
  onOrderSuccess: (orderId: string) => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({ onOrderSuccess }) => {
  const { quickOrderModal, closeQuickOrder, showToast } = useStore();
  const { isOpen, product, bundle } = quickOrderModal;

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [nearbyPlace, setNearbyPlace] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !product) return null;

  const quantity = 1;
  const itemPrice = bundle ? bundle.price : product.price;
  const shippingFee = 0;
  const totalAmount = itemPrice * quantity + shippingFee;
  const itemImage = product.images[0] || BrandAssets.creamHero;
  const itemDisplayName = bundle ? `${product.name} (${bundle.name})` : product.name;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 10) {
      setErrorMsg('Please enter a valid active mobile phone number');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Please enter your complete delivery address');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('Please enter your city name');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        customerName: name.trim(),
        phone: phoneNumber.trim(),
        address: address.trim(),
        nearbyPlace: nearbyPlace.trim() || undefined,
        city: city.trim(),
        items: [
          {
            productId: product.id,
            name: itemDisplayName,
            price: itemPrice,
            quantity: 1,
            image: itemImage,
            bundleName: bundle?.name,
          },
        ],
        subtotal: itemPrice,
        shippingFee: 0,
        total: totalAmount,
        paymentMethod: 'COD',
      };

      const result = await api.createOrder(orderPayload);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      showToast(`Order #${result.order.id} placed successfully!`);
      closeQuickOrder();
      onOrderSuccess(result.order.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#fafafa] rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header exactly matching screenshot 1 */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
          <h2 className="text-lg sm:text-xl font-medium text-slate-800 font-serif-brand tracking-wide">
            Please fill in the form to order
          </h2>
          <button
            id="close-quick-order-btn"
            onClick={closeQuickOrder}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Product Summary Row matching screenshot 1 */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="relative w-14 h-14 bg-blue-900 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                <img
                  src={itemImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -top-1 -right-1 bg-slate-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                  1
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 font-serif-brand leading-tight">
                  {itemDisplayName}
                </p>
                {bundle?.savingsText && (
                  <span className="text-[11px] text-green-600 font-semibold">{bundle.savingsText}</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-900 font-serif-brand">
                Rs.{itemPrice.toLocaleString()}.00 PKR
              </span>
            </div>
          </div>

          {/* Price Breakdown Box matching screenshot 1 */}
          <div className="bg-slate-100/80 rounded-xl p-3.5 space-y-2 text-sm text-slate-700 border border-slate-200/70">
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900 font-serif-brand">
                Rs.{itemPrice.toLocaleString()}.00 PKR
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping</span>
              <span className="font-semibold text-green-700">Free</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold text-base text-slate-900">
              <span>Total</span>
              <span className="text-slate-950 font-serif-brand text-lg">
                Rs.{totalAmount.toLocaleString()}.00 PKR
              </span>
            </div>
          </div>

          {/* Input Fields matching screenshot 1 */}
          <div className="space-y-3">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Name<span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-transparent">
                <div className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-300 text-slate-600">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="quick-order-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Phone<span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-transparent">
                <div className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-300 text-slate-600">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="quick-order-phone"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Active Phone Number"
                  className="w-full px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Address Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Address<span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-transparent">
                <div className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-300 text-slate-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="quick-order-address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Complete Address"
                  className="w-full px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Nearby Famous Place Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Nearby Famous Place
              </label>
              <div className="relative flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-transparent">
                <div className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-300 text-slate-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="quick-order-nearby"
                  type="text"
                  value={nearbyPlace}
                  onChange={(e) => setNearbyPlace(e.target.value)}
                  placeholder="Nearby Famous Place"
                  className="w-full px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* City Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                City<span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-transparent">
                <div className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-300 text-slate-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="quick-order-city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Main City"
                  className="w-full px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Big Black Button matching screenshot 1 */}
          <div className="pt-2">
            <button
              id="quick-order-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-black hover:bg-slate-900 text-white font-bold text-sm tracking-wider rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-75 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>BUY IT NOW - Rs.{totalAmount.toLocaleString()}.00 PKR</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500 mt-2">
              🛡️ Cash on Delivery • 100% Guaranteed Original Product
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
