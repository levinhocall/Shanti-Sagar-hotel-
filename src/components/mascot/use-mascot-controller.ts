import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

const DWELL_MS = 850;
const CARD = '.dish[data-dish-id]';
type DishCue = { phase: 'idle' | 'notice' | 'react'; id: string | null };
const idle: DishCue = { phase: 'idle', id: null };

export function useMascotController(root: RefObject<HTMLElement>, view: string, category: string, enabled: boolean) {
  const [cue, setCue] = useState<DishCue>(idle);

  useEffect(() => {
    setCue(idle);
    const section = root.current;
    if (!section || !enabled || !window.IntersectionObserver) return;
    const cards = Array.from(section.querySelectorAll<HTMLElement>(CARD))
      .filter(card => category === 'All' || card.dataset.dishCategory === category);
    const displayed = new Set(cards);
    const ratios = new Map<HTMLElement, number>();
    let current: HTMLElement | null = null;
    let pinned: HTMLElement | null = null;
    let dwell = 0;
    let restart = 0;
    let release = 0;
    let moving = false;
    const reacted = new WeakSet<HTMLElement>();

    function cancel() {
      window.clearTimeout(dwell);
      window.clearTimeout(release);
      current = null;
      setCue(idle);
    }

    function choose(card: HTMLElement | null) {
      if (card === current) return;
      cancel();
      const id = card?.dataset.dishId;
      if (!card || !id || document.hidden || reacted.has(card)) return;
      current = card;
      setCue({ phase: 'notice', id });
      dwell = window.setTimeout(() => {
        if (current !== card || !card.isConnected) return;
        reacted.add(card);
        setCue({ phase: 'react', id });
        release = window.setTimeout(cancel, 1800);
      }, DWELL_MS);
    }

    function fromViewport() {
      if (moving || document.hidden) return;
      if (pinned) { choose(pinned); return; }
      const candidates = cards.filter(card => card.isConnected && (ratios.get(card) ?? 0) >= .65);
      choose(candidates.find(card => !reacted.has(card)) ?? null);
    }

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const card = entry.target as HTMLElement;
        ratios.set(card, entry.intersectionRatio);
        if (!entry.isIntersecting) reacted.delete(card);
      }
      fromViewport();
    }, { rootMargin: '-70px 0px 0px', threshold: [0, .65] });
    cards.forEach(card => observer.observe(card));

    function target(node: EventTarget | null) {
      return node instanceof Element ? node.closest<HTMLElement>(CARD) : null;
    }

    function onEnter(event: PointerEvent | FocusEvent) {
      if ('pointerType' in event && event.pointerType !== 'mouse') return;
      if (event.type === 'focusin' && !(event.target instanceof Element && event.target.matches(':focus-visible'))) return;
      const card = target(event.target);
      if (!card || !displayed.has(card) || target(event.relatedTarget) === card) return;
      reacted.delete(card);
      pinned = card;
      choose(card);
    }
    function onLeave(event: PointerEvent | FocusEvent) {
      if ('pointerType' in event && event.pointerType !== 'mouse') return;
      const card = target(event.target);
      if (!card || target(event.relatedTarget) === card || pinned !== card) return;
      pinned = null;
      cancel();
    }
    function onScroll() {
      if (!moving) cancel();
      moving = true;
      pinned = null;
      window.clearTimeout(restart);
      restart = window.setTimeout(() => { moving = false; fromViewport(); }, 125);
    }
    function onVisibility() { if (document.hidden) cancel(); else fromViewport(); }
    section.addEventListener('pointerover', onEnter);
    section.addEventListener('pointerout', onLeave);
    section.addEventListener('focusin', onEnter);
    section.addEventListener('focusout', onLeave);
    section.addEventListener('click', cancel);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      window.clearTimeout(dwell);
      window.clearTimeout(release);
      window.clearTimeout(restart);
      section.removeEventListener('pointerover', onEnter);
      section.removeEventListener('pointerout', onLeave);
      section.removeEventListener('focusin', onEnter);
      section.removeEventListener('focusout', onLeave);
      section.removeEventListener('click', cancel);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [root, view, category, enabled]);

  return cue;
}
