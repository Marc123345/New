import { useRef, useEffect, useCallback } from 'react';
import { motion, useInView } from 'motion/react';

/* ── African accent colors (decorative only) ── */
const OCHRE = '#C8832A';
const TERRACOTTA = '#B5401E';
const EARTH = '#7A4E2D';

/* ── Shared animation config ── */
const EASE = [0.16, 1, 0.3, 1] as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const fadeUpSlow = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.0, ease: EASE } },
};

/* ── Kente stripe ── */
function KenteStripe() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <motion.div
      ref={ref}
      style={{
        height: 4,
        background: `repeating-linear-gradient(90deg, ${OCHRE} 0px, ${OCHRE} 20px, ${TERRACOTTA} 20px, ${TERRACOTTA} 40px, ${EARTH} 40px, ${EARTH} 60px)`,
        transformOrigin: 'left',
      }}
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 0.9, ease: EASE }}
    />
  );
}

/* ── Adinkra watermark SVG ── */
function AdinkraWatermark({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <svg style={{ opacity: 0.04, ...style }} viewBox="0 0 400 400" fill="none">
      <circle cx="200" cy="200" r="180" stroke={OCHRE} strokeWidth="1" />
      <circle cx="200" cy="200" r="130" stroke={OCHRE} strokeWidth="0.8" />
      <circle cx="200" cy="200" r="80" stroke={OCHRE} strokeWidth="0.6" />
      <line x1="20" y1="200" x2="380" y2="200" stroke={TERRACOTTA} strokeWidth="0.5" />
      <line x1="200" y1="20" x2="200" y2="380" stroke={TERRACOTTA} strokeWidth="0.5" />
      <line x1="60" y1="60" x2="340" y2="340" stroke={EARTH} strokeWidth="0.4" />
      <line x1="340" y1="60" x2="60" y2="340" stroke={EARTH} strokeWidth="0.4" />
      <rect x="140" y="140" width="120" height="120" stroke={OCHRE} strokeWidth="0.8" transform="rotate(45 200 200)" />
    </svg>
  );
}

/* ── Value card ── */
function ValueCard({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative flex flex-col"
      style={{
        background: 'var(--color-primary)',
        border: '1px solid rgba(164,108,252,0.12)',
        padding: 'var(--space-4x)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      whileHover={{
        y: -4,
        boxShadow: 'var(--shadow-geometric-hover)',
      }}
    >
      {/* Accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${OCHRE}, ${TERRACOTTA})`, transition: 'height 0.3s ease' }} />

      {/* Ghost number */}
      <span style={{
        position: 'absolute', top: 'var(--space-2x)', right: 'var(--space-2x)',
        fontFamily: 'var(--font-stack-heading)', fontSize: 'clamp(3rem, 8vw, 5rem)',
        lineHeight: 1, color: 'rgba(164,108,252,0.06)', fontWeight: 'bold',
      }}>
        {num}
      </span>

      <span style={{
        fontFamily: 'var(--font-stack-heading)', fontSize: '0.75rem',
        letterSpacing: '0.2em', textTransform: 'uppercase', color: OCHRE,
        marginBottom: 'var(--space-2x)',
      }}>
        {num}
      </span>
      <h3 style={{ marginBottom: 'var(--space-2x)' }}>{title}</h3>
      <p style={{ color: 'rgba(232,226,255,0.6)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>{body}</p>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ABOUT SECTION — sits below the hero on the homepage
   ════════════════════════════════════════════════════════════════════════════ */

export function AboutSection() {
  const watermarkRef = useRef<HTMLDivElement>(null);

  /* Parallax watermark on mousemove */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (watermarkRef.current) {
      const x = (e.clientX - window.innerWidth / 2) * 0.015;
      const y = (e.clientY - window.innerHeight / 2) * 0.015;
      watermarkRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  }, []);

  return (
    <div style={{ background: 'var(--color-background-light)' }}>

      {/* ══════ HERO / INTRO ══════ */}
      <section
        className="relative overflow-hidden"
        style={{ padding: 'clamp(80px, 12vw, 160px) 0' }}
        onMouseMove={handleMouseMove}
      >
        <KenteStripe />

        {/* Adinkra watermark — parallax */}
        <div
          ref={watermarkRef}
          className="absolute pointer-events-none will-change-transform"
          style={{ top: '-10%', right: '-5%', width: '500px', height: '500px' }}
        >
          <AdinkraWatermark style={{ width: '100%', height: '100%' }} />
        </div>

        <div className="container relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp} style={{
              fontFamily: 'var(--font-stack-heading)', fontSize: '0.75rem',
              letterSpacing: '0.3em', textTransform: 'uppercase', color: OCHRE,
              marginBottom: 'var(--space-4x)',
            }}>
              About Us
            </motion.div>

            {/* Headline */}
            <motion.h2 variants={fadeUpSlow} style={{ maxWidth: '800px' }}>
              From Brand Voice<br />to Human Connection
            </motion.h2>

            {/* Subheading */}
            <motion.p variants={fadeUp} style={{
              maxWidth: '620px', fontSize: '1.2rem',
              color: 'rgba(232,226,255,0.7)', lineHeight: 1.65,
            }}>
              At H2H we believe the most impactful brands are the ones that know how to connect — not just communicate.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="container"><KenteStripe /></div>

      {/* ══════ BELIEF ══════ */}
      <section className="section">
        <div className="container">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12"
            style={{ gap: 'var(--space-8x)' }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
          >
            <motion.div className="lg:col-span-4" variants={fadeUp}>
              <span style={{
                fontFamily: 'var(--font-stack-heading)', fontSize: '0.75rem',
                letterSpacing: '0.3em', textTransform: 'uppercase', color: OCHRE,
              }}>
                Our Belief
              </span>
            </motion.div>
            <div className="lg:col-span-8">
              <motion.p variants={fadeUp} style={{ fontSize: '1.25rem', lineHeight: 1.7 }}>
                People don't want perfection. They want personality. They want to see and hear brands that speak like humans and offer something meaningful.
              </motion.p>
              <motion.p variants={fadeUp} style={{ fontSize: '1.1rem', color: 'rgba(232,226,255,0.6)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--color-text-dark)' }}>H2H is a social-first agency</strong> built to help brands grow by making their digital presence feel more human — thoughtful, strategic, and real.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container"><KenteStripe /></div>

      {/* ══════ PULL QUOTE ══════ */}
      <section className="section">
        <div className="container">
          <motion.blockquote
            style={{
              borderLeft: `4px solid ${TERRACOTTA}`,
              paddingLeft: 'var(--space-4x)',
              margin: 0, position: 'relative',
            }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
          >
            <span style={{
              position: 'absolute', top: '-30px', left: '-10px',
              fontFamily: 'var(--font-stack-heading)', fontSize: 'clamp(5rem, 12vw, 10rem)',
              lineHeight: 1, color: TERRACOTTA, opacity: 0.12,
              pointerEvents: 'none', userSelect: 'none',
            }}>
              &ldquo;
            </span>
            <motion.p variants={fadeUpSlow} style={{
              fontStyle: 'italic',
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              lineHeight: 1.4, margin: 0,
              fontFamily: 'var(--font-stack-heading)', letterSpacing: '-0.01em',
            }}>
              We don't just deliver content — we embed ourselves in your world.
            </motion.p>
          </motion.blockquote>
        </div>
      </section>

      <div className="container"><KenteStripe /></div>

      {/* ══════ WHY H2H ══════ */}
      <section className="section">
        <div className="container">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
          >
            <motion.h2 variants={fadeUp}>Why H2H?</motion.h2>
            <motion.p variants={fadeUp} style={{
              maxWidth: '700px', color: 'rgba(232,226,255,0.7)',
              fontSize: '1.1rem', lineHeight: 1.7,
            }}>
              When you work with H2H, you get more than an agency. You get a partner — a flexible, responsive extension of your team. We adapt to your rhythm, align with your goals, and help you scale with clarity and purpose. We're strategists, creatives, and storytellers who bring a mix of structure and soul.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ══════ VALUE CARDS ══════ */}
      <section style={{ paddingBottom: 'var(--space-8x)' }}>
        <div className="container">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3"
            style={{ gap: 'var(--space-4x)' }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
          >
            <ValueCard num="01" title="Strategists" body="Every piece of content, every campaign, every decision is rooted in data, insight, and intent. Strategy first, always." />
            <ValueCard num="02" title="Creatives" body="Ideas that stop the scroll. We craft visuals, copy, and experiences that feel native to each platform." />
            <ValueCard num="03" title="Storytellers" body="Brands are stories. We help you tell yours in a way that's consistent, compelling, and unmistakably human." />
          </motion.div>
        </div>
      </section>

      <div className="container"><KenteStripe /></div>

      {/* ══════ MANIFESTO ══════ */}
      <section className="section">
        <div className="container">
          <motion.div
            className="relative overflow-hidden"
            style={{
              background: 'var(--color-primary)',
              border: '1px solid rgba(164,108,252,0.1)',
              padding: 'clamp(48px, 8vw, 96px)',
            }}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
          >
            <div className="absolute pointer-events-none" style={{ top: '-20%', right: '-10%', width: '500px', height: '500px' }}>
              <AdinkraWatermark style={{ width: '100%', height: '100%' }} />
            </div>

            <div className="relative z-10" style={{ maxWidth: '680px' }}>
              <motion.h2 variants={fadeUpSlow}>
                Building brand ecosystems that actually work.
              </motion.h2>
              <motion.p variants={fadeUp} style={{ color: 'rgba(232,226,255,0.65)', fontSize: '1.1rem', lineHeight: 1.7 }}>
                We don't just manage your social media. We build the entire ecosystem around it — content strategy, community management, paid amplification, creative production, and performance analytics. Everything connected. Everything measured. Everything human.
              </motion.p>
            </div>

            <div className="absolute bottom-0 left-0 right-0"><KenteStripe /></div>
          </motion.div>
        </div>
      </section>

      {/* ══════ FOOTER STRIP ══════ */}
      <section style={{ padding: 'var(--space-8x) 0' }}>
        <div className="container">
          <motion.div
            className="flex flex-col items-center gap-6 text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10% 0px' }}
          >
            <motion.span variants={fadeUp} style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--color-secondary)', letterSpacing: '0.1em',
              textTransform: 'uppercase', fontWeight: 'bold',
            }}>
              H2H
            </motion.span>
            <motion.div variants={fadeUp} style={{ width: 120 }}><KenteStripe /></motion.div>
            <motion.p variants={fadeUp} style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.85rem', letterSpacing: '0.25em',
              textTransform: 'uppercase', color: 'rgba(232,226,255,0.4)', margin: 0,
            }}>
              Social-first. Human-always.
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
