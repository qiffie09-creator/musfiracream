import React from 'react';
import { CheckSquare, Sparkles } from 'lucide-react';

interface UrduBenefitsSectionProps {
  benefits?: string[];
  usageSteps?: string[];
}

export const UrduBenefitsSection: React.FC<UrduBenefitsSectionProps> = ({
  benefits = [
    'صرف 7 دن میں نمایاں نتائج',
    'ہر قسم کی جلد کے لیے محفوظ، حتیٰ کہ حساس جلد کے لیے بھی',
    'مہاسوں کے نشانات، چھائیاں (Freckles)، رنگت کی بے ترتیبی (Pigmentation) اور سیاہ دھبوں کو کم کرنے میں مددگار',
    'کھلے مسام (Open Pores) کو کم کر کے جلد کو ہموار اور صاف دکھاتا ہے',
    '100% Steroid-Free فارمولا، بغیر مضر اثرات کے',
  ],
  usageSteps = [
    'اپنے چہرے کو اچھی طرح دھو لیں اور ہلکا سا نم رہنے دیں۔',
    'کریم کو نرمی کے ساتھ جلد پر لگائیں۔',
    'اگر آپ کو مہاسے ہیں تو پہلے 3 دن صرف متاثرہ جگہوں (مہاسوں) پر لگائیں۔',
    'جب مہاسے کم ہو جائیں، تو بہترین نتائج کے لیے کریم کو رات کے وقت پورے چہرے پر 7 دن لگائیں۔',
  ],
}) => {
  return (
    <section className="py-8 px-4 sm:px-6 max-w-3xl mx-auto text-right font-urdu" dir="rtl">
      {/* 1. Benefits Section matching screenshot 9 */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1b2b88] mb-6 font-urdu flex items-center justify-end">
          <span>کریم کے اہم فوائد</span>
        </h2>

        <div className="space-y-4 text-base sm:text-lg text-slate-800 leading-relaxed">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start justify-start space-x-3 space-x-reverse">
              <span className="text-emerald-600 text-xl font-bold mt-0.5 shrink-0">✅</span>
              <p className="flex-1 font-urdu leading-loose text-slate-800 font-medium">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Divider Line matching screenshot 9 */}
      <div className="w-full h-px bg-blue-100 my-8"></div>

      {/* 2. How to Use Section matching screenshot 9 */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1b2b88] mb-6 font-urdu flex items-center justify-end">
          <span>استعمال کا طریقہ</span>
        </h2>

        <div className="space-y-4 text-base sm:text-lg text-slate-800 leading-loose">
          {usageSteps.map((step, index) => (
            <div key={index} className="flex items-start space-x-2 space-x-reverse font-urdu">
              <span className="text-[#1b2b88] font-bold shrink-0">{index + 1}.</span>
              <p className="flex-1 font-urdu text-slate-800 font-medium">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
