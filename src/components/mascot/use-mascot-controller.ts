import { useEffect, useState } from 'react';
import { useMotionValue } from 'motion/react';
import type { MascotExpression } from './mascot-expressions';

const SCROLL_END_MS = 640;
const SECTION_REPLAY_MS = 5400;
const SURPRISE_MS = 1000;
const TAP_MS = 1000;

type Reaction = 'curious' | 'happy' | 'approval';
type Place = 'hero' | 'header' | 'dock';

function readReaction(node: EventTarget | null): HTMLElement | null {
  return node instanceof Element ? node.closest<HTMLElement>('[data-mascot-reaction]') : null;
}

function reactionOf(node: HTMLElement | null): Reaction | null {
  const value = node?.dataset.mascotReaction;
  return value === 'happy' || value === 'approval' || value === 'curious' ? value : null;
}

function sectionMood(id: string) {
  if (id === 'location') return 'approval';
  if (id === 'menu' || id === 'experience' || id === 'food-stories') return 'happy';
  return 'idle';
}

export function useMascotController() {
  const [expression, setExpression] = useState<MascotExpression>('idle');
  const [place, setPlace] = useState<Place>('hero');
  const [visible, setVisible] = useState(() => !document.hidden);
  const gazeX = useMotionValue(0);
  const gazeY = useMotionValue(0);
  const tilt = useMotionValue(0);

  useEffect(() => {
    const heroSlot = document.getElementById('hero-mascot-slot');
    const desktop = matchMedia('(min-width: 1000px)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section'));
    const entries = new Set<HTMLElement>();
    const lastReaction = new Map<HTMLElement, number>();
    let heroVisible = true;
    let section: HTMLElement | undefined;
    let sectionTimer = 0;
    let scrollTimer = 0;
    let tapTimer = 0;
    let frame = 0;
    let pointerMood: Reaction | null = null;
    let focusMood: Reaction | null = null;
    let surprised = false;
    let tapped = false;
    let scrolling = false;
    let lastY = window.scrollY;
    let lastScroll = performance.now();

    function publish() {
      if (document.hidden) return;
      let next: MascotExpression = sectionMood(section?.id ?? '');
      if (scrolling && next === 'idle') next = 'curious';
      if (surprised) next = 'surprised';
      if (focusMood) next = focusMood;
      if (pointerMood) next = pointerMood;
      if (tapped) next = 'happy';
      setExpression(next);
    }

    function updatePlace() {
      setPlace(heroVisible ? 'hero' : desktop.matches ? 'dock' : 'header');
    }

    const heroObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting && entry.intersectionRatio > .22;
      updatePlace();
    }, { threshold: [.22, .4] });
    if (heroSlot) heroObserver?.observe(heroSlot);

    const sectionsObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(observed => {
      for (const entry of observed) {
        const target = entry.target as HTMLElement;
        if (entry.isIntersecting) entries.add(target);
        else entries.delete(target);
      }
      if (entries.size === 0) return;
      const line = window.innerHeight * .43;
      const next = sections.find(item => {
        if (!entries.has(item)) return false;
        const rect = item.getBoundingClientRect();
        return rect.top <= line && rect.bottom >= line;
      }) ?? entries.values().next().value;
      if (!next || section === next) return;
      const previous = section;
      section = next;
      window.clearTimeout(sectionTimer);
      const now = performance.now();
      const last = lastReaction.get(next);
      surprised = Boolean(previous && next.id !== 'home' && (last === undefined || now - last > SECTION_REPLAY_MS));
      if (surprised) {
        lastReaction.set(next, now);
        sectionTimer = window.setTimeout(() => { surprised = false; publish(); }, SURPRISE_MS);
      }
      publish();
    }, { rootMargin: '-42% 0px -56% 0px' });
    sections.forEach(element => sectionsObserver?.observe(element));

    function centerGaze() {
      gazeX.set(0);
      gazeY.set(0);
      tilt.set(0);
    }

    function onScroll() {
      if (frame || document.hidden) return;
      frame = requestAnimationFrame(now => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastY;
        const elapsed = Math.max(16, now - lastScroll);
        lastY = y;
        lastScroll = now;
        if (Math.abs(delta) < 2) return;
        if (!reduced.matches) {
          const intensity = Math.min(1, Math.abs(delta / elapsed) / .8);
          gazeY.set(Math.sign(delta) * (2 + intensity * 5));
          tilt.set(Math.sign(delta) * intensity * 2);
        }
        if (!scrolling) { scrolling = true; publish(); }
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
          scrolling = false;
          centerGaze();
          publish();
        }, SCROLL_END_MS);
      });
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || reduced.matches || document.hidden) return;
      const x = event.clientX / window.innerWidth - .5;
      const y = event.clientY / window.innerHeight - .5;
      gazeX.set(x * 12);
      gazeY.set(y * 8);
      tilt.set(x * 4);
    }

    function onPointerOver(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return;
      const next = reactionOf(readReaction(event.target));
      if (pointerMood === next) return;
      pointerMood = next;
      publish();
    }

    function onPointerOut(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return;
      const next = reactionOf(readReaction(event.relatedTarget));
      if (pointerMood !== next) { pointerMood = next; publish(); }
      if (!event.relatedTarget) centerGaze();
    }

    function onFocus(event: FocusEvent) {
      const target = event.type === 'focusin' ? event.target : event.relatedTarget;
      // Mouse and touch focus should not leave a hover reaction pinned after scrolling.
      const control = readReaction(target);
      focusMood = control?.matches(':focus-visible') || (target instanceof Element && target.matches(':focus-visible'))
        ? reactionOf(control) : null;
      publish();
    }

    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element) || !event.target.closest('[data-mascot-tap]')) return;
      tapped = true;
      publish();
      window.clearTimeout(tapTimer);
      tapTimer = window.setTimeout(() => { tapped = false; publish(); }, TAP_MS);
    }

    function onVisibility() {
      setVisible(!document.hidden);
      lastY = window.scrollY;
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        window.clearTimeout(scrollTimer);
        window.clearTimeout(sectionTimer);
        window.clearTimeout(tapTimer);
        scrolling = surprised = tapped = false;
        pointerMood = focusMood = null;
        centerGaze();
      } else publish();
    }

    desktop.addEventListener('change', updatePlace);
    reduced.addEventListener('change', centerGaze);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
    document.addEventListener('focusin', onFocus);
    document.addEventListener('focusout', onFocus);
    document.addEventListener('click', onClick);
    return () => {
      heroObserver?.disconnect();
      sectionsObserver?.disconnect();
      desktop.removeEventListener('change', updatePlace);
      reduced.removeEventListener('change', centerGaze);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('focusout', onFocus);
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(frame);
      window.clearTimeout(scrollTimer);
      window.clearTimeout(sectionTimer);
      window.clearTimeout(tapTimer);
    };
  }, [gazeX, gazeY, tilt]);

  return { expression, place, visible, gazeX, gazeY, tilt };
}
