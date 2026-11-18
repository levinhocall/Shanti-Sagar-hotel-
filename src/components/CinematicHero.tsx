import { ArrowDown, ArrowUpRight, MapPin } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import { FoodImage } from './FoodImage';

export function CinematicHero() {
  const reduced = useReducedMotion();
  return (
    <section id="home" className="hero shell" aria-labelledby="hero-heading">
      <motion.div className="hero-copy" initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .65 }}>
        <p className="eyebrow"><MapPin size={16} aria-hidden /> Ulhasnagar, Maharashtra</p>
        <h1 id="hero-heading">Pure vegetarian.<br /><span>Pure happiness.</span></h1>
        <p className="hero-description">South Indian favourites, North Indian comfort and a table worth sharing at Shanti Sagar Pure Veg.</p>
        <a className="button button-primary" href="#menu">Explore Menu <ArrowDown size={19} aria-hidden /></a>
        <a className="text-link hero-visit" href="#location">Find us <ArrowUpRight size={17} aria-hidden /></a>
      </motion.div>
      <figure className="hero-photo">
        <FoodImage className="hero-food-image" src="/images/thali-concept-900.webp"
          srcSet="/images/thali-concept-480.webp 480w, /images/thali-concept-900.webp 900w, /images/thali-concept-1440.webp 1440w"
          sizes="(min-width: 1000px) 56vw, 100vw" alt="Illustrative vegetarian thali with shared accompaniments"
          fetchPriority="high" />
        <figcaption>AI concept image</figcaption>
      </figure>
    </section>
  );
}
