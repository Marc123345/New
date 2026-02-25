import { useRef, useState, useCallback, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  Variants,
} from 'motion/react';
import { SignalGridPanel } from './SignalGridPanel';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SPRING_TRANSITION = { type: 'spring', stiffness: 300, damping: 20 };

// --- ANIMATION VARIANTS FOR ORCHESTRATED REVEALS ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Creates a beautiful cascade effect
      delayChildren: 0.3,
    },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: EASE_OUT_EXPO } 
  },
};

function useMagnetic(strength = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
      y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
    },
    [x, y, strength],
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { ref, springX, springY, handleMove, handleLeave };
}

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

function GeometricCard({
  children,
  className = '',
  cardStyle = {},
  shadowColor = 'var(--color-secondary)',
}: {
  children: React.ReactNode;
  className?: string;
  cardStyle?: React.CSSProperties;
  shadowColor?: string;
}) {
  const mag = useMagnetic(0.12);

  return (
    <motion.div
      variants={fadeUpItem} // Hooks into the staggerContainer
      ref={mag.ref}
      onMouseMove={mag.handleMove}
      onMouseLeave={mag.handleLeave}
      style={{ x: mag.springX, y: mag.springY }}
      className={`relative h-full w-full ${className}`}
    >
      <motion.div
        whileHover={{
          x: -4,
          y: -4,
          boxShadow: `12px 12px 0 ${shadowColor}`, // Tightened the shadow for a crisper feel
          transition: SPRING_TRANSITION,
        }}
        className="relative h-full w-full"
        style={{
          border: '2px solid var(--color-secondary)',
          boxShadow: `6px 6px 0 ${shadowColor}`, // Baseline shadow
          ...cardStyle,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function SectionBadge({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className="inline-block mb-10" // Standardized bottom margin
    >
      <motion.div
        whileHover={{ scale: 1.05, backgroundColor: '#ffffff' }}
        transition={SPRING_TRANSITION}
        className="inline-flex items-center gap-3 px-5 py-2 cursor-default group"
        style={{
          border: '1px solid rgba(255,255,255,0.2)', // Refined border
          borderRadius: '100px', // Pill shape for badges looks highly premium
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        <span
          className="text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300 group-hover:text-[var(--color-primary)]"
          style={{
            fontFamily: 'var(--font-stack-heading)',
            color: '#ffffff',
          }}
        >
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}

function CellLabel({ text }: { text: string }) {
  return (
    <span
      className="inline-block w-full"
      style={{
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'var(--color-secondary)',
        fontFamily: 'var(--font-stack-heading)',
        opacity: 0.8,
        marginBottom: '1rem', // Strict pixel rhythm
      }}
    >
      {text}
    </span>
  );
}

function AccentLine() {
  return (
    <motion.div
      style={{
        width: 48, // Divisible by 8
        height: 2,
        background: 'var(--color-secondary)',
        marginBottom: '1.5rem',
        transformOrigin: 'left',
      }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.5, ease: EASE_OUT_EXPO }}
    />
  );
}

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const contentParallax = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']); // Softened parallax so it doesn't break grid alignment

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center selection:bg-[var(--color-secondary)] selection:text-[var(--color-primary)]"
      style={{ 
        background: 'var(--color-primary)',
        padding: 'clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 3rem)' // Refined responsive padding
      }}
    >
      {/* Dynamic Background Mesh */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(164,108,252,0.15) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col items-center" // Tightened max-width for better reading lengths
        style={{ y: contentParallax }}
      >
        <div className="flex flex-col items-center text-center mb-20 md:mb-28">
          <SectionBadge label="About Us" />

          {/* Typography Refinements: Tighter line heights and exact margins */}
          <div className="flex flex-col items-center justify-center">
            <h2
              style={{
                fontSize: 'clamp(2.75rem, 7vw, 6.5rem)',
                fontFamily: 'var(--font-stack-heading)',
                color: '#ffffff',
                lineHeight: 1, // Tighter line-height for massive headers
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '-0.04em', // Slightly tighter kerning
                textAlign: 'center',
                margin: 0,
              }}
            >
              <motion.span
                className="block drop-shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
              >
                From Brand Voice
              </motion.span>
              <motion.span
                className="block mt-2" // Exact pixel rhythm
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: 0.15, ease: EASE_OUT_EXPO }}
              >
                <span
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '2px #ffffff',
                    opacity: 0.9,
                  }}
                >
                  To Human
                </span>{' '}
                Connection
              </motion.span>
            </h2>
          </div>
        </div>

        {/* ORBITAL BENTO GRID - Orchestrated with Framer Motion */}
        <motion.div 
          className="w-full grid grid-cols-1 md:grid-cols-12 gap-6" // Using exact 24px (gap-6) layout grid
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Main Intro Card */}
          <div className="md:col-span-12 lg:col-span-8 lg:col-start-3">
            <GeometricCard
              cardStyle={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                padding: 'clamp(2.5rem, 5vw, 4rem)', // Generous, exact padding
                backdropFilter: 'blur(16px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <AccentLine />
              <p className="relative z-10 max-w-2xl text-white/95" style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                  lineHeight: 1.5,
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                }}>
                At H2H we believe the most impactful brands are the ones that know how to
                connect, not just communicate.
              </p>
              <p className="relative z-10 max-w-xl text-white/60 mt-6" style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
                  lineHeight: 1.6,
                }}>
                Perfect, polished campaigns are something we take very seriously. But people
                want more than that — they want personality, brands that speak like humans
                and offer something meaningful.
              </p>
            </GeometricCard>
          </div>

          {/* UI Fix: Placed the SignalGridPanel INSIDE a GeometricCard for perfect physical consistency */}
          <div className="md:col-span-6 lg:col-span-5 lg:col-start-2">
            <GeometricCard
              cardStyle={{
                padding: 0, // Zero padding so the grid fills the box
                overflow: 'hidden',
                background: 'rgba(0,0,0,0.2)',
                minHeight: '280px',
              }}
            >
              <div className="absolute inset-0 opacity-80 mix-blend-screen">
                <SignalGridPanel />
              </div>
            </GeometricCard>
          </div>

          {/* Social First Card */}
          <div className="md:col-span-6 lg:col-span-5">
            <GeometricCard
              shadowColor="var(--color-primary)"
              cardStyle={{
                background: 'var(--color-secondary)',
                padding: 'clamp(2rem, 4vw, 3rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '280px',
              }}
            >
              <CellLabel text="01 / Social-First" />
              <p className="relative z-10 font-bold" style={{
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.15rem, 2vw, 1.35rem)',
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                }}>
                A social-first agency built to help brands grow by making their digital
                presence feel more human.
              </p>
            </GeometricCard>
          </div>

          {/* Extended Team Card */}
          <div className="md:col-span-12 lg:col-span-10 lg:col-start-2">
            <GeometricCard
              cardStyle={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                padding: 'clamp(2rem, 4vw, 3rem)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                <div className="flex-1 max-w-md">
                  <CellLabel text="02 / Your Extended Team" />
                  <p style={{
                      color: 'rgba(255,255,255,0.75)',
                      fontFamily: 'var(--font-stack-body)',
                      fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
                      lineHeight: 1.6,
                    }}>
                    We combine insight with efficiency to help you build brand ecosystems
                    that work — across every platform and every stage of growth.
                  </p>
                </div>
                
                {/* Orchestrated inner tags */}
                <motion.div 
                  className="grid grid-cols-2 gap-3 shrink-0 w-full md:w-auto"
                  variants={staggerContainer}
                >
                  {['Strategy', 'Creative', 'Growth', 'Content'].map((tag) => (
                    <motion.div
                      key={tag}
                      variants={fadeUpItem} // Hooks into the parent orchestrator
                      whileHover={{ 
                        scale: 1.05, 
                        backgroundColor: 'var(--color-secondary)',
                        color: 'var(--color-primary)',
                      }}
                      transition={SPRING_TRANSITION}
                      className="px-5 py-3 text-center cursor-default"
                      style={{
                        border: '1px solid rgba(164,108,252,0.3)',
                        background: 'rgba(164,108,252,0.05)',
                        fontFamily: 'var(--font-stack-heading)',
                        color: 'var(--color-secondary)',
                        letterSpacing: '0.15em',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      {tag}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </GeometricCard>
          </div>
        </div>
      </motion.div>
    </section>
  );
}