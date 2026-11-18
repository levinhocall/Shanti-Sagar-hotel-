import { Component, lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowCounterClockwise, ArrowClockwise, Cube, Plus } from '@phosphor-icons/react';
import { FOOD_HOTSPOTS, LIGHTS } from '../data/table';
import type { LightMode, Hotspot } from '../data/table';
import { FoodImage } from './FoodImage';

const Scene = lazy(() => import('./ThreeCanvas'));
const dishes = [
  { name: 'Sharing thali', image: '/images/v4/thali-960.webp', alt: 'AI concept image of a vegetarian thali' },
  { name: 'Idli', image: '/images/dosa-900.webp', alt: 'Illustrative photo of idli and sambar' },
  { name: 'Paneer', image: '/images/paneer-900.webp', alt: 'Illustrative photo of paneer curry' },
  { name: 'Biryani', image: '/images/biryani-900.webp', alt: 'Illustrative photo of biryani' },
];

class SceneBoundary extends Component<{ onFailure: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function TableExperience() {
  const [mode, setMode] = useState<'photo' | 'loading' | 'ready' | 'failed'>('photo');
  const [dish, setDish] = useState(0);
  const [angle, setAngle] = useState(0);
  const [light, setLight] = useState<LightMode>('golden');
  const [hotspot, setHotspot] = useState<Hotspot>('paneer');
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
          <p className="section-description">Rotate an illustrated thali model or explore the still-life photographs.</p>
          <button className={live ? 'button' : 'button button-primary'} onClick={() => {
            if (live) { setAngle(0); setMode('photo'); } else start();
          }}>
            {live ? 'Return to still life' : <><Cube size={21} aria-hidden /> Explore in 3D</>}
          </button>
          {mode === 'failed' && <p role="status" className="table-message">3D is unavailable on this browser. You can still explore the food photographs.</p>}
          <div className="table-controls">
            <div role="group" aria-label="Rotate the table" className="rotation-controls">
              <button className="icon-button" aria-label="Rotate left" onClick={() => setAngle(value => value - Math.PI / 4)}><ArrowCounterClockwise size={21} aria-hidden /></button>
              <button className="icon-button" aria-label="Rotate right" onClick={() => setAngle(value => value + Math.PI / 4)}><ArrowClockwise size={21} aria-hidden /></button>
            </div>
            <div className="filter-row" role="group" aria-label="Table lighting">
              {Object.entries(LIGHTS).map(([key, item]) => <button key={key} aria-pressed={light === key} onClick={() => setLight(key as LightMode)}>{item.name}</button>)}
            </div>
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
            <div className="filter-row table-dishes" aria-label="Still life dishes" role="group">
              {dishes.map((item, index) => <button key={item.name} aria-pressed={dish === index} onClick={() => { setDish(index); setAngle(0); }}>{item.name}</button>)}
            </div>
          )}
        </div>
        <figure className="table-figure">
          <div className="sculpture-stage" data-render-ready={mode === 'ready'}>
            {mode !== 'ready' && <FoodImage className={`table-still light-${light}`} src={dishes[dish].image} alt={dishes[dish].alt}
              style={{ rotate: `${angle}rad` }} loading="lazy" />}
            {mode === 'loading' && <div className="scene-loading" role="status">Loading the 3D table…</div>}
            {live && <div className="scene-host">
              <SceneBoundary onFailure={fail}>
                <Suspense fallback={null}><Scene angle={angle} light={light} hotspot={hotspot} onSelect={setHotspot} onFailure={fail} onReady={ready} /></Suspense>
              </SceneBoundary>
            </div>}
          </div>
          <figcaption>{live ? 'Illustrative 3D model · Drag sideways to turn' : 'Illustrative serving concept'}</figcaption>
        </figure>
      </div>
    </section>
  );
}
