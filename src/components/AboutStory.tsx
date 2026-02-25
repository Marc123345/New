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
    const duration = 2200;
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

function SplitWord({
  word,
  delay,
  style,
}: {
  word: string;
  delay: number;
  style?: React.CSSProperties;
}) {
  return (
    <motion.span
      style={{ display: 'inline-block', ...style }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
    >
      {word}
    </motion.span>
  );
}

function PillTag({ label, delay = 0 }: { label: string; delay?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: EASE_OUT_EXPO }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '0.55rem 1.1rem',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.18)'}`,
        background: hovered ? 'rgba(255,255,255,0.07)' : 'transparent',
        cursor: 'default',
        transition: 'border-color 0.25s, background 0.25s',
        display: 'inline-block',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: '0.72rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: hovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
          transition: 'color 0.25s',
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

function HorizontalRule({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease: EASE_OUT_EXPO }}
      style={{
        height: 1,
        background: 'rgba(255,255,255,0.1)',
        transformOrigin: 'left',
        width: '100%',
      }}
    />
  );
}

function StatBlock({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const mag = useMagnetic(0.08);
  return (
    <motion.div
      ref={mag.ref}
      onMouseMove={mag.handleMove}
      onMouseLeave={mag.handleLeave}
      style={{ x: mag.springX, y: mag.springY }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
    >
      <div
        style={{
          paddingBottom: '1.25rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(2.8rem, 5vw, 4rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1,
            letterSpacing: '-0.04em',
          }}
        >
          <CountUp target={value} suffix={suffix} />
        </div>
        <div
          style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: '0.68rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginTop: '0.5rem',
          }}
        >
          {label}
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

  const canvasParallax = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const canvasSpring = useSpring(canvasParallax, { stiffness: 80, damping: 25 });

  const HEADING_WORDS = ['Human', 'to', 'Human'];
  const HEADING_OUTLINE_WORDS = ['Connection'];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden"
      style={{ background: 'var(--color-primary)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)',
          zIndex: 2,
        }}
      />

      <div className="relative z-[2] flex flex-col">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-end"
          style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 5rem) 0' }}>

          <div>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: '2rem' }}
            >
              <div
                className="inline-flex items-center gap-3"
                style={{
                  padding: '0.45rem 1rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.7)',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-stack-heading)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  About H2H
                </span>
              </div>
            </motion.div>

            <h2
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontWeight: 800,
                textTransform: 'uppercase',
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0 0.28em',
                fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              }}
            >
              {HEADING_WORDS.map((w, i) => (
                <SplitWord
                  key={i}
                  word={w}
                  delay={i * 0.08}
                  style={{ color: '#ffffff' }}
                />
              ))}
              {HEADING_OUTLINE_WORDS.map((w, i) => (
                <SplitWord
                  key={'o' + i}
                  word={w}
                  delay={0.24 + i * 0.08}
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '1.5px rgba(255,255,255,0.55)',
                  }}
                />
              ))}
            </h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT_EXPO }}
            style={{
              fontFamily: 'var(--font-stack-body)',
              fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.45)',
              maxWidth: 280,
              paddingBottom: '0.5rem',
              paddingLeft: 'clamp(0px, 4vw, 3rem)',
              alignSelf: 'flex-end',
            }}
            className="hidden lg:block"
          >
            A social-first agency building brands that speak like humans — not marketing machines.
          </motion.p>
        </div>

        <div style={{ padding: '2.5rem clamp(1.5rem, 5vw, 5rem) 0' }}>
          <HorizontalRule delay={0.2} />
        </div>

        <div
          className="relative overflow-hidden"
          style={{ margin: '0 clamp(1.5rem, 5vw, 5rem)' }}
        >
          <motion.div style={{ y: canvasSpring }}>
            <SignalGridPanel />
          </motion.div>

          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: '35%',
              background: 'linear-gradient(to top, var(--color-primary) 0%, transparent 100%)',
              zIndex: 3,
            }}
          />
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: '15%',
              background: 'linear-gradient(to bottom, var(--color-primary) 0%, transparent 100%)',
              zIndex: 3,
            }}
          />
        </div>

        <div style={{ padding: '0 clamp(1.5rem, 5vw, 5rem)' }}>
          <HorizontalRule />
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr]"
          style={{
            padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 5rem)',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex flex-col gap-6">
            <StatBlock value={50} suffix="+" label="Brands elevated" delay={0.05} />
            <StatBlock value={12} suffix="+" label="Global markets" delay={0.12} />
            <StatBlock value={98} suffix="%" label="Client retention" delay={0.19} />
          </div>

          <div
            style={{
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              padding: '0 clamp(1.5rem, 4vw, 3rem)',
            }}
            className="flex flex-col justify-between gap-8"
          >
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT_EXPO }}
              style={{
                fontFamily: 'var(--font-stack-body)',
                fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.88)',
                fontWeight: 500,
              }}
            >
              At H2H we believe the most impactful brands are the ones that know how to
              connect — not just communicate. Perfect campaigns matter, but people want
              personality. They want brands that speak like humans and offer something
              meaningful.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.22, ease: EASE_OUT_EXPO }}
              style={{
                fontFamily: 'var(--font-stack-body)',
                fontSize: 'clamp(0.88rem, 1.5vw, 1rem)',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.42)',
              }}
            >
              We embed ourselves in your world — a flexible, responsive extension of your
              team that combines insight with efficiency to help you build brand ecosystems
              that work across every platform and every stage of growth.
            </motion.p>

            <div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.35 }}
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  marginBottom: '0.85rem',
                }}
              >
                Our disciplines
              </motion.p>
              <div className="flex flex-wrap gap-2">
                {['Strategy', 'Creative', 'Growth', 'Content', 'Analytics', 'Community'].map(
                  (tag, i) => (
                    <PillTag key={tag} label={tag} delay={0.4 + i * 0.06} />
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT_EXPO }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  marginBottom: '1rem',
                }}
              >
                Platforms we dominate
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { name: 'Instagram', pct: 94 },
                  { name: 'TikTok', pct: 88 },
                  { name: 'LinkedIn', pct: 81 },
                  { name: 'YouTube', pct: 76 },
                ].map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.07, ease: EASE_OUT_EXPO }}
                  >
                    <div className="flex justify-between items-center" style={{ marginBottom: '0.35rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-stack-heading)',
                          fontSize: '0.7rem',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.55)',
                        }}
                      >
                        {p.name}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-stack-heading)',
                          fontSize: '0.7rem',
                          color: 'rgba(255,255,255,0.35)',
                        }}
                      >
                        {p.pct}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 2,
                        background: 'rgba(255,255,255,0.08)',
                        overflow: 'hidden',
                      }}
                    >
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: EASE_OUT_EXPO }}
                        style={{
                          height: '100%',
                          width: `${p.pct}%`,
                          background: 'rgba(255,255,255,0.75)',
                          transformOrigin: 'left',
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE_OUT_EXPO }}
            >
              <div
                style={{
                  padding: '1.25rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-stack-heading)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
                    marginBottom: '0.65rem',
                  }}
                >
                  Our philosophy
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-stack-body)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.6)',
                    fontStyle: 'italic',
                  }}
                >
                  "Real growth comes from real connection. We don't chase algorithms — we chase authenticity."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
