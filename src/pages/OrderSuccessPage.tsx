import React from 'react';
import { CheckCircle2, Truck, Phone, MessageCircle, Home, ShoppingBag, Package } from 'lucide-react';
import { Order } from '../types';
import { useStore } from '../context/StoreContext';

interface OrderSuccessPageProps {
  order: Order;
  setCurrentPage: (page: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ order, setCurrentPage }) => {
  const { settings } = useStore();

  const handleWhatsAppConfirm = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum! Maine Musfira Beauty Cream ka order place kiya hai.\nOrder Number: ${order.orderNumber}\nCustomer: ${order.customerName}\nAmount: Rs. ${order.total}`
    );
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xl text-center space-y-6">
        {/* Big Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Order Confirmed / آرڈر موصول ہو گیا
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-brand text-slate-900">
            Thank You for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Your tracking reference number is{' '}
            <strong className="text-amber-800 font-mono text-base">{order.orderNumber}</strong>
          </p>
        </div>

        {/* Urdu Confirmation Note */}
        <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 text-right space-y-1.5 font-urdu">
          <h3 className="font-bold text-amber-900 text-sm">محترم کسٹمر!</h3>
          <p className="text-xs text-amber-950/80 leading-loose">
            آپ کا آرڈر کامیابی کے ساتھ درج ہو چکا ہے۔ ہمارے نمائندے جلد ہی آپ سے فون پر رابطہ کریں گے اور آپ کا پارسل 2 سے 3 دنوں میں آپ کے پتے پر پہنچ جائے گا۔
          </p>
        </div>

        {/* Order Details Summary */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-left space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Delivery & Customer Summary
          </h4>
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div>
              <span className="text-slate-400 block">Name:</span>
              <strong className="text-slate-900">{order.customerName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Phone:</span>
              <strong className="text-slate-900">{order.phone}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">City:</span>
              <strong className="text-slate-900">{order.city}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Total Payable:</span>
              <strong className="text-amber-800 text-sm">Rs. {order.total.toLocaleString()} (COD)</strong>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200 text-slate-600">
            <span className="text-slate-400 block">Delivery Address:</span>
            <p className="text-slate-800 font-medium">{order.address}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleWhatsAppConfirm}
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>Confirm on WhatsApp / واٹس ایپ پر تصدیق</span>
          </button>

          <button
            onClick={() => setCurrentPage('home')}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home / ہوم پیج</span>
          </button>
        </div>
      </div>
    </div>
  );
};
