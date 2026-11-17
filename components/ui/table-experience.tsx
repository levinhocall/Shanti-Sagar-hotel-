import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { Rotate3D, ArrowUpRight } from 'lucide-react'
import { Reveal } from './motion-elements'
const Sculpture = lazy(() => import('./table-sculpture'))
class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}
function FlatSculpture() { return <div className="flat-sculpture" aria-label="Decorative porcelain plate composition"><div className="plate plate-one"/><div className="plate plate-two"/><div className="gold-knot">∞</div><div className="sculpture-leaf"/><div className="sculpture-leaf second"/></div> }
export function TableExperience() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [visible, setVisible] = useState(!document.hidden)
  const [enabled, setEnabled] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' })
    if (ref.current) observer.observe(ref.current)
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [])
  const enable = () => {
    try {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('webgl2') || canvas.getContext('webgl')
      if (!context) { setFailed(true); return }
      context.getExtension('WEBGL_lose_context')?.loseContext()
      setEnabled(true)
    } catch { setFailed(true) }
  }
  return <section className="table-experience section-pad" aria-labelledby="table-heading"><Reveal className="table-copy"><span className="eyebrow">02 / THE ART OF THE TABLE</span><h2 id="table-heading">A little theatre.<br/><em>A lot of soul.</em></h2><p>A celebration of the rituals around a meal. Porcelain, a touch of gold, and space for something wonderful.</p><span className="table-footnote">AN ORIGINAL DECORATIVE SCULPTURE<br/>NOT A REPRESENTATION OF A RESTAURANT DISH</span><a className="text-link" href="#menu">Discover the menu concept <ArrowUpRight size={17}/></a></Reveal><div ref={ref} className="sculpture-stage">
    <span className="sculpture-number">S / S</span>
    {enabled && !failed ? <SceneBoundary fallback={<FlatSculpture/>}><Suspense fallback={<div className="scene-loading" role="status">Preparing the table…</div>}><Sculpture active={inView && visible} reduced={!!reduced} onFailure={() => setFailed(true)}/></Suspense></SceneBoundary> : <FlatSculpture/>}
    <div className="sculpture-controls">{!failed ? <button className="sculpture-button" onClick={() => enabled ? setEnabled(false) : enable()}><Rotate3D size={17}/>{enabled ? 'Return to still life' : 'Explore in 3D'}</button> : <span>Still-life mode · 3D unavailable</span>}<small>{enabled ? 'Drag to rotate · Touch to explore' : 'A quiet still life. An optional new perspective.'}</small></div>
  </div></section>
}
