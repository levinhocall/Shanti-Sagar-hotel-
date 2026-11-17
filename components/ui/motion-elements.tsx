import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import { useState, type ReactNode } from 'react'

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}
export function MagneticLink({ children, className = '', ...props }: HTMLMotionProps<'a'>) {
  const [point, setPoint] = useState({ x: 0, y: 0 })
  const reduced = useReducedMotion()
  return <motion.a {...props} className={`magnetic ${className}`} animate={point} transition={{ type: 'spring', stiffness: 190, damping: 18 }} onPointerMove={event => {
    if (reduced || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    setPoint({ x: (event.clientX - bounds.left - bounds.width / 2) * .12, y: (event.clientY - bounds.top - bounds.height / 2) * .16 })
  }} onPointerLeave={() => setPoint({ x: 0, y: 0 })}>{children}</motion.a>
}
