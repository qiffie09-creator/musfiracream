import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const cleanWa = (settings?.whatsappNumber || '923001234567').replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setSubmitted(true);
    showToast('Your message has been sent to our customer care team!');
    setName('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-[#1b2b88]">
          Customer Support & Care
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif-brand font-bold text-slate-900 mt-1">
          Get in Touch with Musfira
        </h1>
        <p className="text-sm text-slate-600 mt-2 font-sans">
          Have questions about your order, skin type guidance, or tracking? Our dedicated support team is available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-serif-brand">Official Channels</h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-blue-50 text-[#1b2b88] rounded-xl shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-900">Phone Support</span>
                  <span>{settings?.phone || '+92 300 1234567'}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-900">WhatsApp Helpline</span>
                  <a
                    href={`https://wa.me/${cleanWa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:underline font-bold"
                  >
                    Chat on WhatsApp →
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-blue-50 text-[#1b2b88] rounded-xl shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-900">Email Address</span>
                  <span>{settings?.email || 'musfirabeautycream@gmail.com'}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-blue-50 text-[#1b2b88] rounded-xl shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-slate-900">Head Office</span>
                  <span>{settings?.address || 'Lahore, Punjab, Pakistan'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>100% Genuine Guaranteed</span>
            </div>
            <p>
              Musfira products are dispatched directly from our verified warehouse to prevent counter-feiting.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-serif-brand font-bold text-slate-900 mb-4">Send Us a Direct Message</h3>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-bold text-emerald-900 font-serif-brand">Thank You!</h4>
              <p className="text-xs text-emerald-800">
                Your message has been received. Our support agent will reach out via WhatsApp or phone shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold text-emerald-700 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ayesha Malik"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message or Inquiry</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we assist you with Musfira Beauty Cream?"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#1b2b88] hover:bg-blue-950 text-white font-bold text-sm rounded-xl shadow transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
