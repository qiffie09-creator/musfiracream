import React, { useState } from 'react';
import { Search, Package, Clock, CheckCircle2, Truck, AlertCircle, Loader2 } from 'lucide-react';
import { Order } from '../types';
import { api } from '../lib/api';

export const TrackOrderPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setNotFound(false);
      const clean = query.trim();
      const res = await api.getOrder(clean);
      if (res) {
        setOrder(res);
      } else {
        setNotFound(true);
        setOrder(null);
      }
    } catch {
      setNotFound(true);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (status: string) => {
    const sequence = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIdx = sequence.indexOf(status.toLowerCase());
    return currentIdx >= 0 ? currentIdx : 0;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#1b2b88]">
          Musfira Logistics & Courier Tracking
        </span>
        <h1 className="text-3xl font-serif-brand font-bold text-slate-900 mt-1">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 font-sans">
          Enter your Order Reference ID (e.g. MSF-94821) to check live status.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleTrack} className="flex gap-2 max-w-lg mx-auto mb-8">
        <input
          type="text"
          required
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. MSF-94821"
          className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 uppercase font-mono"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#1b2b88] hover:bg-blue-950 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center space-x-1.5"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span>Track</span>
        </button>
      </form>

      {/* Results */}
      {notFound && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-xs text-red-700 space-y-1">
          <AlertCircle className="w-6 h-6 mx-auto text-red-500 mb-1" />
          <p className="font-bold">No Order Found matching "{query}"</p>
          <p>Please double-check your Order Reference ID or contact our WhatsApp helpline.</p>
        </div>
      )}

      {order && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Order ID</span>
              <h3 className="text-xl font-mono font-bold text-[#1b2b88]">{order.id}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-900 rounded-full capitalize">
                Status: {order.orderStatus}
              </span>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full capitalize">
                Payment: {order.paymentStatus}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="space-y-2">
            <div className="grid grid-cols-5 text-center text-[10px] sm:text-xs font-semibold text-slate-600 gap-1">
              <span className={getStepStatus(order.orderStatus) >= 0 ? 'text-emerald-700 font-bold' : ''}>Placed</span>
              <span className={getStepStatus(order.orderStatus) >= 1 ? 'text-emerald-700 font-bold' : ''}>Confirmed</span>
              <span className={getStepStatus(order.orderStatus) >= 2 ? 'text-emerald-700 font-bold' : ''}>Packed</span>
              <span className={getStepStatus(order.orderStatus) >= 3 ? 'text-emerald-700 font-bold' : ''}>Shipped</span>
              <span className={getStepStatus(order.orderStatus) >= 4 ? 'text-emerald-700 font-bold' : ''}>Delivered</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                style={{ width: `${((getStepStatus(order.orderStatus) + 1) / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 pt-2 border-t border-slate-100">
            <div>
              <span className="font-bold text-slate-900 block mb-1">Customer & Address:</span>
              <p>{order.customerName}</p>
              <p>{order.phone}</p>
              <p>{order.address}, {order.city}</p>
            </div>
            <div>
              <span className="font-bold text-slate-900 block mb-1">Order Items & Amount:</span>
              <p>{order.items.map((it) => `${it.name} x${it.quantity}`).join(', ')}</p>
              <p className="font-bold text-[#1b2b88] mt-1">Total: Rs.{order.total.toLocaleString()}.00 PKR (COD)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
