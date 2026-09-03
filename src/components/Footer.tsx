import React, { useState } from 'react';
import { X, Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandAssets } from '../assets/images';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const { products, openQuickOrder } = useStore();
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  // Main Homepage Product: Musfira Beauty Cream
  const mainProduct =
    products.find(
      (p) => p.id === 'prod_musfira_cream' || p.id === 'prod_wiki_cream' || p.slug?.includes('musfira')
    ) || products[0];

  const handleOrderMusfira = () => {
    if (mainProduct) {
      const bestBundle =
        mainProduct.bundles?.find((b) => b.isDefault) ||
        mainProduct.bundles?.[1] ||
        mainProduct.bundles?.[0];
      openQuickOrder(mainProduct, bestBundle);
    }
  };

  const policyContent: Record<string, { title: string; body: string }> = {
    privacy: {
      title: 'Privacy Policy',
      body: 'Musfira Beauty Cream is committed to ensuring that your privacy is protected. Any personal information (name, phone number, shipping address) provided during checkout is solely used for order dispatch, courier coordination, and customer support. We never sell or share your personal data with unauthorized third parties.',
    },
    refund: {
      title: 'Refund Policy',
      body: 'We offer a 7-day replacement or refund guarantee on damaged or defective items delivered. If you receive a compromised package, please contact our support team on WhatsApp within 48 hours of delivery with your order ID and unboxing photo.',
    },
    terms: {
      title: 'Terms of Service',
      body: 'By placing an order on Musfira Beauty Cream, you agree to receive order confirmation calls/messages from our dispatch team and pay the declared Cash on Delivery amount upon parcel delivery.',
    },
    contact: {
      title: 'Contact Information',
      body: 'Customer Care WhatsApp: 0300-1234567\nEmail: musfirabeautycream@gmail.com\nWorking Hours: Monday - Saturday (9:00 AM - 9:00 PM PKT)',
    },
    shipping: {
      title: 'Shipping Policy',
      body: 'We provide Free Cash on Delivery shipping across all major cities, towns, and villages in Pakistan. Standard delivery time is 2 to 4 working days via express courier services (TCS, Leopards, Call Courier, Trax).',
    },
  };

  return (
    <>
      <footer className="bg-[#fffdfa] border-t border-amber-100 py-10 text-center text-xs text-amber-900/80">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {/* Shaking Order Now CTA for Homepage Product in Footer */}
          {mainProduct && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#fff9eb] via-[#fffdfa] to-[#fef6e2] border-2 border-amber-300/90 rounded-3xl shadow-gold-sm max-w-xl mx-auto text-left">
              <div className="flex items-center space-x-3.5 mb-3">
                <div className="relative w-14 h-14 rounded-2xl bg-white p-1 border border-amber-300 shrink-0 shadow-xs">
                  <img
                    src={mainProduct.images?.[0] || BrandAssets.musfiraCreamMain}
                    alt={mainProduct.name}
                    className="w-full h-full object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -top-1.5 -right-1.5 bg-[#b8860b] text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                    ORIGINAL
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#b8860b]">
                      Musfira Special Offer
                    </span>
                    <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                      In Stock
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-amber-950 truncate">
                    {mainProduct.name}
                  </h4>
                  <p className="font-urdu text-xs text-amber-900 font-bold">
                    {mainProduct.urduName || 'مسفرا بیوٹی کریم - مفت ہوم ڈیلیوری'}
                  </p>
                  <p className="text-xs text-slate-600 flex items-center space-x-1.5 mt-0.5">
                    <span className="font-bold text-[#b8860b] text-sm">
                      Rs. {mainProduct.price.toLocaleString()} PKR
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">Free Express Shipping</span>
                  </p>
                </div>
              </div>

              {/* Shaking Order Now Button */}
              <button
                type="button"
                id="footer-order-now-shaking-btn"
                onClick={handleOrderMusfira}
                className="w-full py-3.5 bg-gradient-to-r from-[#996515] via-[#d4af37] to-[#b8860b] text-white font-extrabold text-sm sm:text-base rounded-full shadow-gold-pulse animate-luxury-shake hover:opacity-95 transition-all flex items-center justify-center space-x-2 border-2 border-amber-200 cursor-pointer active:scale-[0.99]"
              >
                <ShoppingBag className="w-5 h-5 text-amber-100" />
                <span className="tracking-wide">
                  ORDER NOW (ابھی آرڈر کریں)
                </span>
              </button>

              <div className="flex items-center justify-center space-x-4 mt-2.5 text-[11px] text-amber-900/75">
                <span className="flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                  100% Herbal
                </span>
                <span>•</span>
                <span>7 Days Return Guarantee</span>
                <span>•</span>
                <span>TCS / Leopards Courier</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center space-x-2 text-[#b8860b]">
            <Sparkles className="w-4 h-4" />
            <span className="font-serif font-bold text-sm tracking-wider">MUSFIRA BEAUTY CREAM</span>
            <Sparkles className="w-4 h-4" />
          </div>

          {/* Policy Links list */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-slate-600">
            <span>© 2026, Musfira Beauty Cream</span>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActivePolicy('privacy')}
              className="hover:text-[#b8860b] hover:underline cursor-pointer"
            >
              Privacy policy
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActivePolicy('refund')}
              className="hover:text-[#b8860b] hover:underline cursor-pointer"
            >
              Refund policy
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActivePolicy('terms')}
              className="hover:text-[#b8860b] hover:underline cursor-pointer"
            >
              Terms of service
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActivePolicy('contact')}
              className="hover:text-[#b8860b] hover:underline cursor-pointer"
            >
              Contact information
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActivePolicy('shipping')}
              className="hover:text-[#b8860b] hover:underline cursor-pointer"
            >
              Shipping policy
            </button>
          </div>
        </div>
      </footer>

      {/* Policy Modal */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl relative animate-fade-in space-y-4 border border-amber-200">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <h3 className="font-serif font-bold text-lg text-amber-950">
                {policyContent[activePolicy]?.title}
              </h3>
              <button
                type="button"
                onClick={() => setActivePolicy(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setActivePolicy(null)}
                className="px-4 py-2 bg-gradient-to-r from-[#996515] to-[#b8860b] text-white font-bold text-xs rounded-xl hover:opacity-95 cursor-pointer shadow-gold-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
