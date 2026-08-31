import React from 'react';
import { useStore } from '../context/StoreContext';

export const UrduOrderNotice: React.FC = () => {
  const { settings } = useStore();

  const title = settings?.orderNoticeTitle || 'آرڈر دیتے وقت دھیان دیں';
  const points = settings?.orderNoticePoints || [
    'اپنا مکمل پتہ لکھیں (گھر نمبر، گلی نمبر، علاقے کا نام، شہر کا نام)',
    'اپنا صحیح موبائل نمبر لازمی درج کریں تاکہ رائیڈر آپ سے رابطہ کر سکے',
    'ہم آپ کا آرڈر کال یا واٹس ایپ سے کنفرم کریں گے — براہ مہربانی کال ریسیو کریں',
  ];
  const warnings = settings?.orderNoticeWarnings || [
    'غلط ایڈریس یا کال ریسیو نہ کرنے کی صورت میں ڈیلیوری میں تاخیر ہو سکتی ہے',
    'صرف سنجیدہ افراد آرڈر کریں تاکہ ہمارا اور آپ کا وقت ضائع نہ ہو',
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 my-8">
      {/* Box with orange side border and light yellowish-cream background matching screenshot 8 */}
      <div
        className="relative bg-[#fffdf0] border border-amber-200/80 rounded-xl p-5 sm:p-7 shadow-sm text-right font-urdu"
        dir="rtl"
        style={{ borderRight: '6px solid #f97316' }}
      >
        {/* Title matching screenshot 8 */}
        <h3 className="text-xl sm:text-2xl font-bold text-[#c2410c] mb-5 flex items-center justify-start space-x-2 space-x-reverse font-urdu">
          <span>📦</span>
          <span>{title}</span>
        </h3>

        {/* Checkmark points */}
        <div className="space-y-3.5 mb-6 text-sm sm:text-base text-slate-800 leading-loose">
          {points.map((pt, idx) => (
            <div key={idx} className="flex items-start justify-start space-x-2.5 space-x-reverse">
              <span className="text-emerald-700 font-bold shrink-0 text-base">✅</span>
              <p className="font-urdu leading-relaxed font-medium text-slate-800">{pt}</p>
            </div>
          ))}
        </div>

        {/* Warning points */}
        <div className="space-y-3.5 pt-4 border-t border-amber-200/60 text-sm sm:text-base text-slate-800 leading-loose">
          {warnings.map((warn, idx) => (
            <div key={idx} className="flex items-start justify-start space-x-2.5 space-x-reverse">
              <span className="text-amber-600 font-bold shrink-0 text-base">⚠️</span>
              <p className="font-urdu leading-relaxed font-medium text-slate-800">{warn}</p>
            </div>
          ))}
        </div>

        {/* Shukriya bottom note */}
        <div className="mt-5 text-left font-urdu text-base font-bold text-amber-800 flex items-center justify-start">
          <span>شکریہ! 🙏</span>
        </div>
      </div>
    </div>
  );
};
