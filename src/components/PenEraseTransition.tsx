import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Phase = 'idle' | 'erasing' | 'writing' | 'done';

const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  w: 3 + (((i * 7 + 3) % 5) / 5) * 4,
  h: 3 + (((i * 11 + 1) % 5) / 5) * 4,
  leftPct: 10 + ((i * 13 + 7) % 80),
  topPct: 20 + ((i * 17 + 3) % 60),
  yDrift: -10 - ((i * 9 + 2) % 15),
  xDrift: ((i % 3) - 1) * 5,
  delay: 0.15 + i * 0.07,
}));

export function PenEraseTransition() {
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('erasing'), 1600),
      setTimeout(() => setPhase('writing'), 3000),
      setTimeout(() => setPhase('done'), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const showB2B = phase === 'idle' || phase === 'erasing';
  const showH2H = phase === 'writing' || phase === 'done';
  const showPen = phase === 'erasing' || phase === 'writing';

  const penVariants = useMemo(() => ({
    eraseStart: { x: '-120%', y: '-50%', opacity: 0, rotate: -25 },
    eraseEnd: { x: '120%', y: '-50%', opacity: 1, rotate: -25 },
    writeStart: { x: '120%', y: '-50%', opacity: 1, rotate: -30 },
    writeEnd: { x: '-20%', y: '-50%', opacity: 1, rotate: -30 },
    hidden: { x: '0%', y: '-50%', opacity: 0, rotate: -25 },
  }), []);

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'baseline',
        minWidth: '3.5ch',
        verticalAlign: 'baseline',
      }}
    >
      <AnimatePresence mode="wait">
        {showB2B && (
          <motion.span
            key="b2b"
            className="outline-text"
            style={{
              display: 'inline-block',
              position: 'relative',
              filter: phase === 'idle' ? 'grayscale(0.5) brightness(0.75)' : undefined,
              transition: 'filter 0.3s ease',
            }}
            exit={{
              opacity: 0,
              filter: 'blur(8px)',
              transition: { duration: 0.4 },
            }}
          >
            B2B

            {phase === 'erasing' && (
              <motion.span
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflow: 'hidden',
                  pointerEvents: 'none',
                }}
                aria-hidden
              >
                <motion.span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(164,108,252,0.2) 40%, rgba(164,108,252,0.4) 50%, transparent 100%)',
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 1.0, ease: 'easeInOut' }}
                />
              </motion.span>
            )}

            {phase === 'erasing' &&
              PARTICLES.map((p) => (
                <motion.span
                  key={p.id}
                  style={{
                    position: 'absolute',
                    width: p.w,
                    height: p.h,
                    borderRadius: '50%',
                    background: 'rgba(164,108,252,0.5)',
                    left: `${p.leftPct}%`,
                    top: `${p.topPct}%`,
                    pointerEvents: 'none',
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.9, 0],
                    scale: [0, 1.2, 0.4],
                    y: [0, p.yDrift],
                    x: [0, p.xDrift],
                  }}
                  transition={{
                    duration: 0.7,
                    delay: p.delay,
                    ease: 'easeOut',
                  }}
                />
              ))}

            {phase === 'erasing' && (
              <motion.span
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '45%',
                  height: '3px',
                  background: 'rgba(164,108,252,0.6)',
                  borderRadius: 2,
                  pointerEvents: 'none',
                }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: 'easeInOut' }}
              />
            )}
          </motion.span>
        )}

        {showH2H && (
          <motion.span
            key="h2h"
            className="outline-text"
            style={{
              display: 'inline-block',
              position: 'relative',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            H2H
            {phase === 'writing' && (
              <motion.span
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  background: '#0c0c14',
                  pointerEvents: 'none',
                }}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.05,
                }}
              />
            )}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPen && (
          <motion.span
            key="pen"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              pointerEvents: 'none',
              zIndex: 10,
              filter: 'drop-shadow(0 2px 10px rgba(164,108,252,0.5))',
            }}
            initial={phase === 'erasing' ? penVariants.eraseStart : penVariants.writeStart}
            animate={phase === 'erasing' ? penVariants.eraseEnd : penVariants.writeEnd}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: phase === 'erasing' ? 1.1 : 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block' }}
            >
              <path
                d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"
                stroke="#c4a8ff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="rgba(164,108,252,0.2)"
              />
              <path
                d="M15 5l4 4"
                stroke="#d4b8ff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="2.5" cy="21.5" r="1" fill="#a46cfc" opacity="0.6" />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>

      {phase === 'done' && (
        <motion.span
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '-3px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #a46cfc, transparent)',
            borderRadius: 1,
            pointerEvents: 'none',
          }}
          initial={{ width: 0, x: '-50%', opacity: 0 }}
          animate={{ width: '120%', x: '-60%', opacity: 0.5 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        />
      )}
    </span>
  );
}
