import { useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, TouchEvent } from 'react';
import { ArrowLeft, CaretLeft, CaretRight, X } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { GALLERY_ITEMS, MENU_ITEMS } from '../data/restaurantData';
import type { DishItem } from '../types';
import type { Panel } from '../hooks/use-explorer';
import { FoodImage } from './FoodImage';

const tabs = ['Overview', 'Ingredients', 'Dietary notes'];
const nextIndex = (index: number, step: number, length: number) => (index + step + length) % length;

function useSwipe(onMove: (step: number) => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onTouchStart(event: TouchEvent) {
      const touch = event.touches[0];
      start.current = { x: touch.clientX, y: touch.clientY };
    },
    onTouchEnd(event: TouchEvent) {
      const origin = start.current;
      start.current = null;
      if (!origin) return;
      const touch = event.changedTouches[0];
      const x = touch.clientX - origin.x;
      if (Math.abs(x) > 55 && Math.abs(x) > Math.abs(touch.clientY - origin.y)) onMove(x < 0 ? 1 : -1);
    },
    onTouchCancel() { start.current = null; },
  };
}

function DishDetail({ dish, onClose }: { dish: DishItem; onClose: () => void }) {
  const reduced = useReducedMotion();
  const [tab, setTab] = useState(0);
  const [image, setImage] = useState(0);
  const move = (step: number) => setImage(index => nextIndex(index, step, dish.gallery.length));
  const swipe = useSwipe(move);
  const content = [
    dish.description,
    'No ingredient list has been verified for this sample dish. Check the current recipe directly with the restaurant.',
    'Vegan suitability, allergens and cross contact precautions are unverified. Ask the restaurant before ordering.',
  ];
  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>) {
    const destination = { ArrowRight: nextIndex(tab, 1, tabs.length), ArrowLeft: nextIndex(tab, -1, tabs.length), Home: 0, End: tabs.length - 1 }[event.key];
    if (destination === undefined) return;
    event.preventDefault();
    setTab(destination);
    document.getElementById(`dish-tab-${destination}`)?.focus();
  }
  return (
    <>
      <div className="dialog-top">
        <button className="back-button" autoFocus onClick={onClose}><ArrowLeft size={19} aria-hidden /> Back to the table</button>
        <button onClick={onClose} className="icon-button" aria-label="Close dish details"><X size={22} aria-hidden /></button>
      </div>
      <div className="detail-grid">
        <motion.div className="detail-image" layoutId={reduced ? undefined : `dish-image-${dish.id}`}
          transition={{ type: 'spring', stiffness: 240, damping: 31 }} {...swipe}>
          {dish.id === 'masala-dosa' && image === 0
            ? <div className="dish-no-photo"><span>Sample dish</span></div>
            : <FoodImage src={dish.gallery[image]} alt={`${dish.name} visual moodboard, image ${image + 1}. Illustrative photography.`} />}
          <div className="image-controls">
            <button className="icon-button" aria-label="Previous dish image" onClick={() => move(-1)}><CaretLeft aria-hidden /></button>
            <span aria-live="polite">{image + 1} / {dish.gallery.length}</span>
            <button className="icon-button" aria-label="Next dish image" onClick={() => move(1)}><CaretRight aria-hidden /></button>
          </div>
        </motion.div>
        <div className="detail-copy">
          <p className="eyebrow">{dish.category} · Sample dish</p>
          <h2 id="explorer-title">{dish.name}</h2><p>{dish.subtitle}</p>
          <div className="detail-tabs" role="tablist" aria-label="Dish information">
            {tabs.map((label, index) => <button key={label} id={`dish-tab-${index}`} role="tab" aria-selected={tab === index}
              aria-controls="dish-panel" tabIndex={tab === index ? 0 : -1} onClick={() => setTab(index)} onKeyDown={navigateTabs}>{label}</button>)}
          </div>
          <div className="tab-panel" id="dish-panel" role="tabpanel" aria-labelledby={`dish-tab-${tab}`} tabIndex={0}>{content[tab]}</div>
          <p className="detail-note">Sample menu. Confirm current dishes and prices with the restaurant.</p>
        </div>
      </div>
    </>
  );
}

function GalleryDetail({ id, onClose, onChange }: { id: string; onClose: () => void; onChange: (panel: Panel) => void }) {
  const index = GALLERY_ITEMS.findIndex(item => item.id === id);
  const item = GALLERY_ITEMS[index];
  const move = (step: number) => onChange({ kind: 'gallery', id: GALLERY_ITEMS[nextIndex(index, step, GALLERY_ITEMS.length)].id });
  const swipe = useSwipe(move);
  const reduced = useReducedMotion();

  return (
    <div className="lightbox" {...swipe} onKeyDown={event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }}>
      <div className="dialog-top"><h2 id="explorer-title">Food photography</h2><button autoFocus className="icon-button" aria-label="Close gallery" onClick={onClose}><X size={22} aria-hidden /></button></div>
      <motion.figure key={id} initial={reduced ? false : { opacity: .45 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .25 }}>
        <FoodImage src={item.src.replace('.webp', '-900.webp')} alt={item.caption} />
        <figcaption>{item.title} <span>· Illustrative photography</span></figcaption>
      </motion.figure>
      <div className="gallery-controls">
        <button className="icon-button" aria-label="Previous gallery image" onClick={() => move(-1)}><CaretLeft aria-hidden /></button>
        <span aria-live="polite">{index + 1} / {GALLERY_ITEMS.length}</span>
        <button className="icon-button" aria-label="Next gallery image" onClick={() => move(1)}><CaretRight aria-hidden /></button>
      </div>
    </div>
  );
}

type DialogProps = { panel: Panel | null; onClose: () => void; onChange: (panel: Panel) => void; onExit: () => void };

export function ExplorerDialog({ panel, onClose, onChange, onExit }: DialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reduced = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const active = Boolean(panel);
  useLayoutEffect(() => {
    const element = dialog.current;
    if (active && element && !element.open) {
      element.showModal();
      setIsOpen(true);
    }
  }, [active]);

  const dish = panel?.kind === 'dish' ? MENU_ITEMS.find(item => item.id === panel.id) : undefined;
  return (
    <dialog ref={dialog} className="explorer-dialog" aria-labelledby="explorer-title" onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={event => {
        if (event.key !== 'Tab') return;
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([tabindex="-1"]), [tabindex="0"]'));
        const edge = event.shiftKey ? controls[0] : controls.at(-1);
        if (document.activeElement === edge) {
          event.preventDefault();
          (event.shiftKey ? controls.at(-1) : controls[0])?.focus();
        }
      }}>
      <AnimatePresence onExitComplete={() => {
        if (!active && dialog.current?.open) { dialog.current.close(); setIsOpen(false); onExit(); }
      }}>
        {panel && isOpen && <motion.div key="surface" className="dialog-surface" initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .28 }}>
          {dish ? <DishDetail key={dish.id} dish={dish} onClose={onClose} /> : <GalleryDetail id={panel.id} onChange={onChange} onClose={onClose} />}
        </motion.div>}
      </AnimatePresence>
    </dialog>
  );
}
