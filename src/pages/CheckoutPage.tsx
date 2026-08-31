import React, { useState } from 'react';
import { User, Phone, MapPin, Mail, ShoppingBag, ShieldCheck, Truck, Loader2, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { api } from '../lib/api';
import { BrandAssets } from '../assets/images';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderPlaced: (orderId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onOrderPlaced }) => {
  const { cart, cartTotal, clearCart, showToast } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [nearbyPlace, setNearbyPlace] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-base text-slate-700">Your cart is empty. Please select products first.</p>
        <button onClick={onBack} className="mt-4 px-6 py-2.5 bg-blue-900 text-white rounded-lg text-sm font-bold">
          Go to Store
        </button>
      </div>
    );
  }

  const shippingFee = 0;
  const grandTotal = cartTotal + shippingFee;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) return setErrorMsg('Full Name is required');
    if (!phone.trim() || phone.trim().length < 10) return setErrorMsg('Active 11-digit mobile phone number is required');
    if (!address.trim()) return setErrorMsg('Delivery address is required');
    if (!city.trim()) return setErrorMsg('City name is required');

    try {
      setIsSubmitting(true);
      const itemsPayload = cart.map((item) => ({
        productId: item.productId,
        name: item.selectedBundle ? `${item.product.name} (${item.selectedBundle.name})` : item.product.name,
        price: item.unitPrice,
        quantity: item.quantity,
        image: item.product.images[0] || BrandAssets.creamHero,
        bundleName: item.selectedBundle?.name,
      }));

      const res = await api.createOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: address.trim(),
        nearbyPlace: nearbyPlace.trim() || undefined,
        city: city.trim(),
        notes: notes.trim() || undefined,
        items: itemsPayload,
        subtotal: cartTotal,
        shippingFee: 0,
        total: grandTotal,
        paymentMethod: 'COD',
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });

      clearCart();
      showToast(`Order #${res.order.id} placed successfully!`);
      onOrderPlaced(res.order.id);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <button
        onClick={onBack}
        className="flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-blue-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to cart</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Delivery Information */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-serif-brand font-bold text-slate-900 mb-1">
              Checkout & Delivery Details
            </h2>
            <p className="text-xs text-slate-500">
              Please enter your accurate address to ensure quick courier delivery.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-900">
                <div className="px-3 py-2.5 bg-slate-100 text-slate-500 border-r border-slate-300">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full px-3 py-2.5 text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Active Mobile Phone<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-900">
                <div className="px-3 py-2.5 bg-slate-100 text-slate-500 border-r border-slate-300">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full px-3 py-2.5 text-sm text-slate-900 focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                The courier rider will call this number prior to arrival.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (Optional)
              </label>
              <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-900">
                <div className="px-3 py-2.5 bg-slate-100 text-slate-500 border-r border-slate-300">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2.5 text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Complete Street Address<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-900">
                <div className="px-3 py-2.5 bg-slate-100 text-slate-500 border-r border-slate-300">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #, Street #, Sector / Area"
                  className="w-full px-3 py-2.5 text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nearby Famous Landmark
                </label>
                <input
                  type="text"
                  value={nearbyPlace}
                  onChange={(e) => setNearbyPlace(e.target.value)}
                  placeholder="e.g. Near PSO Pump / Hospital"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore, Karachi, Rawalpindi"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Order Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special delivery instructions, timing preferences, etc."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            {/* Payment Method Badge */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <input type="radio" checked readOnly className="text-blue-900" />
                <span className="text-sm font-bold text-blue-950">Cash on Delivery (COD)</span>
              </div>
              <p className="text-xs text-blue-900/80 mt-1 pl-6">
                Pay safely in cash directly to the delivery rider when your parcel arrives.
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-black hover:bg-slate-900 text-white font-bold text-sm tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-75 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>CONFIRM ORDER - Rs.{grandTotal.toLocaleString()}.00 PKR</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif-brand pb-3 border-b border-slate-100">
              Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h3>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto space-y-3 pt-1">
              {cart.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.images[0] || BrandAssets.creamHero}
                      alt=""
                      className="w-12 h-12 object-cover rounded-lg bg-slate-50 border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 font-serif-brand line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Qty: {item.quantity} {item.selectedBundle ? `(${item.selectedBundle.name})` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 font-serif-brand">
                    Rs.{(item.unitPrice * item.quantity).toLocaleString()}.00
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 font-serif-brand">
                  Rs.{cartTotal.toLocaleString()}.00 PKR
                </span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Shipping Fee</span>
                <span className="font-bold">FREE</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-950">
                <span>Total Due (COD)</span>
                <span className="text-base text-[#1b2b88] font-serif-brand">
                  Rs.{grandTotal.toLocaleString()}.00 PKR
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <Truck className="w-4 h-4 text-blue-900" />
              <span>Express Delivery across Pakistan</span>
            </div>
            <p>
              Your order is packed securely in tamper-evident packaging and dispatched within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
