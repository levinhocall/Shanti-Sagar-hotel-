import { useEffect, useState } from 'react';
import { Plant } from '@phosphor-icons/react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import type { MascotExpression, MascotPose } from './mascot-expressions';
import { isMascotPoseLoaded, loadMascotPose, mascotImage } from './mascot-expressions';

type Props = {
  expression: MascotExpression;
  place: 'hero' | 'header' | 'dock';
  visible: boolean;
  gazeX: MotionValue<number>;
  gazeY: MotionValue<number>;
  tilt: MotionValue<number>;
};

const poses: Record<MascotExpression, { scale: number; rotate: number; y: number }> = {
  idle: { scale: 1, rotate: 0, y: 0 },
  curious: { scale: 1.015, rotate: -2, y: 0 },
  surprised: { scale: .94, rotate: 2, y: -3 },
  happy: { scale: 1.045, rotate: -1, y: -4 },
  approval: { scale: 1.015, rotate: -2, y: -2 },
};

export function MascotRenderer({ expression, place, visible, gazeX, gazeY, tilt }: Props) {
  const reduced = useReducedMotion();
  const x = useSpring(gazeX, { stiffness: 140, damping: 21 });
  const y = useSpring(gazeY, { stiffness: 140, damping: 21 });
  const rotate = useSpring(tilt, { stiffness: 120, damping: 21 });
  const pupilX = useTransform(x, [-6, 6], ['-0.38%', '0.65%']);
  const pupilY = useTransform(y, [-7, 7], ['-0.48%', '0.5%']);
  const [requestedGaze, setRequestedGaze] = useState(false);
  const [eyesReady, setEyesReady] = useState(false);
  const [pupilsReady, setPupilsReady] = useState(false);
  useMotionValueEvent(gazeX, 'change', () => {
    if (!reduced && !requestedGaze && matchMedia('(any-pointer: fine)').matches) setRequestedGaze(true);
  });
  const [pose, setPose] = useState<MascotPose>(() => isMascotPoseLoaded(expression) ? expression : 'idle');
  const [idleStatus, setIdleStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (!visible) return;
    let current = true;
    if (isMascotPoseLoaded(expression)) setPose(expression);
    else {
      loadMascotPose(expression).then(ok => {
        if (current) setPose(ok ? expression : 'idle');
      });
    }
    return () => { current = false; };
  }, [expression, visible]);

  useEffect(() => {
    if (reduced || !visible || expression !== 'idle') return;
    let waiting = 0;
    let opening = 0;
    let active = true;
    function schedule() {
      waiting = window.setTimeout(() => {
        loadMascotPose('blink').then(ok => {
          if (!active || !ok) return;
          setBlink(true);
          opening = window.setTimeout(() => {
            setBlink(false);
            schedule();
          }, 130);
        });
      }, 4400 + Math.random() * 2600);
    }
    schedule();
    return () => {
      active = false;
      window.clearTimeout(waiting);
      window.clearTimeout(opening);
      setBlink(false);
    };
  }, [reduced, visible, expression]);

  const rendered = blink && pose === 'idle' ? 'blink' : pose;
  const motionPose = pose === 'blink' ? poses.idle : poses[pose];
  return (
    <motion.button type="button" className={`mascot mascot--${place}`}
      aria-label="Say hello to the mascot" data-mascot-tap data-expression={expression}
      data-mascot-pose={rendered} data-mascot-status={idleStatus} data-animated={visible && !reduced && idleStatus === "ready"}
      initial={reduced || place !== 'hero' ? false : { opacity: 0, scale: .91, y: 11 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 170, damping: 17 }}>
      <motion.span className="mascot-gaze" aria-hidden="true" style={reduced || !visible ? undefined : { x, y, rotate }}>
        <span className="mascot-breath">
          <motion.span className="mascot-body" animate={reduced || !visible ? poses.idle : motionPose}
            transition={reduced || !visible ? { duration: 0 } : { type: 'spring', stiffness: 245, damping: 21 }}>
            <span className="mascot-fallback"><Plant weight="duotone" /></span>
            <motion.img className="mascot-image mascot-base" src={mascotImage('idle')} alt="" width="384" height="384"
              fetchPriority="low" draggable={false} hidden={idleStatus === 'failed'}
              onLoad={() => setIdleStatus('ready')} onError={() => setIdleStatus('failed')}
              animate={{ opacity: rendered === 'idle' ? 1 : 0 }}
              transition={{ duration: reduced || !visible || rendered === 'blink' ? 0 : .16 }} />
            {requestedGaze && !reduced && <span className="mascot-eye-rig"
              style={{ visibility: eyesReady && pupilsReady && rendered === 'idle' && idleStatus === 'ready' ? 'visible' : 'hidden' }}>
              <img className="mascot-image" src="/images/mascot/eyes.webp" alt="" draggable={false}
                onLoad={() => setEyesReady(true)} onError={() => setEyesReady(false)} />
              <motion.img className="mascot-image mascot-pupils" src="/images/mascot/pupils.webp" alt="" draggable={false}
                style={{ x: pupilX, y: pupilY }} onLoad={() => setPupilsReady(true)} onError={() => setPupilsReady(false)} />
            </span>}
            {rendered === 'blink' && <img className="mascot-image mascot-blink" src={mascotImage('blink')} alt="" draggable={false} />}
            <AnimatePresence initial={false}>
              {rendered !== 'idle' && rendered !== 'blink' && <motion.img
                key={rendered} className="mascot-image mascot-expression" src={mascotImage(rendered)} alt="" draggable={false}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: reduced || !visible ? 0 : .16 }}
                onError={() => setPose('idle')} />}
            </AnimatePresence>
          </motion.span>
        </span>
      </motion.span>
    </motion.button>
  );
}
