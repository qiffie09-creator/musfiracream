import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

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
      body: 'Customer Care WhatsApp: 0300-1234567\nEmail: musfirabeauty@gmail.com\nWorking Hours: Monday - Saturday (9:00 AM - 9:00 PM PKT)',
    },
    shipping: {
      title: 'Shipping Policy',
      body: 'We provide Free Cash on Delivery shipping across all major cities, towns, and villages in Pakistan. Standard delivery time is 2 to 4 working days via express courier services (TCS, Leopards, Call Courier, Trax).',
    },
  };

  return (
    <>
      <footer className="bg-[#fffdfa] border-t border-amber-100 py-10 text-center text-xs text-amber-900/80">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
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

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setCurrentPage('admin')}
              className="text-[11px] text-amber-800/60 hover:text-amber-950 cursor-pointer"
            >
              ⚙️ Store Management Portal
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
