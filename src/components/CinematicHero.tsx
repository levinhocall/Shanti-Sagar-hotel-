import { useRef } from 'react';
import { ArrowDown, ArrowUpRight, MapPin } from '@phosphor-icons/react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { FoodImage } from './FoodImage';

export function CinematicHero() {
  const hero = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section id="home" ref={hero} className="hero shell" aria-labelledby="hero-heading">
      <motion.div className="hero-copy"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .65 }}>
        <p className="eyebrow"><MapPin size={16} aria-hidden /> Ulhasnagar, Maharashtra</p>
        <h1 id="hero-heading">Pure vegetarian.<br /><span>Pure happiness.</span></h1>
        <p className="hero-description">South Indian favourites, North Indian comfort and a table worth sharing at Shanti Sagar Pure Veg.</p>
        <div className="hero-actions">
          <motion.a className="button button-primary" href="#menu" whileTap={reduced ? undefined : { scale: .98 }}>
            Explore Menu <ArrowDown size={19} aria-hidden />
          </motion.a>
          <a className="text-link hero-visit" href="#location">Find us <ArrowUpRight size={17} aria-hidden /></a>
        </div>
      </motion.div>
      <figure className="hero-photo">
        <motion.div className="hero-photo-layer" style={reduced ? undefined : { y: imageY, scale: imageScale }}>
          <FoodImage className="hero-food-image" src="/images/thali-concept-900.webp"
            source={{ media: '(min-width: 701px)', srcSet: '/images/thali-concept-900.webp 900w, /images/thali-concept-1440.webp 1440w', sizes: '64vw' }}
            srcSet="/images/thali-concept-480.webp 480w, /images/thali-concept-900.webp 900w"
            sizes="calc(100vw - 32px)" alt="Illustrative vegetarian thali with shared accompaniments"
            fetchPriority="high" />
        </motion.div>
        <figcaption>AI concept image</figcaption>
      </figure>
    </section>
  );
}
