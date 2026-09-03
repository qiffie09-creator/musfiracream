import React, { useState } from 'react';
import { X, ShoppingBag, User, Phone, MapPin, Building, Check, Sparkles, Navigation, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductBundle, Order } from '../types';

interface QuickOrderModalProps {
  onOrderSuccess?: (order: Order) => void;
}

const PAKISTAN_PROVINCES = [
  'Punjab (پنجاب)',
  'Sindh (سندھ)',
  'Khyber Pakhtunkhwa (خیبر پختونخوا)',
  'Balochistan (بلوچستان)',
  'Islamabad Capital Territory (اسلام آباد)',
  'Azad Jammu & Kashmir (آزاد کشمیر)',
  'Gilgit-Baltistan (گلگت بلتستان)',
];

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
  const [alternatePhone, setAlternatePhone] = useState('');
  const [province, setProvince] = useState('Punjab (پنجاب)');
  const [city, setCity] = useState('');
  const [areaSector, setAreaSector] = useState('');
  const [address, setAddress] = useState('');
  const [nearbyPlace, setNearbyPlace] = useState('');
  const [notes, setNotes] = useState('');
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
    if (!name.trim() || !phone.trim() || !city.trim() || !address.trim() || !province.trim()) {
      alert('Please fill all required fields (Name, Phone, Province, City, and Complete Address).');
      return;
    }

    setIsSubmitting(true);
    try {
      const newOrder = await placeOrder({
        customerName: name.trim(),
        phone: phone.trim(),
        alternatePhone: alternatePhone.trim() || undefined,
        province: province.trim(),
        city: city.trim(),
        areaSector: areaSector.trim() || undefined,
        address: address.trim(),
        nearbyFamousPlace: nearbyPlace.trim() || undefined,
        notes: notes.trim() || undefined,
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
    setAlternatePhone('');
    setProvince('Punjab (پنجاب)');
    setCity('');
    setAreaSector('');
    setAddress('');
    setNearbyPlace('');
    setNotes('');
    closeQuickOrder();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={closeQuickOrder} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-fade-in my-6 border border-amber-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#fffdf9] via-white to-[#fef8eb] border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#b8860b]" />
            <h2 className="text-sm sm:text-base font-bold text-amber-950">
              Complete Your Order (اپنا آرڈر مکمل کریں)
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
              {orderSuccess.alternatePhone && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Alt Phone:</span>
                  <span className="font-semibold text-amber-950">{orderSuccess.alternatePhone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-semibold text-amber-950 text-right">
                  {orderSuccess.city}, {orderSuccess.province || ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Street Address:</span>
                <span className="font-semibold text-amber-950 text-right max-w-[220px]">
                  {orderSuccess.address}
                  {orderSuccess.areaSector ? `, ${orderSuccess.areaSector}` : ''}
                </span>
              </div>
              {orderSuccess.nearbyFamousPlace && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Landmark:</span>
                  <span className="font-semibold text-amber-950 text-right">{orderSuccess.nearbyFamousPlace}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-amber-200/80 pt-2 font-bold text-sm">
                <span>Total Amount:</span>
                <span className="text-[#b8860b]">Rs.{orderSuccess.total.toLocaleString()}.00 PKR</span>
              </div>
            </div>

            <p className="font-urdu text-sm text-amber-950 leading-relaxed text-right bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/80 font-medium" dir="rtl">
              ✨ آپ کا آرڈر درج ہو چکا ہے۔ ہمارا نمائندہ جلد فون یا واٹس ایپ پر رابطہ کر کے پارسل ڈسپیچ کی تصدیق کرے گا۔ شکریہ!
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
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[82vh] overflow-y-auto">
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
                <span>Shipping Fee</span>
                <span className="font-bold text-emerald-700">Free (Pakistan-wide)</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-amber-950 pt-1">
                <span>Total Payable Amount</span>
                <span className="text-base text-[#b8860b]">Rs.{totalPayable.toLocaleString()}.00 PKR</span>
              </div>
            </div>

            {/* Form Fields: Comprehensive Pakistan Delivery Details */}
            <div className="space-y-3 pt-1">
              <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-[#b8860b] mr-1" />
                  Courier Delivery Address (ڈیلیوری کا تفصیلی پتہ)
                </span>
                <span className="text-[10px] text-amber-800 font-medium">All Pakistan Delivery</span>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Full Name (خریدار کا پورا نام)*
                </label>
                <div className="flex rounded-xl border border-amber-200 overflow-hidden focus-within:border-[#b8860b] focus-within:ring-2 focus-within:ring-amber-200 bg-white shadow-2xs">
                  <div className="bg-amber-50 px-3 py-2 flex items-center justify-center border-r border-amber-200 text-amber-800">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your complete full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              {/* Phone Numbers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Primary Phone */}
                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    Mobile / WhatsApp # (موبائل نمبر)*
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

                {/* Alternate Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alternate Phone (دوسرا فون نمبر - اختیاری)
                  </label>
                  <div className="flex rounded-xl border border-amber-200 overflow-hidden focus-within:border-[#b8860b] focus-within:ring-2 focus-within:ring-amber-200 bg-white shadow-2xs">
                    <div className="bg-amber-50 px-3 py-2 flex items-center justify-center border-r border-amber-200 text-amber-800">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      placeholder="03211234567 (optional)"
                      value={alternatePhone}
                      onChange={(e) => setAlternatePhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Province & City Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Province Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    Province / Region (صوبہ)*
                  </label>
                  <div className="flex rounded-xl border border-amber-200 overflow-hidden focus-within:border-[#b8860b] focus-within:ring-2 focus-within:ring-amber-200 bg-white shadow-2xs">
                    <div className="bg-amber-50 px-3 py-2 flex items-center justify-center border-r border-amber-200 text-amber-800">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none text-slate-900 cursor-pointer"
                    >
                      {PAKISTAN_PROVINCES.map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    City / Town (شہر کا نام)*
                  </label>
                  <div className="flex rounded-xl border border-amber-200 overflow-hidden focus-within:border-[#b8860b] focus-within:ring-2 focus-within:ring-amber-200 bg-white shadow-2xs">
                    <div className="bg-amber-50 px-3 py-2 flex items-center justify-center border-r border-amber-200 text-amber-800">
                      <Building className="w-4 h-4" />
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

              {/* Area / Sector / Colony */}
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Sector / Colony / Mohallah (علاقہ / سیکٹر / فیز / محلہ)
                </label>
                <div className="flex rounded-xl border border-amber-200 overflow-hidden focus-within:border-[#b8860b] focus-within:ring-2 focus-within:ring-amber-200 bg-white shadow-2xs">
                  <div className="bg-amber-50 px-3 py-2 flex items-center justify-center border-r border-amber-200 text-amber-800">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. DHA Phase 5, Gulshan Block 13, Satellite Town"
                    value={areaSector}
                    onChange={(e) => setAreaSector(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              {/* Complete Street / House Address */}
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  House / Flat #, Street # / Road (مکمل گلی اور مکان کا پتہ)*
                </label>
                <div className="flex rounded-xl border border-amber-200 overflow-hidden focus-within:border-[#b8860b] focus-within:ring-2 focus-within:ring-amber-200 bg-white shadow-2xs">
                  <div className="bg-amber-50 px-3 py-2 flex items-center justify-center border-r border-amber-200 text-amber-800">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="House / Plot / Flat #, Street # / Lane #"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              {/* Nearby Famous Place / Landmark */}
              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Nearby Famous Place / Landmark (مشہور قریبی نشان یا جگہ)*
                </label>
                <div className="flex rounded-xl border border-amber-200 overflow-hidden focus-within:border-[#b8860b] focus-within:ring-2 focus-within:ring-amber-200 bg-white shadow-2xs">
                  <div className="bg-amber-50 px-3 py-2 flex items-center justify-center border-r border-amber-200 text-amber-800">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Near Bilal Masjid, Opposite Civil Hospital, Behind Shell Pump"
                    value={nearbyPlace}
                    onChange={(e) => setNearbyPlace(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              {/* Delivery Instructions / Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Instructions / Notes (ڈیلیوری کے متعلق خاص ہدایات - اختیاری)
                </label>
                <div className="flex rounded-xl border border-amber-200 overflow-hidden focus-within:border-[#b8860b] focus-within:ring-2 focus-within:ring-amber-200 bg-white shadow-2xs">
                  <div className="bg-amber-50 px-3 py-2 flex items-center justify-center border-r border-amber-200 text-amber-800">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Call before delivery, deliver in afternoon"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white focus:outline-none text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Order Now Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="quick-order-submit-btn"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#b8860b] hover:opacity-95 text-white font-extrabold text-sm sm:text-base rounded-full shadow-gold-pulse animate-luxury-shake transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 border-2 border-amber-200 active:scale-[0.99]"
              >
                <ShoppingBag className="w-5 h-5 text-amber-100" />
                <span>
                  {isSubmitting ? 'Processing Order...' : `ORDER NOW (ابھی آرڈر کریں) • Rs.${totalPayable.toLocaleString()}.00 PKR`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
