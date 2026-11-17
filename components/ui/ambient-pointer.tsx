import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

export function AmbientPointer() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const smoothX = useSpring(x, { stiffness: 70, damping: 28 })
  const smoothY = useSpring(y, { stiffness: 70, damping: 28 })
  useEffect(() => {
    if (reduced) return
    const media = matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setEnabled(media.matches)
    update(); media.addEventListener('change', update)
    const move = (event: PointerEvent) => { if (!media.matches) return; x.set(event.clientX); y.set(event.clientY) }
    const leave = () => { x.set(-200); y.set(-200) }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => { media.removeEventListener('change', update); window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave) }
  }, [x, y, reduced])
  if (reduced || !enabled) return null
  return <motion.div className="ambient-pointer" style={{ x: smoothX, y: smoothY }} aria-hidden="true"/>
}
