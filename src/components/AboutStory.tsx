import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import UnicornScene from 'unicornstudio-react';

// ─── Narrative beats ──────────────────────────────────────────────────────────

const BEATS = [
  { id: 'b0', chapter: '01', label: 'About H2H'   },
  { id: 'b1', chapter: '02', label: 'Our Belief'  },
  { id: 'b2', chapter: '03', label: 'Our Mission' },
  { id: 'b3', chapter: '04', label: 'Why H2H'     },
  { id: 'b4', chapter: '05', label: 'How We Work' },
] as const;

// Scroll range for each beat: [enter-start, enter-end, exit-start, exit-end]
const RANGES: [number, number, number, number][] = [
  [0.00, 0.06, 0.16, 0.22],
  [0.20, 0.26, 0.36, 0.42],
  [0.40, 0.46, 0.56, 0.62],
  [0.60, 0.66, 0.76, 0.82],
  [0.80, 0.86, 0.96, 1.00],
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useBeat(progress: MotionValue<number>, idx: number) {
  const [e0, e1, x0, x1] = RANGES[idx];
  const opacity = useTransform(progress, [e0, e1, x0, x1], [0, 1, 1, 0]);
  const y       = useTransform(progress, [e0, e1, x0, x1], [36, 0, 0, -36]);
  return { opacity, y };
}

// ─── Progress sidebar ─────────────────────────────────────────────────────────

function ProgressDots({ progress }: { progress: MotionValue<number> }) {
  return (
    <div
      style={{
        position: 'absolute',
        right: 'clamp(1rem, 3vw, 2.5rem)',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 20,
        zIndex: 20,
        pointerEvents: 'none',
      }}
    >
      {BEATS.map((beat, i) => {
        const [e0, e1, x0, x1] = RANGES[i];
        const mid = (e1 + x0) / 2;
        const dotOpacity = useTransform(
          progress,
          [e0, e1, x0, x1],
          [0.2, 1, 1, 0.2]
        );
        const dotScale = useTransform(
          progress,
          [e0, e1, x0, x1],
          [0.7, 1.2, 1.2, 0.7]
        );
        const labelOpacity = useTransform(
          progress,
          [e0, e1, x0, x1],
          [0, 1, 1, 0]
        );
        return (
          <div key={beat.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.span
              style={{
                opacity: labelOpacity,
                fontFamily: 'monospace',
                fontSize: '0.5rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(164,108,252,0.7)',
                whiteSpace: 'nowrap',
              }}
            >
              {beat.label}
            </motion.span>
            <motion.div
              style={{
                opacity: dotOpacity,
                scale: dotScale,
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'rgba(164,108,252,0.8)',
                boxShadow: '0 0 8px rgba(164,108,252,0.5)',
              }}
            />
          </div>
        );
      })}

      {/* Thin vertical track */}
      <div style={{
        position: 'absolute',
        right: 2,
        top: 0,
        bottom: 0,
        width: 1,
        background: 'rgba(164,108,252,0.1)',
        zIndex: -1,
      }} />
    </div>
  );
}

// ─── Decorative chapter number ────────────────────────────────────────────────

function ChapterGlyph({ progress }: { progress: MotionValue<number> }) {
  const chapters = BEATS.map((b, i) => {
    const [e0, e1, x0, x1] = RANGES[i];
    const opacity = useTransform(progress, [e0, e1, x0, x1], [0, 0.06, 0.06, 0]);
    return { chapter: b.chapter, opacity };
  });

  return (
    <>
      {chapters.map(({ chapter, opacity }, i) => (
        <motion.span
          key={i}
          style={{
            opacity,
            position: 'absolute',
            right: '-0.05em',
            bottom: '-0.1em',
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(14rem, 30vw, 28rem)',
            fontWeight: 900,
            letterSpacing: '-0.06em',
            color: 'white',
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {chapter}
        </motion.span>
      ))}
    </>
  );
}

// ─── Individual beats ─────────────────────────────────────────────────────────

const EYEBROW: React.CSSProperties = {
  fontFamily: 'var(--font-stack-heading)',
  fontSize: '0.6rem',
  fontWeight: 700,
  letterSpacing: '0.38em',
  textTransform: 'uppercase',
  color: 'rgba(164,108,252,0.85)',
  display: 'block',
  marginBottom: '1.5rem',
};

const H2_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-stack-heading)',
  fontWeight: 900,
  fontSize: 'clamp(2.6rem, 7.5vw, 7rem)',
  lineHeight: 1.0,
  letterSpacing: '-0.04em',
  textTransform: 'uppercase',
  color: 'var(--color-text-dark)',
  margin: 0,
};

const OUTLINE_SPAN: React.CSSProperties = {
  color: 'transparent',
  WebkitTextStroke: '2px rgba(232,226,255,0.55)',
};

const BODY_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-stack-body)',
  fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
  lineHeight: 1.75,
  color: 'rgba(232,226,255,0.75)',
  maxWidth: '640px',
  margin: 0,
};

const QUOTE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-stack-heading)',
  fontWeight: 800,
  fontSize: 'clamp(1.6rem, 4vw, 3.5rem)',
  lineHeight: 1.2,
  letterSpacing: '-0.025em',
  color: 'rgba(232,226,255,0.92)',
  maxWidth: '780px',
  margin: 0,
};

function Beat0({ progress }: { progress: MotionValue<number> }) {
  const { opacity, y } = useBeat(progress, 0);
  return (
    <motion.div style={{ opacity, y, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'inherit' }}>
      <span style={EYEBROW}>About H2H</span>
      <h2 style={H2_STYLE}>
        <span style={{ display: 'block' }}>From Brand Voice</span>
        <span style={{ display: 'block' }}>
          <span style={OUTLINE_SPAN}>To Human</span> Connection
        </span>
      </h2>
    </motion.div>
  );
}

function Beat1({ progress }: { progress: MotionValue<number> }) {
  const { opacity, y } = useBeat(progress, 1);
  return (
    <motion.div style={{ opacity, y, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'inherit' }}>
      <div style={{ maxWidth: 680 }}>
        <p style={{
          fontFamily: 'var(--font-stack-heading)',
          fontWeight: 800,
          fontSize: 'clamp(1.8rem, 4.5vw, 4rem)',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          color: 'rgba(232,226,255,0.95)',
          margin: 0,
        }}>
          The most impactful brands know how to{' '}
          <span style={{ color: 'var(--color-secondary)' }}>connect</span>,
          not just communicate.
        </p>
      </div>
    </motion.div>
  );
}

function Beat2({ progress }: { progress: MotionValue<number> }) {
  const { opacity, y } = useBeat(progress, 2);
  return (
    <motion.div style={{ opacity, y, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'inherit' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 700 }}>
        <p style={BODY_STYLE}>
          Perfect, polished campaigns are something we take seriously. But people want more than that.
          They want <em style={{ fontStyle: 'normal', color: 'rgba(232,226,255,0.95)', fontWeight: 600 }}>personality</em>.
          They want to see and hear brands that speak like humans and offer something meaningful.
        </p>
        <div style={{
          borderLeft: '2px solid rgba(164,108,252,0.5)',
          paddingLeft: '1.25rem',
          background: 'linear-gradient(90deg, rgba(164,108,252,0.05) 0%, transparent 100%)',
        }}>
          <p style={{ ...BODY_STYLE, color: 'rgba(255,255,255,0.92)', fontWeight: 500, maxWidth: '100%' }}>
            <span style={{ fontFamily: 'var(--font-stack-heading)', fontWeight: 900, color: 'var(--color-secondary)', letterSpacing: '0.02em' }}>H2H</span>{' '}
            is a social-first agency built to help brands grow by making their digital presence feel more human — thoughtful, strategic, and real.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function Beat3({ progress }: { progress: MotionValue<number> }) {
  const { opacity, y } = useBeat(progress, 3);
  return (
    <motion.div style={{ opacity, y, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'inherit' }}>
      <span style={EYEBROW}>Why H2H</span>
      <h2 style={H2_STYLE}>
        <span style={{ display: 'block' }}>Because we</span>
        <span style={{ display: 'block' }}>
          <span style={OUTLINE_SPAN}>embed ourselves</span>
        </span>
        <span style={{ display: 'block' }}>in your world.</span>
      </h2>
    </motion.div>
  );
}

const PARTNER_ITEMS = [
  {
    tag: 'Embedded',
    text: "We don't deliver from the outside. We embed ourselves in your world, learning your rhythm and your audience.",
  },
  {
    tag: 'Responsive',
    text: 'Markets shift fast. We move with you, adapting strategy in real time without losing the thread.',
  },
  {
    tag: 'Aligned',
    text: 'Your goals become ours. Every piece of content, every campaign, every decision maps back to what matters to you.',
  },
];

function Beat4({ progress }: { progress: MotionValue<number> }) {
  const { opacity, y } = useBeat(progress, 4);
  return (
    <motion.div style={{ opacity, y, position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'inherit' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: 680 }}>
        {PARTNER_ITEMS.map((item) => (
          <div key={item.tag}>
            <span style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-secondary)',
              display: 'block',
              marginBottom: '0.6rem',
            }}>
              {item.tag}
            </span>
            <p style={BODY_STYLE}>{item.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function AboutStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 1440, h: 900 });

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      if (w > 0 && h > 0) setDims({ w, h });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Background gradient blob positions
  const blobX = useTransform(scrollYProgress, [0, 0.5, 1], ['20%', '70%', '30%']);
  const blobY = useTransform(scrollYProgress, [0, 0.5, 1], ['20%', '60%', '80%']);

  const contentPadding = 'clamp(2rem, 6vw, 6rem)';

  return (
    <div ref={sectionRef} id="about" style={{ height: '550vh', position: 'relative' }}>
      {/* ── Sticky viewport ── */}
      <div ref={stickyRef} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* UnicornStudio background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <UnicornScene
            projectId="mF5BBrA2ZBWxhUKOq6Wk"
            width={`${dims.w}px`}
            height={`${dims.h}px`}
            scale={1}
            dpi={Math.min(window.devicePixelRatio, 2)}
            sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.3/dist/unicornStudio.umd.js"
            lazyLoad={false}
          />
        </div>

        {/* Dark overlay so text stays legible */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'rgba(4,2,12,0.55)',
        }} />

        {/* Moving gradient blob */}
        <motion.div
          style={{
            position: 'absolute',
            width: '60vw',
            height: '60vw',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(90,30,200,0.10) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
            left: blobX,
            top: blobY,
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        />

        {/* Top scroll progress bar */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0, left: 0,
            height: 2,
            background: 'linear-gradient(90deg, rgba(164,108,252,0.8), rgba(100,60,220,0.4))',
            scaleX: scrollYProgress,
            transformOrigin: 'left',
            zIndex: 30,
          }}
        />

        {/* Content area */}
        <div style={{
          position: 'absolute', inset: 0,
          padding: `clamp(4rem, 8vh, 6rem) ${contentPadding}`,
          display: 'flex',
          alignItems: 'stretch',
          zIndex: 2,
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
          }}>
            {/* Decorative chapter glyph */}
            <ChapterGlyph progress={scrollYProgress} />

            {/* All beats (all in DOM, driven by scroll opacity) */}
            <Beat0 progress={scrollYProgress} />
            <Beat1 progress={scrollYProgress} />
            <Beat2 progress={scrollYProgress} />
            <Beat3 progress={scrollYProgress} />
            <Beat4 progress={scrollYProgress} />

            {/* Progress dots sidebar */}
            <ProgressDots progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </div>
  );
}
