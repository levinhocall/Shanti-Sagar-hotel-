import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { FoodImage } from './FoodImage';

const lines = ['Good food brings', 'everyone to the table.'];
const steps = [
  { title: 'Start with something crisp', content: 'Explore the contrast of crisp dosa, soft idli and warm sambar in our sample menu.', image: 'dosa-900.webp', alt: 'Illustrative photo of idli with sambar and coconut chutney' },
  { title: 'Make room for something rich', content: 'From paneer curry to fragrant rice, the Food Explorer pairs familiar flavours with a closer look.', image: 'paneer-900.webp', alt: 'Illustrative photo of paneer curry' },
  { title: 'Pass a plate around', content: 'A thali brings bread, rice and small servings together on one plate.', image: 'feast-900.webp', alt: 'Illustrative photo of a shared thali' },
];

function StoryPhoto({ step, index, progress }: { step: typeof steps[number]; index: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, .23, .4, .56, .72, 1], [
    [1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1],
  ][index]);
  const scale = useTransform(progress, [0, 1], [1, 1.08]);
  return (
    <motion.div aria-hidden className="story-photo-layer" style={{ opacity, scale }}>
      <FoodImage src={`/images/${step.image}`} alt="" loading="lazy" decoding="async" />
    </motion.div>
  );
}

export function RestaurantStory() {
  const reduced = useReducedMotion();
  const story = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: story, offset: ['start .66', 'end .55'] });
  let delayIndex = 0;
  return (
    <section id="story" className="story section" tabIndex={-1} aria-labelledby="story-heading">
      <div className="shell">
        <motion.h2 id="story-heading" className="story-tagline" initial={reduced ? false : 'muted'} whileInView="shown" viewport={{ once: true, amount: .6 }}>
          {lines.map((line, lineIndex) => <span className="story-line" key={line}>{lineIndex > 0 && ' '}{line.split(' ').map(word => {
            const delay = delayIndex++ * .078;
            return <motion.span key={word} variants={{ muted: { opacity: .7 }, shown: { opacity: 1, transition: { delay: reduced ? 0 : delay, duration: .34 } } }}>{word}{' '}</motion.span>;
          })}</span>)}
        </motion.h2>
        <div className="scroll-story" ref={story}>
          {!reduced && <figure className="storyline-photo story-wide-photo">
            {steps.map((step, index) => <StoryPhoto key={step.image} step={step} index={index} progress={scrollYProgress} />)}
            <figcaption>Illustrative food photography</figcaption>
          </figure>}
          <div className={reduced ? 'story-steps story-static' : 'story-steps'}>
            {steps.map(step => <motion.article key={step.title} initial={reduced ? false : { y: 16 }}
              whileInView={{ y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: reduced ? 0 : .65 }}>
              <figure className="story-inline-photo">
                <FoodImage src={`/images/${step.image}`} alt={step.alt} loading="lazy" decoding="async" />
                <figcaption>Illustrative food photography</figcaption>
              </figure>
              <div><h3>{step.title}</h3><p>{step.content}</p></div>
            </motion.article>)}
          </div>
        </div>
      </div>
    </section>
  );
}
