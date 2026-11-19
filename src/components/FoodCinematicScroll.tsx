import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from '@phosphor-icons/react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { FOOD_STORIES } from '../data/foodStories'
import { FoodImage } from './FoodImage'
import '../styles/food-cinema.css'

export function FoodCinematicScroll() {
  const section = useRef<HTMLElement>(null)
  const [selected, setSelected] = useState(0)
  const [chapter, setChapter] = useState(0)
  const reduced = useReducedMotion()
  const story = FOOD_STORIES[selected]
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-8, 8])

  return (
    <section ref={section} className="food-cinema section" id="food-stories" tabIndex={-1} aria-labelledby="food-cinema-title">
      <div className="shell">
        <div className="section-heading">
          <div><p className="eyebrow">The dining journal</p><h2 id="food-cinema-title">The art of the plate.</h2></div>
          <p>From a crisp dosa to a thali made for sharing, explore three ways to sit down to a vegetarian meal.</p>
        </div>
        <div className="food-study">
          <figure className="food-study-photo">
            <motion.div className="food-study-image" key={story.image}
              initial={reduced ? false : { opacity: .72 }}
              animate={{ opacity: 1 }}
              style={reduced ? undefined : { y }}
              transition={{ duration: .35 }}>
              <FoodImage src={story.image} alt={story.imageAlt} loading="lazy" decoding="async"
                style={{ objectPosition: story.position }} source={{ media: '(max-width: 700px)', srcSet: story.mobile }} />
            </motion.div>
            <figcaption>Illustrative food photography</figcaption>
          </figure>
          <div className="food-study-copy">
            <div className="filter-row" role="group" aria-label="Food stories">
              {FOOD_STORIES.map((item, index) => <button type="button" key={item.id}
                aria-pressed={selected === index} onClick={() => { setSelected(index); setChapter(0) }}>{item.name}</button>)}
            </div>
            <div className="food-study-chapter" aria-live="polite" aria-atomic="true">
              <span className="eyebrow">Chapter {chapter + 1} of {story.scenes.length}</span>
              <motion.h3 key={story.id + chapter} className="food-cinema-line"
                initial={reduced ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .24 }}>{story.scenes[chapter]}</motion.h3>
            </div>
            <div className="food-study-actions">
              <div className="filter-row" role="group" aria-label="Story chapters">
                <button type="button" aria-label="Previous" disabled={chapter === 0}
                  onClick={() => setChapter(n => n - 1)}><ArrowLeft size={17} aria-hidden /></button>
                <button type="button" aria-label="Next" disabled={chapter === story.scenes.length - 1}
                  onClick={() => setChapter(n => n + 1)}><ArrowRight size={17} aria-hidden /></button>
              </div>
              <a className="text-link" href="#menu">Explore dishes <ArrowUpRight size={16} aria-hidden /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
