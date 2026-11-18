export type MascotExpression = 'idle' | 'curious' | 'surprised' | 'happy' | 'approval';
export type MascotPose = MascotExpression | 'blink';

const loaded = new Set<MascotPose>();
const pending = new Map<MascotPose, Promise<boolean>>();

export function mascotImage(pose: MascotPose) {
  return `/images/mascot/${pose}.webp`;
}

export function loadMascotPose(pose: MascotPose): Promise<boolean> {
  if (loaded.has(pose)) return Promise.resolve(true);
  const existing = pending.get(pose);
  if (existing) return existing;
  const request = new Promise<boolean>(resolve => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      loaded.add(pose);
      resolve(true);
    };
    image.onerror = () => resolve(false);
    image.src = mascotImage(pose);
  }).finally(() => pending.delete(pose));
  pending.set(pose, request);
  return request;
}

export function isMascotPoseLoaded(pose: MascotPose) {
  return loaded.has(pose);
}
