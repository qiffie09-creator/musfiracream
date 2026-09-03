import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setPhone('');
    setMessage('');
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent('Assalam-o-Alaikum! Mujhe Musfira Skincare team se rabta karna hai.');
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold font-serif-brand text-slate-900">
          Contact Customer Care
        </h1>
        <p className="font-urdu text-base text-amber-900/90">
          رہنمائی، مشاورت اور آرڈر کے لیے ہم سے رابطہ کریں
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 rounded-3xl p-8 text-white space-y-6 shadow-xl">
          <div>
            <h2 className="text-xl font-bold font-serif-brand">Musfira Skincare Official</h2>
            <p className="text-xs text-amber-200 mt-1">24/7 dedicated beauty advisors available</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-amber-200 text-[10px] block">Direct Helpline:</span>
                <span className="font-bold text-sm">{settings.phone}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-amber-200 text-[10px] block">WhatsApp Order Support:</span>
                <span className="font-bold text-sm">+{settings.whatsappNumber}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-amber-200 text-[10px] block">Email:</span>
                <span className="font-bold text-sm">{settings.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-amber-200 text-[10px] block">Support Hours:</span>
                <span className="font-bold text-sm">Monday – Sunday (9:00 AM – 10:00 PM)</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleWhatsApp}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp Directly</span>
          </button>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Send us a Message / پیغام بھیجیں
          </h3>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-900 text-sm">Thank You! Message Received.</h4>
              <p className="text-xs text-emerald-700 font-urdu">
                آپ کا پیغام موصول ہو چکا ہے۔ ہماری کسٹمر سپورٹ ٹیم جلد رابطہ کرے گی۔
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sana Tariq"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="03001234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message or Query</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ask about skin advice, order inquiry, or wholesale..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>پیغام روانہ کریں (Submit Message)</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
