import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, X, Leaf, ChevronLeft, ChevronRight } from 'lucide-react'
import { dishes, imageFor, photography, type Dish } from '@/src/data'
import type { Panel } from '@/src/hooks/use-explorer'
import { FoodImage } from './food-image'

function Modal({ active, children, onClose, onExit, label }: { active: boolean; children: ReactNode; onClose: () => void; onExit: () => void; label: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const previousOverflow = useRef('')
  const reduced = useReducedMotion()
  useEffect(() => {
    if (active && !dialog.current?.open) {
      previousOverflow.current = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      dialog.current?.showModal()
      dialog.current?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true })
    }
  }, [active])
  useEffect(() => () => { document.body.style.overflow = previousOverflow.current }, [])
  return createPortal(<dialog ref={dialog} className="explorer-dialog" aria-label={label} onKeyDown={event => {
    if (event.key !== 'Tab') return
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]):not([tabindex="-1"]), a[href], [tabindex]:not([tabindex="-1"])')).filter(element => element.getClientRects().length > 0)
    const first = controls[0]; const last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }} onCancel={event => { event.preventDefault(); onClose() }}>
    <AnimatePresence onExitComplete={() => { dialog.current?.close(); document.body.style.overflow = previousOverflow.current; onExit() }}>
      {active && <motion.div key="modal" className="dialog-surface" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .35 }}>{children}</motion.div>}
    </AnimatePresence>
  </dialog>, document.body)
}
function DishDetail({ dish, onClose }: { dish: Dish; onClose: () => void }) {
  const [tab, setTab] = useState(0)
  const [image, setImage] = useState(0)
  const reduced = useReducedMotion()
  const tabs = ['The experience', 'Ingredients', 'Dietary notes']
  const content = [dish.description, 'The restaurant’s ingredients and preparation have not been verified. No ingredient list is provided for this demo dish. Please confirm the current recipe directly with the restaurant.', 'This is a vegetarian restaurant concept. Vegan suitability, allergens, cross-contact precautions and nutritional information for this dish are unverified. Ask the restaurant before ordering, especially if you have an allergy.']
  const selectImage = (step: number) => setImage(current => (current + step + dish.gallery.length) % dish.gallery.length)
  return <div className="dish-detail">
    <div className="detail-top"><button autoFocus onClick={onClose} className="back-button"><ArrowLeft size={18}/> Back to the table</button><span>DEMO DISH · NO OFFICIAL PRICES</span><button onClick={onClose} className="icon-button" aria-label="Close dish details"><X/></button></div>
    <div className="detail-grid">
      <motion.div layoutId={reduced ? undefined : `dish-image-${dish.id}`} transition={{ type: 'spring', stiffness: 230, damping: 30 }} className="detail-image" onTouchStart={event => { event.currentTarget.dataset.touch = String(event.touches[0].clientX) }} onTouchEnd={event => { const delta = event.changedTouches[0].clientX - Number(event.currentTarget.dataset.touch); if (Math.abs(delta) > 60) selectImage(delta < 0 ? 1 : -1) }}>
        <FoodImage key={image} src={imageFor(dish.gallery[image]).src} alt={`${dish.name} visual moodboard, image ${image + 1}. Stock demo photo, not a verified restaurant dish.`}/><span className="photo-label">SAMPLE FOOD PHOTOGRAPHY</span>
        <div className="detail-image-controls"><button className="icon-button" aria-label="Previous dish image" onClick={() => selectImage(-1)}><ChevronLeft/></button><span aria-live="polite">0{image + 1} / 0{dish.gallery.length}</span><button className="icon-button" aria-label="Next dish image" onClick={() => selectImage(1)}><ChevronRight/></button></div>
      </motion.div>
      <div className="detail-copy"><span className="eyebrow">{dish.category} / AN ILLUSTRATIVE EXPLORATION</span><h2>{dish.name.split(' ').map((word, index) => <motion.span key={word} initial={reduced ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : .15 + index * .09 }}>{word}{' '}</motion.span>)}</h2><p className="detail-subtitle">{dish.subtitle}</p>
        <div className="detail-tabs" role="tablist" aria-label="Dish information">{tabs.map((label, index) => <button key={label} id={`dish-tab-${index}`} role="tab" aria-selected={tab === index} aria-controls={`dish-panel-${index}`} tabIndex={tab === index ? 0 : -1} onClick={() => setTab(index)} onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (tab + (event.key === 'ArrowRight' ? 1 : 2)) % 3; setTab(next); document.getElementById(`dish-tab-${next}`)?.focus() } }}>{label}</button>)}</div>
        <AnimatePresence mode="wait"><motion.div key={tab} role="tabpanel" id={`dish-panel-${tab}`} aria-labelledby={`dish-tab-${tab}`} tabIndex={0} initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: reduced ? 1 : 0 }} transition={{ duration: .12 }} className="tab-panel"><p>{content[tab]}</p></motion.div></AnimatePresence>
        <div className="detail-thumbnails" aria-label="Choose dish moodboard image">{dish.gallery.map((id, index) => <button aria-label={`View ${imageFor(id).title}`} aria-pressed={image === index} key={id} onClick={() => setImage(index)}><FoodImage src={imageFor(id).src} alt=""/></button>)}</div>
        <div className="detail-disclaimer"><Leaf size={18}/><p>Sample menu concept. Images and descriptions are illustrative. Availability, ingredients and prices must be confirmed with the restaurant.</p></div>
      </div>
    </div>
  </div>
}
export function ExplorerDialog({ panel, onClose, onChange, onExit }: { panel: Panel | null; onClose: () => void; onChange: (panel: Panel) => void; onExit: () => void }) {
  const reduced = useReducedMotion()
  const galleryIndex = photography.findIndex(item => item.id === panel?.id)
  const swipeStart = useRef(0)
  const navigateGallery = (step: number) => onChange({ kind: 'gallery', id: photography[(galleryIndex + step + photography.length) % photography.length].id })
  const dish = dishes.find(item => item.id === panel?.id)
  return <Modal active={!!panel} onClose={onClose} onExit={onExit} label={panel?.kind === 'dish' ? `${dish?.name} — sample dish details` : 'Demo photography gallery'}>
    {panel?.kind === 'dish' && dish ? <DishDetail key={dish.id} dish={dish} onClose={onClose}/> : panel?.kind === 'gallery' ? <div className="lightbox" onKeyDown={event => { if (event.key === 'ArrowRight') navigateGallery(1); if (event.key === 'ArrowLeft') navigateGallery(-1) }} onTouchStart={event => { swipeStart.current = event.touches[0].clientX }} onTouchEnd={event => { const delta = event.changedTouches[0].clientX - swipeStart.current; if (Math.abs(delta) > 60) navigateGallery(delta < 0 ? 1 : -1) }}><div className="detail-top"><span>THE VISUAL JOURNAL / DEMO PHOTOGRAPHY</span><button className="icon-button" autoFocus aria-label="Close gallery" onClick={onClose}><X/></button></div><AnimatePresence mode="wait"><motion.figure key={panel.id} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2 }}><FoodImage src={imageFor(panel.id).src} alt={`${imageFor(panel.id).title} — stock demo photograph, not photographed at Shanti Sagar`}/><figcaption>{imageFor(panel.id).title} <span>Unsplash · Demo content</span></figcaption></motion.figure></AnimatePresence><div className="lightbox-controls"><button className="icon-button" aria-label="Previous gallery image" onClick={() => navigateGallery(-1)}><ArrowLeft/></button><span aria-live="polite">0{galleryIndex + 1} / 0{photography.length}</span><button className="icon-button" aria-label="Next gallery image" onClick={() => navigateGallery(1)}><ArrowRight/></button></div></div> : null}
  </Modal>
}
