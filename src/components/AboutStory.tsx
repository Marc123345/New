import { useRef, useState, useCallback, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  Variants,
  AnimatePresence,
} from 'motion/react';
import { SignalGridPanel } from './SignalGridPanel';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SPRING_TRANSITION = { type: 'spring' as const, stiffness: 300, damping: 20 };

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

const scaleInItem: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
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
  shadowColor = 'rgba(255,255,255,0.15)',
  noShadow = false,
}: {
  children: React.ReactNode;
  className?: string;
  cardStyle?: React.CSSProperties;
  shadowColor?: string;
  noShadow?: boolean;
}) {
  const mag = useMagnetic(0.08);
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
          whileHover={noShadow ? {} : {
            x: -3,
            y: -3,
            boxShadow: `8px 8px 0 ${shadowColor}`,
            transition: SPRING_TRANSITION,
          }}
          className="relative h-full w-full overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: noShadow ? 'none' : `4px 4px 0 ${shadowColor}, inset 0px 1px 1px rgba(255,255,255,0.1)`,
            borderRadius: 2,
            ...cardStyle,
          }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
            style={{
              opacity: isHovering ? 1 : 0,
              background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.04), transparent 40%)`,
            }}
          />
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
      className="inline-block mb-8"
    >
      <motion.div
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
        transition={SPRING_TRANSITION}
        className="inline-flex items-center gap-3 px-5 py-2 cursor-default group"
        style={{
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '100px',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#ffffff',
            display: 'inline-block',
            boxShadow: '0 0 10px rgba(255,255,255,0.5)',
          }}
        />
        <span
          className="text-[0.6rem] font-bold uppercase tracking-[0.25em]"
          style={{
            fontFamily: 'var(--font-stack-heading)',
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}

function FloatingOrb({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 8 + delay * 2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

function AccentLine() {
  return (
    <motion.div
      style={{
        width: 48,
        height: 2,
        background: 'rgba(255,255,255,0.6)',
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

function CellLabel({ text }: { text: string }) {
  return (
    <span
      className="inline-block w-full"
      style={{
        fontSize: '0.6rem',
        fontWeight: 700,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'var(--font-stack-heading)',
        marginBottom: '0.75rem',
      }}
    >
      {text}
    </span>
  );
}

function StatBlock({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
      className="text-center"
    >
      <div
        className="font-black"
        style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontFamily: 'var(--font-stack-heading)',
          color: '#ffffff',
          lineHeight: 1,
          letterSpacing: '-0.04em',
        }}
      >
        <CountUp target={value} suffix={suffix} />
      </div>
      <div
        className="text-xs uppercase mt-2"
        style={{
          fontFamily: 'var(--font-stack-heading)',
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.2em',
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [h2hExpanded, setH2hExpanded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const contentParallax = useTransform(scrollYProgress, [0, 1], ['3%', '-3%']);
  const videoParallax = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden flex flex-col items-center justify-center selection:bg-white/20 selection:text-white"
      style={{
        background: 'var(--color-primary)',
        padding: 'clamp(6rem, 12vw, 12rem) clamp(1.5rem, 5vw, 3rem)',
      }}
    >
      <FloatingOrb delay={0} size={400} x="10%" y="15%" />
      <FloatingOrb delay={2} size={300} x="70%" y="60%" />
      <FloatingOrb delay={4} size={250} x="85%" y="10%" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, var(--color-primary) 0%, transparent 15%),
            linear-gradient(0deg, var(--color-primary) 0%, transparent 15%)
          `,
          zIndex: 1,
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-[1300px] mx-auto flex flex-col items-center"
        style={{ y: contentParallax }}
      >
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <SectionBadge label="About Us" />

          <h2
            style={{
              fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)',
              fontFamily: 'var(--font-stack-heading)',
              color: '#ffffff',
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            >
              From Brand Voice
            </motion.span>
            <motion.span
              className="block mt-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE_OUT_EXPO }}
            >
              <span
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1.5px rgba(255,255,255,0.7)',
                }}
              >
                To Human
              </span>{' '}
              Connection
            </motion.span>
          </h2>

          <motion.p
            className="max-w-2xl mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT_EXPO }}
            style={{
              fontFamily: 'var(--font-stack-body)',
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            At H2H we believe the most impactful brands are the ones that know how to
            connect, not just communicate. People want personality, brands that speak
            like humans and offer something meaningful.
          </motion.p>
        </div>

        <motion.div
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="lg:col-span-7 h-full">
            <GeometricCard
              cardStyle={{
                padding: 0,
                background: 'rgba(0,0,0,0.4)',
                minHeight: '420px',
                overflow: 'hidden',
              }}
              noShadow
            >
              <motion.div
                className="relative w-full h-full"
                style={{ y: videoParallax }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ minHeight: '420px' }}
                  src="https://ik.imagekit.io/qcvroy8xpd/Shannon_s_Space_Video_Creation.mp4"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)',
                  }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <CellLabel text="Our Story" />
                  <p
                    className="font-medium max-w-md"
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontFamily: 'var(--font-stack-body)',
                      fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
                      lineHeight: 1.5,
                    }}
                  >
                    A social-first agency built to help brands grow by making their
                    digital presence feel more human.
                  </p>
                </motion.div>
              </motion.div>
            </GeometricCard>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="flex-1">
              <GeometricCard
                cardStyle={{
                  padding: 0,
                  background: 'rgba(0,0,0,0.3)',
                  minHeight: '280px',
                  display: 'flex',
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}
                noShadow
              >
                <div
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => setH2hExpanded(!h2hExpanded)}
                >
                  <div className="w-full h-full" style={{ minHeight: '280px' }}>
                    <SignalGridPanel />
                  </div>
                  <AnimatePresence>
                    {!h2hExpanded && (
                      <motion.div
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5"
                        style={{
                          background: 'rgba(0,0,0,0.6)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          backdropFilter: 'blur(8px)',
                          borderRadius: 4,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span
                          className="text-[0.6rem] uppercase"
                          style={{
                            color: 'rgba(255,255,255,0.6)',
                            letterSpacing: '0.15em',
                            fontFamily: 'var(--font-stack-heading)',
                          }}
                        >
                          Live Network
                        </span>
                        <motion.span
                          className="inline-block rounded-full"
                          style={{
                            width: 5,
                            height: 5,
                            background: '#4ade80',
                          }}
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GeometricCard>
            </div>

            <div>
              <GeometricCard
                cardStyle={{
                  background: '#ffffff',
                  padding: 'clamp(1.5rem, 3vw, 2rem)',
                  justifyContent: 'center',
                }}
                shadowColor="rgba(255,255,255,0.08)"
              >
                <p
                  className="font-bold"
                  style={{
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-stack-body)',
                    fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
                    lineHeight: 1.4,
                    letterSpacing: '-0.02em',
                  }}
                >
                  We combine insight with efficiency to help you build brand
                  ecosystems that work across every platform and stage of growth.
                </p>
              </GeometricCard>
            </div>
          </div>

          <div className="lg:col-span-12">
            <motion.div
              className="w-full"
              variants={fadeUpItem}
            >
              <div
                className="w-full py-10 md:py-14"
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 lg:gap-28">
                  <StatBlock value={50} suffix="+" label="Brands" delay={0.1} />
                  <StatBlock value={12} suffix="+" label="Markets" delay={0.2} />
                  <StatBlock value={98} suffix="%" label="Retention" delay={0.3} />
                  <StatBlock value={200} suffix="+" label="Campaigns" delay={0.4} />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-12">
            <motion.div
              className="flex flex-wrap justify-center gap-3 mt-2"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {['Strategy', 'Creative', 'Growth', 'Content', 'Social', 'Analytics'].map((tag) => (
                <motion.div
                  key={tag}
                  variants={scaleInItem}
                  whileHover={{
                    scale: 1.08,
                    backgroundColor: '#ffffff',
                    color: 'var(--color-primary)',
                    borderColor: '#ffffff',
                  }}
                  transition={SPRING_TRANSITION}
                  className="px-5 py-2.5 cursor-default"
                  style={{
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.03)',
                    fontFamily: 'var(--font-stack-heading)',
                    color: 'rgba(255,255,255,0.6)',
                    letterSpacing: '0.15em',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  {tag}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
