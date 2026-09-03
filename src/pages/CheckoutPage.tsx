import React, { useState } from 'react';
import { Truck, ShieldCheck, User, Phone, MapPin, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

interface CheckoutPageProps {
  onOrderSuccess: (order: Order) => void;
  setCurrentPage: (page: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, setCurrentPage }) => {
  const { cart, cartTotal, settings, placeOrder, clearCart } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isFreeDelivery = cartTotal >= settings.freeDeliveryThreshold;
  const deliveryCharges = cart.length === 0 ? 0 : isFreeDelivery ? 0 : settings.deliveryFee;
  const grandTotal = cartTotal + deliveryCharges;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('براہ کرم اپنا نام درج کریں۔');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('براہ کرم درست 11 ہندسوں کا موبائل نمبر درج کریں۔');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('براہ کرم اپنا شہر درج کریں۔');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('براہ کرم مکمل پتہ درج کریں۔');
      return;
    }

    try {
      setIsSubmitting(true);
      const newOrder = await placeOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        notes: notes.trim() || undefined,
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          bundleName: item.bundle?.name,
          quantity: item.quantity,
          price: item.bundle ? item.bundle.price : item.product.price,
          image: item.product.images?.[0],
        })),
        subtotal: cartTotal,
        deliveryCharges,
        total: grandTotal,
        paymentMethod: 'cod',
      });

      clearCart();
      onOrderSuccess(newOrder);
    } catch (err: any) {
      setErrorMsg(err.message || 'Order failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        onClick={() => setCurrentPage('cart')}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-amber-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Cart / کارٹ پر واپس جائیں</span>
      </button>

      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-brand text-slate-900">
          Delivery & Checkout Form
        </h1>
        <p className="font-urdu text-sm text-amber-900/90 mt-1">
          کیش آن ڈیلیوری کے لیے اپنی معلومات درج کریں
        </p>
      </div>

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Customer Information
          </h2>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name (آپ کا مکمل نام) *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                placeholder="e.g. Ayesha Khan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number (موبائل نمبر) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="tel"
                  required
                  placeholder="03001234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City (شہر) *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Lahore / Karachi"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Complete Delivery Address (مکمل پتہ) *
            </label>
            <textarea
              required
              rows={3}
              placeholder="House Number, Street Name, Sector/Colony, City"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Special Delivery Instructions (اختیاری نوٹ)
            </label>
            <input
              type="text"
              placeholder="e.g. Call before delivery or deliver after 2 PM"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Right: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Payment & Summary
            </h2>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-2.5 text-xs text-emerald-800 font-bold">
              <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Cash on Delivery (ادائیگی پارسل ملنے پر)</span>
            </div>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.length} items):</span>
                <span className="font-bold text-slate-900">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery:</span>
                <span className="font-bold text-emerald-700">
                  {deliveryCharges === 0 ? 'FREE (مفت)' : `Rs. ${deliveryCharges}`}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Payable:</span>
                <span className="text-2xl font-black text-amber-800">
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-600/30 active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 fill-white text-amber-800" />
                  <span>آرڈر مکمل کریں (Confirm Order)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
