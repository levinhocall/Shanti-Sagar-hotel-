import React, { useState } from 'react';
import { ArrowDown, Award, Sparkles, MapPin } from 'lucide-react';
import { ThreeCanvas } from './ThreeCanvas';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface CinematicHeroProps {
  onExploreClick?: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({ onExploreClick }) => {
  const [showThreeD, setShowThreeD] = useState(false);
  return (
    <section
      id="home"
      className="relative min-h-[100dvh] w-full flex flex-col justify-between pt-28 sm:pt-32 pb-10 px-5 sm:px-8 overflow-hidden bg-[#080D0B]"
      aria-label="Welcome to Shanti Sagar Pure Veg"
    >
      {/* Cinematic Background Atmosphere Layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep emerald gradient aura */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#103D32]/35 blur-[140px] pointer-events-none" />
        {/* Champagne gold subtle light cone */}
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-[#D6B56E]/12 blur-[120px] pointer-events-none animate-pulse-glow" />
        {/* Subtle grid lines for editorial depth */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(#FFF7E8 1px, transparent 1px), linear-gradient(90deg, #FFF7E8 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Top Metadata Bar: Coordinates & Verified Badge */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between text-[10px] sm:text-xs font-mono tracking-wide sm:tracking-widest text-[#D6B56E]/80 pt-2 border-b border-[#D6B56E]/10 pb-3">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin size={13} className="text-[#D6B56E]" />
          <span className="break-words">ULHASNAGAR · MAHARASHTRA</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#103D32]/40 border border-[#D6B56E]/30 text-[11px] text-[#FFF7E8]">
            <Award size={12} className="text-[#D6B56E]" />
            100% PURE VEG HERITAGE
          </span>
          <span className="text-[11px] text-[#D6B56E]">★ 3.8 GOOGLE RATING (1,364 REVIEWS)</span>
        </div>
      </div>

      {/* Hero Center Grid: Dynamic Headlines + 3D Centerpiece */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-10 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Editorial Copy */}
        <div className="lg:col-span-7 flex flex-col justify-center min-w-0">
          <div className="inline-flex max-w-full items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#103D32]/50 border border-[#D6B56E]/30 text-[#D6B56E] text-xs font-mono tracking-wider uppercase mb-6 w-fit">
            <Sparkles size={13} />
            EXEMPLARY CULINARY EXHIBITION
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl xl:text-7xl font-semibold tracking-tight text-[#FFF7E8] leading-[1.08] mb-6 break-words">
            <span className="block line-reveal">
              <span>PURE VEGETARIAN.</span>
            </span>
            <span className="block line-reveal">
              <span className="gold-gradient-text">PURE HAPPINESS.</span>
            </span>
          </h1>

          <p className="max-w-xl text-[#FFF7E8]/80 text-base sm:text-lg leading-relaxed font-sans font-light mb-8">
            Welcome to Shanti Sagar. An immersive celebration of authentic South Indian comfort,
            aromatic North Indian curries, and the timeless ritual of pure vegetarian dining in Ulhasnagar.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="#menu"
              onClick={(e) => {
                e.preventDefault();
                const menuEl = document.getElementById('menu');
                if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
                if (onExploreClick) onExploreClick();
              }}
              className="btn-cinema py-3.5 px-8 text-xs tracking-[0.2em]"
            >
              EXPLORE THE MENU
            </a>

            <a
              href="#experience"
              className="btn-cinema-outline py-3.5 px-7 text-xs tracking-[0.2em] flex items-center gap-2"
            >
              <span>THE 3D TABLE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6B56E]" />
            </a>
          </div>

          {/* Tasteful Disclaimer Reminder */}
          <p className="mt-8 text-xs text-[#FFF7E8]/65 font-mono tracking-wider">
            {RESTAURANT_INFO.demoDisclaimer}
          </p>
        </div>

        {/* Right Interactive 3D Canvas / Centerpiece */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-w-0">
          {/* Circular Backdrop Aura */}
          <div className="absolute inset-0 m-auto w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-radial from-[#103D32]/50 to-transparent blur-2xl pointer-events-none" />

          {/* Food-first hero: render immediately; optional 3D loads only on demand. */}
          <div className="relative z-10 w-full max-w-[520px] mx-auto">
            <div className="relative aspect-[5/4] sm:aspect-square rounded-[2rem] overflow-hidden border border-[#D6B56E]/30 shadow-[0_28px_90px_rgba(0,0,0,.5)]">
              {showThreeD ? (
                <ThreeCanvas className="w-full h-full" />
              ) : (
                <picture>
                  <source media="(max-width: 600px)" srcSet="/images/feast-480.webp" type="image/webp" />
                  <source media="(max-width: 1000px)" srcSet="/images/feast-900.webp" type="image/webp" />
                  <img src="/images/feast-1800.webp" alt="Illustrative vegetarian dining feast" fetchPriority="high" decoding="async" className="absolute inset-0 w-full h-full object-cover hero-food-image" />
                </picture>
              )}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#080D0B]/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-wider text-[#FFF7E8] font-medium">A feast for the senses</span>
                <button type="button" onClick={() => setShowThreeD((value) => !value)} className="relative z-20 rounded-full bg-[#D6B56E] text-[#080D0B] px-4 py-2.5 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                  {showThreeD ? 'VIEW FOOD' : 'EXPLORE 3D'}
                </button>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-[#FFF7E8]/55">Illustrative food photography · Interactive concept</p>
          </div>

          {/* Floating Aesthetic Seals */}
          <div className="absolute -top-4 -right-4 sm:top-2 sm:right-2 hidden sm:flex flex-col items-center justify-center w-24 h-24 rounded-full border border-[#D6B56E]/40 bg-[#080D0B]/80 backdrop-blur-md text-center p-2 shadow-xl animate-float">
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#D6B56E]">ULHASNAGAR</span>
            <span className="text-xs font-editorial font-bold text-[#FFF7E8]">EST. TASTE</span>
            <span className="text-[8px] text-[#FFF7E8]/60">PURE VEG</span>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator & Secondary Info */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between text-xs font-sans text-[#FFF7E8]/60 pt-4 border-t border-[#D6B56E]/10">
        <div className="flex items-center gap-6">
          <span className="hidden md:inline">PRIVATE DINING AVAILABLE</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">VEGAN & JAIN ACCOMMODATIONS</span>
        </div>

        <a
          href="#story"
          className="flex items-center gap-2 text-[#D6B56E] hover:text-[#FFF7E8] transition-colors uppercase tracking-[0.2em] font-mono text-[11px] group mx-auto md:mx-0"
        >
          <span>SCROLL TO ENTER</span>
          <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform" />
        </a>
      </div>
    </section>
  );
};
