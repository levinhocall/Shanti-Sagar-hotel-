import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowDown, ArrowUpRight } from '@phosphor-icons/react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { FOOD_STORIES } from '../data/foodStories'
import type { FoodStory } from '../data/foodStories'
import { FoodImage } from './FoodImage'
import { FoodSequenceCanvas } from './FoodSequenceCanvas'
import '../styles/food-cinema.css'

function storyIndex(progress: number, count: number) {
  return Math.min(count - 1, Math.floor(Math.max(0, progress) * count))
}

export function FoodCinematicScroll() {
  const track = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<FoodStory['id']>('paneer')
  const [chapter, setChapter] = useState(0)
  const reduced = useReducedMotion()
  const story = FOOD_STORIES.find(item => item.id === selected) ?? FOOD_STORIES[0]
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 100px', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, .36, 1], [1.16, 1.02, 1.12])
  const y = useTransform(scrollYProgress, [0, 1], ['3%', '-3%'])
  const shade = useTransform(scrollYProgress, [0, .55, 1], [.56, .14, .08])

  useMotionValueEvent(scrollYProgress, 'change', value => {
    if (!reduced) setChapter(storyIndex(value, story.scenes.length))
  })

  function changeStory(id: FoodStory['id']) {
    setSelected(id)
    setChapter(reduced ? 0 : storyIndex(scrollYProgress.get(), story.scenes.length))
  }

  return (
    <section className="food-cinema" id="food-stories" tabIndex={-1} aria-labelledby="food-cinema-title">
      <div ref={track} className="food-cinema-track">
        <div className="food-cinema-sticky">
          <div className="food-cinema-art" style={{ '--food-position': story.position } as CSSProperties}>
            <motion.div className="food-cinema-still" style={reduced ? undefined : { scale, y }}>
              <FoodImage key={story.id} src={story.image} alt={story.imageAlt} loading="lazy"
                source={{ media: '(max-width: 700px)', srcSet: story.mobile }} />
            </motion.div>
            {!reduced && story.frameSequence && <FoodSequenceCanvas key={story.id} sequence={story.frameSequence} progress={scrollYProgress} position={.65} />}
            <motion.div className="food-cinema-light" aria-hidden="true" style={reduced ? undefined : { opacity: shade }} />
          </div>
          <div className="food-cinema-inner shell">
            <header className="food-cinema-header">
              <div><p className="eyebrow">Concept food studies</p><h2 id="food-cinema-title">The art of the plate.</h2></div>
              <div className="food-cinema-picker" role="group" aria-label="Food stories">
                {FOOD_STORIES.map(item => <button type="button" key={item.id} onClick={() => changeStory(item.id)}
                  aria-pressed={item.id === selected}>{item.name}</button>)}
              </div>
            </header>
            <div className="food-cinema-copy">
              <div className="food-cinema-chapter" aria-hidden="true">{String(chapter + 1).padStart(2, '0')} / {String(story.scenes.length).padStart(2, '0')}</div>
              <ol className="sr-only">{story.scenes.map(scene => <li key={scene}>{scene}</li>)}</ol>
              {reduced && <p className="sr-only" aria-live="polite">{story.scenes[chapter]}</p>}
              {reduced ? <p aria-hidden="true" className="food-cinema-line">{story.scenes[chapter]}</p> : (
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.p aria-hidden="true" className="food-cinema-line" key={story.id + chapter}
                    initial={{ opacity: 0, y: 13 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -11 }}
                    transition={{ duration: .32 }}>{story.scenes[chapter]}</motion.p>
                </AnimatePresence>
              )}
            </div>
            <footer className="food-cinema-footer">
              <div>
                {reduced ? <div className="food-cinema-picker" role="group" aria-label="Story chapters">
                  <button type="button" onClick={() => setChapter(n => Math.max(0, n - 1))} disabled={chapter === 0}>Previous</button>
                  <button type="button" onClick={() => setChapter(n => Math.min(story.scenes.length - 1, n + 1))} disabled={chapter === story.scenes.length - 1}>Next</button>
                </div> : <span className="food-cinema-scroll"><ArrowDown size={16} aria-hidden /> Scroll to explore</span>}
              </div>
              <a className="text-link" href="#menu">Skip to menu <ArrowUpRight size={16} aria-hidden /></a>
            </footer>
          </div>
        </div>
      </div>
    </section>
  )
}
