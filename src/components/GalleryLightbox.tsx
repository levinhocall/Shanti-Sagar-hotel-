import React, { useState, useEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/restaurantData';
import { GalleryItem } from '../types';

export const GalleryLightbox: React.FC = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;

      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev! + 1) % GALLERY_ITEMS.length);
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => (prev! - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex]);

  // Touch swipe support
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || selectedPhotoIndex === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      // Swiped Left -> Next
      setSelectedPhotoIndex((prev) => (prev! + 1) % GALLERY_ITEMS.length);
    } else if (diff < -50) {
      // Swiped Right -> Prev
      setSelectedPhotoIndex((prev) => (prev! - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
    }
    setTouchStartX(null);
  };

  const activeItem: GalleryItem | null =
    selectedPhotoIndex !== null ? GALLERY_ITEMS[selectedPhotoIndex] : null;

  return (
    <section
      id="gallery"
      className="relative py-28 px-5 sm:px-8 bg-[#07130F] overflow-hidden"
      aria-label="Visual Journal & Gallery"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono tracking-[0.25em] text-[#D6B56E] uppercase mb-4 block">
              05 / THE VISUAL JOURNAL
            </span>
            <h2 className="font-editorial text-4xl sm:text-6xl font-bold text-[#FFF7E8] tracking-tight leading-[1.05]">
              Moments of Culinary Art
            </h2>
          </div>

          <p className="max-w-md text-sm text-[#FFF7E8]/70 font-light font-sans">
            A photographic celebration of vibrant vegetarian textures, golden roasting, and communal sharing.
            Tap any frame to view in high-resolution lightbox.
          </p>
        </div>

        {/* Masonry Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY_ITEMS.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhotoIndex(idx)}
              className="group glass-panel rounded-2xl overflow-hidden cursor-pointer relative transition-all duration-500 hover:-translate-y-2 hover:border-[#D6B56E]/60 shadow-lg"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedPhotoIndex(idx);
                }
              }}
              aria-label={`View photo: ${item.title}`}
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080D0B] via-[#080D0B]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Expand Overlay Icon */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#080D0B]/70 backdrop-blur-md border border-[#D6B56E]/40 text-[#D6B56E] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Maximize2 size={16} />
                </div>
              </div>

              {/* Caption */}
              <div className="p-5">
                <span className="text-[10px] font-mono uppercase text-[#D6B56E] tracking-widest block mb-1">
                  PLATE 0{idx + 1}
                </span>
                <h3 className="font-editorial text-xl font-bold text-[#FFF7E8] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#FFF7E8]/65 font-light line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-screen Lightbox Modal */}
      {activeItem && selectedPhotoIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-8 bg-[#080D0B]/98 backdrop-blur-3xl animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Control Bar */}
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-10 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#D6B56E]">
              <Camera size={16} />
              <span>
                {selectedPhotoIndex + 1} / {GALLERY_ITEMS.length} · {activeItem.title}
              </span>
            </div>

            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="p-2.5 rounded-full bg-[#103D32]/50 hover:bg-[#103D32] border border-[#D6B56E]/30 text-[#FFF7E8] hover:text-[#D6B56E] transition-colors cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X size={20} />
            </button>
          </div>

          {/* Central High-Res View with Prev/Next Controls */}
          <div className="relative my-auto flex items-center justify-center max-h-[75vh]">
            {/* Prev Button */}
            <button
              onClick={() =>
                setSelectedPhotoIndex(
                  (prev) => (prev! - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length
                )
              }
              className="absolute left-2 sm:left-6 z-10 p-3 rounded-full bg-[#080D0B]/80 hover:bg-[#103D32] border border-[#D6B56E]/40 text-[#D6B56E] transition-all cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft size={22} />
            </button>

            {/* Lightbox Image */}
            <div className="max-w-4xl max-h-[72vh] rounded-2xl overflow-hidden border border-[#D6B56E]/40 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
              <img
                src={activeItem.src}
                alt={activeItem.title}
                className="w-full h-full max-h-[72vh] object-contain"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() =>
                setSelectedPhotoIndex((prev) => (prev! + 1) % GALLERY_ITEMS.length)
              }
              className="absolute right-2 sm:right-6 z-10 p-3 rounded-full bg-[#080D0B]/80 hover:bg-[#103D32] border border-[#D6B56E]/40 text-[#D6B56E] transition-all cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Bottom Caption & Attribution Bar */}
          <div className="max-w-2xl mx-auto w-full text-center z-10 pt-4 border-t border-[#D6B56E]/20">
            <h4 className="font-editorial text-2xl font-bold text-[#FFF7E8] mb-1">
              {activeItem.title}
            </h4>
            <p className="text-xs text-[#FFF7E8]/75 font-sans font-light mb-1">
              {activeItem.caption}
            </p>
            <span className="text-[10px] font-mono text-[#D6B56E]/70">
              Demo Photography Credit: {activeItem.credit}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
