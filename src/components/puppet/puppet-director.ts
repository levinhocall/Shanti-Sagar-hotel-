import { contactPoint, distance, ease, mix, restingPose, shoulderOf, solveArm } from './puppet-rig';
import type { Point, Pose } from './puppet-rig';

type Kind = 'tap' | 'present' | 'visit' | 'happy';
type Intent = { kind: Kind; node: HTMLElement; rect: DOMRect; start: number; contacted: boolean; retry: number };

const TARGET = '[data-puppet-target]';
const PAUSE_MS = 280;
const REACH_END = 690;
const CONTACT_TOLERANCE = 4;
const TARGET_COOLDOWN = 4800;

const targetOf = (node: EventTarget | null) => node instanceof Element ? node.closest<HTMLElement>(TARGET) : null;
const isDialogOpen = () => document.querySelector('dialog[open]') !== null;

export function startPuppetDirector(
  publish: (pose: Pose, contactError?: number) => void,
  verifyTip: (pose: Pose, point: Point) => number | null,
) {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section[id]'));
  const observed = new Set<HTMLElement>();
  const seenTarget = new WeakMap<HTMLElement, number>();
  const seenSection = new WeakMap<HTMLElement, number>();
  const start = performance.now();
  let scene = sections[0];
  let entrance = true;
  let intent: Intent | null = null;
  let latest = restingPose({ x: 0, y: 0 }, 1);
  let travelFrom = latest.anchor;
  let travelStart = 0;
  let surpriseStart = -Infinity;
  let lastScrollAt = -Infinity;
  let lastY = window.scrollY;
  let velocity = 0;
  let frame = 0;
  let timer = 0;
  let dirty = true;
  let active = true;
  let contactAnimation: Animation | undefined;
  let heroTop = 60;
  let headerEdge = 80;

  function scale() {
    return window.innerWidth < 560 ? .63 : window.innerWidth < 1000 ? .82 : 1;
  }

  function baseAnchor(where = scene) {
    const compact = window.innerWidth < 700;
    const left = where?.id === 'story' || where?.id === 'reviews';
    return {
      x: left ? (compact ? 75 : 116) : window.innerWidth - (compact ? 78 : 132),
      y: compact ? Math.max(headerEdge + 50, 122) : Math.max(headerEdge + 74, 154),
    };
  }

  function requestFrame() {
    if (!frame && active && !document.hidden) frame = requestAnimationFrame(step);
  }

  function clearIntent() {
    intent?.node.removeAttribute('data-puppet-contact');
    intent = null;
    contactAnimation?.cancel();
    contactAnimation = undefined;
  }

  function getRect(node: HTMLElement) {
    const rect = node.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.top + 20 >= headerEdge && rect.top < window.innerHeight - 35 ? rect : null;
  }

  function begin(kind: Kind, node: HTMLElement) {
    const now = performance.now();
    const rect = getRect(node);
    if (!rect || isDialogOpen() || document.hidden || (!entrance && now - lastScrollAt < 105)) return;
    if (intent?.node === node && intent.kind === kind) return;
    if (kind === 'tap' || kind === 'visit') {
      const previous = seenTarget.get(node);
      if (previous !== undefined && now - previous < TARGET_COOLDOWN) return;
      seenTarget.set(node, now);
    }
    clearIntent();
    entrance = false;
    intent = { kind, node, rect, start: now, contacted: false, retry: 0 };
    travelFrom = latest.anchor;
    requestFrame();
  }

  function markGeometry() {
    dirty = true;
    requestFrame();
  }

  function pickVisibleTarget() {
    if (intent || document.hidden || isDialogOpen() || !scene) return;
    const selector = scene.id === 'menu' ? '[data-puppet-target="dish"]' :
      scene.id === 'location' ? '[data-puppet-target="visit"]' : '';
    if (!selector) return;
    const choice = Array.from(scene.querySelectorAll<HTMLElement>(selector))
      .map(node => ({ node, rect: getRect(node) }))
      .filter(({ rect }) => rect !== null)
      .sort((a, b) => Math.abs(a.rect!.top - innerHeight * .43) - Math.abs(b.rect!.top - innerHeight * .43))[0];
    if (choice) begin(scene.id === 'menu' ? 'tap' : 'visit', choice.node);
  }

  function afterScroll() {
    window.clearTimeout(timer);
    timer = window.setTimeout(pickVisibleTarget, PAUSE_MS);
  }

  function syncScene(now: number) {
    const line = innerHeight * .44;
    const next = sections.find(section => {
      if (observed.size && !observed.has(section)) return false;
      const rect = section.getBoundingClientRect();
      return rect.top <= line && rect.bottom > line;
    });
    if (!next || next === scene) return;
    const previous = seenSection.get(next);
    if (previous === undefined || now - previous > 5000) {
      seenSection.set(next, now);
      surpriseStart = now;
    }
    scene = next;
    clearIntent();
    travelFrom = latest.anchor;
    travelStart = now;
    afterScroll();
  }

  function readGeometry(now: number) {
    if (!dirty) return;
    dirty = false;
    const header = document.querySelector('.site-header')?.getBoundingClientRect();
    headerEdge = Math.max(0, header?.bottom ?? 0);
    heroTop = sections[0]?.getBoundingClientRect().top ?? 0;
    syncScene(now);
    if (intent) {
      const rect = intent.node.isConnected ? getRect(intent.node) : null;
      if (!rect) clearIntent();
      else intent.rect = rect;
    }
  }

  function entrancePose(age: number, s: number): Pose {
    const x = window.innerWidth - (window.innerWidth < 700 ? 85 : 138);
    const edge = Math.max(heroTop, headerEdge + 9);
    const peek = ease((age - 1100) / 720);
    const pose = restingPose({ x, y: edge + (87 - peek * 62) * s }, s);
    pose.phase = 'entrance';
    pose.hidden = age < 400;
    pose.hideHead = age < 1100;
    pose.grip = age > 2300 ? 'wave' : 'grip';
    pose.left = { x: x - 46 * s, y: edge + 8 * s };
    pose.right = age > 2300
      ? { x: x + (57 + Math.sin((age - 2300) / 70) * 10) * s, y: edge + 14 * s }
      : { x: x + 46 * s, y: edge + 8 * s };
    pose.tilt = peek * .12;
    return pose;
  }

  function animateIntent(current: Intent, now: number, s: number) {
    const point = contactPoint(current.rect);
    const age = now - current.start;
    const desired = {
      x: Math.max(52, Math.min(innerWidth - 52, point.x - 75 * s)),
      y: Math.max(headerEdge + 24 * s, point.y - 91 * s),
    };
    const recovery = current.kind === 'present' ? 1330 : 1200;
    const anchor = age > recovery ? mix(desired, baseAnchor(), ease((age - recovery) / 430))
      : mix(travelFrom, desired, ease(age / 335));
    const pose = restingPose(anchor, s);
    pose.gaze = point;
    pose.phase = age < 310 ? 'look' : 'reach';
    const reach = ease((age - 310) / 380) * (1 - ease((age - recovery) / 380));

    if (current.kind === 'happy') {
      pose.phase = age < 760 ? 'happy' : 'recover';
      pose.tilt = Math.sin(age / 150) * .085;
      return pose;
    }

    if (current.kind === 'present') {
      const spread = Math.min(current.rect.width * .28, 65 * s);
      const center = Math.max(64, Math.min(innerWidth - 64, point.x - 35 * s));
      pose.left = mix(pose.left, { x: center - spread, y: point.y + 13 * s }, reach);
      pose.right = mix(pose.right, { x: center + spread, y: point.y + 13 * s }, reach);
      pose.grip = 'present';
      if (age >= REACH_END) pose.phase = age > recovery ? 'recover' : 'present';
    } else {
      pose.right = mix(pose.right, point, reach);
      pose.grip = 'point';
      if (age >= REACH_END) pose.phase = age > recovery ? 'recover' : current.kind === 'visit' && age > 865 ? 'approve' : 'contact';
      if (pose.phase === 'approve') {
        pose.grip = 'thumb';
        pose.right = mix(pose.right, { x: anchor.x + 67 * s, y: anchor.y + 12 * s }, ease((age - 865) / 220));
      }
    }
    return pose;
  }

  function attemptContact(current: Intent, pose: Pose) {
    if (current.contacted || pose.phase !== 'contact' || performance.now() < current.retry) return;
    current.contacted = true;
    const fresh = current.node.isConnected ? getRect(current.node) : null;
    if (!fresh) { clearIntent(); return; }
    const point = contactPoint(fresh);
    const arm = solveArm(shoulderOf(pose, 1), pose.right, 1, pose.scale);
    const error = arm.reachable && distance(arm.tip, point) <= CONTACT_TOLERANCE ? verifyTip(pose, point) : null;
    if (error === null || error > CONTACT_TOLERANCE) {
      // One correction permits a card in a layout transition to settle without
      // forcing synchronous layout reads on subsequent animation frames.
      if (current.retry === 0) {
        current.rect = fresh;
        current.contacted = false;
        current.retry = performance.now() + 100;
      }
      return;
    }
    if (current.kind === 'tap' && typeof current.node.animate === 'function') {
      current.node.dataset.puppetContact = 'true';
      contactAnimation = current.node.animate([
        { scale: '1', boxShadow: '0 0 0 0 #dcb16f00' },
        { scale: '.982', boxShadow: '0 0 0 3px #dcb16fbb', offset: .19 },
        { scale: '1.008', boxShadow: '0 0 0 5px #dcb16f35', offset: .54 },
        { scale: '1', boxShadow: '0 0 0 6px #dcb16f00' },
      ], { duration: 490, easing: 'ease-out' });
      contactAnimation.onfinish = () => current.node.removeAttribute('data-puppet-contact');
    }
    publish(pose, error);
  }

  function step(now: number) {
    frame = 0;
    if (!active || document.hidden) return;
    readGeometry(now);
    const s = scale();
    if (isDialogOpen()) {
      clearIntent();
      publish({ ...latest, hidden: true });
      return;
    }

    const age = now - start;
    if (entrance && age >= 3000) {
      entrance = false;
      travelFrom = latest.anchor;
      travelStart = now;
    }
    if (entrance) {
      latest = entrancePose(age, s);
      publish(latest);
      requestFrame();
      return;
    }

    const current = intent;
    if (current && now - current.start < 1770) {
      latest = animateIntent(current, now, s);
      publish(latest);
      attemptContact(current, latest);
      requestFrame();
      return;
    }
    if (current) clearIntent();

    const travelling = now - lastScrollAt < 175 || now - travelStart < 440;
    const anchor = mix(travelFrom, baseAnchor(), ease((now - travelStart) / 440));
    latest = restingPose(anchor, s);
    if (travelling) {
      latest.phase = 'travel';
      latest.direction = velocity < 0 ? 'up' : 'down';
      latest.tilt = Math.max(-.17, Math.min(.17, velocity * .12));
      latest.gaze = { x: anchor.x, y: anchor.y + (velocity < 0 ? -75 : 110) };
    } else if (now - surpriseStart < 1250) {
      latest.phase = 'surprise';
      latest.tilt = -.13 * ease((now - surpriseStart - 440) / 300);
    }
    publish(latest);
    if (travelling || latest.phase === 'surprise') requestFrame();
  }

  function onScroll() {
    const now = performance.now();
    const y = window.scrollY;
    if (Math.abs(y - lastY) < 1) return;
    velocity = (y - lastY) / (Number.isFinite(lastScrollAt) ? Math.max(16, now - lastScrollAt) : 16);
    lastY = y;
    if (now - lastScrollAt > 175 || entrance) {
      travelFrom = latest.anchor;
      travelStart = now;
    }
    lastScrollAt = now;
    entrance = false;
    clearIntent();
    markGeometry();
    afterScroll();
  }

  function onPointer(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return;
    const node = targetOf(event.target);
    if (!node || node === targetOf(event.relatedTarget)) return;
    begin(node.dataset.puppetTarget === 'visit' ? 'visit' : 'present', node);
  }

  function onFocus(event: FocusEvent) {
    const node = targetOf(event.target);
    if (node?.matches(':focus-visible')) begin(node.dataset.puppetTarget === 'visit' ? 'visit' : 'present', node);
  }

  function onClick(event: MouseEvent) {
    const node = targetOf(event.target);
    if (node) begin('happy', node);
  }

  function onVisibility() {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      window.clearTimeout(timer);
      clearIntent();
    } else markGeometry();
  }

  const sectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const target = entry.target as HTMLElement;
      if (entry.isIntersecting) observed.add(target);
      else observed.delete(target);
    }
    markGeometry();
  }, { rootMargin: '-40% 0px -52% 0px' });
  sections.forEach(section => sectionObserver.observe(section));

  const resizeObserver = new ResizeObserver(() => {
    markGeometry();
    afterScroll();
  });
  const main = document.querySelector('main');
  if (main) resizeObserver.observe(main);
  const menu = document.getElementById('menu');
  if (menu) resizeObserver.observe(menu);
  window.addEventListener('resize', markGeometry);
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('pointerover', onPointer, { passive: true });
  document.addEventListener('focusin', onFocus);
  document.addEventListener('click', onClick);
  document.addEventListener('close', markGeometry, true);
  document.addEventListener('visibilitychange', onVisibility);
  document.fonts?.addEventListener('loadingdone', markGeometry);

  if (window.scrollY > 100) entrance = false;
  travelFrom = baseAnchor();
  requestFrame();
  return () => {
    active = false;
    cancelAnimationFrame(frame);
    window.clearTimeout(timer);
    clearIntent();
    sectionObserver.disconnect();
    resizeObserver.disconnect();
    window.removeEventListener('resize', markGeometry);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('pointerover', onPointer);
    document.removeEventListener('focusin', onFocus);
    document.removeEventListener('click', onClick);
    document.removeEventListener('close', markGeometry, true);
    document.removeEventListener('visibilitychange', onVisibility);
    document.fonts?.removeEventListener('loadingdone', markGeometry);
  };
}
