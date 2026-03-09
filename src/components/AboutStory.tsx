import { memo } from 'react';
import { motion } from 'motion/react';
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
          fontSize: 'clamp(2.2rem, 7vw, 6rem)',
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
    <div className="flex flex-col gap-6 md:gap-8" style={{ maxWidth: '600px' }}>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1, delay: 0.2, ease: EASE_OUT_EXPO }}
        style={{
          fontFamily: 'var(--font-stack-body)',
          fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
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
          fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
          lineHeight: 1.8,
          color: 'rgba(232,226,255,0.65)',
          margin: 0,
        }}
      >
        Perfect, polished campaigns are something that we take very seriously. But, people want more than that. They want personality. They want to see and hear brands that speak like humans and offer something meaningful.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1, delay: 0.4, ease: EASE_OUT_EXPO }}
        className="relative pl-5 md:pl-6 py-2 mt-2"
        style={{
          borderLeft: '2px solid rgba(164,108,252,0.5)',
          background: 'linear-gradient(90deg, rgba(164,108,252,0.05) 0%, transparent 100%)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-stack-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
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
    // FIX: Removed style={{ contain: 'layout style' }} from this wrapper!
    <div className="w-full">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-7 flex flex-col gap-8 md:gap-10">
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
      className="w-full mt-16 md:mt-24 lg:mt-32"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
    >
      <motion.div
        className="relative overflow-hidden cursor-pointer group rounded-sm"
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

export function AboutStory() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #06030f 0%, #0e0820 30%, #080318 70%, #030108 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.08 }}>
        <SignalBackground />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(60, 20, 120, 0.14) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 70%, rgba(20, 10, 60, 0.16) 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative mx-auto flex flex-col gap-24 lg:gap-40" 
           style={{ 
             maxWidth: '1300px', 
             padding: 'clamp(4rem, 8vw, 8rem) clamp(1.5rem, 5vw, 3rem)',
             zIndex: 10 
           }}>
        
        <AboutPanel />
        <WhyH2HPanel />
        <SignatureEnding />

      </div>
    </section>
  );
}