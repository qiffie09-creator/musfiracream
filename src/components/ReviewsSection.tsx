import React, { useState } from 'react';
import { Star, ChevronDown, CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ReviewsSection: React.FC = () => {
  const { reviews } = useStore();
  const [sortBy, setSortBy] = useState('recent');
  const [pageSize, setPageSize] = useState('10');

  const totalReviews = reviews.length;
  const averageRating = 5.0;

  return (
    <section className="py-12 bg-white border-t border-amber-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center sm:text-left mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#b8860b]">
            VERIFIED CUSTOMER TESTIMONIALS
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif text-amber-950 font-bold mt-1">
            Customer Reviews & Results
          </h2>
        </div>

        {/* Rating Breakdown Summary Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-gradient-to-br from-[#fffdfa] to-[#fef8eb] p-6 rounded-2xl border border-amber-200/80 shadow-xs">
          {/* Left score */}
          <div className="flex flex-col items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-amber-200/60">
            <span className="text-5xl font-extrabold text-amber-950 tracking-tight">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex items-center space-x-1 my-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#d4af37] text-[#d4af37]" />
              ))}
            </div>
            <span className="text-sm text-amber-900 font-medium">
              {totalReviews} Verified Reviews
            </span>
          </div>

          {/* Right Star Counts */}
          <div className="flex flex-col justify-center space-y-2 p-2">
            {[
              { stars: 5, count: totalReviews, pct: 100 },
              { stars: 4, count: 0, pct: 0 },
              { stars: 3, count: 0, pct: 0 },
              { stars: 2, count: 0, pct: 0 },
              { stars: 1, count: 0, pct: 0 },
            ].map((item) => (
              <div key={item.stars} className="flex items-center space-x-3 text-xs text-amber-950">
                <span className="w-8 font-medium">{item.stars} ★</span>
                <div className="flex-1 h-2 bg-amber-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#b8860b] to-[#d4af37] rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="w-4 text-right font-medium text-amber-800">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sort and Filters */}
        <div className="flex items-center justify-end space-x-3 mb-6">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-amber-200 text-amber-950 text-xs font-medium py-1.5 pl-3 pr-8 rounded-xl cursor-pointer focus:outline-none focus:border-[#b8860b]"
            >
              <option value="recent">Recent Reviews</option>
              <option value="highest">Highest Rating</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-amber-700 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="appearance-none bg-white border border-amber-200 text-amber-950 text-xs font-medium py-1.5 pl-3 pr-8 rounded-xl cursor-pointer focus:outline-none focus:border-[#b8860b]"
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-amber-700 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Review Items List */}
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white border border-amber-100/90 rounded-2xl shadow-xs space-y-4 hover:border-amber-300 transition-colors"
            >
              {/* Header: Avatar, Name, Rating, Date */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-amber-950 flex items-center justify-center font-bold text-xs border border-amber-300/60 shadow-2xs">
                    {rev.initials || rev.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="text-sm font-bold text-amber-950">{rev.author}</h4>
                      <span className="inline-flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                        <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                        Verified Buyer
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 mt-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
                      ))}
                    </div>
                  </div>
                </div>

                <span className="text-xs text-amber-800/70 font-medium">{rev.date}</span>
              </div>

              {/* Before and After Image (if present) */}
              {rev.beforeAfterImage && (
                <div className="rounded-xl overflow-hidden border border-amber-200 bg-amber-50/50 max-w-sm">
                  <img
                    src={rev.beforeAfterImage}
                    alt="Customer Transformation Result"
                    className="w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Comment text */}
              {rev.comment && (
                <p className="text-sm text-slate-800 leading-relaxed font-normal">
                  {rev.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
