import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, MotionConfig, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { ArrowUpRight, Leaf, Menu, X } from 'lucide-react'
import { RestaurantSections } from '@/components/ui/restaurant-sections'
import { Hero } from '@/components/ui/hero'
import { AmbientPointer } from '@/components/ui/ambient-pointer'

const links = ['About', 'Menu', 'Gallery', 'Reviews', 'Location', 'Contact']
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const toggle = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const entry = entries.find(item => item.isIntersecting)
      if (entry) setActiveSection(entry.target.id)
    }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 })
    links.forEach(link => { const section = document.getElementById(link.toLowerCase()); if (section) observer.observe(section) })
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); toggle.current?.focus() } }
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setMenuOpen(false) }
    document.addEventListener('keydown', onKey); document.addEventListener('pointerdown', outside)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', outside) }
  }, [menuOpen])
  return <MotionConfig reducedMotion="user"><LayoutGroup id="restaurant">
    <AmbientPointer/><a className="skip-link" href="#main">Skip to content</a>
    <motion.div className="scroll-progress" style={{ scaleX: reduced ? scrollYProgress : progress }}/>
    <div className="concept-banner">Unofficial Website Concept — Demo Only</div>
    <header className="site-header" ref={header}>
      <a href="#home" className="brand" aria-label="Shanti Sagar Pure Veg home"><span className="brand-mark"><Leaf size={22} strokeWidth={1}/></span><span>SHANTI SAGAR<small>PURE VEG / ULHASNAGAR</small></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(link => <a key={link} href={`#${link.toLowerCase()}`} aria-current={activeSection === link.toLowerCase() ? 'location' : undefined}>{link}</a>)}</nav>
      <a className="header-cta" href="#location">Visit us <ArrowUpRight size={16}/></a>
      <button ref={toggle} className="mobile-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      <AnimatePresence>{menuOpen && <motion.nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: reduced ? 0 : -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>{links.map((link, index) => <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}><span><small>0{index + 1}</small>{link}</span><ArrowUpRight size={19}/></a>)}</motion.nav>}</AnimatePresence>
    </header>
    <main id="main" data-design-version="cinematic-v2"><div id="home"/><Hero/><RestaurantSections/></main>
    <footer><div className="footer-top"><a className="brand" href="#home"><Leaf size={26} strokeWidth={1}/><span>SHANTI SAGAR<small>PURE VEG / ULHASNAGAR</small></span></a><p>Vegetarian at heart.<br/>Happiness at the table.</p><a className="text-link" href="#home">Back to the beginning <ArrowUpRight size={17}/></a></div><div className="footer-wordmark" aria-hidden="true">Shanti Sagar.</div><div className="footer-bottom"><span>Unofficial Website Concept — Demo Only</span><span>Sample dishes & licensed demo photography.</span><span>Thoughtfully made. Purely vegetarian.</span></div></footer>
  </LayoutGroup></MotionConfig>
}
