import { useRef, useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  Variants,
  useInView,
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
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      start = Math.round(eased * value);
      setDisplay(start);
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

const VALUES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Strategy First',
    description: 'Every move is intentional. We ground creativity in data-driven strategy that aligns with real business goals.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    title: 'Human-Centric',
    description: 'We design for people, not algorithms. Authentic connection drives every piece of content we create.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Relentless Momentum',
    description: 'We move fast without cutting corners. Agile execution meets uncompromising quality at every touchpoint.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: 'Full-Stack Thinking',
    description: 'From brand positioning to performance marketing, we see the whole picture and optimize every layer.',
  },
];

function ValuesGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {VALUES.map((val, i) => (
        <motion.div
          key={val.title}
          className="group relative p-6"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.12 * i, ease: EASE_OUT_EXPO }}
          style={{
            background: 'rgba(164,108,252,0.03)',
            border: '1px solid rgba(164,108,252,0.1)',
            borderRadius: '10px',
            cursor: 'default',
          }}
          whileHover={{
            y: -4,
            background: 'rgba(164,108,252,0.07)',
            borderColor: 'rgba(164,108,252,0.25)',
          }}
        >
          <div
            className="mb-4 inline-flex items-center justify-center"
            style={{
              width: 48,
              height: 48,
              borderRadius: '10px',
              background: 'rgba(164,108,252,0.08)',
              border: '1px solid rgba(164,108,252,0.15)',
              color: 'var(--color-secondary)',
            }}
          >
            {val.icon}
          </div>
          <h4
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-dark)',
              marginBottom: '0.6rem',
            }}
          >
            {val.title}
          </h4>
          <p
            style={{
              fontFamily: 'var(--font-stack-body)',
              fontSize: 'clamp(0.88rem, 1.1vw, 0.95rem)',
              lineHeight: 1.75,
              color: 'rgba(232,226,255,0.65)',
              margin: 0,
            }}
          >
            {val.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function ApproachTimeline() {
  const steps = [
    { num: '01', title: 'Discover', text: 'Deep-dive into your brand DNA, audience psychology, and market landscape to uncover what makes you irreplaceable.' },
    { num: '02', title: 'Strategize', text: 'Build a tailored roadmap that fuses brand narrative with measurable growth levers across every channel.' },
    { num: '03', title: 'Create', text: 'Bring strategy to life through scroll-stopping content, campaigns, and experiences that feel unmistakably you.' },
    { num: '04', title: 'Amplify', text: 'Launch, optimize, and scale. We turn traction into momentum with relentless iteration and data-backed refinement.' },
  ];

  return (
    <div className="relative">
      <div
        className="absolute left-4 md:left-6 top-0 bottom-0 w-px hidden md:block"
        style={{ background: 'linear-gradient(180deg, rgba(164,108,252,0.4), rgba(164,108,252,0.05))' }}
      />
      <div className="flex flex-col gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            className="flex gap-5 md:gap-8 items-start"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, delay: 0.15 * i, ease: EASE_OUT_EXPO }}
          >
            <div
              className="flex-shrink-0 flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: '2px solid rgba(164,108,252,0.35)',
                background: 'rgba(164,108,252,0.06)',
                fontFamily: 'var(--font-stack-heading)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: 'var(--color-secondary)',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {step.num}
            </div>
            <div className="pt-1">
              <h4
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-dark)',
                  marginBottom: '0.4rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {step.title}
              </h4>
              <p
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
                  lineHeight: 1.75,
                  color: 'rgba(232,226,255,0.7)',
                  margin: 0,
                }}
              >
                {step.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
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
        {/* Header */}
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

        {/* Stats Bar */}
        <div className="w-full mb-16 md:mb-24">
          <StatsBar />
        </div>

        {/* Main Content: Video + Story */}
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

        {/* Divider */}
        <motion.div
          className="w-full my-16 md:my-24 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(164,108,252,0.25), transparent)', transformOrigin: 'center' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.4, ease: EASE_OUT_EXPO }}
        />

        {/* Values + Approach */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
          >
            <motion.span
              className="inline-block mb-3"
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
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
              What We Stand For
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT_EXPO }}
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: 800,
                color: 'var(--color-text-dark)',
                lineHeight: 1.15,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
              }}
            >
              Our Core Values
            </motion.h3>
            <ValuesGrid />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT_EXPO }}
          >
            <motion.span
              className="inline-block mb-3"
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
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
              How We Work
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE_OUT_EXPO }}
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: 800,
                color: 'var(--color-text-dark)',
                lineHeight: 1.15,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                marginBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
              }}
            >
              Our Approach
            </motion.h3>
            <ApproachTimeline />
          </motion.div>
        </div>

        {/* Closing Statement */}
        <motion.div
          className="w-full mt-16 md:mt-24 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO }}
        >
          <motion.p
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
              fontWeight: 700,
              lineHeight: 1.4,
              color: 'var(--color-text-dark)',
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            We don't just build brands.{' '}
            <span style={{ color: 'var(--color-secondary)' }}>
              We build movements.
            </span>
          </motion.p>
          <motion.p
            className="mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT_EXPO }}
            style={{
              fontFamily: 'var(--font-stack-body)',
              fontSize: 'clamp(0.92rem, 1.2vw, 1.05rem)',
              lineHeight: 1.75,
              color: 'rgba(232,226,255,0.55)',
              maxWidth: '550px',
              margin: '1rem auto 0',
            }}
          >
            Ready to make your brand impossible to ignore? That's exactly what we're here for.
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}
