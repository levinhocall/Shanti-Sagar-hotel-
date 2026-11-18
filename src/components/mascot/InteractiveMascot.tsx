import { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MascotRenderer } from './MascotRenderer';
import { useMascotController } from './use-mascot-controller';
import './mascot.css';

export function InteractiveMascot() {
  const controller = useMascotController();
  const [slots, setSlots] = useState<{ hero: HTMLElement | null; header: HTMLElement | null }>({ hero: null, header: null });
  useLayoutEffect(() => {
    setSlots({
      hero: document.getElementById('hero-mascot-slot'),
      header: document.getElementById('header-mascot-slot'),
    });
  }, []);

  const mascot = <MascotRenderer {...controller} />;
  if (controller.place === 'dock') return mascot;
  const slot = slots[controller.place];
  return slot ? createPortal(mascot, slot) : null;
}
