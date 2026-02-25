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

// --- ANIMATION VARIANTS ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
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

// --- CUSTOM HOOKS ---
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

// --- COMPONENTS ---
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

function SplitText({
  text,
  className,
  style,
  delay = 0,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  return (
    <span
      className={className}
      style={{ ...style, display: 'flex', flexWrap: 'wrap', gap: '0 0.3em', justifyContent: 'center' }}
    >
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-flex', paddingBottom: '0.15em', marginBottom: '-0.15em' }}>
          <motion.span
            style={{ display: 'inline-block', transformOrigin: 'bottom' }}
            initial={{ y: '110%', rotate: 2, opacity: 0 }}
            whileInView={{ y: '0%', rotate: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: delay + i * 0.04, ease: EASE_OUT_EXPO }}
          >
            {word}
          </motion.span>
        </span>
      ))}
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
  
  // UI UPGRADE: Spotlight Hover State
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mag.handleMove(e);
    if (!mag.ref.current) return;
    const rect = mag.ref.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div variants={fadeUpItem} className={`relative h-full w-full ${className}`}>
      <motion.div
        ref={mag.ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          mag.handleLeave();
          setIsHovering(false);
        }}
        style={{ x: mag.springX, y: mag.springY }}
        className="relative h-full w-full"
      >
        <motion.div
          whileHover={{
            x: -4,
            y: -4,
            boxShadow: `12px 12px 0 ${shadowColor}`,
            transition: SPRING_TRANSITION,
          }}
          className="relative h-full w-full overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,0.1)', // Refined outer border
            boxShadow: `6px 6px 0 ${shadowColor}, inset 0px 1px 1px rgba(255,255,255,0.15)`, // UI UPGRADE: Inner glassmorphism rim light
            ...cardStyle,
          }}
        >
          {/* UI UPGRADE: The Cursor Spotlight */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
            style={{
              opacity: isHovering ? 1 : 0,
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(164,108,252,0.1), transparent 40%)`,
            }}
          />
          {/* Content wrapper to sit above the spotlight */}
          <div className="relative z-10 h-full w-full flex flex-col">
            {children}
          </div>
        </motion.div>
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
      className="inline-block mb-10"
    >
      <motion.div
        whileHover={{ scale: 1.05, backgroundColor: '#ffffff' }}
        transition={SPRING_TRANSITION}
        className="inline-flex items-center gap-3 px-6 py-2 cursor-default group"
        style={{
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '100px',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.02)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)', // Micro rim light
        }}
      >
        <span
          className="text-[0.65rem] font-bold uppercase tracking-[0.25em] transition-colors duration-300 group-hover:text-[var(--color-primary)]"
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
        opacity: 0.9,
        marginBottom: '1rem',
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
        width: 48,
        height: 2,
        background: 'var(--color-secondary)',
        marginBottom: '1.5rem',
        transformOrigin: 'left',
      }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT_EXPO }}
    />
  );
}

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const contentParallax = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center selection:bg-[var(--color-secondary)] selection:text-[var(--color-primary)]"
      style={{ 
        background: 'var(--color-primary)',
        padding: 'clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 3rem)'
      }}
    >
      {/* UI UPGRADE: Breathing Background Mesh */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0"
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: 'radial-gradient(circle at 50% 10%, rgba(164,108,252,0.18) 0%, transparent 60%)',
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-[1200px] mx-auto flex flex-col items-center"
        style={{ y: contentParallax }}
      >
        <div className="flex flex-col items-center text-center mb-20 md:mb-28">
          <SectionBadge label="About Us" />

          <div className="flex flex-col items-center justify-center">
            <h2
              style={{
                fontSize: 'clamp(2.75rem, 7vw, 6.5rem)',
                fontFamily: 'var(--font-stack-heading)',
                color: '#ffffff',
                lineHeight: 1,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '-0.04em',
                textAlign: 'center',
                margin: 0,
              }}
            >
              <motion.span
                className="block drop-shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
              >
                From Brand Voice
              </motion.span>
              <motion.span
                className="block mt-2"
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

        {/* ORBITAL BENTO GRID */}
        <motion.div 
          className="w-full grid grid-cols-1 md:grid-cols-12 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Main Intro Card */}
          <div className="md:col-span-12 lg:col-span-8 lg:col-start-3 h-full">
            <GeometricCard
              cardStyle={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                padding: 'clamp(2.5rem, 5vw, 4rem)',
                backdropFilter: 'blur(16px)',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <AccentLine />
              <p className="font-medium max-w-2xl text-white/95" style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                  lineHeight: 1.5,
                  letterSpacing: '-0.01em',
                }}>
                At H2H we believe the most impactful brands are the ones that know how to
                connect, not just communicate.
              </p>
              <p className="max-w-xl text-white/60 mt-6" style={{
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

          {/* Signal Grid Panel */}
          <div className="md:col-span-6 lg:col-span-5 lg:col-start-2 h-full">
            <GeometricCard
              cardStyle={{
                padding: 0,
                background: 'rgba(0,0,0,0.3)',
                minHeight: '280px',
              }}
            >
              <div className="absolute inset-0 opacity-80 mix-blend-screen pointer-events-none">
                <SignalGridPanel />
              </div>
            </GeometricCard>
          </div>

          {/* Social First Card */}
          <div className="md:col-span-6 lg:col-span-5 h-full">
            <GeometricCard
              shadowColor="var(--color-primary)"
              cardStyle={{
                background: 'var(--color-secondary)',
                padding: 'clamp(2rem, 4vw, 3rem)',
                justifyContent: 'center',
                minHeight: '280px',
              }}
            >
              <CellLabel text="01 / Social-First" />
              <p className="font-bold" style={{
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
          <div className="md:col-span-12 lg:col-span-10 lg:col-start-2 h-full">
            <GeometricCard
              cardStyle={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                padding: 'clamp(2rem, 4vw, 3rem)',
                backdropFilter: 'blur(16px)',
                justifyContent: 'center',
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
                
                <motion.div 
                  className="grid grid-cols-2 gap-3 shrink-0 w-full md:w-auto"
                  variants={staggerContainer}
                >
                  {['Strategy', 'Creative', 'Growth', 'Content'].map((tag) => (
                    <motion.div
                      key={tag}
                      variants={fadeUpItem}
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
                        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
                      }}
                    >
                      {tag}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </GeometricCard>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}