import React from 'react';
import { Sparkles, HeartHandshake, Leaf, ShieldCheck } from 'lucide-react';

export const RestaurantStory: React.FC = () => {
  return (
    <section
      id="story"
      className="relative py-28 px-5 sm:px-8 bg-[#07130F] overflow-hidden"
      aria-label="The Shanti Sagar Story"
    >
      {/* Background Decorative Accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-[#103D32]/25 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full bg-[#D6B56E]/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Index & Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono tracking-[0.25em] text-[#D6B56E] uppercase">
            02 / THE SHANTI SAGAR WAY
          </span>
          <div className="h-[1px] w-24 bg-[#D6B56E]/30" />
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Story Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-bold text-[#FFF7E8] leading-[1.08] mb-8">
              Slow down.
              <br />
              <span className="italic text-[#D6B56E] font-normal">A little theatre on the table.</span>
            </h2>

            <div className="space-y-6 text-[#FFF7E8]/85 text-base sm:text-lg font-light leading-relaxed">
              <p>
                In the bustling heart of Ulhasnagar, dining is never rushed. It is an unhurried pause where sizzling tawas, fragrant tempered mustard seeds, and steaming sambars turn ordinary moments into gatherings of warmth.
              </p>
              <p>
                At Shanti Sagar Pure Veg, every preparation is rooted in genuine vegetarian reverence. Fresh coconut is grated each morning; fermented batters are allowed their natural rhythm; and rich curries are simmered patiently in copper and iron vessels until their aromatics blossom.
              </p>
            </div>

            {/* Ethos Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-[#D6B56E]/15">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0E241E]/40 border border-[#D6B56E]/15">
                <ShieldCheck size={20} className="text-[#D6B56E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono uppercase text-[#FFF7E8] font-bold">100% Purity</h4>
                  <p className="text-xs text-[#FFF7E8]/60 mt-1">Strict vegetarian discipline with zero animal byproduct.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0E241E]/40 border border-[#D6B56E]/15">
                <Leaf size={20} className="text-[#D6B56E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono uppercase text-[#FFF7E8] font-bold">Fresh Daily</h4>
                  <p className="text-xs text-[#FFF7E8]/60 mt-1">Daily ground rice batters & farm-sourced produce.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0E241E]/40 border border-[#D6B56E]/15">
                <HeartHandshake size={20} className="text-[#D6B56E] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-mono uppercase text-[#FFF7E8] font-bold">Family Welcoming</h4>
                  <p className="text-xs text-[#FFF7E8]/60 mt-1">Spacious private dining and warm regional hospitality.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Editorial Imagery */}
          <div className="lg:col-span-5 relative">
            {/* Primary Large Image */}
            <div className="relative rounded-2xl overflow-hidden border border-[#D6B56E]/30 shadow-2xl group">
              <img
                src="/images/dosa.webp"
                alt="Crisp South Indian Dosa Presentation"
                className="w-full h-[420px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080D0B] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-5 left-5 right-5 text-xs font-mono text-[#FFF7E8]/75">
                <span className="text-[#D6B56E]">FIG. 01</span> — Morning fermentation & golden tawa roasting
              </div>
            </div>

            {/* Overlapping Floating Small Image Card */}
            <div className="hidden sm:block absolute -bottom-10 -left-10 w-52 h-52 rounded-xl overflow-hidden border-2 border-[#D6B56E]/50 shadow-2xl bg-[#080D0B] group animate-float">
              <img
                src="/images/paneer.webp"
                alt="Paneer Curry Rich Texture"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#080D0B]/30" />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#080D0B]/80 text-[10px] font-mono text-[#D6B56E]">
                SPICED TEXTURES
              </div>
            </div>

            {/* Subtle Aesthetic Stamp */}
            <div className="absolute top-4 -right-4 bg-[#103D32]/90 backdrop-blur-md border border-[#D6B56E]/30 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#D6B56E] flex items-center gap-1.5 shadow-lg">
              <Sparkles size={12} />
              AUTHENTIC FLAVORS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
