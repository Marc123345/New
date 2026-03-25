import React, { useRef, useState, useEffect, memo, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { useIsMobile } from '../hooks/useIsMobile';

const GlobeWrapper = lazy(() =>
  import('./HeroStory/Globe/GlobeWrapper').then((m) => ({ default: m.GlobeWrapper }))
);

const phases = [
  {
    label: '01',
    subtitle: 'The World Is Connected',
    title: 'But connection\nis not enough.',
    description: 'At H2H, we help companies show up online with a voice that feels real, relatable, and worth listening to.',
    range: [0, 0.1, 0.22, 0.28] as [number, number, number, number],
  },
  {
    label: '02',
    subtitle: 'The Digital Era',
    title: 'Brands went\ndigital. Fast.',
    description: "In today's crowded digital world, connection is currency. Your audience wants honesty, personality, and purpose.",
    range: [0.22, 0.32, 0.45, 0.52] as [number, number, number, number],
  },
  {
    label: '03',
    subtitle: 'The AI Era',
    title: 'More content.\nLess connection.',
    description: 'We help you deliver all three — through strategy, storytelling, and content that actually resonates.',
    range: [0.48, 0.56, 0.68, 0.76] as [number, number, number, number],
  },
  {
    label: '04',
    subtitle: 'The H2H Difference',
    title: 'Human to\nHuman.',
    description: "Whether you're a startup or a global brand, we'll help you cut through the noise and build a social presence that connects on a human level.",
    range: [0.72, 0.8, 1, 1] as [number, number, number, number],
  },
] as const;

const PhaseText = memo(({
  scrollYProgress,
  phaseIndex,
}: {
  scrollYProgress: MotionValue<number>;
  phaseIndex: number;
}) => {
  const phase = phases[phaseIndex];
  const range = phase.range as unknown as [number, number, number, number];
  const opacity = useTransform(scrollYProgress, range, [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, range, [50, 0, 0, -50]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{ opacity, y, willChange: 'transform, opacity' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span
          style={{
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            fontFamily: 'var(--font-stack-heading)',
            color: '#c084fc',
            padding: '3px 9px',
            border: '1px solid rgba(192,132,252,0.3)',
            borderRadius: '999px',
          }}
        >
          {phase.label}
        </span>
        <span
          style={{
            fontSize: 'clamp(0.55rem, 0.8vw, 0.68rem)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(192,132,252,0.65)',
            fontFamily: 'var(--font-stack-heading)',
          }}
        >
          {phase.subtitle}
        </span>
      </div>

      <h2
        style={{
          fontSize: 'clamp(2rem, 4.5vw, 4rem)',
          fontWeight: 900,
          lineHeight: 1.02,
          color: '#ffffff',
          fontFamily: 'var(--font-stack-heading)',
          whiteSpace: 'pre-line',
          marginBottom: '18px',
          letterSpacing: '-0.03em',
        }}
      >
        {phase.title}
      </h2>

      <div
        style={{
          width: '40px',
          height: '2px',
          background: 'linear-gradient(to right, #c084fc, transparent)',
          marginBottom: '16px',
        }}
      />

      <p
        style={{
          fontSize: 'clamp(0.85rem, 1.1vw, 1.05rem)',
          lineHeight: 1.7,
          color: 'rgba(220,220,235,0.75)',
          maxWidth: '380px',
          fontFamily: 'var(--font-stack-body)',
        }}
      >
        {phase.description}
      </p>
    </motion.div>
  );
});

export function HeroStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible) setGlobeReady(true);
      },
      { threshold: 0, rootMargin: '400px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '500vh' }}>
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 60% 50%, #1a0a35 0%, #0e0422 40%, #080118 100%)' }}
      >
        {/* Globe — full background */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 45%, rgba(88,28,135,0.35) 0%, rgba(30,0,60,0.1) 50%, transparent 80%)',
            }}
          />
          {globeReady && (
            <Suspense fallback={null}>
              <GlobeWrapper scrollYProgress={scrollYProgress} isVisible={isVisible} />
            </Suspense>
          )}
        </div>

        {/* Text overlay — positioned to the left, beside the globe */}
        <div
          className="absolute inset-0 flex items-center"
          style={{
            zIndex: 10,
            padding: isMobile ? '0 24px' : '0 clamp(48px, 6vw, 100px)',
            paddingTop: isMobile ? '8vh' : 0,
          }}
        >
          {/* Readability gradient — fades from solid left to transparent right */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isMobile
                ? 'linear-gradient(to bottom, rgba(8,1,24,0.95) 0%, rgba(8,1,24,0.7) 45%, rgba(8,1,24,0.2) 70%, transparent 100%)'
                : 'linear-gradient(to right, rgba(8,1,24,0.92) 0%, rgba(8,1,24,0.7) 30%, rgba(8,1,24,0.25) 50%, transparent 65%)',
            }}
          />

          <div
            className="relative"
            style={{
              maxWidth: isMobile ? '100%' : '480px',
              minHeight: isMobile ? 200 : 240,
              width: '100%',
            }}
          >
            {phases.map((_, i) => (
              <PhaseText key={i} scrollYProgress={scrollYProgress} phaseIndex={i} />
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ zIndex: 20, opacity: scrollHintOpacity }}
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            style={{
              width: '18px',
              height: '28px',
              borderRadius: '9px',
              border: '1.5px solid rgba(192,132,252,0.35)',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '5px',
            }}
          >
            <motion.div
              animate={{ y: [0, 7, 0], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              style={{ width: '2px', height: '5px', borderRadius: '1px', background: '#c084fc' }}
            />
          </motion.div>
          <span
            style={{
              fontSize: '0.5rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(192,132,252,0.4)',
              fontFamily: 'var(--font-stack-heading)',
            }}
          >
            Scroll
          </span>
        </motion.div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none"
          style={{ zIndex: 15, background: 'linear-gradient(to top, #080118 0%, transparent 100%)' }}
        />
      </div>
    </div>
  );
}

export function AboutStory() {
  return <HeroStory />;
}
