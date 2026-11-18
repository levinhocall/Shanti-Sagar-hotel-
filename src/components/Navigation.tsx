import React, { useState, useEffect } from 'react';
import { Menu, X, UtensilsCrossed, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface NavigationProps {
  onReserveClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onReserveClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['home', 'story', 'experience', 'menu', 'gallery', 'reviews', 'location'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trap escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Heritage', href: '#story' },
    { name: 'Table 3D', href: '#experience' },
    { name: 'Menu Explorer', href: '#menu' },
    { name: 'Visual Journal', href: '#gallery' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Location', href: '#location' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3.5 bg-[#080D0B]/85 backdrop-blur-xl border-b border-[#D6B56E]/15 shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <a
            href="#home"
            className="flex items-center gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B56E]"
            aria-label="Shanti Sagar Pure Veg Home"
          >
            <div className="w-10 h-10 rounded-full border border-[#D6B56E]/40 bg-[#103D32]/50 flex items-center justify-center text-[#D6B56E] group-hover:scale-105 transition-transform duration-300">
              <UtensilsCrossed size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-xl sm:text-2xl font-bold tracking-wider text-[#FFF7E8] group-hover:text-[#D6B56E] transition-colors">
                SHANTI SAGAR
              </span>
              <span className="text-[10px] tracking-[0.22em] text-[#D6B56E] uppercase font-sans font-medium">
                PURE VEG · ULHASNAGAR
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-sans tracking-[0.14em] uppercase" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className={`relative py-1 transition-colors duration-300 hover:text-[#D6B56E] cursor-pointer ${
                    isActive ? 'text-[#D6B56E] font-semibold' : 'text-[#FFF7E8]/75'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D6B56E] rounded-full shadow-[0_0_8px_#D6B56E]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="#menu"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#menu');
                if (onReserveClick) onReserveClick();
              }}
              className="hidden sm:inline-flex btn-cinema text-xs py-2 px-5 gap-2"
            >
              <Sparkles size={14} />
              EXPLORE DISHES
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-full border border-[#D6B56E]/30 bg-[#103D32]/40 text-[#FFF7E8] hover:text-[#D6B56E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D6B56E]"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex flex-col justify-between bg-[#080D0B]/98 backdrop-blur-2xl px-8 pt-28 pb-12 transition-all">
          <div className="flex flex-col gap-6 text-center">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D6B56E] font-mono mb-2">
              Navigation Menu
            </span>
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.href)}
                className="font-editorial text-2xl text-[#FFF7E8] hover:text-[#D6B56E] transition-colors py-2 border-b border-[#103D32]/40 text-left flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="text-xs font-mono text-[#D6B56E]/60 tracking-wider">0{navLinks.indexOf(link) + 1}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-[#D6B56E]/20 text-center">
            <p className="text-xs text-[#FFF7E8]/60 font-sans">
              {RESTAURANT_INFO.fullAddress}
            </p>
            <a
              href={RESTAURANT_INFO.orderUrlZomato}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cinema w-full text-xs py-3"
            >
              Order on Zomato
            </a>
          </div>
        </div>
      )}
    </>
  );
};
