import { useEffect, useState } from 'react';
import { SpeakerHigh, SpeakerSlash, X } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { mascotImage } from './mascot-expressions';
import type { MascotExpression } from './mascot-expressions';
import type { DishCue } from './use-mascot-controller';

type DishReaction = {
  expression: MascotExpression;
  gesture: 'present' | 'point' | 'thumbsUp' | 'amazed';
  line: string;
};

const DISH_REACTIONS: Record<string, DishReaction> = {
  'idli-sambar': {
    expression: 'happy',
    gesture: 'present',
    line: 'ये गरमा-गरम सांभर और इडली देखिए!',
  },
  'masala-dosa': {
    expression: 'curious',
    gesture: 'point',
    line: 'क्रिस्पी मसाला डोसा — एकदम ताज़ा!',
  },
  'paneer-curry': {
    expression: 'approval',
    gesture: 'point',
    line: 'आहा! ये पनीर करी तो बहुत ही लाजवाब है!',
  },
  'vegetable-biryani': {
    expression: 'surprised',
    gesture: 'amazed',
    line: 'वाह! खुशबूदार दम वेज बिरयानी!',
  },
  'royal-thali': {
    expression: 'approval',
    gesture: 'thumbsUp',
    line: 'लाजवाब! पूरी शाकाहारी थाली का आनंद लें!',
  },
};

type Props = {
  active: boolean;
  cue: DishCue;
  onSelectDish?: (id: string) => void;
};

function GestureBadge({ gesture }: { gesture: 'namaste' | DishReaction['gesture'] }) {
  if (gesture === 'namaste') {
    return (
      <span className="floating-host-gesture gesture-namaste" aria-hidden="true">
        🙏
      </span>
    );
  }
  if (gesture === 'thumbsUp') {
    return (
      <span className="floating-host-gesture gesture-thumbs" aria-hidden="true">
        👍
      </span>
    );
  }
  if (gesture === 'present') {
    return (
      <span className="floating-host-gesture gesture-present" aria-hidden="true">
        🫴
      </span>
    );
  }
  if (gesture === 'amazed') {
    return (
      <span className="floating-host-gesture gesture-amazed" aria-hidden="true">
        ✨
      </span>
    );
  }
  return (
    <span className="floating-host-gesture gesture-point" aria-hidden="true">
      👈
    </span>
  );
}

export function FloatingHost({ active, cue }: Props) {
  const reduced = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);

  const reaction = cue.id ? DISH_REACTIONS[cue.id] : undefined;
  const isReacting = cue.phase === 'react' && Boolean(reaction);
  const isNoticing = cue.phase === 'notice';

  const expression: MascotExpression = isReacting
    ? reaction!.expression
    : isNoticing
      ? 'curious'
      : 'idle';

  const gesture: 'namaste' | DishReaction['gesture'] = isReacting
    ? reaction!.gesture
    : 'namaste';

  const speechText = isReacting
    ? reaction!.line
    : isNoticing
      ? 'ज़रा इसे देखिए...'
      : 'नमस्ते! आज क्या खाने का मन है?';

  useEffect(() => {
    if (!voiceOn || !active || dismissed || reduced || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    if (cue.phase !== 'react' || !reaction) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(reaction.line);
    utterance.lang = 'hi-IN';
    utterance.rate = 1.02;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  }, [voiceOn, active, dismissed, reduced, cue.phase, cue.id, reaction]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (reduced || !active || dismissed) return null;

  const topPercent = cue.phase === 'idle' ? 72 : Math.round(cue.cardTopRatio * 100);

  return (
    <motion.div
      className="floating-host-dock"
      data-phase={cue.phase}
      initial={{ opacity: 0, x: 40, scale: 0.9 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: isReacting ? 1.04 : 1,
        top: `${topPercent}%`,
      }}
      exit={{ opacity: 0, x: 40, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={speechText}
          className="floating-host-bubble"
          initial={{ opacity: 0, y: 6, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.96 }}
          transition={{ duration: 0.2 }}
        >
          <p>{speechText}</p>
          <div className="floating-host-controls">
            <button
              type="button"
              className="floating-host-btn"
              aria-label={voiceOn ? 'Mute host voice' : 'Enable Hindi host voice'}
              aria-pressed={voiceOn}
              onClick={() => {
                const next = !voiceOn;
                setVoiceOn(next);
                if (!next && 'speechSynthesis' in window) window.speechSynthesis.cancel();
              }}
            >
              {voiceOn ? <SpeakerHigh size={14} aria-hidden /> : <SpeakerSlash size={14} aria-hidden />}
            </button>
            <button
              type="button"
              className="floating-host-btn"
              aria-label="Hide floating host"
              onClick={() => setDismissed(true)}
            >
              <X size={14} aria-hidden />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="floating-host-avatar"
        animate={
          isReacting
            ? { rotate: [-2, 2, -1], y: [0, -5, 0] }
            : isNoticing
              ? { rotate: -3, y: -2 }
              : { rotate: 0, y: [0, -3, 0] }
        }
        transition={
          isReacting
            ? { duration: 0.55, ease: 'easeOut' }
            : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <img
          src={mascotImage(expression)}
          alt=""
          width={140}
          height={140}
          draggable={false}
        />
        <GestureBadge gesture={gesture} />
      </motion.div>
    </motion.div>
  );
}
