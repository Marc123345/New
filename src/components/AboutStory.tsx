import { useRef, useState, useCallback, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from 'motion/react';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
        <motion.span
          key={i}
          style={{ display: 'inline-block' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, delay: delay + i * 0.04, ease: EASE_OUT_EXPO }}
        >
          {word}
        </motion.span>
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
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={mag.ref}
      onMouseMove={mag.handleMove}
      onMouseLeave={() => {
        mag.handleLeave();
        setHovered(false);
      }}
      onMouseEnter={() => setHovered(true)}
      style={{ x: mag.springX, y: mag.springY }}
      className={className}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay, ease: EASE_OUT_EXPO }}
        className="relative h-full"
        style={{
          border: '2px solid var(--color-secondary)',
          boxShadow: hovered
            ? `14px 14px 0 ${shadowColor}`
            : `10px 10px 0 ${shadowColor}`,
          transform: hovered ? 'translate(-2px, -2px)' : 'translate(0, 0)',
          transition: 'box-shadow 0.25s ease, transform 0.25s ease',
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
      <div
        className="inline-flex items-center gap-3 px-4 py-2"
        style={{
          border: '2px solid var(--color-secondary)',
          boxShadow: '4px 4px 0 var(--color-secondary)',
        }}
      >
        <span
          className="text-xs uppercase"
          style={{
            fontFamily: 'var(--font-stack-heading)',
            color: 'var(--color-secondary)',
            letterSpacing: '0.3em',
          }}
        >
          {label}
        </span>
      </div>
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
      }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
    />
  );
}

function VideoPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.0]);

  return (
    <div
      ref={ref}
      className="relative w-full h-full overflow-hidden"
      style={{ minHeight: 'clamp(360px, 60vh, 780px)' }}
    >
      <motion.video
        autoPlay
        muted
        loop
        playsInline
        style={{ scale }}
        className="absolute inset-0 w-full h-full object-cover"
        src="https://ik.imagekit.io/qcvroy8xpd/astronauts-dance-on-surface-of-the-alien-planet-hu-2026-01-28-04-20-47-utc.mp4a"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, transparent 60%, var(--color-primary) 100%), linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      <motion.div
        className="absolute bottom-8 left-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div
          className="flex gap-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 'var(--space-4x)' }}
        >
          {[
            { value: 50, suffix: '+', label: 'Brands' },
            { value: 12, suffix: '+', label: 'Markets' },
            { value: 98, suffix: '%', label: 'Retention' },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                className="font-black"
                style={{
                  fontSize: '2rem',
                  fontFamily: 'var(--font-stack-heading)',
                  color: 'var(--color-secondary)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div
                className="text-xs uppercase"
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  color: 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.2em',
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute top-6 left-6"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5"
          style={{
            background: 'rgba(0,0,0,0.45)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-secondary)',
              display: 'inline-block',
            }}
          />
          <span
            className="text-xs uppercase"
            style={{
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.2em',
              fontFamily: 'var(--font-stack-heading)',
            }}
          >
            H2H Agency
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const lineProgress = useSpring(
    useTransform(scrollYProgress, [0.1, 0.5], [0, 1]),
    { stiffness: 100, damping: 30 },
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden"
      style={{ background: 'var(--color-primary)' }}
    >
      <motion.div
        className="absolute left-8 lg:left-12 top-0 bottom-0 hidden lg:block pointer-events-none"
        style={{
          width: 2,
          background:
            'linear-gradient(to bottom, transparent, var(--color-secondary), transparent)',
          scaleY: lineProgress,
          transformOrigin: 'top',
          opacity: 0.12,
          zIndex: 2,
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(164,108,252,0.25), transparent)',
          zIndex: 2,
        }}
      />

      <div className="relative z-[2] flex flex-col lg:flex-row min-h-screen">
        <motion.div
          className="lg:w-1/2 w-full relative"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
        >
          <VideoPanel />
        </motion.div>

        <div
          className="lg:w-1/2 w-full flex flex-col justify-center"
          style={{ padding: 'clamp(3rem, 6vw, 5rem) clamp(2rem, 5vw, 4rem)' }}
        >
          <SectionBadge label="About Us" />

          <div style={{ perspective: 800, marginBottom: 'var(--space-8x)' }}>
            <SplitText
              text="From Brand Voice"
              className="block"
              style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
                fontFamily: 'var(--font-stack-heading)',
                color: '#ffffff',
                lineHeight: 0.95,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
              }}
            />
            <div className="flex items-baseline flex-wrap" style={{ gap: '0 0.25em' }}>
              <SplitText
                text="To Human"
                delay={0.3}
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
                  fontFamily: 'var(--font-stack-heading)',
                  color: 'transparent',
                  WebkitTextStroke: '1.5px var(--color-secondary)',
                  lineHeight: 0.95,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.03em',
                }}
              />
              <SplitText
                text="Connection"
                delay={0.45}
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 5rem)',
                  fontFamily: 'var(--font-stack-heading)',
                  color: '#ffffff',
                  lineHeight: 0.95,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.03em',
                }}
              />
            </div>
          </div>

          <div className="flex flex-col" style={{ gap: 'var(--space-4x)' }}>
            <GeometricCard
              delay={0.1}
              cardStyle={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
              }}
            >
              <AccentLine />
              <p
                className="relative z-10 font-medium"
                style={{
                  color: 'rgba(255,255,255,0.92)',
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  lineHeight: 1.6,
                }}
              >
                At H2H we believe the most impactful brands are the ones that know how to
                connect, not just communicate.
              </p>
              <p
                className="relative z-10"
                style={{
                  color: 'rgba(255,255,255,0.45)',
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(0.9rem, 1.6vw, 1rem)',
                  lineHeight: 1.7,
                  marginTop: 'var(--space-3x)',
                }}
              >
                Perfect, polished campaigns are something we take very seriously. But people
                want more than that — they want personality, brands that speak like humans
                and offer something meaningful.
              </p>
            </GeometricCard>

            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 'var(--space-4x)' }}>
              <GeometricCard
                delay={0.2}
                shadowColor="var(--color-primary)"
                cardStyle={{
                  background: 'var(--color-secondary)',
                  padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                }}
              >
                <CellLabel text="01 / Social-First" />
                <p
                  className="relative z-10 font-semibold"
                  style={{
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-stack-body)',
                    fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
                    lineHeight: 1.5,
                  }}
                >
                  A social-first agency built to help brands grow by making their digital
                  presence feel more human.
                </p>
              </GeometricCard>

              <GeometricCard
                delay={0.3}
                cardStyle={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                }}
              >
                <CellLabel text="02 / Why H2H?" />
                <p
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontFamily: 'var(--font-stack-body)',
                    fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
                    lineHeight: 1.6,
                  }}
                >
                  Because we embed ourselves in your world — a flexible, responsive
                  extension of your team.
                </p>
              </GeometricCard>
            </div>

            <GeometricCard
              delay={0.4}
              cardStyle={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CellLabel text="03 / Your Extended Team" />
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontFamily: 'var(--font-stack-body)',
                      fontSize: 'clamp(0.85rem, 1.6vw, 1rem)',
                      lineHeight: 1.6,
                      maxWidth: 340,
                    }}
                  >
                    We combine insight with efficiency to help you build brand ecosystems
                    that work — across every platform and every stage of growth.
                  </p>
                </div>
                <div className="grid grid-cols-2 shrink-0" style={{ gap: 'var(--space-2x)' }}>
                  {['Strategy', 'Creative', 'Growth', 'Content'].map((tag, i) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.08 }}
                      className="px-3 py-2 text-center"
                      style={{
                        border: '1px solid var(--color-secondary)',
                        background: 'rgba(164,108,252,0.08)',
                      }}
                    >
                      <span
                        className="text-xs uppercase"
                        style={{
                          fontFamily: 'var(--font-stack-heading)',
                          color: 'var(--color-secondary)',
                          letterSpacing: '0.12em',
                        }}
                      >
                        {tag}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GeometricCard>
          </div>
        </div>
      </div>
    </section>
  );
}
