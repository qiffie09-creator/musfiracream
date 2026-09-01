import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandAssets } from '../assets/images';

interface FooterProps {
  setCurrentView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentView }) => {
  const { settings } = useStore();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const cleanWaNumber = (settings?.whatsappNumber || '923001234567').replace(/[^0-9]/g, '');

  const policyContent: Record<string, { title: string; text: string }> = {
    privacy: {
      title: 'Privacy Policy',
      text: 'Musfira Beauty Cream is committed to protecting your privacy. We collect your delivery information strictly to fulfill orders across Pakistan. Your telephone number and address are never shared or sold to third parties.',
    },
    refund: {
      title: 'Refund & Return Policy',
      text: 'We offer a 7-day money-back guarantee on unopened, sealed products. In the rare event of damaged transit goods, contact our WhatsApp customer support within 24 hours of delivery for immediate replacement.',
    },
    terms: {
      title: 'Terms of Service',
      text: 'By placing an order on the Musfira Official Store, you agree to receive verification calls/WhatsApp messages prior to dispatch. All orders are fulfilled with genuine, 100% original skincare products.',
    },
    shipping: {
      title: 'Shipping & Delivery Policy',
      text: 'We provide Free Cash on Delivery shipping across all cities and towns in Pakistan. Standard transit takes 2-4 working days via trusted courier partners (TCS, Leopards, Call Courier, PostEx).',
    },
  };

  return (
    <footer className="bg-slate-100/90 text-slate-700 border-t border-slate-200 mt-16 pt-12 pb-24 sm:pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src={settings?.logoUrl || BrandAssets.logo}
                alt="Musfira Beauty"
                className="h-10 w-auto object-contain rounded"
                referrerPolicy="no-referrer"
              />
              <span className="font-serif-brand text-2xl font-bold tracking-widest text-[#b8860b]">
                {settings?.brandName || 'MUSFIRA'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              100% Original and Steroid-Free Skincare Formula. Designed for radiant skin, eliminating dark spots, and nourishing skin naturally.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Original Product
              </span>
            </div>
          </div>

          {/* Col 2: Store Navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Store Links</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-blue-900 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="hover:text-blue-900 transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    setTimeout(() => {
                      document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-blue-900 transition-colors"
                >
                  Customer Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('contact')}
                  className="hover:text-blue-900 transition-colors"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('track')}
                  className="hover:text-blue-900 transition-colors"
                >
                  Track Order
                </button>
              </li>
              <li>
                <button
                  id="footer-admin-link"
                  onClick={() => setCurrentView('admin')}
                  className="hover:text-blue-900 transition-colors text-slate-400 hover:text-slate-700"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & WhatsApp */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-blue-900 mt-0.5 shrink-0" />
                <span>{settings?.phone || '+92 300 1234567'}</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-blue-900 mt-0.5 shrink-0" />
                <span>{settings?.email || 'musfirabeautycream@gmail.com'}</span>
              </li>
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-blue-900 mt-0.5 shrink-0" />
                <span className="leading-tight">{settings?.address || 'Lahore, Pakistan'}</span>
              </li>
              <li className="pt-1">
                <a
                  href={`https://wa.me/${cleanWaNumber}?text=Assalam%20o%20Alaikum!%20I%20want%20to%20order%20Musfira%20Beauty%20Cream`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                  Direct WhatsApp Order
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Nationwide Cash on Delivery */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-slate-900 font-serif-brand">Cash on Delivery Available</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Order now with complete peace of mind. Pay cash when the parcel arrives at your doorstep anywhere in Pakistan.
            </p>
          </div>
        </div>

        {/* Bottom Minimal Link Row exactly matching screenshot 3 */}
        <div className="pt-8 border-t border-slate-200 text-center text-xs text-slate-500 space-y-3 font-sans">
          <p className="leading-relaxed">
            {settings?.footerText || '© 2026, Musfira Special · Privacy policy · Refund policy · Terms of service · Contact information · Shipping policy'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-600">
            <button onClick={() => setActiveModal('privacy')} className="hover:underline hover:text-blue-900">
              Privacy policy
            </button>
            <span>·</span>
            <button onClick={() => setActiveModal('refund')} className="hover:underline hover:text-blue-900">
              Refund policy
            </button>
            <span>·</span>
            <button onClick={() => setActiveModal('terms')} className="hover:underline hover:text-blue-900">
              Terms of service
            </button>
            <span>·</span>
            <button onClick={() => setCurrentView('contact')} className="hover:underline hover:text-blue-900">
              Contact information
            </button>
            <span>·</span>
            <button onClick={() => setActiveModal('shipping')} className="hover:underline hover:text-blue-900">
              Shipping policy
            </button>
          </div>
        </div>
      </div>

      {/* Policy View Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 text-left">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
            <h3 className="text-xl font-serif-brand font-bold text-slate-900 mb-3">
              {policyContent[activeModal]?.title}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-6 font-sans">
              {policyContent[activeModal]?.text}
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-black"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
