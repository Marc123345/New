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
      onMouseLeave={(e) => {
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
      style={{ background: 'var(--color-background-light)' }}
    >
      <motion.div
        className="absolute left-8 lg:left-12 top-0 bottom-0 hidden lg:block pointer-events-none"
        style={{
          width: 2,
          background:
            'linear-gradient(to bottom, transparent, var(--color-secondary), transparent)',
          scaleY: lineProgress,
          transformOrigin: 'top',
          opacity: 0.2,
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(164,108,252,0.25), transparent)',
        }}
      />

      <div
        className="relative z-10"
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: 'var(--space-12x) var(--space-4x)',
        }}
      >
        <div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between"
          style={{ marginBottom: 'var(--space-12x)' }}
        >
          <div style={{ maxWidth: 900 }}>
            <SectionBadge label="About Us" />

            <div style={{ perspective: 800 }}>
              <SplitText
                text="From Brand Voice"
                className="block"
                style={{
                  fontSize: 'clamp(2.8rem, 7.5vw, 6.5rem)',
                  fontFamily: 'var(--font-stack-heading)',
                  color: '#ffffff',
                  lineHeight: 0.95,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.03em',
                }}
              />
              <div
                className="flex items-baseline flex-wrap"
                style={{ gap: '0 0.25em' }}
              >
                <SplitText
                  text="To Human"
                  delay={0.3}
                  style={{
                    fontSize: 'clamp(2.8rem, 7.5vw, 6.5rem)',
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
                    fontSize: 'clamp(2.8rem, 7.5vw, 6.5rem)',
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
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="hidden lg:flex items-center pb-4"
            style={{ gap: 'var(--space-8x)' }}
          >
            {[
              { value: 50, suffix: '+', label: 'Brands' },
              { value: 12, suffix: '+', label: 'Markets' },
              { value: 98, suffix: '%', label: 'Retention' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="font-black"
                  style={{
                    fontSize: '2.5rem',
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
                    color: 'var(--color-text-dark)',
                    opacity: 0.4,
                    letterSpacing: '0.2em',
                    marginTop: 'var(--space-1x)',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12"
          style={{ gap: 'var(--space-4x)' }}
        >
          <div className="lg:col-span-7 md:col-span-2">
            <GeometricCard
              delay={0.1}
              cardStyle={{
                background:
                  'linear-gradient(135deg, var(--color-primary) 0%, #1a1240 100%)',
                padding: 'clamp(2rem, 4vw, 3rem)',
              }}
            >
              <div
                className="absolute -top-6 -right-2 select-none pointer-events-none"
                style={{ opacity: 0.04 }}
              >
                <span
                  style={{
                    fontSize: 'clamp(8rem, 14vw, 14rem)',
                    fontFamily: 'var(--font-stack-heading)',
                    fontWeight: 900,
                    lineHeight: 0.85,
                    color: '#ffffff',
                    letterSpacing: '-0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  H2H
                </span>
              </div>

              <AccentLine />

              <p
                className="relative z-10 font-medium"
                style={{
                  color: 'rgba(255,255,255,0.95)',
                  fontFamily: 'var(--font-stack-body)',
                  maxWidth: 540,
                  fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
                  lineHeight: 1.5,
                }}
              >
                At H2H we believe the most impactful brands are the ones that
                know how to connect, not just communicate.
              </p>
              <p
                className="relative z-10"
                style={{
                  color: 'var(--color-text-dark)',
                  opacity: 0.5,
                  fontFamily: 'var(--font-stack-body)',
                  maxWidth: 540,
                  fontSize: 'clamp(0.95rem, 1.8vw, 1.125rem)',
                  lineHeight: 1.7,
                  marginTop: 'var(--space-4x)',
                }}
              >
                Perfect, polished campaigns are something that we take very
                seriously. But, people want more than that. They want
                personality. They want to see and hear brands that speak like
                humans and offer something meaningful.
              </p>
            </GeometricCard>
          </div>

          <div className="lg:col-span-5">
            <GeometricCard
              delay={0.2}
              shadowColor="var(--color-primary)"
              cardStyle={{
                background: 'var(--color-secondary)',
                padding: 'clamp(2rem, 4vw, 3rem)',
              }}
            >
              <div
                className="flex flex-col justify-between h-full"
                style={{ minHeight: 260 }}
              >
                <div>
                  <CellLabel text="01 / Social-First" />
                  <p
                    className="relative z-10 font-semibold"
                    style={{
                      color: 'var(--color-primary)',
                      fontFamily: 'var(--font-stack-body)',
                      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                      lineHeight: 1.5,
                    }}
                  >
                    H2H is a social-first agency built to help brands grow by
                    making their digital presence feel more human — thoughtful,
                    strategic, and real.
                  </p>
                </div>
                <motion.div
                  className="flex items-center"
                  style={{ marginTop: 'var(--space-6x)', gap: 'var(--space-2x)' }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex -space-x-2">
                    {['var(--color-primary)', '#1a1240', '#3d2d7a'].map(
                      (c, i) => (
                        <div
                          key={i}
                          className="w-7 h-7"
                          style={{
                            background: c,
                            border: '2px solid var(--color-secondary)',
                          }}
                        />
                      ),
                    )}
                  </div>
                  <span
                    className="text-xs"
                    style={{
                      color: 'var(--color-primary)',
                      fontFamily: 'var(--font-stack-body)',
                      opacity: 0.6,
                    }}
                  >
                    Trusted by 50+ brands
                  </span>
                </motion.div>
              </div>
            </GeometricCard>
          </div>

          <div className="lg:col-span-4">
            <GeometricCard
              delay={0.3}
              cardStyle={{
                background: 'var(--color-primary)',
                padding: 'clamp(2rem, 4vw, 3rem)',
              }}
            >
              <div
                className="flex flex-col justify-between h-full"
                style={{ minHeight: 280 }}
              >
                <div>
                  <CellLabel text="02 / Why H2H?" />
                  <h3
                    className="font-extrabold"
                    style={{
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-stack-heading)',
                      fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      marginBottom: 'var(--space-4x)',
                    }}
                  >
                    Because we embed ourselves in your world.
                  </h3>
                </div>
                <p
                  style={{
                    color: 'var(--color-text-dark)',
                    opacity: 0.55,
                    fontFamily: 'var(--font-stack-body)',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                  }}
                >
                  When you work with H2H, you don't get an agency. You get a
                  partner — a flexible, responsive extension of your team.
                </p>
              </div>
            </GeometricCard>
          </div>

          <div className="lg:col-span-8">
            <GeometricCard
              delay={0.4}
              cardStyle={{
                background:
                  'linear-gradient(160deg, #1a1240 0%, var(--color-primary) 100%)',
                padding: 'clamp(2rem, 4vw, 3rem)',
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
                <div className="flex-1">
                  <CellLabel text="03 / Your Extended Team" />
                  <p
                    className="relative z-10"
                    style={{
                      color: 'rgba(255,255,255,0.85)',
                      fontFamily: 'var(--font-stack-body)',
                      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                      lineHeight: 1.6,
                    }}
                  >
                    Like a living, breathing part of your organization, we adapt
                    to your rhythm, align with your goals, and help you scale
                    with clarity and purpose.
                  </p>
                </div>

                <div className="shrink-0 grid grid-cols-2" style={{ gap: 'var(--space-2x)' }}>
                  {['Strategy', 'Creative', 'Growth', 'Content'].map(
                    (tag, i) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.08 }}
                        className="px-4 py-2.5 text-center"
                        style={{
                          border: '2px solid var(--color-secondary)',
                          boxShadow: '3px 3px 0 var(--color-secondary)',
                          background: 'rgba(164,108,252,0.08)',
                        }}
                      >
                        <span
                          className="text-xs uppercase"
                          style={{
                            fontFamily: 'var(--font-stack-heading)',
                            color: 'var(--color-secondary)',
                            letterSpacing: '0.15em',
                          }}
                        >
                          {tag}
                        </span>
                      </motion.div>
                    ),
                  )}
                </div>
              </div>
            </GeometricCard>
          </div>

          <div className="lg:col-span-12 md:col-span-2">
            <GeometricCard
              delay={0.5}
              cardStyle={{
                background:
                  'linear-gradient(135deg, var(--color-primary) 0%, #0e0b1f 50%, var(--color-primary) 100%)',
                padding: 'clamp(2.5rem, 5vw, 4rem)',
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                <div style={{ maxWidth: 740 }}>
                  <CellLabel text="Structure + Soul" />
                  <p
                    style={{
                      color: 'rgba(255,255,255,0.75)',
                      fontFamily: 'var(--font-stack-body)',
                      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                      lineHeight: 1.7,
                    }}
                  >
                    We're strategists, creatives, and storytellers who bring a
                    mix of structure and soul. We combine insight with efficiency
                    to help you build brand ecosystems that actually work —
                    across every platform, every touchpoint, and every stage of
                    growth.
                  </p>
                </div>

                <motion.div
                  className="shrink-0 flex items-center justify-center relative"
                  style={{
                    width: 'clamp(140px, 14vw, 200px)',
                    height: 'clamp(140px, 14vw, 200px)',
                    border: '2px solid var(--color-secondary)',
                    boxShadow: '8px 8px 0 var(--color-secondary)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <svg
                    viewBox="0 0 200 200"
                    className="absolute inset-0 w-full h-full"
                  >
                    <defs>
                      <path
                        id="aboutCirclePath"
                        d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                      />
                    </defs>
                    <text
                      style={{
                        fontSize: '14px',
                        fontFamily: 'var(--font-stack-heading)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.35em',
                        fill: 'rgba(164,108,252,0.5)',
                      }}
                    >
                      <textPath href="#aboutCirclePath">
                        HUMAN TO HUMAN -- CONNECT -- GROW --
                      </textPath>
                    </text>
                  </svg>
                  <span
                    className="relative z-10 font-black uppercase"
                    style={{
                      fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                      fontFamily: 'var(--font-stack-heading)',
                      color: 'transparent',
                      WebkitTextStroke: '1px var(--color-secondary)',
                      lineHeight: 1,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    H2H
                  </span>
                </motion.div>
              </div>
            </GeometricCard>
          </div>
        </div>
      </div>
    </section>
  );
}
