import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SHANNON_IMAGES = [
  {
    src: 'https://ik.imagekit.io/qcvroy8xpd/image%203.png',
    alt: 'Shannon - Founder of H2H',
  },
  {
    src: 'https://ik.imagekit.io/qcvroy8xpd/image%201%20(1).png',
    alt: 'Shannon - Creative Director',
  },
  {
    src: 'https://ik.imagekit.io/qcvroy8xpd/image%202.png',
    alt: 'Shannon - Brand Strategist',
  },
];

const BG_IMAGE = 'https://ik.imagekit.io/qcvroy8xpd/istockphoto-1401387054-612x612.jpg?updatedAt=1772992288758';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const AUTO_INTERVAL = 4500;

export function ShannonCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % SHANNON_IMAGES.length);
    }, AUTO_INTERVAL);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const goTo = (idx: number) => {
    setActive(idx);
    resetTimer();
  };

  const goNext = () => goTo((active + 1) % SHANNON_IMAGES.length);
  const goPrev = () => goTo((active - 1 + SHANNON_IMAGES.length) % SHANNON_IMAGES.length);

  return (
    <motion.div
      ref={containerRef}
      className="w-full mt-20 md:mt-28"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, ease: EASE_OUT_EXPO }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          border: '2px solid rgba(255,255,255,0.12)',
          background: '#0a0a0f',
          boxShadow: '0 30px 60px -15px rgba(0,0,0,0.6)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${BG_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3) saturate(0.6)',
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, rgba(6,3,15,0.7) 0%, rgba(6,3,15,0.3) 40%, rgba(6,3,15,0.6) 100%),
              radial-gradient(ellipse at center bottom, rgba(164,108,252,0.1) 0%, transparent 60%)
            `,
          }}
        />

        <div
          className="relative flex flex-col items-center justify-center"
          style={{ minHeight: 'clamp(400px, 55vw, 600px)', padding: 'clamp(24px, 4vw, 48px)' }}
        >
          <div className="relative w-full flex items-center justify-center" style={{ maxWidth: '380px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                className="w-full"
              >
                <div
                  className="relative overflow-hidden mx-auto"
                  style={{
                    maxWidth: '320px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 50px -10px rgba(0,0,0,0.6), 0 0 40px rgba(164,108,252,0.08)',
                  }}
                >
                  <img
                    src={SHANNON_IMAGES[active].src}
                    alt={SHANNON_IMAGES[active].alt}
                    className="w-full block"
                    style={{
                      aspectRatio: '3 / 4',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                    }}
                    loading="lazy"
                  />

                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `
                        linear-gradient(180deg, rgba(6,3,15,0.15) 0%, transparent 30%),
                        linear-gradient(180deg, transparent 60%, rgba(6,3,15,0.85) 100%)
                      `,
                    }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                width: '40px',
                height: '40px',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                width: '40px',
                height: '40px',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3 mt-8">
            {SHANNON_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
                className="relative transition-all duration-300"
                style={{
                  width: active === i ? '32px' : '8px',
                  height: '8px',
                  background: active === i ? 'var(--color-secondary)' : 'rgba(255,255,255,0.25)',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              />
            ))}
          </div>

          <motion.div
            className="absolute bottom-6 left-6 md:bottom-8 md:left-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT_EXPO }}
          >
            <span
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: '0.55rem',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--color-secondary)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Founder
            </span>
            <span
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--color-text-dark)',
              }}
            >
              Shannon
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
