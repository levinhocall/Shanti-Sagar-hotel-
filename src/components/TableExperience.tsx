import React, { useState } from 'react';
import { RotateCw, Sun, Moon, Flame, Sparkles, Eye } from 'lucide-react';

interface DishAngle {
  id: string;
  name: string;
  image: string;
  subtitle: string;
  composition: string;
  temperature: string;
  vessel: string;
}

const DISH_ANGLES: DishAngle[] = [
  {
    id: 'thali',
    name: 'The Grand Royal Thali',
    image: '/images/feast.webp',
    subtitle: 'The full spectrum of pure vegetarian abundance',
    composition: 'Curated 7-course regional spread with seasonal vegetables, dal, and warm rotis',
    temperature: 'Piping Hot & Steaming',
    vessel: 'Traditional Hand-Hammered Brass Platter',
  },
  {
    id: 'dosa',
    name: 'Crisp Tawa Masala Dosa',
    image: '/images/dosa.webp',
    subtitle: 'Golden crispness with spiced potato warmth',
    composition: 'Fermented stone-ground rice and urad crepe with spiced potato filling',
    temperature: 'Fresh Off Cast Iron Tawa',
    vessel: 'Banana Leaf Lined Stainless Steel',
  },
  {
    id: 'paneer',
    name: 'Paneer Butter Masala',
    image: '/images/paneer.webp',
    subtitle: 'Rich silk gravy and tender fresh cottage cheese',
    composition: 'Simmered tomato gravy, cashews, and fresh dairy paneer',
    temperature: 'Slow Simmered Warmth',
    vessel: 'Copper-Bottom Handi Vessel',
  },
  {
    id: 'biryani',
    name: 'Dum Vegetable Biryani',
    image: '/images/biryani.webp',
    subtitle: 'Saffron layers and aged basmati fragrance',
    composition: 'Slow-steamed spiced basmati layered with garden produce and caramelised onions',
    temperature: 'Sealed Dum Warmth',
    vessel: 'Traditional Clay Earthen Pot',
  },
];

export const TableExperience: React.FC = () => {
  const [activeDishIndex, setActiveDishIndex] = useState(0);
  const [lightMode, setLightMode] = useState<'golden' | 'candle' | 'daylight'>('golden');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const activeDish = DISH_ANGLES[activeDishIndex];

  const handleManualRotate = () => {
    setIsRotating(true);
    setRotationAngle((prev) => prev + 45);
    setTimeout(() => setIsRotating(false), 500);
  };

  return (
    <section
      id="experience"
      className="relative py-28 px-5 sm:px-8 bg-[#080D0B] overflow-hidden"
      aria-label="Interactive Table Sculpture Experience"
    >
      {/* Background Radial Glow */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
          lightMode === 'golden'
            ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(214,181,110,0.18)_0%,transparent_70%)]'
            : lightMode === 'candle'
            ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(166,106,72,0.22)_0%,transparent_70%)]'
            : 'bg-[radial-gradient(circle_at_50%_50%,rgba(16,61,50,0.25)_0%,transparent_70%)]'
        }`}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Eyebrow & Headline */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#103D32]/40 border border-[#D6B56E]/30 text-[#D6B56E] text-xs font-mono tracking-[0.2em] uppercase mb-4">
            <Sparkles size={12} />
            SCENE 03 / THE TABLE SCULPTURE
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-bold text-[#FFF7E8] leading-tight mb-4">
            An Interactive Table Exhibition
          </h2>
          <p className="text-[#FFF7E8]/75 text-sm sm:text-base font-light font-sans">
            Explore the visual architecture of Shanti Sagar pure vegetarian presentations.
            Rotate compositions and observe the craftsmanship of traditional Indian dining vessels.
          </p>
        </div>

        {/* Sculpture Stage Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Stage (Interactive Canvas & Image) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
              <div className="relative w-full max-w-[480px] aspect-square rounded-full border border-[#D6B56E]/20 p-4 sm:p-6 flex items-center justify-center">
                {/* Outer Orbit Rings */}
                <div
                  className="absolute inset-0 rounded-full border border-dashed border-[#D6B56E]/30 animate-spin"
                  style={{ animationDuration: '40s' }}
                />
                <div
                  className="absolute inset-3 rounded-full border border-[#103D32]/50 animate-spin"
                  style={{ animationDuration: '60s', animationDirection: 'reverse' }}
                />

                {/* Main Interactive Dish Image with Dynamic Lighting Filters */}
                <div
                  className="w-full h-full rounded-full overflow-hidden shadow-2xl relative transition-transform duration-700 ease-out select-none"
                  style={{
                    transform: `rotate(${rotationAngle}deg)`,
                    filter:
                      lightMode === 'golden'
                        ? 'sepia(0.2) saturate(1.2) brightness(1.05)'
                        : lightMode === 'candle'
                        ? 'sepia(0.4) saturate(1.4) brightness(0.95)'
                        : 'contrast(1.08) brightness(1)',
                  }}
                >
                  <img
                    src={activeDish.image}
                    alt={activeDish.name}
                    className="w-full h-full object-cover scale-105"
                  />
                  <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#080D0B]/60" />
                </div>
              </div>

              {/* Stage Quick Controls */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <button
                  onClick={handleManualRotate}
                  className="px-4 py-2 rounded-full bg-[#103D32]/60 hover:bg-[#103D32] border border-[#D6B56E]/40 text-[#D6B56E] text-xs font-mono tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RotateCw size={14} className={isRotating ? 'animate-spin' : ''} />
                  ROTATE 45°
                </button>

                {/* Lighting Toggles */}
                <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#0E241E]/80 border border-[#D6B56E]/20">
                  <button
                    onClick={() => setLightMode('golden')}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                      lightMode === 'golden' ? 'bg-[#D6B56E] text-[#080D0B] font-bold' : 'text-[#FFF7E8]/70 hover:text-[#FFF7E8]'
                    }`}
                  >
                    <Sun size={12} />
                    Golden Hour
                  </button>
                  <button
                    onClick={() => setLightMode('candle')}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                      lightMode === 'candle' ? 'bg-[#D6B56E] text-[#080D0B] font-bold' : 'text-[#FFF7E8]/70 hover:text-[#FFF7E8]'
                    }`}
                  >
                    <Flame size={12} />
                    Candlelight
                  </button>
                  <button
                    onClick={() => setLightMode('daylight')}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                      lightMode === 'daylight' ? 'bg-[#D6B56E] text-[#080D0B] font-bold' : 'text-[#FFF7E8]/70 hover:text-[#FFF7E8]'
                    }`}
                  >
                    <Moon size={12} />
                    Clear Daylight
                  </button>
                </div>
              </div>
            </div>

            {/* Sculpture Metadata & Dish Selector */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-xs font-mono text-[#D6B56E] uppercase tracking-widest mb-2">
                ACTIVE COMPOSITION
              </span>
              <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-[#FFF7E8] mb-2">
                {activeDish.name}
              </h3>
              <p className="text-sm font-sans text-[#D6B56E] italic mb-6">
                "{activeDish.subtitle}"
              </p>

              {/* Technical Composition Details */}
              <div className="space-y-4 text-xs font-mono text-[#FFF7E8]/80 mb-8 pb-8 border-b border-[#D6B56E]/15">
                <div className="flex items-start justify-between py-1.5 border-b border-[#103D32]/40">
                  <span className="text-[#FFF7E8]/50 uppercase">Culinary Composition</span>
                  <span className="text-right text-[#FFF7E8] max-w-[200px]">{activeDish.composition}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#103D32]/40">
                  <span className="text-[#FFF7E8]/50 uppercase">Serving Vessel</span>
                  <span className="text-[#D6B56E]">{activeDish.vessel}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[#FFF7E8]/50 uppercase">Service Temperature</span>
                  <span className="text-[#FFF7E8]">{activeDish.temperature}</span>
                </div>
              </div>

              {/* Composition Selector Tabs */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-mono text-[#FFF7E8]/60 uppercase tracking-widest mb-1">
                  SELECT COMPOSITION
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {DISH_ANGLES.map((dish, idx) => (
                    <button
                      key={dish.id}
                      onClick={() => setActiveDishIndex(idx)}
                      className={`p-3 rounded-xl text-left text-xs font-sans transition-all flex items-center justify-between cursor-pointer border ${
                        activeDishIndex === idx
                          ? 'bg-[#103D32] border-[#D6B56E] text-[#FFF7E8] font-bold shadow-lg'
                          : 'bg-[#0E241E]/40 border-[#D6B56E]/10 text-[#FFF7E8]/70 hover:border-[#D6B56E]/30'
                      }`}
                    >
                      <span className="truncate pr-2">{dish.name}</span>
                      <Eye size={12} className={activeDishIndex === idx ? 'text-[#D6B56E]' : 'opacity-40'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
