import React from 'react';
import { ArrowUp, UtensilsCrossed, ShieldAlert } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#050A08] pt-20 pb-12 px-5 sm:px-8 border-t border-[#D6B56E]/20 text-[#FFF7E8] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#103D32]/20 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-[#D6B56E]/15">
          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full border border-[#D6B56E]/40 bg-[#103D32]/50 flex items-center justify-center text-[#D6B56E]">
                  <UtensilsCrossed size={16} />
                </div>
                <span className="font-editorial text-2xl font-bold tracking-wider text-[#FFF7E8]">
                  SHANTI SAGAR
                </span>
              </div>
              <p className="text-sm font-sans font-light text-[#FFF7E8]/70 max-w-sm leading-relaxed mb-6">
                Pure vegetarian culinary excellence celebrating traditional South Indian breakfasts, slow-simmered North Indian curries, and generous thalis in Ulhasnagar.
              </p>
            </div>

            <p className="text-xs font-mono text-[#D6B56E]">
              100% PURE VEG · ZERO MEAT · ZERO EGGS
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono text-[#D6B56E] uppercase tracking-[0.2em] mb-4">
              EXPERIENCE
            </h4>
            <ul className="space-y-2.5 text-xs font-sans text-[#FFF7E8]/75">
              <li>
                <a href="#home" className="hover:text-[#D6B56E] transition-colors">
                  Cinematic Arrival
                </a>
              </li>
              <li>
                <a href="#story" className="hover:text-[#D6B56E] transition-colors">
                  The Shanti Sagar Way
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-[#D6B56E] transition-colors">
                  Interactive 3D Table
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#D6B56E] transition-colors">
                  Food Product Explorer
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#D6B56E] transition-colors">
                  Visual Journal Gallery
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#D6B56E] transition-colors">
                  Verified Google Ratings
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-[#D6B56E] transition-colors">
                  Location & Map
                </a>
              </li>
            </ul>
          </div>

          {/* Restaurant Details & Return to Top */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono text-[#D6B56E] uppercase tracking-[0.2em] mb-4">
                SANCTUARY ADDRESS
              </h4>
              <p className="text-xs font-sans text-[#FFF7E8]/75 leading-relaxed mb-4">
                {RESTAURANT_INFO.fullAddress}
              </p>
              <p className="text-xs font-mono text-[#D6B56E]">
                Open Daily: {RESTAURANT_INFO.hours}
              </p>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-6 self-start px-4 py-2 rounded-full border border-[#D6B56E]/30 bg-[#0E241E]/40 hover:bg-[#103D32] text-xs font-mono text-[#D6B56E] flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>RETURN TO TOP</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>

        {/* Mandatory Tasteful Demo Disclaimer Box */}
        <div className="my-10 p-5 rounded-2xl bg-[#0E241E]/50 border border-[#D6B56E]/25 flex items-start gap-3.5 text-xs text-[#FFF7E8]/80">
          <ShieldAlert size={20} className="text-[#D6B56E] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-mono text-[#D6B56E] uppercase tracking-wider font-bold block">
              Unofficial Website Concept — Demo Only
            </span>
            <p className="font-sans font-light leading-relaxed">
              This website is an independent creative redesign concept created for portfolio demonstration and digital exhibition. It is not an official ordering or business portal of Shanti Sagar Pure Veg. All culinary photographs shown are licensed stock demo assets.
            </p>
          </div>
        </div>

        {/* Giant Editorial Wordmark */}
        <div className="w-full text-center select-none overflow-hidden py-4">
          <span className="font-editorial text-[14vw] sm:text-[15vw] font-bold tracking-tighter text-[#FFF7E8]/[0.06] block leading-none hover:text-[#D6B56E]/15 transition-colors duration-700">
            SHANTI SAGAR
          </span>
        </div>

        {/* Bottom Attribution Bar */}
        <div className="pt-6 border-t border-[#D6B56E]/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#FFF7E8]/50 gap-4">
          <span>
            © {new Date().getFullYear()} Shanti Sagar Pure Veg · Ulhasnagar Digital Concept
          </span>
          <span className="text-[#D6B56E]/70">
            Engineered with React · TypeScript · Three.js · Cloudflare Workers
          </span>
        </div>
      </div>
    </footer>
  );
};
