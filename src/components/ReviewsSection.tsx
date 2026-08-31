import React, { useState } from 'react';
import { Star, MessageSquarePlus, X, CheckCircle, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { api } from '../lib/api';
import { BrandAssets } from '../assets/images';

export const ReviewsSection: React.FC = () => {
  const { reviews, refreshStoreData, showToast } = useStore();
  const [filterSort, setFilterSort] = useState('recent');
  const [showAddModal, setShowAddModal] = useState(false);

  // New review form states
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)));
    counts[star] = (counts[star] || 0) + 1;
  });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert('Please enter your name and comments.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.submitReview({
        productId: 'msf-001',
        productName: 'Musfira Special Cream',
        reviewerName: name.trim(),
        rating,
        comment: comment.trim(),
        beforeAfterImage: BrandAssets.beforeAfter,
      });

      showToast('Thank you! Your review has been submitted.');
      setShowAddModal(false);
      setName('');
      setComment('');
      setRating(5);
      refreshStoreData();
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitialsBg = (initials: string) => {
    const colors = ['bg-pink-100 text-pink-700', 'bg-purple-100 text-purple-700', 'bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700'];
    const idx = (initials.charCodeAt(0) || 0) % colors.length;
    return colors[idx];
  };

  return (
    <section id="reviews-section" className="py-10 px-4 sm:px-6 max-w-3xl mx-auto border-t border-slate-200">
      {/* Reviews Title matching screenshot 8 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-serif-brand font-medium text-slate-900 tracking-tight">
          Reviews
        </h2>
        <button
          id="write-review-btn"
          onClick={() => setShowAddModal(true)}
          className="text-xs sm:text-sm font-semibold text-[#1b2b88] hover:text-blue-950 flex items-center space-x-1.5 py-1.5 px-3 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 transition-colors"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Write a review</span>
        </button>
      </div>

      {/* Aggregate Rating Box matching screenshot 8 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm mb-8">
        {/* Left Big Score */}
        <div className="flex flex-col items-center justify-center p-2 border-b sm:border-b-0 sm:border-r border-slate-100">
          <span className="text-5xl font-extrabold text-slate-900 font-serif-brand tracking-tight">
            {avgRating}
          </span>
          <div className="flex items-center space-x-1 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-sm text-slate-500 font-medium">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        {/* Right Star Breakdown */}
        <div className="space-y-1.5 flex flex-col justify-center px-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = counts[stars] || 0;
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center text-xs font-medium text-slate-700 space-x-2">
                <span className="w-6 text-right flex items-center justify-end">
                  {stars} <Star className="w-3 h-3 fill-slate-700 text-slate-700 inline ml-0.5" />
                </span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-800 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-4 text-left text-slate-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews Controls / Filter */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 text-xs font-semibold text-slate-600 mb-6">
        <div className="flex items-center space-x-2">
          <select
            value={filterSort}
            onChange={(e) => setFilterSort(e.target.value)}
            className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
          >
            <option value="recent">Recent</option>
            <option value="highest">Highest Rating</option>
          </select>
          <span className="text-slate-400">•</span>
          <span>{totalReviews} Customer Opinions</span>
        </div>
      </div>

      {/* Review List matching screenshots 6, 7 */}
      <div className="space-y-8">
        {reviews.map((rev) => (
          <div key={rev.id} className="border-b border-slate-100 pb-8 last:border-0">
            {/* Before / After Image Container if present */}
            {rev.beforeAfterImage && (
              <div className="mb-4 rounded-xl overflow-hidden shadow-sm border border-slate-200 max-w-lg mx-auto">
                <div className="relative">
                  <img
                    src={rev.beforeAfterImage || BrandAssets.beforeAfter}
                    alt="Before and After Results"
                    className="w-full h-auto object-cover max-h-72"
                    referrerPolicy="no-referrer"
                  />
                  {/* Badges matching screenshots */}
                  <div className="absolute bottom-2 left-4 flex items-center space-x-2">
                    <span className="bg-black/90 text-white text-[10px] font-bold px-3 py-1 rounded shadow">
                      BEFORE
                    </span>
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded shadow">
                      AFTER
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Reviewer Header matching screenshots 6, 7 */}
            <div className="flex items-center space-x-3 mb-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${getInitialsBg(
                  rev.initials
                )}`}
              >
                {rev.initials}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 capitalize flex items-center space-x-1.5">
                  <span>{rev.reviewerName}</span>
                  {rev.verified && (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                  )}
                </h4>
              </div>
            </div>

            {/* Stars & Date */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">{rev.date}</span>
            </div>

            {/* Comment Text matching screenshots */}
            <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed font-sans">
              {rev.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif-brand font-bold text-slate-900 mb-4">
              Write a Review for Musfira Cream
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fatima Khan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Star Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-slate-700 ml-2">{rating}.0 / 5.0</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Experience / Feedback</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your results with Musfira Beauty Cream..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#1b2b88] hover:bg-blue-950 text-white font-bold rounded-lg shadow transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Submit Review</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
