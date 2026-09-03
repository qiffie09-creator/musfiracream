import React from 'react';
import { AlertCircle } from 'lucide-react';

export const UrduOrderNotice: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#fffdf9] to-[#fef8eb] border border-amber-300/80 rounded-2xl p-5 my-8 shadow-xs max-w-xl mx-auto">
      <div className="text-right space-y-3" dir="rtl">
        <h3 className="font-urdu font-bold text-lg sm:text-xl text-amber-950 flex items-center justify-start space-x-2 space-x-reverse">
          <AlertCircle className="w-5 h-5 text-[#b8860b]" />
          <span>آرڈر دیتے وقت ضروری ہدایات</span>
        </h3>

        <div className="space-y-2 text-sm sm:text-base font-urdu text-amber-950 leading-relaxed pt-1">
          <p className="flex items-start justify-start gap-2">
            <span>✨</span>
            <span><strong className="text-amber-900">اپنا مکمل پتہ لکھیں:</strong> گھر نمبر، گلی نمبر، محلہ، نزدیکی لینڈ مارک اور شہر کا نام</span>
          </p>
          <p className="flex items-start justify-start gap-2">
            <span>✨</span>
            <span><strong className="text-amber-900">درست موبائل نمبر:</strong> وہ واٹس ایپ یا فون نمبر درج کریں جو ہر وقت آن ہو تاکہ رائیڈر باآسانی پہنچ سکے</span>
          </p>
          <p className="flex items-start justify-start gap-2">
            <span>✨</span>
            <span><strong className="text-amber-900">آرڈر تصدیق:</strong> ہم آرڈر بھیجنے سے پہلے کال یا واٹس ایپ پر کنفرم کریں گے — کال ضرور ریسیو کریں</span>
          </p>
          <p className="flex items-start justify-start gap-2">
            <span>✨</span>
            <span><strong className="text-amber-800">صرف سنجیدہ خریدار آرڈر کریں:</strong> پارسل موصول کرتے وقت کیش آن ڈیلیوری ادا کریں</span>
          </p>
        </div>

        <div className="pt-2 text-left font-urdu font-bold text-[#b8860b] text-sm">
          مسفرہ بیوٹی کیئر — آپ کے اعتماد کا ضامن! ✨
        </div>
      </div>
    </div>
  );
};
