import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  Variants,
} from 'motion/react';
import { ShootingStars } from './ShootingStars';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

const scaleInItem: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};


function GeometricFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 overflow-hidden"
      style={{
        position: 'relative',
        border: '2px solid var(--color-surface-dark)',
        background: 'var(--color-background-light)',
        boxShadow: 'var(--shadow-geometric)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-geometric-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-geometric)';
      }}
    >
      {children}
    </div>
  );
}

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
          border: '1px solid rgba(56,189,248,0.15)',
          borderRadius: '100px',
          background: 'rgba(56,189,248,0.05)',
        }}
      >
        <motion.span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'var(--color-secondary)',
            display: 'inline-block',
            boxShadow: '0 0 8px rgba(56,189,248,0.5)',
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span
          className="text-[0.55rem] font-bold uppercase tracking-[0.3em]"
          style={{
            fontFamily: 'var(--font-stack-heading)',
            color: 'var(--color-surface-dark)',
          }}
        >
          {label}
        </span>
      </div>
    </motion.div>
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
      className="relative w-full overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(160deg, #060810 0%, #0a0e18 30%, #080c14 70%, #030508 100%)',
        padding: 'clamp(6rem, 12vw, 12rem) clamp(1.5rem, 5vw, 3rem)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
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
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <SectionBadge label="About Us" />

          <h2
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
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
            >
              From Brand Voice
            </motion.span>
            <motion.span
              className="block mt-1"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.12, ease: EASE_OUT_EXPO }}
            >
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--color-surface-dark)' }}>
                To Human
              </span>{' '}
              Connection
            </motion.span>
          </h2>

          <motion.p
            className="mt-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE_OUT_EXPO }}
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

        <motion.div
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div className="lg:col-span-5" variants={fadeUpItem}>
            <GeometricFrame>
              <div style={{ position: 'relative' }}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full object-cover"
                  style={{ aspectRatio: '4 / 5', display: 'block' }}
                  src="https://ik.imagekit.io/qcvroy8xpd/Video_Generation_With_Earth.mp4"
                />
                <div
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
              </div>
            </GeometricFrame>
          </motion.div>

          <motion.div
            className="lg:col-span-7 flex flex-col justify-center"
            variants={fadeUpItem}
          >
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT_EXPO }}
            >
              <span
                className="inline-block mb-6"
                style={{
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(56,189,248,0.6)',
                  fontFamily: 'var(--font-stack-heading)',
                }}
              >
                Our Story
              </span>

              <p
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.05rem, 1.5vw, 1.15rem)',
                  lineHeight: 1.8,
                  color: 'rgba(232,226,255,0.55)',
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

              <motion.div
                className="h-px mb-8"
                style={{ background: 'rgba(56,189,248,0.2)', transformOrigin: 'left' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease: EASE_OUT_EXPO }}
              />

              <span
                className="inline-block mb-5"
                style={{
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(56,189,248,0.6)',
                  fontFamily: 'var(--font-stack-heading)',
                }}
              >
                Why H2H?
              </span>

              <p
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: 'clamp(1.1rem, 1.6vw, 1.25rem)',
                  lineHeight: 1.6,
                  color: 'var(--color-text-dark)',
                  fontWeight: 700,
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
                  marginBottom: '2.5rem',
                }}
              >
                We're strategists, creatives, and storytellers who bring a mix of structure and soul. We combine insight with efficiency to help you build brand ecosystems that actually work — across every platform, every touchpoint, and every stage of growth.
              </p>

            </motion.div>
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  );
}
