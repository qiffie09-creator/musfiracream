import React, { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle, Truck, Package, Clock, Home, Copy, Check } from 'lucide-react';
import { Order } from '../types';
import { api } from '../lib/api';
import { useStore } from '../context/StoreContext';

interface OrderSuccessPageProps {
  orderId: string;
  onContinueShopping: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId, onContinueShopping }) => {
  const { settings, showToast } = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await api.getOrder(orderId);
        setOrder(data);
      } catch (e) {
        console.error('Could not fetch order:', e);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const rawWa = settings?.whatsappNumber || '923001234567';
  const cleanWa = rawWa.replace(/[^0-9]/g, '');
  const waMsg = encodeURIComponent(
    `Assalam o Alaikum! I placed Order #${orderId} on Musfira Beauty Cream. Total: Rs.${order?.total || 1499} PKR.`
  );
  const whatsappUrl = `https://wa.me/${cleanWa}?text=${waMsg}`;

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    showToast('Order ID copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm text-center space-y-6">
        {/* Success Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            Order Received Successfully
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif-brand font-bold text-slate-900 mt-1">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-sans">
            Our team will call or WhatsApp you shortly to confirm your delivery address and dispatch your parcel.
          </p>
        </div>

        {/* Order ID Box */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[11px] text-slate-400 font-semibold block uppercase">Order Reference</span>
            <span className="text-lg font-mono font-bold text-[#1b2b88]">{orderId}</span>
          </div>
          <button
            onClick={copyOrderId}
            className="p-2 text-slate-500 hover:text-blue-900 rounded-lg hover:bg-slate-200 transition-colors flex items-center space-x-1 text-xs font-medium"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Tracking Status Timeline */}
        <div className="text-left p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
          <h4 className="text-xs font-bold text-[#1b2b88] uppercase tracking-wider">Order Status</h4>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <div className="flex items-center space-x-1.5 text-emerald-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>1. Order Placed</span>
            </div>
            <div className="flex items-center space-x-1.5 text-blue-900">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span>2. Confirmation Call</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              <span>3. Dispatch (COD)</span>
            </div>
          </div>
        </div>

        {/* Order Details summary if available */}
        {order && (
          <div className="text-left border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600 font-sans">
            <div className="flex justify-between">
              <span className="font-semibold">Customer:</span>
              <span>{order.customerName} ({order.phone})</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Delivery City:</span>
              <span>{order.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Payment:</span>
              <span className="font-bold text-slate-900">Cash on Delivery (Rs.{order.total.toLocaleString()} PKR)</span>
            </div>
          </div>
        )}

        {/* Quick WhatsApp Confirmation Button */}
        <div className="pt-2 space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-[0.99]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Confirm Instant on WhatsApp</span>
          </a>

          <button
            onClick={onContinueShopping}
            className="w-full py-3 px-6 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Return to Store</span>
          </button>
        </div>
      </div>
    </div>
  );
};
