import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, Leaf } from 'lucide-react'
import { FoodImage } from './food-image'

export function ScrollStory() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 80, reduced ? 0 : -80])
  const rotate = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -7, reduced ? 0 : 6])
  const scale = useTransform(scrollYProgress, [0, .5, 1], [reduced ? 1 : .9, 1, reduced ? 1 : 1.06])
  const light = useTransform(scrollYProgress, [0, .5, 1], [.15, .8, .2])
  return <section ref={ref} className="scroll-story" aria-labelledby="storyline-heading">
    <motion.div className="story-glow" style={{ opacity: reduced ? .4 : light }} aria-hidden="true"/>
    <div className="storyline-heading"><span className="eyebrow">THE SHANTI SAGAR WAY</span><h2 id="storyline-heading">Slow down.<br/><em>Take it all in.</em></h2><span className="storyline-rule"/><p>Let colour catch your eye.<br/>Let the table bring you closer.<br/>Let a meal become a moment.</p><a href="#menu" className="text-link">Find your moment <ArrowDown size={17}/></a></div>
    <motion.figure className="storyline-photo" style={{ y: imageY, rotate, scale }}><FoodImage src="/images/paneer.webp" loading="lazy" sizes="(max-width: 760px) 85vw, 45vw" alt="Paneer food moodboard in a cinematic composition. Demo stock photography." width={900} height={900}/><figcaption>COLOUR. COMFORT. CONNECTION. <span>DEMO PHOTOGRAPHY</span></figcaption></motion.figure>
    <span className="storyline-side" aria-hidden="true">A MOMENT WORTH SAVOURING</span><Leaf className="storyline-leaf" size={80} strokeWidth={.5} aria-hidden="true"/>
  </section>
}
