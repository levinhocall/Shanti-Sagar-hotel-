import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useReducedMotion } from 'motion/react';
import { MascotRenderer } from './MascotRenderer';
import type { MascotExpression } from './mascot-expressions';
import './mascot.css';

export function InteractiveMascot({ expression }: { expression: MascotExpression }) {
  const host = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const visible = useInView(host);
  const reduced = useReducedMotion();
  const [greeting, setGreeting] = useState(false);
  const gazeX = useMotionValue(0);
  const gazeY = useMotionValue(0);
  const tilt = useMotionValue(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return <div ref={host} className="editorial-host"
    onPointerMove={event => {
      if (reduced || !visible || event.pointerType !== 'mouse') return;
      const box = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - .5;
      const y = (event.clientY - box.top) / box.height - .5;
      gazeX.set(x * 9);
      gazeY.set(y * 5);
      tilt.set(x * 4);
    }}
    onPointerLeave={() => { gazeX.set(0); gazeY.set(0); tilt.set(0); }}>
    <MascotRenderer expression={greeting ? 'happy' : expression} visible={visible} gazeX={gazeX} gazeY={gazeY} tilt={tilt}
      onHello={() => {
        setGreeting(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setGreeting(false), 1000);
      }} />
  </div>;
}
