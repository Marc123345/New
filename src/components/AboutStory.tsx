import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  Variants,
  AnimatePresence,
} from 'motion/react';

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

const CAPABILITIES = [
  { tag: 'Strategy', desc: 'Brand positioning & market analysis' },
  { tag: 'Creative', desc: 'Visual storytelling & content creation' },
  { tag: 'Growth', desc: 'Performance marketing & scaling' },
  { tag: 'Social', desc: 'Community management & engagement' },
  { tag: 'Content', desc: 'Editorial planning & production' },
  { tag: 'Analytics', desc: 'Data-driven insights & optimization' },
];

function HologramFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="hologram-container" style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 8,
          padding: 2,
          background: 'linear-gradient(135deg, #a46cfc 0%, #b181fc 40%, #a46cfc 70%, #b181fc 100%)',
          backgroundSize: '300% 300%',
          animation: 'hologramBorder 4s ease infinite',
          zIndex: 0,
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: 6,
          background: 'rgba(14,11,31,0.95)',
        }} />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: 6,
          overflow: 'hidden',
          boxShadow: '0 0 40px rgba(164,108,252,0.15), 0 0 80px rgba(164,108,252,0.06)',
        }}
      >
        <div
          className="pointer-events-none"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(164,108,252,0.03) 2px, rgba(164,108,252,0.03) 4px)',
          }}
        />
        <div
          className="pointer-events-none"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 11,
            background: 'linear-gradient(180deg, rgba(164,108,252,0.08) 0%, transparent 15%, transparent 85%, rgba(164,108,252,0.06) 100%)',
          }}
        />
        {children}
      </div>
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
          border: '1px solid rgba(164,108,252,0.15)',
          borderRadius: '100px',
          background: 'rgba(164,108,252,0.05)',
        }}
      >
        <motion.span
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
  const [activeCapability, setActiveCapability] = useState<number | null>(null);

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
        background: 'var(--color-primary)',
        padding: 'clamp(6rem, 12vw, 12rem) clamp(1.5rem, 5vw, 3rem)',
      }}
    >
      <style>{`
        @keyframes hologramBorder {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes scanlineSweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, var(--color-primary) 0%, transparent 12%),
            linear-gradient(0deg, var(--color-primary) 0%, transparent 12%)
          `,
          zIndex: 1,
        }}
      />

      <motion.div
        className="relative z-10 w-full mx-auto flex flex-col items-center"
        style={{ y: contentParallax, maxWidth: '1300px' }}
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
        </div>

        <motion.div
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div className="lg:col-span-5" variants={fadeUpItem}>
            <HologramFrame>
              <div style={{ position: 'relative' }}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full object-cover"
                  style={{ aspectRatio: '4 / 5', display: 'block' }}
                  src="https://ik.imagekit.io/qcvroy8xpd/Shannon_s_Space_Video_Creation.mp4"
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
                <div
                  className="pointer-events-none"
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '200%',
                    top: 0,
                    background: 'linear-gradient(180deg, transparent 0%, rgba(164,108,252,0.04) 50%, transparent 100%)',
                    animation: 'scanlineSweep 6s linear infinite',
                    zIndex: 12,
                  }}
                />
              </div>
            </HologramFrame>
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
                  color: 'rgba(164,108,252,0.6)',
                  fontFamily: 'var(--font-stack-heading)',
                }}
              >
                Our Story
              </span>

              <p
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.05rem, 1.6vw, 1.2rem)',
                  lineHeight: 1.75,
                  color: 'rgba(232,226,255,0.55)',
                  marginBottom: '1.5rem',
                }}
              >
                We started with a simple belief: the most impactful brands don't just
                broadcast -- they connect. In a world saturated with noise, people
                gravitate toward brands that feel human, speak with personality, and
                offer something genuinely meaningful.
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.05rem, 1.6vw, 1.2rem)',
                  lineHeight: 1.75,
                  color: 'rgba(232,226,255,0.55)',
                  marginBottom: '1.5rem',
                }}
              >
                That's why we built a social-first agency grounded in insight and
                efficiency -- helping brands grow by making every digital touchpoint
                feel real and every interaction count.
              </p>

              <p
                className="font-semibold"
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.05rem, 1.6vw, 1.2rem)',
                  lineHeight: 1.75,
                  color: 'var(--color-text-dark)',
                  marginBottom: '2.5rem',
                }}
              >
                We combine strategy, creative, and data to build brand ecosystems
                that work -- across every platform and stage of growth.
              </p>

              <motion.div
                className="h-px mb-8"
                style={{ background: 'rgba(164,108,252,0.2)', transformOrigin: 'left' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease: EASE_OUT_EXPO }}
              />

              <motion.a
                href="#contact"
                className="inline-flex items-center gap-3 group cursor-pointer"
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-dark)',
                  textDecoration: 'none',
                  padding: '14px 32px',
                  border: '1px solid rgba(164,108,252,0.3)',
                  borderRadius: 4,
                  background: 'rgba(164,108,252,0.06)',
                  transition: 'all 0.3s ease',
                }}
                whileHover={{
                  background: 'rgba(164,108,252,0.14)',
                  borderColor: 'rgba(164,108,252,0.5)',
                  y: -2,
                }}
                whileTap={{ scale: 0.98 }}
              >
                Why We Exist
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="w-full mt-16 md:mt-24">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.tag}
                variants={scaleInItem}
                onHoverStart={() => setActiveCapability(i)}
                onHoverEnd={() => setActiveCapability(null)}
                className="relative px-4 py-4 cursor-default"
                style={{
                  border: `1px solid ${activeCapability === i ? 'rgba(164,108,252,0.25)' : 'rgba(164,108,252,0.08)'}`,
                  background: activeCapability === i
                    ? 'rgba(164,108,252,0.08)'
                    : 'rgba(164,108,252,0.02)',
                  borderRadius: 6,
                  transition: 'background 0.3s ease, border-color 0.3s ease',
                }}
              >
                <span
                  className="block text-[0.7rem] font-semibold uppercase tracking-[0.15em]"
                  style={{
                    fontFamily: 'var(--font-stack-heading)',
                    color: activeCapability === i ? 'var(--color-text-dark)' : 'rgba(232,226,255,0.5)',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {cap.tag}
                </span>
                <AnimatePresence>
                  {activeCapability === i && (
                    <motion.span
                      className="block mt-1.5 text-[0.65rem]"
                      style={{
                        color: 'rgba(232,226,255,0.4)',
                        fontFamily: 'var(--font-stack-body)',
                        lineHeight: 1.4,
                      }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {cap.desc}
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.div
                  className="absolute bottom-0 left-2 right-2 h-px"
                  style={{
                    background: 'var(--color-secondary)',
                    transformOrigin: 'left',
                    scaleX: activeCapability === i ? 1 : 0,
                    opacity: activeCapability === i ? 0.4 : 0,
                    transition: 'transform 0.4s ease, opacity 0.4s ease',
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
