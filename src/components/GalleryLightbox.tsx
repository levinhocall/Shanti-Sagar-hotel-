import { ArrowsOut } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import { GALLERY_ITEMS } from '../data/restaurantData';
import type { Panel } from '../hooks/use-explorer';
import { FoodImage } from './FoodImage';

export function GalleryLightbox({ open }: { open: (panel: Panel, trigger: HTMLElement) => void }) {
  const reduced = useReducedMotion();
  return (
    <section id="gallery" className="section shell" tabIndex={-1} aria-labelledby="gallery-heading">
      <div className="section-heading">
        <div><p className="eyebrow">Photo gallery</p><h2 id="gallery-heading">A closer look.</h2></div>
        <p>A gallery of illustrative food photography. Tap a photo for a larger view.</p>
      </div>
      <div className="gallery-grid">
        {GALLERY_ITEMS.map(item => (
          <motion.button className="gallery-card" key={item.id} aria-label={`Open gallery: ${item.title}`}
            whileTap={reduced ? undefined : { scale: .985 }}
            onClick={event => open({ kind: 'gallery', id: item.id }, event.currentTarget)}>
            <FoodImage src={item.large ?? item.src.replace('.webp', '-900.webp')} alt="" loading="lazy" decoding="async" />
            <span>{item.title}<ArrowsOut size={20} aria-hidden /></span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
