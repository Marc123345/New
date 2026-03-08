import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
} from 'motion/react';
import { SignalBackground } from './about/SignalBackground';
import { ImpactStack } from './about/ImpactStack';
import { StoryColumns } from './about/StoryColumns';
import { ShannonCarousel } from './about/ShannonCarousel';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

function Eyebrow({ label }: { label: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      style={{
        fontFamily: 'var(--font-stack-heading)',
        fontSize: '0.6rem',
        fontWeight: 700,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'rgba(164,108,252,0.65)',
        display: 'block',
        marginBottom: '24px',
      }}
    >
      {label}
    </motion.span>
  );
}

function HeroBlock() {
  return (
    <div className="flex flex-col items-start w-full">
      <Eyebrow label="About H2H" />

      <h2
        style={{
          fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)',
          fontFamily: 'var(--font-stack-heading)',
          color: 'var(--color-text-dark)',
          lineHeight: 1.02,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '-0.04em',
          margin: 0,
        }}
      >
        <motion.span
          className="block"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO }}
        >
          From Brand Voice
        </motion.span>
        <motion.span
          className="block"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.1, ease: EASE_OUT_EXPO }}
        >
          <span style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--color-surface-dark)' }}>
            To Human
          </span>{' '}
          Connection
        </motion.span>
      </h2>
    </div>
  );
}

function NarrativeBlock() {
  return (
    <div className="flex flex-col gap-8" style={{ maxWidth: '560px' }}>
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT_EXPO }}
        style={{
          fontFamily: 'var(--font-stack-body)',
          fontSize: 'clamp(1.05rem, 1.4vw, 1.18rem)',
          lineHeight: 1.85,
          color: 'rgba(232,226,255,0.8)',
          margin: 0,
        }}
      >
        At H2H we believe the most impactful brands are the ones that know how to connect, not just communicate.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE_OUT_EXPO }}
        style={{
          fontFamily: 'var(--font-stack-body)',
          fontSize: 'clamp(1.05rem, 1.4vw, 1.18rem)',
          lineHeight: 1.85,
          color: 'rgba(232,226,255,0.65)',
          margin: 0,
        }}
      >
        Perfect, polished campaigns are something that we take very seriously. But people want more than that. They want personality. They want to see and hear brands that speak like humans.
      </motion.p>

      <motion.p
        className="relative pl-5"
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, delay: 0.35, ease: EASE_OUT_EXPO }}
        style={{
          fontFamily: 'var(--font-stack-body)',
          fontSize: 'clamp(1.05rem, 1.4vw, 1.18rem)',
          lineHeight: 1.85,
          color: 'rgba(255,255,255,0.95)',
          fontWeight: 500,
          borderLeft: '2px solid rgba(164,108,252,0.5)',
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
      </motion.p>
    </div>
  );
}

function AsymmetricHero() {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
      <div className="lg:col-span-7 flex flex-col gap-12">
        <HeroBlock />
        <NarrativeBlock />
      </div>

      <div className="lg:col-span-5 lg:mt-16">
        <div className="lg:pl-6">
          <motion.span
            className="block mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT_EXPO }}
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.55rem',
              fontWeight: 700,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(164,108,252,0.5)',
            }}
          >
            Impact
          </motion.span>
          <ImpactStack />
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <motion.div
      className="w-full my-20 md:my-28"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
      style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(164,108,252,0.2), rgba(164,108,252,0.2), transparent)',
        transformOrigin: 'left',
      }}
    />
  );
}

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ['2%', '-2%']);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #06030f 0%, #0e0820 30%, #080318 70%, #030108 100%)',
        padding: 'clamp(6rem, 12vw, 12rem) clamp(1.5rem, 5vw, 3rem)',
      }}
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

      <motion.div
        className="relative mx-auto"
        style={{ y: contentY, maxWidth: '1300px', zIndex: 10 }}
      >
        <AsymmetricHero />

        <ShannonCarousel />

        <Divider />

        <StoryColumns />
      </motion.div>
    </section>
  );
}
