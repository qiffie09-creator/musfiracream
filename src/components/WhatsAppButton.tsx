import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useStore();

  const handleWhatsApp = () => {
    const text = encodeURIComponent('Assalam-o-Alaikum! Mujhe Musfira Beauty Cream ke baare me maloomat chahiye aur order place karna hai.');
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <button
      id="floating-whatsapp-btn"
      onClick={handleWhatsApp}
      className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center space-x-2 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
      aria-label="Contact on WhatsApp"
    >
      <div className="w-6 h-6 flex items-center justify-center">
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
      </div>
      <span className="hidden sm:inline font-bold text-xs">
        Order on WhatsApp / واٹس ایپ
      </span>
    </button>
  );
};
