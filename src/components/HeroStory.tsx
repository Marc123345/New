import React, { useRef, useState, useEffect, memo, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { useIsMobile } from '../hooks/useIsMobile';

const GlobeWrapper = lazy(() =>
  import('./HeroStory/Globe/GlobeWrapper').then((m) => ({ default: m.GlobeWrapper }))
);

const phases = [
  {
    subtitle: 'The World Is Connected',
    title: 'But connection\nis not enough.',
    description: 'At H2H, we help companies show up online with a voice that feels real, relatable, and worth listening to.',
    range: [0, 0.1, 0.22, 0.28] as [number, number, number, number],
  },
  {
    subtitle: 'The Digital Era',
    title: 'Brands went\ndigital. Fast.',
    description: "In today's crowded digital world, connection is currency. Your audience wants honesty, personality, and purpose.",
    range: [0.22, 0.32, 0.45, 0.52] as [number, number, number, number],
  },
  {
    subtitle: 'The AI Era',
    title: 'More content.\nLess connection.',
    description: "We help you deliver all three — through strategy, storytelling, and content that actually resonates.",
    range: [0.48, 0.56, 0.68, 0.76] as [number, number, number, number],
  },
  {
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
  const y = useTransform(scrollYProgress, range, [40, 0, 0, -40]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{ opacity, y, willChange: 'transform, opacity' }}
    >
      <span
        style={{
          fontSize: 'clamp(0.6rem, 0.9vw, 0.75rem)',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(192,132,252,0.9)',
          fontFamily: 'var(--font-stack-heading)',
          marginBottom: '16px',
          display: 'block',
        }}
      >
        {phase.subtitle}
      </span>
      <h2
        style={{
          fontSize: 'clamp(2rem, 4.5vw, 4rem)',
          fontWeight: 900,
          lineHeight: 1.05,
          color: '#ffffff',
          fontFamily: 'var(--font-stack-heading)',
          whiteSpace: 'pre-line',
          marginBottom: '20px',
          letterSpacing: '-0.02em',
        }}
      >
        {phase.title}
      </h2>
      <p
        style={{
          fontSize: 'clamp(0.875rem, 1.1vw, 1.1rem)',
          lineHeight: 1.7,
          color: 'rgba(209,213,219,0.85)',
          maxWidth: '420px',
          fontFamily: 'var(--font-stack-body)',
        }}
      >
        {phase.description}
      </p>
    </motion.div>
  );
});

const ProgressDots = memo(({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
  return (
    <div
      className="hidden md:flex flex-col items-center gap-3"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
      }}
    >
      {phases.map((phase, i) => {
        const mid = (phase.range[1] + phase.range[2]) / 2;
        return <DotIndicator key={i} scrollYProgress={scrollYProgress} target={mid} />;
      })}
    </div>
  );
});

function DotIndicator({ scrollYProgress, target }: { scrollYProgress: MotionValue<number>; target: number }) {
  const scale = useTransform(scrollYProgress, [target - 0.12, target, target + 0.12], [0.6, 1, 0.6]);
  const dotOpacity = useTransform(scrollYProgress, [target - 0.15, target, target + 0.15], [0.3, 1, 0.3]);
  return (
    <motion.div
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#c084fc',
        scale,
        opacity: dotOpacity,
        boxShadow: '0 0 10px rgba(192,132,252,0.6)',
      }}
    />
  );
}

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
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: '500vh' }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: '#0a0118' }}
      >
        {/* ── Split layout ── */}
        <div className="relative z-10 h-full flex flex-col md:flex-row">

          {/* Left: Text phases */}
          <div
            className="relative flex-1 flex items-center"
            style={{
              padding: isMobile ? '0 24px' : '0 clamp(40px, 5vw, 80px)',
              paddingTop: isMobile ? '15vh' : 0,
            }}
          >
            {/* Subtle gradient behind text for readability */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: isMobile
                  ? 'linear-gradient(to bottom, rgba(10,1,24,0.95) 0%, rgba(10,1,24,0.7) 60%, transparent 100%)'
                  : 'linear-gradient(to right, rgba(10,1,24,0.95) 0%, rgba(10,1,24,0.6) 70%, transparent 100%)',
              }}
            />

            <div className="relative z-10 w-full max-w-lg" style={{ minHeight: isMobile ? 180 : 220 }}>
              {phases.map((_, i) => (
                <PhaseText key={i} scrollYProgress={scrollYProgress} phaseIndex={i} />
              ))}
            </div>
          </div>

          {/* Centre dots (desktop only) */}
          <ProgressDots scrollYProgress={scrollYProgress} />

          {/* Right: Globe */}
          <div
            className="absolute md:relative md:flex-1"
            style={{
              inset: isMobile ? 0 : undefined,
              width: isMobile ? '100%' : undefined,
              height: isMobile ? '100%' : undefined,
              zIndex: isMobile ? 1 : undefined,
            }}
          >
            {/* Purple ambient glow behind globe */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 45%, rgba(88,28,135,0.4) 0%, rgba(30,0,60,0.15) 50%, transparent 80%)',
              }}
            />

            {globeReady && (
              <Suspense fallback={null}>
                <GlobeWrapper scrollYProgress={scrollYProgress} isVisible={isVisible} />
              </Suspense>
            )}
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
          style={{ background: 'linear-gradient(to top, #0a0118 0%, transparent 100%)' }}
        />
      </div>
    </div>
  );
}

export function AboutStory() {
  return <HeroStory />;
}
