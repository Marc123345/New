import { useRef, useState, useEffect, memo, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { useIsMobile } from '../hooks/useIsMobile';

const GlobeWrapper = lazy(() =>
  import('./HeroStory/Globe/GlobeWrapper').then((m) => ({ default: m.GlobeWrapper }))
);

const phases = [
  {
    subtitle: 'The World Is Connected',
    title: 'But connection\nis not enough.',
    description: 'Billions of people online. Infinite content. Yet most brands still struggle to be heard — let alone felt.',
    range: [0, 0.1, 0.22, 0.28] as [number, number, number, number],
  },
  {
    subtitle: 'The Digital Era',
    title: 'Brands went\ndigital. Fast.',
    description: 'Social media, paid ads, automation. The tools multiplied. But somewhere along the way, the human voice got lost.',
    range: [0.22, 0.32, 0.45, 0.52] as [number, number, number, number],
  },
  {
    subtitle: 'The AI Era',
    title: 'More content.\nLess connection.',
    description: "AI accelerated everything — except authenticity. People don't want more noise. They want brands that speak like humans.",
    range: [0.48, 0.56, 0.68, 0.76] as [number, number, number, number],
  },
  {
    subtitle: 'The H2H Difference',
    title: 'Human to\nHuman.',
    description: 'We help brands grow by making their digital presence feel more human — thoughtful, strategic, and real.',
    range: [0.72, 0.8, 1, 1] as [number, number, number, number],
  },
] as const;

const HEADING_STYLES = phases.map((_, i) => ({
  fontFamily: 'var(--font-stack-heading)',
  textShadow: `0 0 50px rgba(168,85,247,${0.4 + i * 0.15})`,
  whiteSpace: 'pre-line' as const,
}));

const SUBTITLE_STYLE = { color: 'rgba(192,132,252,0.95)' } as const;
const DESC_STYLE = { color: 'rgba(209,213,219,0.9)' } as const;

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
      <p
        className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold mb-3 sm:mb-4"
        style={SUBTITLE_STYLE}
      >
        {phase.subtitle}
      </p>
      <h2
        className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 sm:mb-6 text-white"
        style={HEADING_STYLES[phaseIndex]}
      >
        {phase.title}
      </h2>
      <p className="text-sm sm:text-base md:text-lg leading-relaxed max-w-sm" style={DESC_STYLE}>
        {phase.description}
      </p>
    </motion.div>
  );
});

const PROGRESS_BG_STYLE = { background: 'rgba(168,85,247,0.2)' } as const;
const PROGRESS_FILL_BG = 'linear-gradient(to right, rgba(168,85,247,0.9), rgba(192,132,252,0.5))';
const DOT_STYLE_BASE = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: '#c084fc',
  boxShadow: '0 0 8px rgba(192,132,252,0.8)',
  translateX: '-50%',
} as const;
const SCROLL_LABEL_STYLE = {
  color: 'rgba(192,132,252,0.75)',
  fontFamily: 'var(--font-stack-heading)',
} as const;

const ProgressBar = memo(({ progressBarWidth }: { progressBarWidth: MotionValue<string> }) => (
  <div className="absolute bottom-6 left-4 md:left-8 lg:left-12 right-4 md:right-8 z-20 hidden md:flex flex-col gap-2">
    <div className="w-64 h-px relative" style={PROGRESS_BG_STYLE}>
      <motion.div
        className="absolute inset-y-0 left-0"
        style={{ width: progressBarWidth, background: PROGRESS_FILL_BG }}
      />
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: progressBarWidth, ...DOT_STYLE_BASE }}
      />
    </div>
    <div className="flex items-center gap-2">
      <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
        <path d="M0 4H12M12 4L8 1M12 4L8 7" stroke="rgba(192,132,252,0.75)" strokeWidth="1" strokeLinecap="round"/>
      </svg>
      <span className="text-xs uppercase tracking-[0.2em]" style={SCROLL_LABEL_STYLE}>
        scroll to explore
      </span>
    </div>
  </div>
));

const PURPLE_OVERLAY = {
  background: 'radial-gradient(ellipse at 50% 40%, rgba(88,28,135,0.35) 0%, rgba(59,7,100,0.25) 40%, rgba(30,0,60,0.2) 70%, transparent 100%)',
} as const;

const GRADIENT_OVERLAY_DESKTOP = {
  background: 'linear-gradient(to right, rgba(2,0,8,0.75) 0%, rgba(2,0,8,0.4) 35%, transparent 60%)',
} as const;

const GRADIENT_OVERLAY_MOBILE = {
  background: 'linear-gradient(to top, rgba(2,0,8,0.95) 0%, rgba(2,0,8,0.8) 25%, rgba(2,0,8,0.5) 45%, rgba(2,0,8,0.15) 65%, transparent 80%)',
} as const;

const BOTTOM_FADE_STYLE = {
  background: 'linear-gradient(to top, rgba(2,0,8,0.6) 0%, transparent 100%)',
} as const;

const STICKY_BG = {
  background: 'radial-gradient(ellipse at 60% 50%, #1a0a35 0%, #0e0422 40%, #080118 100%)',
} as const;

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

  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible && !globeReady) setGlobeReady(true);
      },
      { threshold: 0, rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [globeReady]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: '500vh' }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={STICKY_BG}
      >
        {globeReady && (
          <Suspense fallback={null}>
            <GlobeWrapper scrollYProgress={scrollYProgress} isVisible={isVisible} hideArcs={isMobile} />
          </Suspense>
        )}

        <div
          className="absolute inset-0 pointer-events-none"
          style={PURPLE_OVERLAY}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={isMobile ? GRADIENT_OVERLAY_MOBILE : GRADIENT_OVERLAY_DESKTOP}
        />

        <div className={`relative z-10 h-full flex ${isMobile ? 'items-start pt-[38vh]' : 'items-center'}`}>
          <div className="w-full max-w-8xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="w-full md:w-1/2 relative" style={{ minHeight: isMobile ? 160 : 200 }}>
              {phases.map((_, i) => (
                <PhaseText
                  key={i}
                  scrollYProgress={scrollYProgress}
                  phaseIndex={i}
                />
              ))}
            </div>
          </div>
        </div>

        <ProgressBar progressBarWidth={progressBarWidth} />

        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={BOTTOM_FADE_STYLE}
        />
      </div>
    </div>
  );
}

export function AboutStory() {
  return <HeroStory />;
}
