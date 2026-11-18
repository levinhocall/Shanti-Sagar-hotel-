export type Point = { x: number; y: number };
export type Side = -1 | 1;
export type Gesture = 'grip' | 'rest' | 'point' | 'present' | 'thumb' | 'wave';
export type ArmPose = { shoulder: Point; elbow: Point; wrist: Point; tip: Point; angle: number; reachable: boolean };

export const ARM_LENGTHS = { upper: 72, forearm: 64, finger: 29 } as const;

export function mix(from: Point, to: Point, progress: number): Point {
  return { x: from.x + (to.x - from.x) * progress, y: from.y + (to.y - from.y) * progress };
}

export function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

const constrain = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));
export const ease = (value: number) => {
  const t = constrain(value, 0, 1);
  return t * t * (3 - 2 * t);
};

export function viewportToWorld(point: Point, viewport: { width: number; height: number }) {
  return { x: point.x - viewport.width / 2, y: viewport.height / 2 - point.y };
}

// The bend plane stays in screen space. The model binder can preserve depth
// and roll when converting the resulting world points to its local joint axes.
export function solveArm(shoulder: Point, target: Point, side: Side, scale: number): ArmPose {
  const upper = ARM_LENGTHS.upper * scale;
  const forearm = ARM_LENGTHS.forearm * scale;
  const finger = ARM_LENGTHS.finger * scale;
  const span = distance(shoulder, target);
  const dx = span > .001 ? (target.x - shoulder.x) / span : side;
  const dy = span > .001 ? (target.y - shoulder.y) / span : 0;
  const requested = span - finger;
  const reach = constrain(requested, Math.abs(upper - forearm) + .01, upper + forearm - .01);
  const along = (upper * upper + reach * reach - forearm * forearm) / (2 * reach);
  const bend = Math.sqrt(Math.max(0, upper * upper - along * along));
  const wrist = { x: shoulder.x + dx * reach, y: shoulder.y + dy * reach };
  return {
    shoulder,
    elbow: { x: shoulder.x + dx * along + side * dy * bend, y: shoulder.y + dy * along - side * dx * bend },
    wrist,
    tip: { x: wrist.x + dx * finger, y: wrist.y + dy * finger },
    angle: Math.atan2(-dy, dx) - Math.PI / 2,
    reachable: Math.abs(reach - requested) < .05,
  };
}

export type Pose = {
  phase: 'entrance' | 'idle' | 'travel' | 'surprise' | 'look' | 'reach' | 'contact' | 'present' | 'approve' | 'happy' | 'recover';
  anchor: Point;
  left: Point;
  right: Point;
  gaze: Point;
  scale: number;
  tilt: number;
  direction?: "up" | "down";
  grip: Gesture;
  hideHead?: boolean;
  hidden?: boolean;
};

export function shoulderOf(pose: Pose, side: Side): Point {
  return { x: pose.anchor.x + side * 25 * pose.scale, y: pose.anchor.y + 33 * pose.scale };
}

export function restingPose(anchor: Point, scale: number): Pose {
  return {
    phase: 'idle', anchor, scale, tilt: 0, grip: 'rest',
    left: { x: anchor.x - 68 * scale, y: anchor.y + 77 * scale },
    right: { x: anchor.x + 68 * scale, y: anchor.y + 77 * scale },
    gaze: { x: anchor.x, y: anchor.y + 75 * scale },
  };
}

export function contactPoint(rect: Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>): Point {
  return { x: rect.left + rect.width * .68, y: rect.top + Math.min(17, rect.height * .28) };
}
