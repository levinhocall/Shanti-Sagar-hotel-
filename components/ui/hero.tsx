import { motion, useMotionValue, useSpring, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowUpRight, Leaf } from 'lucide-react'
import { useRef } from 'react'
import { mapSearch } from '@/src/data'
import { MagneticLink } from './motion-elements'
import { FoodImage } from './food-image'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const pointerX = useMotionValue(0); const pointerY = useMotionValue(0)
  const rotateY = useSpring(pointerX, { stiffness: 70, damping: 25 })
  const rotateX = useSpring(pointerY, { stiffness: 70, damping: 25 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '16%'])
  return <section className="hero" ref={ref} aria-labelledby="hero-heading" onPointerMove={event => {
    if (reduced || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX / rect.width - .5) * 7); pointerY.set(-(event.clientY / rect.height - .5) * 5)
  }} onPointerLeave={() => { pointerX.set(0); pointerY.set(0) }}>
    <div className="hero-grain" aria-hidden="true"/>
    <motion.div className="hero-copy" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <span className="eyebrow hero-eyebrow"><span className="tiny-line"/> A VEGETARIAN AFFAIR · ULHASNAGAR</span>
      <h1 id="hero-heading">{['Pure Vegetarian.', 'Pure Happiness.'].map((line, index) => <span className="line-mask" key={line}><motion.span initial={reduced ? false : { y: '110%', rotate: 3 }} animate={{ y: 0, rotate: 0 }} transition={{ delay: .15 + index * .15, duration: 1.1, ease: [.22, 1, .36, 1] }} className={index === 1 ? 'hero-italic' : ''}>{line}</motion.span></span>)}</h1>
      <p>Some moments are meant to be savoured.<br/>Welcome to the world of Shanti Sagar Pure Veg.</p>
      <div className="hero-actions"><MagneticLink href="#menu" className="button button-gold">Explore Menu <ArrowUpRight size={19}/></MagneticLink><MagneticLink href={mapSearch} target="_blank" rel="noreferrer" className="hero-directions">Get Directions <ArrowUpRight size={16}/></MagneticLink></div>
      <div className="hero-bottom-note"><Leaf size={15}/><span>SOUTH INDIAN SOUL. VEGETARIAN AT HEART.</span></div>
    </motion.div>
    <motion.div className="hero-visual" style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, y }} initial={reduced ? false : { opacity: 0, scale: .93 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.3, delay: .2 }}>
      <div className="hero-orbit" aria-hidden="true"/>
      <div className="hero-photo"><FoodImage src="/images/feast.jpg" alt="Illustrative vegetarian thali spread. Licensed stock demo photography." fetchPriority="high" width={900} height={900}/></div>
      <div className="hero-small-photo"><FoodImage src="/images/paneer.jpg" alt="A sample paneer presentation, demo photography" width={300} height={300}/></div>
      <span className="hero-caption">THE PLEASURE OF A SHARED TABLE <span>01 — 03</span></span>
      <div className="hero-seal" aria-hidden="true"><Leaf size={21}/><span>PURE<br/>VEG</span></div>
      <span className="hero-photo-label">DEMO FOOD PHOTOGRAPHY</span>
    </motion.div>
    <a href="#about" className="hero-scroll"><span>SCROLL TO SAVOUR</span><ArrowDown size={16}/></a>
    <span className="hero-edition">EST. IN THE EVERYDAY JOY OF FOOD<br/>AN ORIGINAL WEBSITE CONCEPT</span>
  </section>
}
