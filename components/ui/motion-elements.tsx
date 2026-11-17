import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .75, ease: [.22, 1, .36, 1] }}>{children}</motion.div>
}
export function MagneticLink({ children, className = '', ...props }: HTMLMotionProps<'a'>) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 190, damping: 18 })
  const springY = useSpring(y, { stiffness: 190, damping: 18 })
  return <motion.a {...props} className={`magnetic ${className}`} style={{ ...props.style, x: springX, y: springY }} onPointerMove={event => {
    if (reduced || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - bounds.left - bounds.width / 2) * .12)
    y.set((event.clientY - bounds.top - bounds.height / 2) * .16)
  }} onPointerLeave={() => { x.set(0); y.set(0) }}>{children}</motion.a>
}
