import React from 'react';
import { MapPin, Clock, Phone, MessageCircle, Navigation, ExternalLink, Utensils } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

export const LocationAndContact: React.FC = () => {
  return (
    <section
      id="location"
      className="relative py-28 px-5 sm:px-8 bg-[#07130F] overflow-hidden"
      aria-label="Location, Directions and Contact"
    >
      {/* Background Lighting Aura */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] rounded-full bg-[#103D32]/25 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-[0.25em] text-[#D6B56E] uppercase mb-4 block">
            07 / VISIT & CONNECT
          </span>
          <h2 className="font-editorial text-4xl sm:text-6xl font-bold text-[#FFF7E8] leading-tight mb-4">
            Your Next Gathering Awaits
          </h2>
          <p className="text-[#FFF7E8]/75 text-sm sm:text-base font-light font-sans">
            Centrally situated at Maharishi Complex near Bhatia Chowk in Ulhasnagar.
            Drop in for an unhurried family meal or order pure vegetarian comfort directly to your door.
          </p>
        </div>

        {/* Location & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Verified Location Details & Direct CTAs */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-8 sm:p-10 flex flex-col justify-between border border-[#D6B56E]/30">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#D6B56E] uppercase tracking-widest mb-4">
                <MapPin size={16} />
                VERIFIED RESTAURANT ADDRESS
              </div>

              <h3 className="font-editorial text-3xl font-bold text-[#FFF7E8] mb-3">
                Shanti Sagar Pure Veg
              </h3>

              <p className="text-sm font-sans text-[#FFF7E8]/85 font-light leading-relaxed mb-6">
                {RESTAURANT_INFO.fullAddress}
              </p>

              <div className="space-y-4 pt-6 border-t border-[#D6B56E]/20 text-xs font-mono text-[#FFF7E8]/80">
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-[#D6B56E] shrink-0" />
                  <div>
                    <span className="text-[#FFF7E8]/50 block">Operating Hours</span>
                    <span className="text-[#FFF7E8] font-bold">{RESTAURANT_INFO.hours}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#D6B56E] shrink-0" />
                  <div>
                    <span className="text-[#FFF7E8]/50 block">Telephone Inquiries</span>
                    <a href={`tel:${RESTAURANT_INFO.phoneContact}`} className="hover:text-[#D6B56E] transition-colors">
                      {RESTAURANT_INFO.phoneContact}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-[#D6B56E]/20 space-y-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  RESTAURANT_INFO.fullAddress
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cinema w-full text-xs py-3.5 flex items-center justify-center gap-2"
              >
                <Navigation size={15} />
                GET DIRECTIONS ON GOOGLE MAPS
              </a>

              <a
                href={RESTAURANT_INFO.whatsappContact}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cinema-outline w-full text-xs py-3.5 flex items-center justify-center gap-2"
              >
                <MessageCircle size={15} />
                WHATSAPP TABLE ENQUIRY
              </a>

              {/* Delivery Ordering Links */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={RESTAURANT_INFO.orderUrlZomato}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#0E241E]/80 hover:bg-[#103D32] border border-[#D6B56E]/20 text-xs font-mono text-center flex items-center justify-center gap-2 text-[#FFF7E8] transition-all"
                >
                  <Utensils size={13} className="text-[#D6B56E]" />
                  Zomato
                  <ExternalLink size={12} className="opacity-50" />
                </a>

                <a
                  href={RESTAURANT_INFO.orderUrlDistrict}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#0E241E]/80 hover:bg-[#103D32] border border-[#D6B56E]/20 text-xs font-mono text-center flex items-center justify-center gap-2 text-[#FFF7E8] transition-all"
                >
                  <ExternalLink size={13} className="text-[#D6B56E]" />
                  District
                  <ExternalLink size={12} className="opacity-50" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Embedded Map */}
          <div className="lg:col-span-7 glass-panel rounded-3xl overflow-hidden border border-[#D6B56E]/30 shadow-2xl relative min-h-[420px]">
            <iframe
              title="Shanti Sagar Pure Veg Location Map"
              src="https://maps.google.com/maps?q=Shanti+Sagar+Pure+Veg+Ulhasnagar&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[420px] border-0 filter invert-[0.9] hue-rotate-180 contrast-125 opacity-90 hover:opacity-100 transition-opacity"
              loading="lazy"
              allowFullScreen
            />

            {/* Map Overlay Badge */}
            <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-[#080D0B]/85 backdrop-blur-md border border-[#D6B56E]/30 text-xs font-mono text-[#D6B56E] flex items-center gap-2 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-[#D6B56E] animate-ping" />
              NEAR BHATIA CHOWK, ULHASNAGAR
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
