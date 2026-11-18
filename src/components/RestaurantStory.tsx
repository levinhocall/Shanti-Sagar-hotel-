import { motion, useReducedMotion } from 'motion/react';
import { FoodImage } from './FoodImage';

const lines = ['Good food brings', 'everyone to the table.'];
const steps = [
  ['Start with something crisp', 'Explore the contrast of crisp dosa, soft idli and warm sambar in our sample menu.'],
  ['Make room for something rich', 'From paneer curry to fragrant rice, the Food Explorer pairs familiar flavours with a closer look.'],
  ['Pass a plate around', 'The 3D table imagines a thali built for sharing, with every bowl and bite in its place.'],
];

export function RestaurantStory() {
  const reduced = useReducedMotion();
  let delayIndex = 0;
  return (
    <section id="story" className="story section" tabIndex={-1} aria-labelledby="story-heading">
      <div className="shell">
        <motion.h2 id="story-heading" className="story-tagline" initial={reduced ? false : 'muted'} whileInView="shown" viewport={{ once: true, amount: .6 }}>
          {lines.map((line, lineIndex) => <span className="story-line" key={line}>{lineIndex > 0 && ' '}{line.split(' ').map(word => {
            const delay = delayIndex++ * .078;
            return <motion.span key={word} variants={{ muted: { opacity: .35 }, shown: { opacity: 1, transition: { delay: reduced ? 0 : delay, duration: .34 } } }}>{word}{' '}</motion.span>;
          })}</span>)}
        </motion.h2>
        <div className="scroll-story">
          <figure className="storyline-photo">
            <FoodImage src="/images/dosa-900.webp" alt="Illustrative photo of idli with sambar and coconut chutney" loading="lazy" />
            <figcaption>Illustrative food photography</figcaption>
          </figure>
          <div className="story-steps">
            {steps.map(([title, content]) => <motion.article key={title} initial={reduced ? false : { opacity: .55, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: reduced ? 0 : .65 }}>
              <h3>{title}</h3><p>{content}</p>
            </motion.article>)}
          </div>
        </div>
      </div>
    </section>
  );
}
