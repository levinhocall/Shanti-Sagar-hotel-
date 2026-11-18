import React from 'react';
import { ShieldCheck, Users, Sparkles, Leaf } from 'lucide-react';
import { FACILITIES } from '../data/restaurantData';

export const DiningFacilities: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck size={28} className="text-[#D6B56E]" />;
      case 'Users':
        return <Users size={28} className="text-[#D6B56E]" />;
      case 'Sparkles':
        return <Sparkles size={28} className="text-[#D6B56E]" />;
      case 'Leaf':
        return <Leaf size={28} className="text-[#D6B56E]" />;
      default:
        return <Sparkles size={28} className="text-[#D6B56E]" />;
    }
  };

  return (
    <section
      id="facilities"
      className="relative py-28 px-5 sm:px-8 bg-[#080D0B] overflow-hidden"
      aria-label="Dining Facilities & Purity Standards"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#103D32]/20 blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Eyebrow & Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-[0.25em] text-[#D6B56E] uppercase mb-4 block">
            04 / THE DINING SANCTUARY
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-bold text-[#FFF7E8] leading-tight mb-4">
            Thoughtfully Crafted Facilities
          </h2>
          <p className="text-[#FFF7E8]/75 text-sm sm:text-base font-light font-sans">
            Verified dining arrangements designed to celebrate family milestones, quiet personal dinners, and mindful dietary preferences.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FACILITIES.map((facility) => (
            <div
              key={facility.id}
              className="glass-panel rounded-2xl p-8 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:border-[#D6B56E]/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#103D32]/60 border border-[#D6B56E]/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {getIcon(facility.iconName)}
                </div>

                <span className="text-[10px] font-mono tracking-[0.2em] text-[#D6B56E] uppercase block mb-1">
                  {facility.tag}
                </span>

                <h3 className="font-editorial text-2xl font-bold text-[#FFF7E8] mb-2">
                  {facility.title}
                </h3>

                <h4 className="text-xs font-sans text-[#D6B56E] italic mb-4">
                  {facility.subtitle}
                </h4>

                <p className="text-xs text-[#FFF7E8]/70 font-light leading-relaxed">
                  {facility.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D6B56E]/15 flex items-center justify-between text-[11px] font-mono text-[#D6B56E]/70">
                <span>SHANTI SAGAR</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6B56E]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
