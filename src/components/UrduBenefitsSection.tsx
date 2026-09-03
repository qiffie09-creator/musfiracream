import React from 'react';
import { Sparkles } from 'lucide-react';

export const UrduBenefitsSection: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-8" dir="rtl">
      {/* مسفرہ کریم كے اہم فوائد */}
      <div className="text-right space-y-4 bg-gradient-to-b from-[#fffdfa] to-white p-6 rounded-2xl border border-amber-200/80 shadow-xs">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Sparkles className="w-5 h-5 text-[#b8860b]" />
          <h2 className="text-2xl sm:text-3xl font-bold font-urdu text-amber-950">
            مسفرہ بیوٹی کریم کے اہم فوائد
          </h2>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-start justify-start gap-2.5">
            <span className="text-base text-amber-600 font-bold shrink-0">✨</span>
            <p className="text-base sm:text-lg font-urdu text-amber-950 leading-relaxed font-medium">
              صرف 7 دن کے مسلسل استعمال سے چہرے پر قدرتی چمک اور نکھار
            </p>
          </div>

          <div className="flex items-start justify-start gap-2.5">
            <span className="text-base text-amber-600 font-bold shrink-0">✨</span>
            <p className="text-base sm:text-lg font-urdu text-amber-950 leading-relaxed font-medium">
              ہر قسم کی جلد کے لیے محفوظ، حتی کہ حساس جلد کے لیے بھی انتہائی موزوں
            </p>
          </div>

          <div className="flex items-start justify-start gap-2.5">
            <span className="text-base text-amber-600 font-bold shrink-0">✨</span>
            <p className="text-base sm:text-lg font-urdu text-amber-950 leading-relaxed font-medium">
              مہاسوں کے نشانات، چھائیاں (Freckles)، پگمنٹیشن اور سیاہ دھبوں کا خاتمہ
            </p>
          </div>

          <div className="flex items-start justify-start gap-2.5">
            <span className="text-base text-amber-600 font-bold shrink-0">✨</span>
            <p className="text-base sm:text-lg font-urdu text-amber-950 leading-relaxed font-medium">
              کھلے مسام (Open Pores) کو ٹائٹ کر کے جلد کو شیشے کی طرح ہموار بنائے
            </p>
          </div>

          <div className="flex items-start justify-start gap-2.5">
            <span className="text-base text-amber-600 font-bold shrink-0">✨</span>
            <p className="text-base sm:text-lg font-urdu text-amber-950 leading-relaxed font-medium">
              100% ہربل اور بغیر کسی سائیڈ ایفیکٹ کے تصدیق شدہ فارمولا
            </p>
          </div>
        </div>
      </div>

      {/* استعمال کا طریقہ */}
      <div className="text-right space-y-4 bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs">
        <h2 className="text-2xl sm:text-3xl font-bold font-urdu text-[#b8860b]">
          طریقہ استعمال (How to Use)
        </h2>

        <div className="space-y-3 pt-2 text-slate-800 font-urdu text-base sm:text-lg leading-loose">
          <p>1. رات سونے سے پہلے چہرے کو اچھے فیس واش یا صابن سے دھو کر خشک کریں۔</p>
          <p>2. مسفرہ کریم کی مناسب مقدار نرمی سے چہرے اور گردن پر لگائیں۔</p>
          <p>3. کریم کو زور سے رگڑیں مت، ہلکے ہاتھوں سے مساج کر کے جذب ہونے دیں۔</p>
          <p>4. صبح اٹھ کر چہرے کو نیم گرم یا عام پانی سے دھو لیں۔</p>
        </div>
      </div>
    </div>
  );
};
