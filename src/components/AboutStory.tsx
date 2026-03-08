import { useRef, memo } from 'react';
import {
  motion,
  useScroll,
  useTransform,
} from 'motion/react';
import { SignalBackground } from './about/SignalBackground';
import { ImpactStack } from './about/ImpactStack';
import { WhyH2HPanel } from './about/WhyH2HPanel';
import { SignatureEnding } from './about/SignatureEnding';
import { SpinningH2H } from './about/SpinningH2H';

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

function Eyebrow({ label }: { label: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
      style={{
        fontFamily: 'var(--font-stack-heading)',
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.35em',
        textTransform: 'uppercase',
        color: 'rgba(164,108,252,0.8)',
        display: 'block',
        marginBottom: '28px',
      }}
    >
      {label}
    </motion.span>
  );
}

function HeroBlock() {
  return (
    <div className="flex flex-col items-start w-full mb-4">
      <Eyebrow label="About H2H" />

      <h2
        style={{
          fontSize: 'clamp(2.8rem, 7vw, 6rem)',
          fontFamily: 'var(--font-stack-heading)',
          color: 'var(--color-text-dark)',
          lineHeight: 1.05,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '-0.04em',
          margin: 0,
        }}
      >
        <span className="block overflow-hidden pb-2">
          <motion.span
            className="block"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
          >
            From Brand Voice
          </motion.span>
        </span>
        <span className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: '100%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1.2, delay: 0.15, ease: EASE_OUT_EXPO }}
          >
            <span style={{ color: 'transparent', WebkitTextStroke: '2px var(--color-surface-dark)' }}>
              To Human
            </span>{' '}
            Connection
          </motion.span>
        </span>
      </h2>
    </div>
  );
}

function NarrativeBlock() {
  return (
    <div className="flex flex-col gap-8" style={{ maxWidth: '600px' }}>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1, delay: 0.2, ease: EASE_OUT_EXPO }}
        style={{
          fontFamily: 'var(--font-stack-body)',
          fontSize: 'clamp(1.1rem, 1.5vw, 1.25rem)',
          lineHeight: 1.8,
          color: 'rgba(232,226,255,0.85)',
          margin: 0,
        }}
      >
        At H2H we believe the most impactful brands are the ones that know how to connect, not just communicate.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1, delay: 0.3, ease: EASE_OUT_EXPO }}
        style={{
          fontFamily: 'var(--font-stack-body)',
          fontSize: 'clamp(1.1rem, 1.5vw, 1.25rem)',
          lineHeight: 1.8,
          color: 'rgba(232,226,255,0.65)',
          margin: 0,
        }}
      >
        Perfect, polished campaigns are something that we take very seriously. But people want more than that. They want personality. They want to see and hear brands that speak like humans.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1, delay: 0.4, ease: EASE_OUT_EXPO }}
        className="relative pl-6 py-2 mt-2"
        style={{
          borderLeft: '2px solid rgba(164,108,252,0.5)',
          background: 'linear-gradient(90deg, rgba(164,108,252,0.05) 0%, transparent 100%)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-stack-body)',
            fontSize: 'clamp(1.1rem, 1.5vw, 1.25rem)',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.95)',
            fontWeight: 500,
            margin: 0,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontWeight: 800,
              letterSpacing: '0.02em',
              color: 'var(--color-secondary)',
            }}
          >
            H2H
          </span>{' '}
          is a social-first agency built to help brands grow by making their digital presence feel more human — thoughtful, strategic, and real.
        </p>
      </motion.div>
    </div>
  );
}

const AboutPanel = memo(function AboutPanel() {
  return (
    <div className="w-full" style={{ contain: 'layout style' }}>
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-start">
        <div className="lg:col-span-7 flex flex-col gap-10">
          <HeroBlock />
          <NarrativeBlock />
        </div>

        <div className="lg:col-span-5 lg:mt-24">
          <div className="lg:pl-8">
            <motion.span
              className="block mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT_EXPO }}
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(164,108,252,0.6)',
              }}
            >
              Impact
            </motion.span>
            <ImpactStack />
          </div>
        </div>
      </div>

      <VideoBlock />
    </div>
  );
});

function VideoBlock() {
  return (
    <motion.div
      className="w-full mt-24 md:mt-32"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
    >
      <motion.div
        className="relative overflow-hidden cursor-pointer group"
        whileHover={{
          y: -8,
          x: -8,
          boxShadow: 'var(--shadow-geometric-hover)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'var(--color-background-light)',
          boxShadow: 'var(--shadow-geometric)',
          maxHeight: '500px',
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ display: 'block', maxHeight: '500px' }}
          src="https://ik.imagekit.io/qcvroy8xpd/astronauts-dance-on-surface-of-the-alien-planet-hu-2026-01-28-04-20-47-utc.mp4?updatedAt=1771949799426"
        />

        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-80"
          style={{
            background: `
              linear-gradient(180deg, rgba(14,11,31,0.2) 0%, transparent 20%),
              linear-gradient(180deg, transparent 50%, rgba(14,11,31,0.9) 100%),
              linear-gradient(90deg, rgba(14,11,31,0.4) 0%, transparent 40%)
            `,
          }}
        />

        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex items-center gap-4 z-10">
          <SpinningH2H />
        </div>
      </motion.div>
    </motion.div>
  );
}

function SwipeTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const panel1X = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], ['0%', '0%', '-100%', '-100%']);
  const panel1Opacity = useTransform(scrollYProgress, [0, 0.35, 0.6, 0.65], [1, 1, 0.3, 0]);
  const panel1Scale = useTransform(scrollYProgress, [0, 0.35, 0.65], [1, 1, 0.96]);

  const panel2X = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], ['100%', '100%', '0%', '0%']);
  const panel2Opacity = useTransform(scrollYProgress, [0.3, 0.35, 0.65, 1], [0, 0, 1, 1]);
  const panel2Scale = useTransform(scrollYProgress, [0.35, 0.65, 1], [0.96, 1, 1]);

  const lineScaleX = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const lineOpacity = useTransform(scrollYProgress, [0.3, 0.45, 0.55, 0.7], [0, 1, 1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: '400vh' }}
    >
      <div
        className="sticky top-0 left-0 w-full overflow-hidden"
        style={{ height: '100vh', contain: 'layout paint' }}
      >
        <SignalBackground />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(60, 20, 120, 0.14) 0%, transparent 55%),
              radial-gradient(ellipse at 80% 70%, rgba(20, 10, 60, 0.16) 0%, transparent 50%)
            `,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(180deg, #06030f 0%, transparent 10%),
              linear-gradient(0deg, #06030f 0%, transparent 10%)
            `,
          }}
        />

        <div className="relative h-full" style={{ zIndex: 10 }}>
          <motion.div
            className="absolute inset-0 flex items-center"
            style={{
              x: panel1X,
              opacity: panel1Opacity,
              scale: panel1Scale,
              willChange: 'transform, opacity',
            }}
          >
            <div
              className="w-full mx-auto overflow-y-auto hide-scrollbar"
              style={{
                maxWidth: '1300px',
                padding: 'clamp(2rem, 4vw, 4rem) clamp(1.5rem, 5vw, 3rem)',
                maxHeight: '100vh',
              }}
            >
              <AboutPanel />
            </div>
          </motion.div>

          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: '1px',
              height: '60vh',
              background: 'linear-gradient(180deg, transparent, rgba(164,108,252,0.5), transparent)',
              scaleX: lineScaleX,
              opacity: lineOpacity,
              transformOrigin: 'center',
            }}
          />

          <motion.div
            className="absolute inset-0 flex items-center"
            style={{
              x: panel2X,
              opacity: panel2Opacity,
              scale: panel2Scale,
              willChange: 'transform, opacity',
            }}
          >
            <div
              className="w-full mx-auto overflow-y-auto hide-scrollbar"
              style={{
                maxWidth: '1300px',
                padding: 'clamp(2rem, 4vw, 4rem) clamp(1.5rem, 5vw, 3rem)',
                maxHeight: '100vh',
              }}
            >
              <WhyH2HPanel />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function AboutStory() {
  return (
    <section
      id="about"
      className="relative w-full"
      style={{
        background: 'linear-gradient(160deg, #06030f 0%, #0e0820 30%, #080318 70%, #030108 100%)',
      }}
    >
      <SwipeTransition />

      <div
        className="relative"
        style={{
          background: 'linear-gradient(160deg, #06030f 0%, #0e0820 30%, #080318 70%, #030108 100%)',
          padding: 'clamp(4rem, 8vw, 8rem) clamp(1.5rem, 5vw, 3rem)',
        }}
      >
        <div className="relative mx-auto" style={{ maxWidth: '1300px', zIndex: 10 }}>
          <SignatureEnding />
        </div>
      </div>
    </section>
  );
}
