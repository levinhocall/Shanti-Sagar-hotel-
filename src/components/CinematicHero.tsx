import { useRef } from 'react';
import { ArrowDown, ArrowUpRight, MapPin } from '@phosphor-icons/react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { FoodImage } from './FoodImage';

export function CinematicHero() {
  const hero = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const pointerX = useMotionValue(0);
  const imageX = useSpring(pointerX, { stiffness: 110, damping: 22 });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section id="home" ref={hero} className="hero hero-v4" aria-labelledby="hero-heading"
      onPointerMove={event => {
        if (reduced || event.pointerType !== 'mouse') return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - rect.left) / rect.width - .5) * 20);
      }}
      onPointerLeave={() => pointerX.set(0)}>
      <motion.div className="hero-copy shell"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .65 }}>
        <p className="eyebrow"><MapPin size={16} aria-hidden /> Ulhasnagar, Maharashtra</p>
        <p className="hero-wordmark">Shanti Sagar Pure Veg</p>
        <h1 id="hero-heading">Pure vegetarian.<br /><span>Pure happiness.</span></h1>
        <p className="hero-description">South Indian favourites, North Indian comfort and a table worth sharing at Shanti Sagar Pure Veg.</p>
        <div className="hero-actions">
          <motion.a className="button button-primary" href="#menu" whileTap={reduced ? undefined : { scale: .98 }}>
            Explore Menu <ArrowDown size={19} aria-hidden />
          </motion.a>
          <a className="text-link hero-visit" href="#location" data-mascot-reaction="approval">Find us <ArrowUpRight size={17} aria-hidden /></a>
        </div>
      </motion.div>
      <figure className="hero-photo">
        <motion.div className="hero-photo-layer" style={reduced ? undefined : { x: imageX, y: imageY, scale: imageScale }}>
          <FoodImage className="hero-food-image" src="/images/editorial/masala-dosa-900.webp"
            source={{ media: '(max-width: 700px)', srcSet: '/images/editorial/masala-dosa-480.webp 480w, /images/editorial/masala-dosa-900.webp 900w', sizes: '100vw' }}
            srcSet="/images/editorial/masala-dosa-900.webp 900w, /images/editorial/masala-dosa-1280.webp 1280w"
            sizes="60vw" alt="Illustrative masala dosa with sambar and chutneys"
            fetchPriority="high" />
        </motion.div>
        <figcaption>Masala dosa · Illustrative photography</figcaption>
      </figure>
    </section>
  );
}
