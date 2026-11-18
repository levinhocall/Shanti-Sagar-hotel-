"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import "./sushi-conveyor-menu.css";

export type DishTier = 1 | 2 | 3 | 4 | 5;

export interface ConveyorDish {
  id: string;
  name: string;
  description?: string;
  price: string;
  tier?: DishTier;
  image: string;
  details?: string[];
}

export interface SushiConveyorMenuLabels {
  add: string;
  close: string;
  previous: string;
  next: string;
  pause?: string;
}

export interface SushiConveyorMenuProps extends React.ComponentPropsWithoutRef<"section"> {
  items: ConveyorDish[];
  eyebrow?: string;
  heading?: string;
  caption?: string;
  action?: React.ReactNode;
  speed?: number;
  paused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  autoplay?: boolean;
  interval?: number;
  active?: number | null;
  onActiveChange?: (index: number | null) => void;
  onOpenChange?: (index: number | null) => void;
  onAdd?: (item: ConveyorDish) => void;
  onSelectDish?: (item: ConveyorDish, trigger: HTMLButtonElement) => void;
  legend?: { [tier: number]: string };
  labels?: SushiConveyorMenuLabels;
}

const DEFAULT_LABELS = { add: "Add to order", close: "Close", previous: "Previous plate", next: "Next plate", pause: "Pause belt" };
const WIDTH = 800;
const HEIGHT = 342;
const STRAIGHT = 426;
const RADIUS = 116;
const ARC = RADIUS * Math.PI;
const LENGTH = 2 * (STRAIGHT + ARC);
const FRONT = STRAIGHT / 2;

function mod(value: number, total: number) {
  return ((value % total) + total) % total;
}

// An oval track laid out by arc length so plates stay evenly spaced in turns.
function along(distance: number, radius = RADIUS) {
  const t = mod(distance, LENGTH);
  if (t < STRAIGHT) return { x: FRONT - t, z: radius };
  if (t < STRAIGHT + ARC) {
    const angle = (t - STRAIGHT) / RADIUS;
    return { x: -FRONT - radius * Math.sin(angle), z: radius * Math.cos(angle) };
  }
  if (t < 2 * STRAIGHT + ARC) return { x: -FRONT + t - STRAIGHT - ARC, z: -radius };
  const angle = (t - 2 * STRAIGHT - ARC) / RADIUS;
  return { x: FRONT + radius * Math.sin(angle), z: -radius * Math.cos(angle) };
}

function project(distance: number, rim = 0) {
  const { x, z } = along(distance, RADIUS + rim);
  const depth = (z / RADIUS + 1) / 2;
  const scale = 0.65 + 0.35 * depth;
  return { x: WIDTH / 2 + x * scale, y: 177 + z * 0.61, depth, scale };
}

function coordinates(point: ReturnType<typeof project>) {
  return `${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
}

function edge(rim: number) {
  return Array.from({ length: 96 }, (_, index) =>
    `${index === 0 ? "M" : "L"}${coordinates(project(index * LENGTH / 96, rim))}`
  ).join("") + "Z";
}

function slats(offset: number) {
  const pitch = LENGTH / 50;
  return Array.from({ length: 50 }, (_, index) => {
    const position = mod(offset, pitch) + index * pitch;
    return `M${coordinates(project(position, -41))}L${coordinates(project(position, 41))}`;
  }).join("");
}

const OUTER_RAIL = edge(46);
const INNER_RAIL = edge(-46);
const TRACK = `${edge(47)}${edge(-47)}`;

function PlateImage({ item }: { item: ConveyorDish }) {
  const [failed, setFailed] = React.useState(false);
  if (failed) return <span className="conveyor-image-fallback" aria-hidden>✦</span>;
  return <img src={item.image} alt="" loading="lazy" decoding="async" draggable={false} onError={() => setFailed(true)} />;
}

export const SushiConveyorMenu = React.forwardRef<HTMLElement, SushiConveyorMenuProps>(function SushiConveyorMenu({
  items, eyebrow, heading, caption, action, speed = 26, paused: pausedProp, onPausedChange,
  autoplay = false, interval = 3000, active: activeProp, onActiveChange, onOpenChange,
  onAdd, onSelectDish, legend, labels = DEFAULT_LABELS, className, ...rest
}, ref) {
  const uid = React.useId();
  const count = items.length;
  const pitch = LENGTH / Math.max(1, count);
  const stage = React.useRef<HTMLDivElement>(null);
  const seams = React.useRef<SVGPathElement>(null);
  const plates = React.useRef<Array<HTMLButtonElement | null>>([]);
  const dialog = React.useRef<HTMLDialogElement>(null);
  const returnFocus = React.useRef<HTMLButtonElement | null>(null);
  const offset = React.useRef(FRONT);
  const target = React.useRef<number | null>(null);
  const drag = React.useRef<{ id: number; x: number; y: number; offset: number; moved: boolean } | null>(null);
  const ignoreClick = React.useRef(false);
  const [innerActive, setInnerActive] = React.useState<number | null>(null);
  const [innerPaused, setInnerPaused] = React.useState(false);
  const [interacted, setInteracted] = React.useState(false);
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [reduced, setReduced] = React.useState(() =>
    typeof window !== "undefined" && (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false));
  const [visible, setVisible] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [focusWithin, setFocusWithin] = React.useState(false);
  const centerRef = React.useRef(0);
  const [center, setCenter] = React.useState(0);
  const selection = activeProp !== undefined ? activeProp : innerActive;
  const active = selection !== null && items[selection] ? selection : null;
  const paused = pausedProp ?? innerPaused;
  const opened = items.find(item => item.id === openId);
  const drawing = React.useRef({ active, pitch, count });

  const paint = React.useCallback(() => {
    const current = drawing.current;
    const distance = offset.current;
    seams.current?.setAttribute("d", slats(distance));
    plates.current.slice(0, current.count).forEach((plate, index) => {
      if (!plate) return;
      const point = project(distance - index * current.pitch);
      const selected = index === current.active;
      plate.style.left = `${(100 * point.x / WIDTH).toFixed(2)}%`;
      plate.style.top = `${(100 * (point.y - (selected ? 12 : 0)) / HEIGHT).toFixed(2)}%`;
      plate.style.setProperty("--plate-scale", String(point.scale * (selected ? 1.12 : 1)));
      plate.style.setProperty("--plate-light", String(0.68 + 0.32 * point.depth));
      plate.style.zIndex = String(selected ? 200 : Math.round(point.depth * 100) + 1);
    });
    const nearest = mod(Math.round((distance - FRONT) / current.pitch), Math.max(1, current.count));
    if (centerRef.current !== nearest) {
      centerRef.current = nearest;
      setCenter(nearest);
    }
  }, []);

  React.useLayoutEffect(() => {
    if (drawing.current.count !== count) {
      offset.current = FRONT;
      target.current = null;
      setInnerActive(null);
    }
    drawing.current = { active, pitch, count };
    if (active === null) target.current = null;
    else {
      const destination = FRONT + active * pitch;
      target.current = destination + Math.round((offset.current - destination) / LENGTH) * LENGTH;
    }
    paint();
  }, [active, count, pitch, paint]);

  React.useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    const node = stage.current;
    if (!node) return;
    let inView = typeof IntersectionObserver === "undefined";
    const update = () => setVisible(inView && !document.hidden);
    const observer = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    }, { threshold: 0.1 });
    observer?.observe(node);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [count]);

  const cruise = !reduced && !paused && !hovered && !focusWithin && !opened && active === null && count > 1;
  React.useEffect(() => {
    if (!visible || !count) return;
    let frame = 0;
    let previous = 0;
    function tick(now: number) {
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 1 / 60;
      previous = now;
      if (drag.current?.moved) return;
      if (target.current !== null) {
        const delta = target.current - offset.current;
        if (reduced || Math.abs(delta) < 0.35) {
          offset.current = target.current;
          target.current = null;
        } else offset.current += delta * (1 - Math.exp(-7 * dt));
      } else if (cruise) offset.current = mod(offset.current + Math.max(0, speed) * dt, LENGTH);
      paint();
      if (target.current !== null || (cruise && speed > 0)) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, count, active, cruise, speed, reduced, paint]);

  const select = React.useCallback((index: number | null) => {
    if (activeProp === undefined) setInnerActive(index);
    onActiveChange?.(index);
  }, [activeProp, onActiveChange]);

  React.useEffect(() => {
    if (!autoplay || interacted || paused || reduced || !visible || hovered || focusWithin || count < 2) return;
    const timer = window.setTimeout(() => select(mod((active ?? center) + 1, count)), Math.max(1000, interval));
    return () => window.clearTimeout(timer);
  }, [active, autoplay, center, count, focusWithin, hovered, interacted, interval, paused, reduced, select, visible]);

  React.useLayoutEffect(() => {
    if (opened && !dialog.current?.open) dialog.current?.showModal();
    else if (!opened && dialog.current?.open) dialog.current.close();
  }, [opened]);

  function step(amount: number, focusPlate = false) {
    if (!count) return;
    setInteracted(true);
    const index = mod((active ?? center) + amount, count);
    select(index);
    if (focusPlate) plates.current[index]?.focus({ preventScroll: true });
  }

  function togglePause() {
    setInteracted(true);
    const next = !paused;
    if (!next) select(null);
    if (pausedProp === undefined) setInnerPaused(next);
    onPausedChange?.(next);
  }

  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    ignoreClick.current = false;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, offset: offset.current, moved: false };
  }

  function moveDrag(event: React.PointerEvent<HTMLDivElement>) {
    const pointer = drag.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    if (!pointer.moved) {
      if (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(event.clientY - pointer.y)) return;
      pointer.moved = true;
      ignoreClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setInteracted(true);
      select(null);
      target.current = null;
      pointer.offset = offset.current;
    }
    offset.current = mod(pointer.offset - dx * WIDTH / event.currentTarget.clientWidth, LENGTH);
    paint();
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (drag.current?.id !== event.pointerId) return;
    const moved = drag.current.moved;
    drag.current = null;
    if (moved) select(mod(Math.round((offset.current - FRONT) / pitch), count));
  }

  function openPlate(index: number, trigger: HTMLButtonElement) {
    setInteracted(true);
    if (!paused) {
      if (pausedProp === undefined) setInnerPaused(true);
      onPausedChange?.(true);
    }
    select(index);
    if (onSelectDish) onSelectDish(items[index], trigger);
    else {
      returnFocus.current = trigger;
      setOpenId(items[index].id);
      onOpenChange?.(index);
    }
  }

  function closePlate() {
    dialog.current?.close();
    setOpenId(null);
    onOpenChange?.(null);
    returnFocus.current?.focus({ preventScroll: true });
  }

  const entries = ([1, 2, 3, 4, 5] as const).map(tier => ({
    tier, label: legend?.[tier] ?? (!legend ? items.find(item => (item.tier ?? 1) === tier)?.price : undefined),
  })).filter(entry => entry.label);
  const featured = active === null ? undefined : items[active];

  return (
    <section {...rest} ref={ref} className={cn("conveyor-menu", className)} aria-labelledby={heading ? uid : undefined} aria-label={heading ? undefined : "Conveyor menu"}>
      <header className="conveyor-heading">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {heading && <h3 id={uid}>{heading}</h3>}
      </header>
      <div
        className="conveyor-stage" ref={stage} hidden={!count}
        onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
        onPointerLeave={() => { setHovered(false); if (!drag.current?.moved) drag.current = null; }}
        onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}
        onFocus={() => setFocusWithin(true)}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false); }}
        onKeyDown={event => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          const from = plates.current.indexOf(event.target as HTMLButtonElement);
          if (from < 0) return;
          setInteracted(true);
          const next = mod(from + (event.key === "ArrowRight" ? 1 : -1), count);
          select(next);
          plates.current[next]?.focus({ preventScroll: true });
        }}
      >
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="conveyor-track" aria-hidden="true">
          <ellipse cx="400" cy="182" rx="255" ry="53" className="conveyor-island" />
          <path d={TRACK} fillRule="evenodd" className="conveyor-track-wall" transform="translate(0 12)" />
          <path d={TRACK} fillRule="evenodd" className="conveyor-track-deck" />
          <path ref={seams} className="conveyor-track-seams" />
          <path d={OUTER_RAIL} className="conveyor-track-rail" />
          <path d={INNER_RAIL} className="conveyor-track-rail" />
          <path d="M379 177h42m-21-11v22" className="conveyor-island-mark" />
          <circle cx="400" cy="177" r="16" className="conveyor-island-mark" />
        </svg>
        {items.map((item, index) => (
          <button key={item.id} ref={node => { plates.current[index] = node; }} type="button"
            className="conveyor-plate" data-puppet-target="dish" data-tier={item.tier ?? 1} data-active={index === active}
            aria-label={item.price ? `${item.name}, ${item.price}` : item.name} aria-haspopup="dialog"
            onClick={event => {
              if (ignoreClick.current && event.detail !== 0) { ignoreClick.current = false; return; }
              openPlate(index, event.currentTarget);
            }}
          >
            <span className="conveyor-plate-photo"><PlateImage key={item.image} item={item} /></span>
          </button>
        ))}
      </div>
      <div className="conveyor-footer">
        <div className="conveyor-caption">
          <p aria-live={caption || active !== null ? "polite" : "off"}>{featured?.name ?? (count ? caption ?? items[center]?.name : "No dishes in this selection.")}</p>
          {featured?.price && <span>{featured.price}</span>}
          {action}
        </div>
        {count > 1 && <div className="conveyor-controls" role="group" aria-label="Conveyor controls">
          <button type="button" aria-label={labels.previous} onClick={() => step(-1)}><ChevronLeft size={18} aria-hidden /></button>
          {!reduced && <button type="button" aria-label={paused || active !== null ? "Play belt" : labels.pause ?? "Pause belt"}
            onClick={active !== null && !paused ? () => { setInteracted(true); select(null); } : togglePause}>
            {paused || active !== null ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
          </button>}
          <button type="button" aria-label={labels.next} onClick={() => step(1)}><ChevronRight size={18} aria-hidden /></button>
        </div>}
      </div>
      {!!entries.length && <ul className="conveyor-legend" aria-label="Plate legend">
        {entries.map(entry => <li key={entry.tier} data-tier={entry.tier}>{entry.label}</li>)}
      </ul>}
      {!onSelectDish && opened && createPortal(
        <dialog ref={dialog} className="conveyor-dialog" aria-labelledby={`${uid}-detail`}
          onCancel={event => { event.preventDefault(); closePlate(); }}
          onClick={event => { if (event.target === event.currentTarget) closePlate(); }}>
          <div className="conveyor-dialog-content">
            <button type="button" aria-label={labels.close} onClick={closePlate}><X size={20} aria-hidden /></button>
            <div className="conveyor-dialog-image"><PlateImage key={opened.image} item={opened} /></div>
            <h3 id={`${uid}-detail`}>{opened.name}</h3>
            {opened.description && <p>{opened.description}</p>}
            {opened.price && <p>{opened.price}</p>}
            {!!opened.details?.length && <ul>{opened.details.map(detail => <li key={detail}>{detail}</li>)}</ul>}
            {onAdd && <button type="button" onClick={() => { onAdd(opened); closePlate(); }}>{labels.add}</button>}
          </div>
        </dialog>, document.body
      )}
    </section>
  );
});
