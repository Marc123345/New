import { useRef, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
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

function GlassCard({
  children,
  className = '',
  cardStyle = {},
  noHoverLift = false,
}: {
  children: React.ReactNode;
  className?: string;
  cardStyle?: React.CSSProperties;
  noHoverLift?: boolean;
}) {
  const mag = useMagnetic(0.06);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mag.handleMove(e);
    if (!mag.ref.current) return;
    const rect = mag.ref.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div variants={fadeUpItem} className={`relative h-full w-full ${className}`}>
      <motion.div
        ref={mag.ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => { mag.handleLeave(); setIsHovering(false); }}
        style={{ x: mag.springX, y: mag.springY }}
        className="relative h-full w-full"
      >
        <motion.div
          whileHover={noHoverLift ? {} : {
            y: -4,
            transition: { type: 'spring', stiffness: 400, damping: 25 },
          }}
          className="relative h-full w-full overflow-hidden"
          style={{
            border: '1px solid rgba(164,108,252,0.1)',
            borderRadius: 6,
            ...cardStyle,
          }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
            style={{
              opacity: isHovering ? 1 : 0,
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(164,108,252,0.06), transparent 40%)`,
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

function FloatingOrb({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: 'radial-gradient(circle, rgba(164,108,252,0.06) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }}
      animate={{
        y: [0, -40, 0],
        x: [0, 20, 0],
        scale: [1, 1.15, 1],
        opacity: [0.2, 0.5, 0.2],
      }}
      transition={{
        duration: 10 + delay * 2,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

function CellLabel({ text }: { text: string }) {
  return (
    <span
      className="inline-block w-full"
      style={{
        fontSize: '0.55rem',
        fontWeight: 700,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(164,108,252,0.6)',
        fontFamily: 'var(--font-stack-heading)',
        marginBottom: '0.75rem',
      }}
    >
      {text}
    </span>
  );
}

const CAPABILITIES = [
  { tag: 'Strategy', desc: 'Brand positioning & market analysis' },
  { tag: 'Creative', desc: 'Visual storytelling & content creation' },
  { tag: 'Growth', desc: 'Performance marketing & scaling' },
  { tag: 'Social', desc: 'Community management & engagement' },
  { tag: 'Content', desc: 'Editorial planning & production' },
  { tag: 'Analytics', desc: 'Data-driven insights & optimization' },
];

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
      <FloatingOrb delay={0} size={500} x="5%" y="10%" />
      <FloatingOrb delay={3} size={350} x="75%" y="55%" />
      <FloatingOrb delay={1.5} size={280} x="50%" y="80%" />

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

          <motion.p
            className="max-w-xl mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE_OUT_EXPO }}
            style={{
              fontFamily: 'var(--font-stack-body)',
              fontSize: 'clamp(1rem, 1.6vw, 1.1rem)',
              lineHeight: 1.75,
              color: 'rgba(232,226,255,0.45)',
            }}
          >
            We believe the most impactful brands are the ones that know how to
            connect, not just communicate. People want personality -- brands that
            speak like humans and offer something meaningful.
          </motion.p>
        </div>

        <motion.div
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className="lg:col-span-7 h-full">
            <GlassCard
              cardStyle={{
                padding: 'clamp(2rem, 4vw, 3rem)',
                background: 'rgba(14,11,31,0.8)',
                minHeight: '480px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <CellLabel text="Our Story" />
              <h3
                className="font-bold"
                style={{
                  color: 'var(--color-text-dark)',
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: '1rem',
                }}
              >
                A social-first agency built to help brands grow by making their
                digital presence feel more human.
              </h3>
              <p
                style={{
                  color: 'rgba(232,226,255,0.4)',
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                  lineHeight: 1.7,
                  maxWidth: '520px',
                }}
              >
                We help companies build authentic relationships through strategic
                content, thought leadership, and employee advocacy -- turning every
                touchpoint into a meaningful conversation.
              </p>
              <motion.div
                className="mt-6 h-px"
                style={{ background: 'rgba(164,108,252,0.25)', transformOrigin: 'left' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.7, ease: EASE_OUT_EXPO }}
              />
            </GlassCard>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            <GlassCard
              cardStyle={{
                background: 'var(--color-text-dark)',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                justifyContent: 'center',
              }}
            >
              <p
                className="font-bold"
                style={{
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
                  lineHeight: 1.45,
                  letterSpacing: '-0.02em',
                }}
              >
                We combine insight with efficiency to build brand ecosystems
                that work -- across every platform and stage of growth.
              </p>
            </GlassCard>
          </div>

          <div className="lg:col-span-12 mt-6">
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
      </motion.div>
    </section>
  );
}
