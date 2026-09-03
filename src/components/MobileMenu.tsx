import React from 'react';
import { X, Home, ShoppingBag, Truck, Phone, ShieldCheck, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  currentPage,
  setCurrentPage,
}) => {
  const { settings } = useStore();

  if (!isOpen) return null;

  const handleNav = (page: string) => {
    setCurrentPage(page);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10 animate-slide-right">
        {/* Header */}
        <div className="p-4 border-b border-amber-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-serif-brand font-bold text-base">
              M
            </div>
            <div>
              <span className="font-serif-brand font-bold text-slate-900 text-sm">MUSFIRA</span>
              <span className="block text-[9px] uppercase tracking-wider text-amber-700 font-semibold">Skincare</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="p-4 space-y-1 flex-1 overflow-y-auto">
          <button
            onClick={() => handleNav('home')}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentPage === 'home'
                ? 'bg-amber-100/80 text-amber-900 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4 text-amber-600" />
            <span>Home (ہوم)</span>
          </button>

          <button
            onClick={() => handleNav('shop')}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentPage === 'shop'
                ? 'bg-amber-100/80 text-amber-900 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <span>All Products (تمام پراڈکٹس)</span>
          </button>

          <button
            onClick={() => handleNav('track')}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentPage === 'track'
                ? 'bg-amber-100/80 text-amber-900 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-4 h-4 text-amber-600" />
            <span>Track Order (آرڈر ٹریک کریں)</span>
          </button>

          <button
            onClick={() => handleNav('contact')}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-colors ${
              currentPage === 'contact'
                ? 'bg-amber-100/80 text-amber-900 font-bold'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Phone className="w-4 h-4 text-amber-600" />
            <span>Contact & Support (رابطہ)</span>
          </button>

          <div className="pt-4 border-t border-slate-100 my-2">
            <button
              onClick={() => handleNav('admin')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center space-x-2 text-emerald-700 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Guaranteed Results</span>
          </div>
          <p className="text-[11px] text-slate-500 font-urdu text-right">
            کیش آن ڈیلیوری پورے پاکستان میں دستیاب ہے۔
          </p>
        </div>
      </div>
    </div>
  );
};
