import React, { useState } from 'react';
import { X, ShoppingBag, User, Phone, MapPin, Building, Check, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductBundle, Order } from '../types';

interface QuickOrderModalProps {
  onOrderSuccess?: (order: Order) => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({ onOrderSuccess }) => {
  const {
    isQuickOrderOpen,
    quickOrderProduct,
    quickOrderBundle,
    closeQuickOrder,
    placeOrder,
  } = useStore();

  const [selectedBundle, setSelectedBundle] = useState<ProductBundle | undefined>(
    quickOrderBundle || undefined
  );
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [nearbyPlace, setNearbyPlace] = useState('');
  const [city, setCity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  React.useEffect(() => {
    if (quickOrderBundle) {
      setSelectedBundle(quickOrderBundle);
    } else if (quickOrderProduct?.bundles && quickOrderProduct.bundles.length > 0) {
      setSelectedBundle(quickOrderProduct.bundles[0]);
    }
  }, [quickOrderBundle, quickOrderProduct]);

  if (!isQuickOrderOpen || !quickOrderProduct) return null;

  const currentPrice = selectedBundle ? selectedBundle.price : quickOrderProduct.price;
  const deliveryFee = 0; // Free shipping
  const totalPayable = currentPrice + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      alert('Please fill all required fields (Name, Phone, Address, City).');
      return;
    }

    setIsSubmitting(true);
    try {
      const newOrder = await placeOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        nearbyFamousPlace: nearbyPlace.trim(),
        items: [
          {
            productId: quickOrderProduct.id,
            productName: quickOrderProduct.name,
            bundleName: selectedBundle?.name,
            quantity: 1,
            price: currentPrice,
            image: quickOrderProduct.images[0],
          },
        ],
        subtotal: currentPrice,
        deliveryCharges: deliveryFee,
        total: totalPayable,
        paymentMethod: 'cod',
      });

      setIsSubmitting(false);
      setOrderSuccess(newOrder);
      if (onOrderSuccess) {
        onOrderSuccess(newOrder);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setOrderSuccess(null);
    setName('');
    setPhone('');
    setAddress('');
    setNearbyPlace('');
    setCity('');
    closeQuickOrder();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={closeQuickOrder} />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-fade-in my-6 border border-amber-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#fffdf9] via-white to-[#fef8eb] border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#b8860b]" />
            <h2 className="text-sm sm:text-base font-bold text-amber-950">
              Complete Your Order (Cash on Delivery)
            </h2>
          </div>
          <button
            type="button"
            onClick={closeQuickOrder}
            className="p-1.5 text-amber-800 hover:text-amber-950 hover:bg-amber-100/50 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderSuccess ? (
          /* SUCCESS CONFIRMATION */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-full flex items-center justify-center mx-auto shadow-gold-sm">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase">
                Order Placed Successfully!
              </span>
              <h3 className="text-xl font-bold text-amber-950 mt-2 font-serif">
                Thank You for Ordering Musfira!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Tracking Order ID: <span className="font-mono font-bold text-[#b8860b]">{orderSuccess.orderNumber}</span>
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-[#fffdf9] to-[#fef8eb] border border-amber-200 rounded-2xl text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold text-amber-950">{orderSuccess.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-semibold text-amber-950">{orderSuccess.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Address:</span>
                <span className="font-semibold text-amber-950 text-right">{orderSuccess.address}, {orderSuccess.city}</span>
              </div>
              <div className="flex justify-between border-t border-amber-200/80 pt-2 font-bold text-sm">
                <span>Total Amount:</span>
                <span className="text-[#b8860b]">Rs.{orderSuccess.total.toLocaleString()}.00 PKR</span>
              </div>
            </div>

            <p className="font-urdu text-sm text-amber-950 leading-relaxed text-right bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/80 font-medium" dir="rtl">
              ✨ آپ کا آرڈر درج ہو چکا ہے۔ ہمارا نمائندہ جلد فون یا واٹس ایپ پر رابطہ کر کے تصدیق کرے گا۔ شکریہ!
            </p>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3.5 bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#b8860b] hover:opacity-95 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-gold-sm"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* FORM VIEW */
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
            {/* Product Item Preview */}
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div className="flex items-center space-x-3">
                <div className="relative w-14 h-14 bg-gradient-to-br from-amber-50 to-amber-100/60 rounded-xl overflow-hidden border border-amber-200 p-1 flex items-center justify-center">
                  <span className="absolute top-0.5 left-0.5 bg-amber-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    1
                  </span>
                  <img
                    src={quickOrderProduct.images[0]}
                    alt={quickOrderProduct.name}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-950 leading-tight">
                    {quickOrderProduct.name}
                  </h4>
                  {selectedBundle && (
                    <span className="text-xs text-amber-800 font-medium">
                      {selectedBundle.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-[#b8860b]">
                  Rs.{currentPrice.toLocaleString()}.00 PKR
                </span>
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 pb-2 border-b border-amber-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">Rs.{currentPrice.toLocaleString()}.00 PKR</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-bold text-emerald-700">Free (Pakistan-wide)</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-amber-950 pt-1">
                <span>Total Payable</span>
                <span className="text-base text-[#b8860b]">Rs.{totalPayable.toLocaleString()}.00 PKR</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 pt-1">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Full Name (نام)*
                </label>
                <div className="flex rounded-xl border border-amber-200 overflow-hidden focus-within:border-[#b8860b] focus-within:ring-2 focus-within:ring-amber-200 bg-white shadow-2xs">
                  <div className="bg-amber-50 px-3 py-2 flex items-center justify-center border-r border-amber-200 text-amber-800">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Mobile / WhatsApp Number (فون نمبر)*
                </label>
                <div className="flex rounded-xl border border-amber-200 overflow-hidden focus-within:border-[#b8860b] focus-within:ring-2 focus-within:ring-amber-200 bg-white shadow-2xs">
                  <div className="bg-amber-50 px-3 py-2 flex items-center justify-center border-r border-amber-200 text-amber-800">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="03001234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Complete Delivery Address (مکمل پتہ)*
                </label>
                <div className="flex rounded-xl border border-amber-200 overflow-hidden focus-within:border-[#b8860b] focus-within:ring-2 focus-within:ring-amber-200 bg-white shadow-2xs">
                  <div className="bg-amber-50 px-3 py-2 flex items-center justify-center border-r border-amber-200 text-amber-800">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="House / Flat #, Street #, Area"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              {/* Nearby Famous Place */}
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Nearby Landmark / Famous Place (مشہور جگہ)
                </label>
                <div className="flex rounded-xl border border-amber-200 overflow-hidden focus-within:border-[#b8860b] focus-within:ring-2 focus-within:ring-amber-200 bg-white shadow-2xs">
                  <div className="bg-amber-50 px-3 py-2 flex items-center justify-center border-r border-amber-200 text-amber-800">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Near Main Mosque / Hospital"
                    value={nearbyPlace}
                    onChange={(e) => setNearbyPlace(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  City (شہر کا نام)*
                </label>
                <div className="flex rounded-xl border border-amber-200 overflow-hidden focus-within:border-[#b8860b] focus-within:ring-2 focus-within:ring-amber-200 bg-white shadow-2xs">
                  <div className="bg-amber-50 px-3 py-2 flex items-center justify-center border-r border-amber-200 text-amber-800">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lahore, Karachi, Rawalpindi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Buy Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#b8860b] hover:opacity-95 text-white font-bold text-sm sm:text-base rounded-2xl shadow-gold-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 border border-amber-200 active:scale-[0.99]"
              >
                <ShoppingBag className="w-5 h-5 text-amber-100" />
                <span>
                  {isSubmitting ? 'Processing Order...' : `COMPLETE ORDER - Rs.${totalPayable.toLocaleString()}.00 PKR`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
