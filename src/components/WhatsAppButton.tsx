import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useStore();
  const rawNumber = settings?.whatsappNumber || '923001234567';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(settings?.whatsappDefaultMessage || 'Assalam o Alaikum! I would like to order Musfira Beauty Cream.');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40">
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:shadow-green-500/40 active:scale-95 transition-all duration-300 relative"
        aria-label="Chat with Musfira Support on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400"></span>
        </span>

        {/* WhatsApp Icon */}
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white stroke-[#25D366]" />

        {/* Tooltip on Hover */}
        <span className="hidden sm:inline-block max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold text-sm pl-0 group-hover:pl-2">
          Order on WhatsApp
        </span>
      </a>
    </div>
  );
};
