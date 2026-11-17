import { motion, useMotionValue, useSpring, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowUpRight, Leaf } from 'lucide-react'
import { useRef } from 'react'
import { mapSearch } from '@/src/data'
import { MagneticLink } from './motion-elements'
import { FoodImage } from './food-image'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateY = useSpring(pointerX, { stiffness: 60, damping: 25 })
  const rotateX = useSpring(pointerY, { stiffness: 60, damping: 25 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 140])
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.17])
  const copyY = useTransform(scrollYProgress, [0, .8], [0, reduced ? 0 : -90])
  const opacity = useTransform(scrollYProgress, [0, .75], [1, reduced ? 1 : .18])
  const turn = useTransform(scrollYProgress, [0, 1], [-12, reduced ? -12 : 8])
  return <section className="hero" ref={ref} aria-labelledby="hero-heading" onPointerMove={event => {
    if (reduced || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - rect.left) / rect.width - .5) * 6)
    pointerY.set(-((event.clientY - rect.top) / rect.height - .5) * 5)
  }} onPointerLeave={() => { pointerX.set(0); pointerY.set(0) }}>
    <div className="hero-atmosphere" aria-hidden="true"/>
    <div className="hero-grid-lines" aria-hidden="true"/>
    <span className="hero-coordinate">PURE VEG / SOUTH INDIAN <span>ULHASNAGAR, INDIA</span></span>
    <motion.div className="hero-copy" style={{ y: copyY, opacity }}>
      <span className="eyebrow hero-eyebrow"><span className="tiny-line"/> A VEGETARIAN AFFAIR</span>
      <h1 id="hero-heading">{['Pure Vegetarian.', 'Pure Happiness.'].map((line, index) => <span className="line-mask" key={line}><motion.span initial={reduced ? false : { y: '110%', rotate: 4 }} animate={{ y: 0, rotate: 0 }} transition={{ delay: .1 + index * .12, duration: .95, ease: [.22, 1, .36, 1] }} className={index === 1 ? 'hero-italic' : ''}>{line}</motion.span></span>)}</h1>
      <motion.div className="hero-intro" initial={reduced ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .7 }}><p>A little warmth. A little wonder.<br/>A whole world at the vegetarian table.</p><div className="hero-actions"><MagneticLink href="#menu" className="button button-gold">Explore Menu <ArrowUpRight size={19}/></MagneticLink><MagneticLink href={mapSearch} target="_blank" rel="noreferrer" className="hero-directions">Get Directions <ArrowUpRight size={16}/></MagneticLink></div></motion.div>
    </motion.div>
    <motion.div className="hero-visual" style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, y, scale }} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.1, delay: .1 }}>
      <div className="hero-orbit" aria-hidden="true"/><div className="hero-orbit second-orbit" aria-hidden="true"/>
      <motion.div className="hero-photo" style={{ rotate: turn }}><FoodImage src="/images/feast.webp" alt="Illustrative vegetarian thali spread. Licensed stock demo photography." fetchPriority="high" decoding="sync" sizes="(max-width: 760px) 95vw, 64vw" width={900} height={900}/></motion.div>
      <div className="hero-small-photo"><FoodImage src="/images/paneer.webp" alt="A sample paneer presentation, demo photography" sizes="(max-width: 760px) 30vw, 18vw" width={300} height={300}/></div>
      <div className="hero-seal"><Leaf size={22} strokeWidth={1}/><span>VEGETARIAN<br/>AT HEART</span></div>
      <span className="hero-photo-label">AN ILLUSTRATIVE FEAST / DEMO PHOTOGRAPHY</span>
    </motion.div>
    <span className="hero-watermark" aria-hidden="true">SAGAR</span>
    <a href="#about" className="hero-scroll"><span className="scroll-pill"><ArrowDown size={17}/></span><span>SCROLL TO SAVOUR</span></a>
    <div className="hero-edition"><span>SHANTI SAGAR PURE VEG</span><span>SOUTH INDIAN SOUL. VEGETARIAN AT HEART.</span></div>
  </section>
}
