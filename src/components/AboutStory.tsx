import { useRef, useState, useCallback, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from 'motion/react';
import { SignalGridPanel } from './SignalGridPanel';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SPRING_TRANSITION = { type: 'spring', stiffness: 300, damping: 20 };

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

// FIX 1: Added padding to the overflow wrapper so the font metrics don't clip and hide the text
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
      style={{ ...style, display: 'flex', flexWrap: 'wrap', gap: '0 0.3em' }}
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
  delay = 0,
  shadowColor = 'var(--color-secondary)',
}: {
  children: React.ReactNode;
  className?: string;
  cardStyle?: React.CSSProperties;
  delay?: number;
  shadowColor?: string;
}) {
  const mag = useMagnetic(0.12);

  return (
    <motion.div
      ref={mag.ref}
      onMouseMove={mag.handleMove}
      onMouseLeave={mag.handleLeave}
      style={{ x: mag.springX, y: mag.springY }}
      className={className}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, boxShadow: `10px 10px 0 ${shadowColor}` }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        whileHover={{
          x: -4,
          y: -4,
          boxShadow: `16px 16px 0 ${shadowColor}`,
          transition: SPRING_TRANSITION,
        }}
        transition={{ duration: 0.8, delay, ease: EASE_OUT_EXPO }}
        className="relative h-full"
        style={{
          border: '2px solid var(--color-secondary)',
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
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="inline-block"
      style={{ marginBottom: 'var(--space-6x)' }}
    >
      <motion.div
        whileHover={{ scale: 1.05, backgroundColor: 'var(--color-secondary)' }}
        transition={SPRING_TRANSITION}
        className="inline-flex items-center gap-3 px-4 py-2 cursor-default group"
        style={{
          border: '2px solid var(--color-secondary)',
          boxShadow: '4px 4px 0 var(--color-secondary)',
        }}
      >
        <span
          className="text-xs uppercase group-hover:text-[var(--color-primary)] transition-colors duration-300"
          style={{
            fontFamily: 'var(--font-stack-heading)',
            color: 'var(--color-secondary)',
            letterSpacing: '0.3em',
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
      className="inline-block"
      style={{
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'var(--color-secondary)',
        fontFamily: 'var(--font-stack-heading)',
        opacity: 0.7,
        marginBottom: 'var(--space-4x)',
      }}
    >
      {text}
    </span>
  );
}

function AccentLine({ delay = 0.3 }: { delay?: number }) {
  return (
    <motion.div
      style={{
        width: 40,
        height: 2,
        background: 'var(--color-secondary)',
        marginBottom: 'var(--space-4x)',
        transformOrigin: 'left',
      }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: EASE_OUT_EXPO }}
    />
  );
}

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const starsParallax = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const contentParallax = useTransform(scrollYProgress, [0, 1], ['10%', '-5%']);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ 
        background: 'var(--color-primary)',
        padding: 'clamp(4rem, 8vw, 8rem) clamp(1rem, 4vw, 2rem)'
      }}
    >
      {/* GALAXY THEME: Deep Space Nebula Glow */}
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(164,108,252,0.12) 0%, transparent 60%)',
        }}
      />

      {/* GALAXY THEME: Subtle Orbital Rings in Background */}
      <motion.div 
        className="absolute top-[20%] left-1/2 w-[800px] h-[800px] -translate-x-1/2 rounded-full border border-white/5 pointer-events-none z-0 hidden md:block"
        style={{ y: starsParallax }}
      />
      <motion.div 
        className="absolute top-[10%] left-1/2 w-[1200px] h-[1200px] -translate-x-1/2 rounded-full border border-white/5 pointer-events-none z-0 hidden md:block"
        style={{ y: starsParallax }}
      />

      <motion.div 
        className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col items-center"
        style={{ y: contentParallax }}
      >
        <div className="flex flex-col items-center text-center mb-24 md:mb-32">
          <SectionBadge label="About Us" />

          {/* FIX 2: Updated typography colors to strictly rely on var(--color-secondary) instead of white, improving contrast */}
          <div className="mt-8 flex flex-col items-center justify-center" style={{ perspective: 800 }}>
            <SplitText
              text="From Brand Voice"
              className="block"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 6.5rem)',
                fontFamily: 'var(--font-stack-heading)',
                color: 'var(--color-secondary)', 
                lineHeight: 1,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                textAlign: 'center',
                textShadow: '0px 4px 20px rgba(0,0,0,0.1)' // Helps pop off the background
              }}
            />
            <div className="flex items-center justify-center flex-wrap mt-2" style={{ gap: '0 0.25em' }}>
              <SplitText
                text="To Human"
                delay={0.3}
                style={{
                  fontSize: 'clamp(2.5rem, 7vw, 6.5rem)',
                  fontFamily: 'var(--font-stack-heading)',
                  color: 'rgba(164, 108, 252, 0.1)', // Subtle fill instead of pure transparent
                  WebkitTextStroke: '2px var(--color-secondary)',
                  lineHeight: 1,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.03em',
                }}
              />
              <SplitText
                text="Connection"
                delay={0.45}
                style={{
                  fontSize: 'clamp(2.5rem, 7vw, 6.5rem)',
                  fontFamily: 'var(--font-stack-heading)',
                  color: 'var(--color-secondary)',
                  lineHeight: 1,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.03em',
                  textShadow: '0px 4px 20px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          </div>
        </div>

        {/* ORBITAL BENTO GRID */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          <div className="md:col-span-12 lg:col-span-8 lg:col-start-3">
            <GeometricCard
              delay={0.1}
              cardStyle={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                padding: 'clamp(2rem, 4vw, 3rem)',
                backdropFilter: 'blur(12px)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <AccentLine />
              <p className="relative z-10 font-medium max-w-2xl mt-4" style={{
                  color: 'var(--color-secondary)',
                  opacity: 0.95,
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                  lineHeight: 1.6,
                }}>
                At H2H we believe the most impactful brands are the ones that know how to
                connect, not just communicate.
              </p>
              <p className="relative z-10 max-w-xl" style={{
                  color: 'var(--color-secondary)',
                  opacity: 0.7,
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
                  lineHeight: 1.7,
                  marginTop: 'var(--space-4x)',
                }}>
                Perfect, polished campaigns are something we take very seriously. But people
                want more than that — they want personality, brands that speak like humans
                and offer something meaningful.
              </p>
            </GeometricCard>
          </div>

          <div className="md:col-span-6 lg:col-span-4 lg:col-start-3">
             <div className="h-full min-h-[250px] relative overflow-hidden rounded-sm border-2 border-[var(--color-secondary)] opacity-80 mix-blend-screen bg-black/20">
                <SignalGridPanel />
             </div>
          </div>

          <div className="md:col-span-6 lg:col-span-4">
            <GeometricCard
              delay={0.2}
              shadowColor="var(--color-primary)"
              cardStyle={{
                background: 'var(--color-secondary)',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <CellLabel text="01 / Social-First" />
              <p className="relative z-10 font-bold" style={{
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
                  lineHeight: 1.4,
                }}>
                A social-first agency built to help brands grow by making their digital
                presence feel more human.
              </p>
            </GeometricCard>
          </div>

          <div className="md:col-span-12 lg:col-span-8 lg:col-start-3">
            <GeometricCard
              delay={0.4}
              cardStyle={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex-1">
                  <CellLabel text="02 / Your Extended Team" />
                  <p style={{
                      color: 'var(--color-secondary)',
                      opacity: 0.8,
                      fontFamily: 'var(--font-stack-body)',
                      fontSize: 'clamp(0.95rem, 1.6vw, 1.1rem)',
                      lineHeight: 1.6,
                    }}>
                    We combine insight with efficiency to help you build brand ecosystems
                    that work — across every platform and every stage of growth.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 shrink-0 w-full md:w-auto">
                  {['Strategy', 'Creative', 'Growth', 'Content'].map((tag, i) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05, backgroundColor: 'var(--color-secondary)' }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.08, ...SPRING_TRANSITION }}
                      className="px-4 py-3 text-center group cursor-default"
                      style={{
                        border: '1px solid var(--color-secondary)',
                        background: 'rgba(164,108,252,0.08)',
                      }}
                    >
                      <span className="text-xs uppercase group-hover:text-[var(--color-primary)] transition-colors duration-300"
                        style={{
                          fontFamily: 'var(--font-stack-heading)',
                          color: 'var(--color-secondary)',
                          letterSpacing: '0.15em',
                        }}>
                        {tag}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GeometricCard>
          </div>
        </div>
      </motion.div>
    </section>
  );
}