import React from 'react';
import { Star, ExternalLink, MapPin, CheckCircle, MessageSquare } from 'lucide-react';
import { REVIEW_DATA } from '../data/restaurantData';

export const ReviewsAndRatings: React.FC = () => {
  return (
    <section
      id="reviews"
      className="relative py-28 px-5 sm:px-8 bg-[#080D0B] overflow-hidden"
      aria-label="Verified Customer Reviews & Google Rating"
    >
      {/* Background Lighting */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-[#D6B56E]/12 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Big Verified Rating Number & Link */}
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left">
            <span className="text-xs font-mono tracking-[0.25em] text-[#D6B56E] uppercase mb-3 block">
              06 / AROUND THE TABLE
            </span>

            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#FFF7E8] leading-tight mb-4">
              Verified Public Ratings
            </h2>

            <p className="text-sm text-[#FFF7E8]/70 font-light font-sans mb-8">
              Documented feedback from patrons and local families gathered across {REVIEW_DATA.totalReviews.toLocaleString()} verified Google reviews.
            </p>

            {/* Rating Highlight Block */}
            <div className="glass-panel rounded-3xl p-8 border border-[#D6B56E]/30 relative overflow-hidden mb-6">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-editorial text-7xl sm:text-8xl font-bold text-[#FFF7E8]">
                    {REVIEW_DATA.rating}
                  </span>
                  <span className="text-xl sm:text-2xl text-[#D6B56E] font-mono">/ 5.0</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#D6B56E] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      fill={i < Math.floor(REVIEW_DATA.rating) ? '#D6B56E' : 'transparent'}
                      className={i < Math.ceil(REVIEW_DATA.rating) ? 'text-[#D6B56E]' : 'text-[#D6B56E]/30'}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#FFF7E8]/80 mb-6">
                  <CheckCircle size={14} className="text-[#D6B56E]" />
                  <span>{REVIEW_DATA.totalReviews.toLocaleString()} Verified Google Reviews</span>
                </div>

                <a
                  href={REVIEW_DATA.reviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cinema text-xs py-3 px-6 w-full flex items-center justify-center gap-2"
                >
                  <ExternalLink size={14} />
                  VIEW ON GOOGLE MAPS
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-mono text-[#FFF7E8]/50">
              <MapPin size={13} className="text-[#D6B56E]" />
              <span>{REVIEW_DATA.verifiedLocation}</span>
            </div>
          </div>

          {/* Right Column: Customer Feedback Themes */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-editorial text-2xl font-bold text-[#FFF7E8] mb-6 flex items-center gap-2">
              <MessageSquare size={18} className="text-[#D6B56E]" />
              Frequently Noted Dining Experiences
            </h3>

            {REVIEW_DATA.highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-2xl p-6 sm:p-8 border border-[#D6B56E]/20 transition-all hover:border-[#D6B56E]/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-editorial text-2xl font-bold text-[#FFF7E8]">
                    {highlight.title}
                  </h4>
                  <span className="px-3 py-1 rounded-full bg-[#103D32]/70 text-[#D6B56E] text-xs font-mono">
                    {highlight.count} Mentions
                  </span>
                </div>
                <p className="text-sm font-sans font-light text-[#FFF7E8]/80 leading-relaxed">
                  "{highlight.text}"
                </p>
              </div>
            ))}

            <p className="text-[11px] font-mono text-[#FFF7E8]/40 pt-2">
              Rating and review count verified from public Google business data.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
