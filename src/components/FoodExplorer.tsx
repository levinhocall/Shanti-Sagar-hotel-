import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, ShieldCheck, ExternalLink, MessageCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { MENU_ITEMS, RESTAURANT_INFO } from '../data/restaurantData';
import type { DishItem } from '../types';

export const FoodExplorer: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeDish, setActiveDish] = useState<DishItem | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'dietary' | 'ingredients'>('overview');
  const [activeModalImage, setActiveModalImage] = useState<string>('');

  // Synchronize with URL hash for browser Back button support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#dish-')) {
        const dishId = hash.replace('#dish-', '');
        const found = MENU_ITEMS.find((d) => d.id === dishId);
        if (found) {
          setActiveDish(found);
          setActiveModalImage(found.image);
        }
      } else {
        // Functional-free reset: safe no-op when already closed, and avoids a stale closure over activeDish
        setActiveDish(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    // Initial check
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Keyboard accessibility: Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeDish) {
        closeDishDetail();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDish]);

  const openDishDetail = (dish: DishItem) => {
    setActiveDish(dish);
    setActiveModalImage(dish.image);
    setActiveTab('overview');
    window.history.pushState({ dishId: dish.id }, '', `#dish-${dish.id}`);
  };

  const closeDishDetail = () => {
    setActiveDish(null);
    if (window.location.hash.startsWith('#dish-')) {
      window.history.pushState(null, '', '#menu');
    }
  };

  const categories = ['All', 'South Indian', 'North Indian', 'Rice & More', 'Specialties'];

  const filteredItems =
    selectedCategory === 'All'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section
      id="menu"
      className="relative py-28 px-5 sm:px-8 bg-[#07130F] overflow-hidden"
      aria-label="Interactive Food Menu Explorer"
    >
      {/* Background Lighting Aura */}
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-[#103D32]/25 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full bg-[#D6B56E]/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Header & Section Eyebrow */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#103D32]/40 border border-[#D6B56E]/30 text-[#D6B56E] text-xs font-mono tracking-[0.2em] uppercase mb-4">
              <Sparkles size={13} />
              03 / SOMETHING TO SAVOUR
            </div>
            <h2 className="font-editorial text-4xl sm:text-6xl font-bold text-[#FFF7E8] tracking-tight leading-[1.05]">
              The Pure Veg Food Explorer
            </h2>
          </div>

          <p className="max-w-md text-sm text-[#FFF7E8]/70 font-light font-sans leading-relaxed">
            Tap any dish to enter the immersive shared-element drill-down experience.
            Explore authentic flavors, ingredient profiles, and culinary artistry.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar" role="tablist" aria-label="Menu categories">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              role="tab"
              aria-selected={selectedCategory === category}
              className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === category
                  ? 'bg-[#D6B56E] text-[#080D0B] border-[#FFF7E8] font-bold shadow-[0_0_20px_rgba(214,181,110,0.35)]'
                  : 'bg-[#0E241E]/60 text-[#FFF7E8]/75 border-[#D6B56E]/15 hover:border-[#D6B56E]/40 hover:text-[#FFF7E8]'
              }`}
            >
              {category.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((dish, idx) => (
            <div
              key={dish.id}
              onClick={() => openDishDetail(dish)}
              className="group glass-panel rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-[#D6B56E]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openDishDetail(dish);
                }
              }}
              aria-label={`Explore ${dish.name}`}
            >
              {/* Dish Visual Header */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E241E] via-transparent to-transparent opacity-90" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#080D0B]/80 backdrop-blur-md text-[#D6B56E] text-[10px] font-mono tracking-wider border border-[#D6B56E]/20">
                    {dish.category}
                  </span>
                  {dish.spiceLevel && (
                    <span className="px-2.5 py-1 rounded-full bg-[#103D32]/80 backdrop-blur-md text-[#FFF7E8] text-[10px] font-mono">
                      {dish.spiceLevel}
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#080D0B]/70 border border-[#D6B56E]/30 text-[#D6B56E] flex items-center justify-center text-xs font-mono">
                  0{idx + 1}
                </div>
              </div>

              {/* Dish Information */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-[#FFF7E8] group-hover:text-[#D6B56E] transition-colors mb-2">
                    {dish.name}
                  </h3>
                  <p className="text-xs font-sans text-[#D6B56E] italic mb-3">
                    "{dish.subtitle}"
                  </p>
                  <p className="text-xs text-[#FFF7E8]/70 line-clamp-2 font-light leading-relaxed mb-4">
                    {dish.description}
                  </p>
                </div>

                {/* Footer Interaction Bar */}
                <div className="pt-4 border-t border-[#D6B56E]/15 flex items-center justify-between text-xs font-mono text-[#D6B56E]">
                  <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    EXPLORE DISH
                    <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-[10px] text-[#FFF7E8]/40">Tap for 360° details</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Disclaimer Note */}
        <div className="mt-12 text-center text-xs text-[#FFF7E8]/50 font-mono tracking-wider">
          Illustrative menu concept for Shanti Sagar pure vegetarian presentations.
        </div>
      </div>

      {/* Flagship Immersive Detail Modal (Shared-Element Drill-Down) */}
      {activeDish && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-[#080D0B]/92 backdrop-blur-2xl overflow-y-auto animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-dish-title"
        >
          <div className="glass-panel w-full max-w-5xl rounded-3xl overflow-hidden my-auto border border-[#D6B56E]/30 shadow-[0_25px_80px_rgba(0,0,0,0.8)] relative flex flex-col lg:flex-row max-h-[92vh]">
            {/* Left Media Stage */}
            <div className="lg:w-1/2 relative bg-[#080D0B] flex flex-col justify-between p-6 sm:p-8 min-h-[340px] lg:min-h-full">
              {/* Back Button */}
              <button
                onClick={closeDishDetail}
                className="self-start px-4 py-2 rounded-full bg-[#0E241E]/80 hover:bg-[#103D32] border border-[#D6B56E]/30 text-[#FFF7E8] text-xs font-mono tracking-wider flex items-center gap-2 transition-all cursor-pointer z-10"
                aria-label="Back to menu"
              >
                <ArrowLeft size={14} className="text-[#D6B56E]" />
                BACK TO MENU
              </button>

              {/* Main Expanded Image with Ambient Depth */}
              <div className="my-auto relative flex items-center justify-center py-6">
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-[#D6B56E]/40 p-3 shadow-2xl animate-float">
                  <div className="w-full h-full rounded-full overflow-hidden shadow-inner border border-[#D6B56E]/20">
                    <img
                      src={activeModalImage}
                      alt={activeDish.name}
                      className="w-full h-full object-cover scale-105"
                    />
                  </div>
                </div>
              </div>

              {/* Image Angle Thumbnails */}
              <div className="flex items-center justify-center gap-3 relative z-10 pt-4">
                {activeDish.gallery.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveModalImage(imgSrc)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeModalImage === imgSrc
                        ? 'border-[#D6B56E] scale-105 shadow-md'
                        : 'border-[#103D32] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgSrc} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Information Panel */}
            <div className="lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-[#D6B56E] uppercase tracking-[0.2em]">
                    {activeDish.category} · CULINARY SHOWCASE
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#103D32] text-[#FFF7E8] text-[10px] font-mono">
                    {activeDish.mood}
                  </span>
                </div>

                <h3 id="modal-dish-title" className="font-editorial text-3xl sm:text-5xl font-bold text-[#FFF7E8] mb-2">
                  {activeDish.name}
                </h3>
                <p className="text-sm font-sans text-[#D6B56E] italic mb-6">
                  "{activeDish.subtitle}"
                </p>

                {/* Interactive Detail Tabs */}
                <div className="flex items-center gap-4 border-b border-[#D6B56E]/20 pb-3 mb-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                      activeTab === 'overview'
                        ? 'text-[#D6B56E] font-bold border-b-2 border-[#D6B56E] pb-3 -mb-3.5'
                        : 'text-[#FFF7E8]/60 hover:text-[#FFF7E8]'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('dietary')}
                    className={`text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                      activeTab === 'dietary'
                        ? 'text-[#D6B56E] font-bold border-b-2 border-[#D6B56E] pb-3 -mb-3.5'
                        : 'text-[#FFF7E8]/60 hover:text-[#FFF7E8]'
                    }`}
                  >
                    Dietary & Purity
                  </button>
                  <button
                    onClick={() => setActiveTab('ingredients')}
                    className={`text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                      activeTab === 'ingredients'
                        ? 'text-[#D6B56E] font-bold border-b-2 border-[#D6B56E] pb-3 -mb-3.5'
                        : 'text-[#FFF7E8]/60 hover:text-[#FFF7E8]'
                    }`}
                  >
                    Serving & Style
                  </button>
                </div>

                {/* Tab Content Display */}
                {activeTab === 'overview' && (
                  <div className="space-y-4 text-xs sm:text-sm font-sans font-light text-[#FFF7E8]/85 leading-relaxed">
                    <p>{activeDish.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {activeDish.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full bg-[#103D32]/50 border border-[#D6B56E]/20 text-xs font-mono text-[#D6B56E]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'dietary' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#D6B56E] mb-2">
                      <ShieldCheck size={16} />
                      VERIFIED PURITY STANDARDS
                    </div>
                    {activeDish.verifiedDietary.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-[#FFF7E8]/80 font-sans">
                        <CheckCircle2 size={14} className="text-[#D6B56E]" />
                        <span>{item}</span>
                      </div>
                    ))}
                    <p className="text-[11px] text-[#FFF7E8]/50 font-mono pt-3 border-t border-[#103D32]/40">
                      Prepared in a kitchen upholding 100% pure vegetarian preparation standards.
                    </p>
                  </div>
                )}

                {activeTab === 'ingredients' && (
                  <div className="space-y-3 text-xs font-mono text-[#FFF7E8]/85">
                    <div className="p-3 rounded-xl bg-[#0E241E]/50 border border-[#D6B56E]/15">
                      <span className="text-[#D6B56E] block mb-1">Serving Presentation:</span>
                      <p className="font-sans text-xs text-[#FFF7E8]/80">{activeDish.servingStyle}</p>
                    </div>
                    {activeDish.chefNote && (
                      <div className="p-3 rounded-xl bg-[#0E241E]/50 border border-[#D6B56E]/15">
                        <span className="text-[#D6B56E] block mb-1">Concept Note:</span>
                        <p className="font-sans text-xs text-[#FFF7E8]/80">{activeDish.chefNote}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons & Order Link */}
              <div className="mt-8 pt-6 border-t border-[#D6B56E]/20 flex flex-wrap items-center gap-4">
                <a
                  href={RESTAURANT_INFO.orderUrlZomato}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cinema text-xs py-3 px-6 flex items-center gap-2 flex-1 justify-center"
                >
                  <ExternalLink size={14} />
                  ORDER ON ZOMATO
                </a>
                <a
                  href={RESTAURANT_INFO.whatsappContact}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cinema-outline text-xs py-3 px-6 flex items-center gap-2 flex-1 justify-center"
                >
                  <MessageCircle size={14} />
                  WHATSAPP ENQUIRY
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
