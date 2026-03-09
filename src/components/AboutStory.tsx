import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ShootingStars } from './ShootingStars';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

function SectionBadge({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className="inline-block mb-10"
    >
      <div
        className="inline-flex items-center gap-2.5 px-4 py-1.5"
        style={{
          border: '1px solid rgba(164,108,252,0.15)',
          borderRadius: '100px',
          background: 'rgba(164,108,252,0.05)',
        }}
      >
        <motion.span
          aria-hidden="true"
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'var(--color-secondary)',
            display: 'inline-block',
            boxShadow: '0 0 8px rgba(164,108,252,0.5)',
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span
          className="text-[0.55rem] font-bold uppercase tracking-[0.3em]"
          style={{ fontFamily: 'var(--font-stack-heading)', color: 'var(--color-surface-dark)' }}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}

function Eyebrow({ label }: { label: string }) {
  return (
    <span
      className="inline-block"
      style={{
        fontSize: '0.55rem',
        fontWeight: 700,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(164,108,252,0.6)',
        fontFamily: 'var(--font-stack-heading)',
      }}
    >
      {label}
    </span>
  );
}

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const contentParallax = useTransform(scrollYProgress, [0, 1], ['2%', '-2%']);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="relative w-full overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(160deg, #06030f 0%, #0e0820 30%, #080318 70%, #030108 100%)',
        padding: 'clamp(6rem, 12vw, 12rem) clamp(1.5rem, 5vw, 3rem)',
      }}
    >
      {/* Decorative background — hidden from assistive technology */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <ShootingStars count={16} />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(60, 20, 120, 0.18) 0%, transparent 55%),
              radial-gradient(ellipse at 80% 70%, rgba(20, 10, 60, 0.2) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(10, 5, 30, 0.4) 0%, transparent 70%)
            `,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, #06030f 0%, transparent 12%),
              linear-gradient(0deg, #06030f 0%, transparent 12%)
            `,
          }}
        />
      </div>

      <motion.div
        className="relative w-full mx-auto flex flex-col items-center"
        style={{ y: contentParallax, maxWidth: '1300px', zIndex: 10 }}
      >
        {/* ── Hero header ─────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <SectionBadge label="About Us" />

          <h2
            id="about-heading"
            style={{
              fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)',
              fontFamily: 'var(--font-stack-heading)',
              color: 'var(--color-text-dark)',
              lineHeight: 1.05,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
              textAlign: 'center',
              margin: 0,
            }}
          >
            {/* Text-clip reveal: overflow-hidden clips the rising span */}
            <span className="block overflow-hidden pb-1">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 1, ease: EASE_OUT_EXPO }}
              >
                From Brand Voice
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 1, delay: 0.1, ease: EASE_OUT_EXPO }}
              >
                <span style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--color-surface-dark)' }}>
                  To Human
                </span>{' '}
                Connection
              </motion.span>
            </span>
          </h2>

          <motion.p
            className="mt-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE_OUT_EXPO }}
            style={{
              fontFamily: 'var(--font-stack-body)',
              fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
              lineHeight: 1.8,
              color: 'rgba(232,226,255,0.5)',
              textAlign: 'center',
            }}
          >
            At H2H we believe the most impactful brands are the ones that know how to connect, not just communicate.
          </motion.p>
        </div>

        {/* ── Main content grid ────────────────────────────────── */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Video column */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
          >
            <motion.div
              className="overflow-hidden"
              whileHover={{ y: -4, x: -4, boxShadow: 'var(--shadow-geometric-hover)' }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              style={{
                position: 'relative',
                border: '2px solid var(--color-surface-dark)',
                background: 'var(--color-background-light)',
                boxShadow: 'var(--shadow-geometric)',
              }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                aria-label="H2H Agency brand showcase"
                className="w-full object-cover"
                style={{ aspectRatio: '4 / 5', display: 'block' }}
                src="https://ik.imagekit.io/qcvroy8xpd/Video_Generation_With_Earth.mp4"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `
                    linear-gradient(180deg, rgba(14,11,31,0.3) 0%, transparent 25%),
                    linear-gradient(180deg, transparent 70%, rgba(14,11,31,0.7) 100%)
                  `,
                }}
              />
            </motion.div>
          </motion.div>

          {/* Text column — single entrance animation, no competing variant system */}
          <motion.div
            className="lg:col-span-7 flex flex-col justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT_EXPO }}
          >
            {/* Our Story */}
            <Eyebrow label="Our Story" />

            <p
              style={{
                fontFamily: 'var(--font-stack-body)',
                fontSize: 'clamp(1.05rem, 1.5vw, 1.15rem)',
                lineHeight: 1.8,
                color: 'rgba(232,226,255,0.55)',
                marginTop: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              Perfect, polished campaigns are something that we take very seriously. But, people want more than that. They want personality. They want to see and hear brands that speak like humans and offer something meaningful.
            </p>

            <p
              style={{
                fontFamily: 'var(--font-stack-body)',
                fontSize: 'clamp(1.05rem, 1.5vw, 1.15rem)',
                lineHeight: 1.8,
                color: 'rgba(232,226,255,0.55)',
                marginBottom: '2.5rem',
              }}
            >
              H2H is a social-first agency built to help brands grow by making their digital presence feel more human — thoughtful, strategic, and real.
            </p>

            {/* Divider — animates from center out */}
            <motion.div
              aria-hidden="true"
              className="h-px mb-8"
              style={{ background: 'rgba(164,108,252,0.2)', transformOrigin: 'center' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE_OUT_EXPO }}
            />

            {/* Why H2H */}
            <Eyebrow label="Why H2H?" />

            <p
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(1.1rem, 1.6vw, 1.25rem)',
                lineHeight: 1.6,
                color: 'var(--color-text-dark)',
                fontWeight: 700,
                marginTop: '1.25rem',
                marginBottom: '1.25rem',
              }}
            >
              Because we embed ourselves in your world.
            </p>

            <p
              style={{
                fontFamily: 'var(--font-stack-body)',
                fontSize: 'clamp(1.05rem, 1.5vw, 1.15rem)',
                lineHeight: 1.8,
                color: 'rgba(232,226,255,0.55)',
                marginBottom: '1.5rem',
              }}
            >
              When you work with H2H, you don't get an agency. You get a partner — a flexible, responsive extension of your team. Like a living, breathing part of your organization, we adapt to your rhythm, align with your goals, and help you scale with clarity and purpose.
            </p>

            <p
              style={{
                fontFamily: 'var(--font-stack-body)',
                fontSize: 'clamp(1.05rem, 1.5vw, 1.15rem)',
                lineHeight: 1.8,
                color: 'rgba(232,226,255,0.55)',
              }}
            >
              We're strategists, creatives, and storytellers who bring a mix of structure and soul. We combine insight with efficiency to help you build brand ecosystems that actually work — across every platform, every touchpoint, and every stage of growth.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
