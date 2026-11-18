import { useState } from 'react';
import { SushiConveyorMenu } from '@/components/ui/sushi-conveyor-menu';
import type { DishTier } from '@/components/ui/sushi-conveyor-menu';
import { ArrowUpRight } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MENU_ITEMS } from '../data/restaurantData';
import type { Panel } from '../hooks/use-explorer';
import { FoodImage } from './FoodImage';

const plateTiers: DishTier[] = [1, 2, 3, 4, 5];
const categories = ['All', ...new Set(MENU_ITEMS.map(dish => dish.category))];
type Props = { open: (panel: Panel, trigger: HTMLElement) => void };

export function FoodExplorer({ open }: Props) {
  const [category, setCategory] = useState('All');
  const [view, setView] = useState<'grid' | 'conveyor'>('grid');
  const reduced = useReducedMotion();
  const dishes = MENU_ITEMS.filter(dish => category === 'All' || dish.category === category);
  return (
    <section id="menu" className="section menu-section" tabIndex={-1} aria-labelledby="menu-heading">
      <div className="shell">
        <div className="section-heading">
          <div><p className="eyebrow">Food explorer</p><h2 id="menu-heading">What are you craving?</h2></div>
          <p id="sample-menu-note">Browse sample dishes inspired by the cuisines on the restaurant’s public listing. Photography is illustrative.</p>
        </div>
        <div className="filter-row" aria-label="Filter dishes" role="group">
          {categories.map(item => <button key={item} type="button" aria-pressed={item === category} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <div className="filter-row menu-view-row" role="group" aria-label="Menu view">
          <button type="button" aria-pressed={view === 'grid'} onClick={() => setView('grid')}>Grid view</button>
          <button type="button" aria-pressed={view === 'conveyor'} onClick={() => setView('conveyor')}>Conveyor view</button>
        </div>
        {view === 'conveyor' ? (
          <SushiConveyorMenu key={category} data-mascot-reaction="happy" aria-describedby="sample-menu-note"
            eyebrow="Sample menu" heading="The rolling table"
            caption="Drag the table or choose a plate to explore a sample dish."
            items={dishes.map(dish => ({
              id: dish.id,
              name: dish.name,
              image: dish.conceptVisual?.card ?? dish.image.replace('.webp', '-480.webp'),
              price: '',
              tier: plateTiers[MENU_ITEMS.indexOf(dish) % plateTiers.length],
            }))}
            onSelectDish={(dish, trigger) => open({ kind: 'dish', id: dish.id }, trigger)} />
        ) : <div className="dish-grid">
          <AnimatePresence initial={false} mode="popLayout">
            {dishes.map(dish => (
              <motion.button data-mascot-reaction="happy" className="dish" key={dish.id} layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                whileHover={reduced ? undefined : { y: -4 }} whileTap={reduced ? undefined : { scale: .98 }}
                aria-describedby="sample-menu-note" onClick={event => open({ kind: 'dish', id: dish.id }, event.currentTarget)}>
                <motion.div className="dish-image" layoutId={!reduced ? `dish-image-${dish.id}` : undefined}
                  transition={{ type: 'spring', stiffness: 240, damping: 31 }}>
                  <FoodImage src={dish.conceptVisual?.card ?? dish.image.replace('.webp', '-480.webp')}
                    srcSet={dish.conceptVisual
                      ? `${dish.conceptVisual.card} ${dish.id === 'paneer-curry' ? 480 : 600}w, ${dish.conceptVisual.large} 960w`
                      : `${dish.image.replace('.webp', '-480.webp')} 480w, ${dish.image} 900w`}
                    sizes="(max-width: 700px) 65vw, (max-width: 1200px) 45vw, 620px"
                    alt="" loading="lazy" decoding="async" />
                  {dish.conceptVisual && <span className="photo-label">AI concept image</span>}
                </motion.div>
                <div className="dish-label"><div><span>{dish.category}</span><h3>{dish.name}</h3></div><ArrowUpRight size={24} aria-hidden /></div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>}
      </div>
    </section>
  );
}
