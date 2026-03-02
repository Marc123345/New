import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Phase = 'idle' | 'erasing' | 'writing' | 'done';

export function PenEraseTransition() {
  const [phase, setPhase] = useState<Phase>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('erasing'), 1800);
    const t2 = setTimeout(() => setPhase('writing'), 3200);
    const t3 = setTimeout(() => setPhase('done'), 4400);
    timerRef.current = [t1, t2, t3];
    return () => timerRef.current.forEach(clearTimeout);
  }, []);

  const showB2B = phase === 'idle' || phase === 'erasing';
  const showH2H = phase === 'writing' || phase === 'done';
  const showPen = phase === 'erasing' || phase === 'writing';

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        minWidth: '3.2ch',
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
              filter: phase === 'idle' ? 'grayscale(0.6) brightness(0.7)' : undefined,
              transition: 'filter 0.4s ease',
            }}
            exit={{ opacity: 0, filter: 'blur(6px)', transition: { duration: 0.5 } }}
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
              >
                <motion.span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, transparent 0%, rgba(164,108,252,0.15) 40%, rgba(164,108,252,0.3) 50%, transparent 100%)',
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                />
              </motion.span>
            )}

            {phase === 'erasing' && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.span
                    key={i}
                    style={{
                      position: 'absolute',
                      width: 3 + Math.random() * 4,
                      height: 3 + Math.random() * 4,
                      borderRadius: '50%',
                      background: 'rgba(164,108,252,0.4)',
                      left: `${10 + Math.random() * 80}%`,
                      top: `${20 + Math.random() * 60}%`,
                      pointerEvents: 'none',
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 0.8, 0],
                      scale: [0, 1, 0.5],
                      y: [0, -10 - Math.random() * 15],
                      x: [(Math.random() - 0.5) * 10],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2 + i * 0.08,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </>
            )}
          </motion.span>
        )}

        {showH2H && (
          <motion.span
            key="h2h"
            className="outline-text"
            style={{ display: 'inline-block', position: 'relative' }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{ position: 'relative' }}>
              H2H
              {phase === 'writing' && (
                <motion.span
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    background: 'inherit',
                    backgroundClip: 'padding-box',
                    WebkitBackgroundClip: 'padding-box',
                  }}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </span>
          </motion.span>
        )}
      </AnimatePresence>

      {showPen && (
        <motion.span
          style={{
            position: 'absolute',
            top: '50%',
            pointerEvents: 'none',
            zIndex: 5,
            filter: 'drop-shadow(0 2px 8px rgba(164,108,252,0.4))',
          }}
          initial={
            phase === 'erasing'
              ? { left: '-10%', y: '-50%', opacity: 0, rotate: -25 }
              : { left: '110%', y: '-50%', opacity: 1, rotate: -25 }
          }
          animate={
            phase === 'erasing'
              ? { left: '110%', y: '-50%', opacity: 1, rotate: -25 }
              : { left: '-10%', y: '-50%', opacity: 1, rotate: -30 }
          }
          exit={{ opacity: 0 }}
          transition={{ duration: phase === 'erasing' ? 1.2 : 0.8, ease: 'easeInOut' }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"
              stroke="#a46cfc"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="rgba(164,108,252,0.15)"
            />
            <path
              d="M15 5l4 4"
              stroke="#b181fc"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.span>
      )}

      {phase === 'done' && (
        <motion.span
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '-4px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #a46cfc, transparent)',
            borderRadius: 1,
            pointerEvents: 'none',
            transformOrigin: 'center',
          }}
          initial={{ width: 0, x: '-50%', opacity: 0 }}
          animate={{ width: '110%', x: '-55%', opacity: [0, 0.6, 0.3] }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        />
      )}
    </span>
  );
}
