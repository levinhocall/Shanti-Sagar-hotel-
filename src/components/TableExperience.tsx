import { Component, lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import type { Panel } from '../hooks/use-explorer';
import { ArrowCounterClockwise, ArrowClockwise, Cube, Plus } from '@phosphor-icons/react';
import { FOOD_HOTSPOTS, LIGHTS } from '../data/table';
import type { LightMode, Hotspot } from '../data/table';
import { FoodImage } from './FoodImage';

const Scene = lazy(() => import('./ThreeCanvas'));
const dishes = [
  { id: 'royal-thali', name: 'Sharing thali', image: '/images/editorial/vegetarian-thali-900.webp', alt: 'Illustrative photograph of a vegetarian thali' },
  { id: 'idli-sambar', name: 'Idli', image: '/images/dosa-900.webp', alt: 'Illustrative photo of idli and sambar' },
  { id: 'paneer-curry', name: 'Paneer', image: '/images/paneer-900.webp', alt: 'Illustrative photo of paneer curry' },
  { id: 'vegetable-biryani', name: 'Biryani', image: '/images/biryani-900.webp', alt: 'Illustrative photo of biryani' },
];

class SceneBoundary extends Component<{ onFailure: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function TableExperience({ open }: { open: (panel: Panel, trigger: HTMLElement) => void }) {
  const [mode, setMode] = useState<'photo' | 'loading' | 'ready' | 'failed'>('photo');
  const [dish, setDish] = useState(0);
  const [angle, setAngle] = useState(0);
  const [light, setLight] = useState<LightMode>('golden');
  const [hotspot, setHotspot] = useState<Hotspot>('paneer');
  const reduced = useReducedMotion();
  const offset = useMotionValue(0);
  const photoX = useSpring(offset, { stiffness: 230, damping: 25 });
  const live = mode === 'loading' || mode === 'ready';
  const fail = useCallback(() => setMode('failed'), []);
  const ready = useCallback(() => setMode('ready'), []);

  useEffect(() => {
    if (mode !== 'loading') return;
    const timeout = window.setTimeout(fail, 12000);
    return () => clearTimeout(timeout);
  }, [mode, fail]);

  function start() {
    try {
      const context = document.createElement('canvas').getContext('webgl2', { powerPreference: 'low-power', failIfMajorPerformanceCaveat: false });
      if (!context) { fail(); return; }
      context.getExtension('WEBGL_lose_context')?.loseContext();
      setAngle(0);
      setDish(0);
      setMode('loading');
    } catch { fail(); }
  }

  return (
    <section id="experience" className="section table-section" tabIndex={-1} aria-labelledby="table-heading">
      <div className="shell table-grid">
        <div className="table-copy">
          <p className="eyebrow">Interactive dining table</p>
          <h2 id="table-heading">A seat at the table.</h2>
          <p className="section-description">Explore the still-life photographs with a swipe. A separate illustrated model shows how a thali is arranged.</p>
          <button className={live ? 'button' : 'button button-primary'} onClick={() => {
            if (live) { setAngle(0); setMode('photo'); } else start();
          }}>
            {live ? 'Return to still life' : <><Cube size={21} aria-hidden /> Explore in 3D</>}
          </button>
          {mode === 'failed' && <p role="status" className="table-message">3D is unavailable on this browser. You can still explore the food photographs.</p>}
          <div className="table-controls">
            {live && <div role="group" aria-label="Rotate the table" className="rotation-controls">
              <button className="icon-button" aria-label="Rotate left" onClick={() => setAngle(value => value - Math.PI / 4)}><ArrowCounterClockwise size={21} aria-hidden /></button>
              <button className="icon-button" aria-label="Rotate right" onClick={() => setAngle(value => value + Math.PI / 4)}><ArrowClockwise size={21} aria-hidden /></button>
            </div>}
            <label className="table-light-select">Lighting
              <select value={light} onChange={event => setLight(event.currentTarget.value as LightMode)}>
                {Object.entries(LIGHTS).map(([key, item]) => <option key={key} value={key}>{item.name}</option>)}
              </select>
            </label>
          </div>
          {live ? (
            <div className="hotspot-summary">
              <div className="filter-row" aria-label="Dish hotspots" role="group">
                {Object.entries(FOOD_HOTSPOTS).map(([key, item]) => <button key={key} aria-pressed={hotspot === key}
                  onClick={() => setHotspot(key as Hotspot)}><Plus size={15} aria-hidden />{item.name}</button>)}
              </div>
              <p aria-live="polite">{FOOD_HOTSPOTS[hotspot].description}</p>
            </div>
          ) : (
            <>
              <div className="filter-row table-dishes" aria-label="Still life dishes" role="group">
                {dishes.map((item, index) => <button key={item.name} aria-pressed={dish === index} onClick={() => setDish(index)}>{item.name}</button>)}
              </div>
              <button type="button" className="text-link table-dish-detail" onClick={event => open({ kind: 'dish', id: dishes[dish].id }, event.currentTarget)}>View dish details</button>
            </>
          )}
        </div>
        <figure className="table-figure">
          <div className="sculpture-stage" data-render-ready={mode === 'ready'}>
            {mode !== 'ready' && <motion.div className="table-photo-motion"
              onPan={(_, info) => { if (!reduced) offset.set(Math.max(-16, Math.min(16, info.offset.x * .15))); }}
              onPanEnd={(_, info) => {
                offset.set(0);
                if (Math.abs(info.offset.x) > 55 && Math.abs(info.offset.x) > Math.abs(info.offset.y) * 1.4) {
                  setDish(next => (next + (info.offset.x < 0 ? 1 : -1) + dishes.length) % dishes.length);
                }
              }} onPointerCancel={() => offset.set(0)}>
              <motion.div key={dishes[dish].id} className="table-photo-layer"
                style={reduced ? undefined : { x: photoX }} initial={reduced ? false : { opacity: .78 }}
                animate={{ opacity: 1 }} transition={{ duration: .28 }}>
                <FoodImage className={`table-still light-${light}`} src={dishes[dish].image}
                  srcSet={`${dishes[dish].image.replace('-900.webp', '-480.webp')} 480w, ${dishes[dish].image} 900w`}
                  sizes="(max-width: 700px) 95vw, 60vw" alt={dishes[dish].alt} loading="lazy" />
              </motion.div>
            </motion.div>}
            {mode === 'loading' && <div className="scene-loading" role="status">Loading the 3D table…</div>}
            {live && <div className="scene-host">
              <SceneBoundary onFailure={fail}>
                <Suspense fallback={null}><Scene angle={angle} light={light} hotspot={hotspot} onSelect={setHotspot} onFailure={fail} onReady={ready} /></Suspense>
              </SceneBoundary>
            </div>}
          </div>
          <figcaption>{live ? 'Illustrative 3D model · Drag sideways to turn' : 'Illustrative photograph · Swipe sideways to change dishes'}</figcaption>
        </figure>
      </div>
    </section>
  );
}
