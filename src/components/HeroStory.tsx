import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export function HeroStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(2rem, 5vw, 5rem)',
        background: '#f5f3f0',
        overflow: 'hidden',
        color: '#6d6d6d',
        letterSpacing: '-0.02em',
      }}
    >
      <motion.div style={{ y, opacity }}>
        {/* ── Top metadata row ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'clamp(3rem, 10vw, 16rem)',
            marginBottom: 'clamp(1.5rem, 3vw, 3.5rem)',
          }}
        >
          {/* Left: brand + role */}
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(1.2rem, 2.2vw, 2rem)',
                fontWeight: 400,
                color: '#1a1a1a',
                lineHeight: 1.1,
                overflow: 'hidden',
              }}
            >
              <motion.span
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block' }}
              >
                H2H Social
              </motion.span>
            </h2>
            <div
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(0.7rem, 1vw, 0.9rem)',
                fontWeight: 400,
                color: '#999',
                marginTop: '4px',
                overflow: 'hidden',
              }}
            >
              <motion.span
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block' }}
              >
                Human to Human Marketing
              </motion.span>
            </div>
          </div>

          {/* Right: editorial reference */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(0.6rem, 0.85vw, 0.8rem)',
                letterSpacing: '0.05em',
                color: '#999',
                overflow: 'hidden',
              }}
            >
              <motion.span
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block' }}
              >
                From B2B to H2H / Est. 2024
              </motion.span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(0.6rem, 0.85vw, 0.8rem)',
                letterSpacing: '0.05em',
                color: '#bbb',
                marginTop: '4px',
                overflow: 'hidden',
              }}
            >
              <motion.span
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block' }}
              >
                Strategy · Story · Soul
              </motion.span>
            </div>
          </div>
        </div>

        {/* ── Large typographic statement ── */}
        <div style={{ overflow: 'hidden' }}>
          <motion.div
            initial={{ y: '100%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg
              viewBox="0 0 1200 140"
              style={{
                width: '100%',
                maxWidth: '82rem',
                height: 'auto',
                display: 'block',
              }}
            >
              <text
                x="0"
                y="120"
                style={{
                  fontFamily: 'var(--font-stack-heading), system-ui, sans-serif',
                  fontSize: '148',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  fill: 'none',
                  stroke: '#a46cfc',
                  strokeWidth: '1.5',
                }}
              >
                HUMAN TO HUMAN
              </text>
            </svg>
          </motion.div>
        </div>

        {/* ── Tagline beneath ── */}
        <div
          style={{
            marginTop: 'clamp(1rem, 2vw, 2rem)',
            maxWidth: '520px',
            overflow: 'hidden',
          }}
        >
          <motion.p
            initial={{ y: '100%', opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'var(--font-stack-body)',
              fontSize: 'clamp(0.85rem, 1.1vw, 1.05rem)',
              lineHeight: 1.7,
              color: '#888',
              display: 'inline-block',
            }}
          >
            We help brands stop broadcasting and start connecting — with strategy,
            story, and soul. Build a brand people actually want to talk to.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

export function AboutStory() {
  return <HeroStory />;
}
