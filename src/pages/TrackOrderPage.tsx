import React, { useState } from 'react';
import { Search, Package, Clock, CheckCircle, Truck, XCircle, MapPin, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';

export const TrackOrderPage: React.FC = () => {
  const { orders } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === query ||
        o.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '')
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmed / تصدیق شدہ', color: 'bg-blue-100 text-blue-800' };
      case 'dispatched':
        return { label: 'Dispatched / روانہ کر دیا گیا', color: 'bg-amber-100 text-amber-800' };
      case 'delivered':
        return { label: 'Delivered / پہنچا دیا گیا', color: 'bg-emerald-100 text-emerald-800' };
      case 'cancelled':
        return { label: 'Cancelled / منسوخ', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Pending Verification / زیرِ تصدیق', color: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-brand text-slate-900">
          Track Your Musfira Order
        </h1>
        <p className="font-urdu text-base text-amber-900/90">
          اپنا آرڈر نمبر یا موبائل نمبر درج کر کے لائیو اسٹیٹس چیک کریں
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto">
        <div className="flex rounded-2xl bg-white border-2 border-slate-200 focus-within:border-amber-500 overflow-hidden shadow-sm">
          <input
            id="track-order-search-input"
            type="text"
            required
            placeholder="Order Number (e.g. MSF-1234) or Phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 text-xs sm:text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Result */}
      {hasSearched && (
        <div className="mt-8">
          {searchedOrder ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs text-slate-400">Order Number</span>
                  <h3 className="font-bold text-lg text-slate-900 font-mono">
                    {searchedOrder.orderNumber}
                  </h3>
                </div>

                <span
                  className={`mt-2 sm:mt-0 text-xs font-bold px-3 py-1 rounded-full ${
                    getStatusBadge(searchedOrder.status).color
                  }`}
                >
                  {getStatusBadge(searchedOrder.status).label}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Customer Name:</span>
                  <strong className="text-slate-900">{searchedOrder.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">City & Destination:</span>
                  <strong className="text-slate-900">{searchedOrder.city}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Payable:</span>
                  <strong className="text-amber-800 font-bold">
                    Rs. {searchedOrder.total.toLocaleString()} (COD)
                  </strong>
                </div>
              </div>

              {searchedOrder.courierName && (
                <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900">
                  <span>Courier Service: </span>
                  <strong>{searchedOrder.courierName}</strong>
                  {searchedOrder.trackingNumber && (
                    <span className="ml-2 font-mono">
                      (Tracking # {searchedOrder.trackingNumber})
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
              <XCircle className="w-10 h-10 text-red-400 mx-auto" />
              <h3 className="font-bold text-slate-900 text-sm">No Order Found</h3>
              <p className="text-xs text-slate-500 font-urdu">
                اس نمبر کے ساتھ کوئی آرڈر نہیں ملا۔ براہ کرم اپنا آرڈر نمبر یا موبائل نمبر دوبارہ چیک کریں۔
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
