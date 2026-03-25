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

/* ── Phase text block ─────────────────────────────────────────────────────── */

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
  const y = useTransform(scrollYProgress, range, [60, 0, 0, -60]);
  const scale = useTransform(scrollYProgress, range, [0.96, 1, 1, 0.96]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{ opacity, y, scale, willChange: 'transform, opacity' }}
    >
      {/* Phase number + subtitle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <span
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            fontFamily: 'var(--font-stack-heading)',
            color: '#c084fc',
            padding: '4px 10px',
            border: '1px solid rgba(192,132,252,0.3)',
            borderRadius: '999px',
          }}
        >
          {phase.label}
        </span>
        <span
          style={{
            fontSize: 'clamp(0.6rem, 0.85vw, 0.72rem)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(192,132,252,0.7)',
            fontFamily: 'var(--font-stack-heading)',
          }}
        >
          {phase.subtitle}
        </span>
      </div>

      {/* Heading */}
      <h2
        style={{
          fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
          fontWeight: 900,
          lineHeight: 1.0,
          color: '#ffffff',
          fontFamily: 'var(--font-stack-heading)',
          whiteSpace: 'pre-line',
          marginBottom: '24px',
          letterSpacing: '-0.03em',
        }}
      >
        {phase.title}
      </h2>

      {/* Accent line */}
      <div
        style={{
          width: '48px',
          height: '2px',
          background: 'linear-gradient(to right, #c084fc, rgba(192,132,252,0.2))',
          marginBottom: '20px',
          borderRadius: '1px',
        }}
      />

      {/* Description */}
      <p
        style={{
          fontSize: 'clamp(0.9rem, 1.15vw, 1.1rem)',
          lineHeight: 1.75,
          color: 'rgba(220,220,235,0.8)',
          maxWidth: '400px',
          fontFamily: 'var(--font-stack-body)',
        }}
      >
        {phase.description}
      </p>
    </motion.div>
  );
});

/* ── Vertical progress track ──────────────────────────────────────────────── */

const ProgressTrack = memo(({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
  const trackHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div
      className="hidden lg:flex flex-col items-center"
      style={{
        position: 'absolute',
        left: '50%',
        top: '15%',
        bottom: '15%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        width: '40px',
      }}
    >
      {/* Track line */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '1px',
          background: 'rgba(192,132,252,0.12)',
          transform: 'translateX(-50%)',
        }}
      >
        {/* Active fill */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: trackHeight,
            background: 'linear-gradient(to bottom, #c084fc, rgba(192,132,252,0.3))',
          }}
        />
      </div>

      {/* Dots at each phase midpoint */}
      {phases.map((phase, i) => {
        const mid = (phase.range[1] + phase.range[2]) / 2;
        const pct = `${mid * 100}%`;
        return (
          <PhaseIndicator
            key={i}
            scrollYProgress={scrollYProgress}
            target={mid}
            label={phase.label}
            style={{ position: 'absolute', top: pct, transform: 'translate(-50%, -50%)', left: '50%' }}
          />
        );
      })}
    </div>
  );
});

function PhaseIndicator({
  scrollYProgress,
  target,
  label,
  style,
}: {
  scrollYProgress: MotionValue<number>;
  target: number;
  label: string;
  style: React.CSSProperties;
}) {
  const isActive = useTransform(scrollYProgress, (v) => Math.abs(v - target) < 0.1 ? 1 : 0);
  const dotScale = useTransform(scrollYProgress, [target - 0.12, target, target + 0.12], [0.5, 1, 0.5]);
  const dotOpacity = useTransform(scrollYProgress, [target - 0.15, target, target + 0.15], [0.25, 1, 0.25]);
  const labelOpacity = useTransform(scrollYProgress, [target - 0.1, target - 0.05, target + 0.05, target + 0.1], [0, 1, 1, 0]);

  return (
    <div style={{ ...style, display: 'flex', alignItems: 'center', gap: '12px' }}>
      <motion.div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#c084fc',
          scale: dotScale,
          opacity: dotOpacity,
          boxShadow: '0 0 12px rgba(192,132,252,0.5)',
          flexShrink: 0,
        }}
      />
      <motion.span
        style={{
          opacity: labelOpacity,
          fontSize: '0.6rem',
          letterSpacing: '0.15em',
          color: 'rgba(192,132,252,0.8)',
          fontFamily: 'var(--font-stack-heading)',
          whiteSpace: 'nowrap',
          position: 'absolute',
          left: '28px',
        }}
      >
        {label}
      </motion.span>
    </div>
  );
}

/* ── Scroll hint ──────────────────────────────────────────────────────────── */

function ScrollHint({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      style={{ opacity }}
    >
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        style={{
          width: '20px',
          height: '32px',
          borderRadius: '10px',
          border: '1.5px solid rgba(192,132,252,0.4)',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '6px',
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{
            width: '3px',
            height: '6px',
            borderRadius: '2px',
            background: '#c084fc',
          }}
        />
      </motion.div>
      <span
        style={{
          fontSize: '0.55rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(192,132,252,0.5)',
          fontFamily: 'var(--font-stack-heading)',
        }}
      >
        Scroll
      </span>
    </motion.div>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */

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
    <div ref={containerRef} className="relative w-full" style={{ height: '500vh' }}>
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: '#0a0118' }}
      >
        {/* ── True 50/50 split via CSS grid ── */}
        <div
          className="relative z-10 h-full"
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          }}
        >

          {/* Left: Text */}
          <div
            className="relative flex items-center"
            style={{
              padding: isMobile ? '0 28px' : '0 clamp(48px, 6vw, 96px)',
              paddingTop: isMobile ? '12vh' : 0,
              zIndex: 10,
            }}
          >
            {/* Readability gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: isMobile
                  ? 'linear-gradient(to bottom, rgba(10,1,24,0.97) 0%, rgba(10,1,24,0.75) 50%, transparent 100%)'
                  : 'linear-gradient(to right, rgba(10,1,24,0.95) 0%, rgba(10,1,24,0.8) 60%, rgba(10,1,24,0.2) 90%, transparent 100%)',
              }}
            />

            <div className="relative z-10 w-full max-w-[480px]" style={{ minHeight: isMobile ? 200 : 260 }}>
              {phases.map((_, i) => (
                <PhaseText key={i} scrollYProgress={scrollYProgress} phaseIndex={i} />
              ))}
            </div>
          </div>

          {/* Right: Globe */}
          <div
            className="relative"
            style={{
              position: isMobile ? 'absolute' : 'relative',
              inset: isMobile ? 0 : undefined,
              zIndex: isMobile ? 1 : 5,
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 45%, rgba(88,28,135,0.45) 0%, rgba(40,10,80,0.15) 45%, transparent 75%)',
              }}
            />

            {globeReady && (
              <Suspense fallback={null}>
                <GlobeWrapper scrollYProgress={scrollYProgress} isVisible={isVisible} />
              </Suspense>
            )}
          </div>

          {/* Centre progress track — absolutely positioned over the grid seam */}
          <ProgressTrack scrollYProgress={scrollYProgress} />
        </div>

        {/* Scroll hint */}
        <ScrollHint scrollYProgress={scrollYProgress} />

        {/* Top edge glow */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none z-20"
          style={{ background: 'linear-gradient(to right, transparent, rgba(192,132,252,0.2) 30%, rgba(192,132,252,0.2) 70%, transparent)' }}
        />

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-20"
          style={{ background: 'linear-gradient(to top, #0a0118 0%, transparent 100%)' }}
        />
      </div>
    </div>
  );
}

export function AboutStory() {
  return <HeroStory />;
}
