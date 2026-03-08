import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  Variants,
  useInView,
} from 'motion/react';
import { ShootingStars } from './ShootingStars';
import { getButtonHoverHandlers } from '../utils/buttonHover';

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
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1, ease: EASE_OUT_EXPO }}
      className="inline-block mb-10"
      style={{
        padding: '6px 16px',
        border: '2px solid var(--color-secondary)',
        boxShadow: '4px 4px 0 var(--color-secondary)',
      }}
    >
      <span
        style={{
          fontSize: '0.68rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-stack-heading)',
          color: 'var(--color-secondary)',
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

const STATS = [
  { value: 120, suffix: '+', label: 'Brands Served' },
  { value: 6, suffix: '', label: 'Years Running' },
  { value: 98, suffix: '%', label: 'Client Retention' },
  { value: 40, suffix: 'M+', label: 'Impressions Driven' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

function StatsBar() {
  return (
    <motion.div
      className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
      style={{
        padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
        background: 'rgba(164,108,252,0.04)',
        border: '1px solid rgba(164,108,252,0.12)',
        borderRadius: '12px',
      }}
    >
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 * i, ease: EASE_OUT_EXPO }}
          style={{
            borderRight: i < STATS.length - 1 ? '1px solid rgba(164,108,252,0.12)' : 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: 'var(--color-secondary)',
              lineHeight: 1.1,
            }}
          >
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
          </span>
          <span
            style={{
              fontFamily: 'var(--font-stack-body)',
              fontSize: 'clamp(0.7rem, 1vw, 0.82rem)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(232,226,255,0.5)',
              marginTop: '0.5rem',
            }}
          >
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

function StarburstIcon() {
  return (
    <motion.div
      className="hidden md:flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
    >
      <motion.svg
        width="100"
        height="100"
        viewBox="0 0 121 121"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <path
          opacity="0.2"
          d="M0 54.3207C0.346705 54.3523 0.693411 54.3838 1.04012 54.3838C15.5702 54.3838 30.1003 54.3838 44.6619 54.3838C44.9771 54.3838 45.2923 54.3838 45.5444 54.3838C34.765 43.6016 23.9857 32.8194 13.2378 22.0688C16.2951 19.0422 19.1003 16.2994 21.9685 13.462C32.5903 24.0865 43.3696 34.8687 54.4327 45.9346C54.4327 30.3919 54.4327 15.1959 54.4327 0C58.5301 0 62.5014 0 66.5673 0C66.5673 15.2275 66.5673 30.3603 66.5673 45.4617C77.3467 34.6795 88.1261 23.8973 98.8109 13.2097C101.868 16.2678 104.642 19.0422 107.479 21.8796C96.8567 32.5042 86.0774 43.2863 75.298 54.0685C75.3295 54.1631 75.3925 54.2577 75.4241 54.3523C90.5845 54.3523 105.777 54.3523 121 54.3523C121 58.4508 121 62.4231 121 66.5216C105.777 66.5216 90.6161 66.5216 75.3295 66.5216C86.235 77.4299 96.9828 88.1806 107.731 98.9312C104.768 101.832 101.994 104.575 99.1576 107.38C88.5358 96.7559 77.7564 85.9737 66.788 74.9708C66.7249 75.5698 66.6619 75.822 66.6619 76.0743C66.6619 90.7658 66.6619 105.457 66.6619 120.18C66.6619 120.464 66.7249 120.716 66.7249 121C62.6275 121 58.5301 121 54.4327 121C54.4642 120.653 54.4957 120.306 54.4957 119.96C54.4957 105.426 54.4957 90.8919 54.4957 76.358C54.4957 76.0427 54.4327 75.6959 54.4011 75.0023C43.3381 86.0052 32.5587 96.7874 21.937 107.412C19.1003 104.606 16.2951 101.863 13.2063 98.8366C23.9542 88.086 34.702 77.3353 45.4814 66.5531C45.2607 66.5531 44.9456 66.5531 44.6304 66.5531C30.1003 66.5531 15.5702 66.5531 1.04012 66.5531C0.693411 66.5531 0.346705 66.6162 0 66.6162C0 62.5177 0 58.4192 0 54.3207Z"
          fill="var(--color-secondary)"
        />
      </motion.svg>
    </motion.div>
  );
}

function AboutCTA() {
  const btnHover = getButtonHoverHandlers();

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
      style={{
        border: '2px solid var(--color-text-dark)',
        boxShadow: '8px 8px 0 var(--color-surface-dark)',
        background: 'rgba(14,11,31,0.6)',
        backdropFilter: 'blur(12px)',
        padding: 'clamp(2rem, 5vw, 3.5rem)',
      }}
    >
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT_EXPO }}
        style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          textTransform: 'uppercase',
          color: 'var(--color-text-dark)',
          marginBottom: 'clamp(2rem, 4vw, 3rem)',
        }}
      >
        Let's Build Something{' '}
        <span style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--color-surface-dark)' }}>
          Unforgettable
        </span>
      </motion.h3>

      <div
        className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12"
        style={{
          borderTop: '1px solid rgba(232,226,255,0.12)',
          paddingTop: 'clamp(1.5rem, 3vw, 2.5rem)',
        }}
      >
        <StarburstIcon />

        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE_OUT_EXPO }}
            className="flex-1"
            style={{
              fontFamily: 'var(--font-stack-body)',
              fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
              lineHeight: 1.75,
              color: 'rgba(232,226,255,0.7)',
              margin: 0,
            }}
          >
            Ready to make your brand impossible to ignore? We're strategists, creatives, and storytellers who turn ambition into momentum.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE_OUT_EXPO }}
            onClick={scrollToContact}
            className="flex-shrink-0"
            style={{
              padding: '16px 32px',
              background: 'var(--color-text-dark)',
              border: '2px solid var(--color-text-dark)',
              color: 'var(--color-background-light)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-stack-heading)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-button)',
              transition: 'box-shadow 0.2s, transform 0.2s',
              whiteSpace: 'nowrap',
            }}
            {...btnHover}
          >
            Start a Project
          </motion.button>
        </div>
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
        background: 'linear-gradient(160deg, #06030f 0%, #0e0820 30%, #080318 70%, #030108 100%)',
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
              color: 'rgba(232,226,255,0.78)',
              textAlign: 'center',
            }}
          >
            At H2H we believe the most impactful brands are the ones that know how to connect, not just communicate.
          </motion.p>
        </div>

        <div className="w-full mb-16 md:mb-24">
          <StatsBar />
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
                  src="https://ik.imagekit.io/qcvroy8xpd/astronauts-dance-on-surface-of-the-alien-planet-hu-2026-01-28-04-20-47-utc.mp4?updatedAt=1771949799426"
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
            <div className="flex flex-col gap-10">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT_EXPO }}
              >
                <motion.span
                  className="inline-block mb-5"
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                  style={{
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: 'rgba(164,108,252,0.85)',
                    fontFamily: 'var(--font-stack-heading)',
                  }}
                >
                  Our Story
                </motion.span>

                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT_EXPO }}
                  style={{
                    fontFamily: 'var(--font-stack-body)',
                    fontSize: 'clamp(1.08rem, 1.5vw, 1.2rem)',
                    lineHeight: 1.85,
                    color: 'rgba(232,226,255,0.82)',
                    marginBottom: '1.25rem',
                  }}
                >
                  Perfect, polished campaigns are something that we take very seriously. But, people want more than that. They want personality. They want to see and hear brands that speak like humans and offer something meaningful.
                </motion.p>

                <motion.p
                  className="relative pl-5"
                  initial={{ opacity: 0, x: -16, borderLeftColor: 'rgba(164,108,252,0)' }}
                  whileInView={{ opacity: 1, x: 0, borderLeftColor: 'rgba(164,108,252,0.5)' }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.9, delay: 0.25, ease: EASE_OUT_EXPO }}
                  style={{
                    fontFamily: 'var(--font-stack-body)',
                    fontSize: 'clamp(1.08rem, 1.5vw, 1.2rem)',
                    lineHeight: 1.85,
                    color: 'rgba(255,255,255,0.95)',
                    fontWeight: 500,
                    borderLeft: '2px solid rgba(164,108,252,0.5)',
                  }}
                >
                  H2H is a social-first agency built to help brands grow by making their digital presence feel more human — thoughtful, strategic, and real.
                </motion.p>
              </motion.div>

              <motion.div
                className="h-px"
                style={{ background: 'linear-gradient(to right, rgba(164,108,252,0.35), transparent)', transformOrigin: 'left' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 1.2, delay: 0.3, ease: EASE_OUT_EXPO }}
              />

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              >
                <motion.span
                  className="inline-block mb-4"
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT_EXPO }}
                  style={{
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: 'rgba(164,108,252,0.85)',
                    fontFamily: 'var(--font-stack-heading)',
                  }}
                >
                  Why H2H?
                </motion.span>

                <motion.p
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_EXPO }}
                  style={{
                    fontFamily: 'var(--font-stack-heading)',
                    fontSize: 'clamp(1.15rem, 1.8vw, 1.35rem)',
                    lineHeight: 1.5,
                    color: 'var(--color-text-dark)',
                    fontWeight: 700,
                  }}
                >
                  Because we embed ourselves in your world.
                </motion.p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div
                    className="p-5"
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ y: -3, background: 'rgba(164,108,252,0.08)', borderColor: 'rgba(164,108,252,0.3)' }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT_EXPO }}
                    style={{
                      background: 'rgba(164,108,252,0.04)',
                      border: '1px solid rgba(164,108,252,0.15)',
                      borderRadius: '8px',
                    }}
                  >
                    <span
                      className="block mb-2"
                      style={{
                        fontFamily: 'var(--font-stack-heading)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'rgba(164,108,252,0.9)',
                      }}
                    >
                      Your Partner
                    </span>
                    <p
                      style={{
                        fontFamily: 'var(--font-stack-body)',
                        fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
                        lineHeight: 1.75,
                        color: 'rgba(232,226,255,0.75)',
                      }}
                    >
                      When you work with H2H, you don't get an agency. You get a partner — a flexible, responsive extension of your team. Like a living, breathing part of your organization, we adapt to your rhythm, align with your goals, and help you scale with clarity and purpose.
                    </p>
                  </motion.div>

                  <motion.div
                    className="p-5"
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ y: -3, background: 'rgba(164,108,252,0.08)', borderColor: 'rgba(164,108,252,0.3)' }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.7, delay: 0.45, ease: EASE_OUT_EXPO }}
                    style={{
                      background: 'rgba(164,108,252,0.04)',
                      border: '1px solid rgba(164,108,252,0.15)',
                      borderRadius: '8px',
                    }}
                  >
                    <span
                      className="block mb-2"
                      style={{
                        fontFamily: 'var(--font-stack-heading)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'rgba(164,108,252,0.9)',
                      }}
                    >
                      Structure & Soul
                    </span>
                    <p
                      style={{
                        fontFamily: 'var(--font-stack-body)',
                        fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
                        lineHeight: 1.75,
                        color: 'rgba(232,226,255,0.75)',
                      }}
                    >
                      We're strategists, creatives, and storytellers who bring a mix of structure and soul. We combine insight with efficiency to help you build brand ecosystems that actually work — across every platform, every touchpoint, and every stage of growth.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <div className="w-full mt-16 md:mt-24">
          <AboutCTA />
        </div>
      </motion.div>
    </section>
  );
}
