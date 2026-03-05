import React, { useRef, useState, useEffect, memo } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { GlobeWrapper } from './HeroStory/Globe/GlobeWrapper';

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
];

const PhaseText = memo(({
  subtitle,
  title,
  description,
  progressRange,
  scrollYProgress,
  phaseIndex,
}: {
  subtitle: string;
  title: string;
  description: string;
  progressRange: [number, number, number, number];
  scrollYProgress: MotionValue<number>;
  phaseIndex: number;
}) => {
  const opacity = useTransform(scrollYProgress, progressRange, [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, progressRange, [40, 0, 0, -40]);
  const scale = useTransform(scrollYProgress, progressRange, [0.95, 1, 1, 0.95]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center"
      style={{ opacity, y, scale, pointerEvents: 'none' }}
    >
      <p
        className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold mb-3 sm:mb-4"
        style={{ color: 'rgba(192,132,252,0.95)' }}
      >
        {subtitle}
      </p>
      <h2
        className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 sm:mb-6 text-white"
        style={{
          fontFamily: 'var(--font-stack-heading)',
          textShadow: `0 0 50px rgba(168,85,247,${0.4 + phaseIndex * 0.15})`,
          whiteSpace: 'pre-line',
        }}
      >
        {title}
      </h2>
      <p className="text-sm sm:text-base md:text-lg leading-relaxed max-w-sm" style={{ color: 'rgba(209,213,219,0.9)' }}>
        {description}
      </p>
    </motion.div>
  );
});

export function HeroStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: '100px' }
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
        style={{ background: 'radial-gradient(ellipse at 60% 50%, #0d0520 0%, #060110 40%, #020008 100%)' }}
      >
        <GlobeWrapper scrollYProgress={scrollYProgress} isVisible={isVisible} />

        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to right, rgba(2,0,8,0.75) 0%, rgba(2,0,8,0.4) 35%, transparent 60%)',
        }} />

        <div className="relative z-10 h-full flex items-center">
          <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-14 lg:px-20">
            <div className="w-full md:w-1/2 relative" style={{ minHeight: 200 }}>
              {phases.map((phase, i) => (
                <PhaseText
                  key={i}
                  subtitle={phase.subtitle}
                  title={phase.title}
                  description={phase.description}
                  progressRange={phase.range}
                  scrollYProgress={scrollYProgress}
                  phaseIndex={i}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-5 sm:left-8 md:left-14 lg:left-20 right-5 sm:right-8 z-20 flex flex-col gap-2">
          <div className="w-64 h-px relative" style={{ background: 'rgba(168,85,247,0.2)' }}>
            <motion.div
              className="absolute inset-y-0 left-0"
              style={{
                width: progressBarWidth,
                background: 'linear-gradient(to right, rgba(168,85,247,0.9), rgba(192,132,252,0.5))',
              }}
            />
            <motion.div
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                left: progressBarWidth,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#c084fc',
                boxShadow: '0 0 8px rgba(192,132,252,0.8)',
                translateX: '-50%',
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
              <path d="M0 4H12M12 4L8 1M12 4L8 7" stroke="rgba(192,132,252,0.75)" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span className="text-xs uppercase tracking-[0.2em]" style={{ color: 'rgba(192,132,252,0.75)', fontFamily: 'var(--font-stack-heading)' }}>
              scroll to explore
            </span>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(2,0,8,0.6) 0%, transparent 100%)' }}
        />
      </div>
    </div>
  );
}

export function AboutStory() {
  return <HeroStory />;
}
