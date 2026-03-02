import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const PILLARS = [
  {
    number: '01',
    title: 'Human-First Strategy',
    body: 'We believe authentic connection drives lasting brand equity. Every strategy we build starts with real human insight.',
  },
  {
    number: '02',
    title: 'Digital Ecosystem',
    body: 'From content creation to distribution, we build integrated ecosystems that amplify your voice across every channel.',
  },
  {
    number: '03',
    title: 'AI-Powered Execution',
    body: 'We harness the latest AI tools to scale creative output without sacrificing the human nuance that makes brands resonate.',
  },
];

function Pillar({ number, title, body, index }: { number: string; title: string; body: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '2rem',
        paddingBottom: '2rem',
      }}
    >
      <div className="flex items-start gap-6">
        <span
          style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.3em',
            color: 'rgba(164,108,252,0.5)',
            minWidth: '2rem',
            paddingTop: '0.15rem',
          }}
        >
          {number}
        </span>
        <div>
          <h3
            className="mb-3"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              fontWeight: 700,
              color: 'rgba(232,226,255,0.9)',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-stack-body)',
              fontSize: 'clamp(0.85rem, 1.2vw, 0.95rem)',
              lineHeight: 1.75,
              color: 'rgba(200,190,230,0.5)',
            }}
          >
            {body}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function AboutStory() {
  const headingRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headingRef, { once: true, margin: '-10% 0px' });

  return (
    <section
      id="about"
      style={{
        background: 'linear-gradient(180deg, #06030f 0%, #0a041a 50%, #06030f 100%)',
        paddingTop: 'var(--space-8x)',
        paddingBottom: 'var(--space-8x)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
          <div ref={headingRef}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-8"
                style={{
                  border: '1px solid rgba(164,108,252,0.2)',
                  borderRadius: '100px',
                  background: 'rgba(164,108,252,0.06)',
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'rgba(164,108,252,0.9)',
                    display: 'inline-block',
                    boxShadow: '0 0 8px rgba(164,108,252,0.5)',
                  }}
                />
                <span
                  className="text-[0.5rem] font-bold uppercase tracking-[0.3em]"
                  style={{ fontFamily: 'var(--font-stack-heading)', color: 'rgba(232,226,255,0.6)' }}
                >
                  About H2H
                </span>
              </div>

              <h2
                className="uppercase mb-6"
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 900,
                  lineHeight: 1.0,
                  letterSpacing: '-0.03em',
                  color: 'rgba(232,226,255,0.95)',
                }}
              >
                Connection is the ultimate competitive advantage
              </h2>

              <div
                className="mb-8 h-px"
                style={{ background: 'linear-gradient(90deg, rgba(164,108,252,0.4) 0%, transparent 100%)' }}
              />

              <p
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
                  lineHeight: 1.8,
                  color: 'rgba(200,190,230,0.6)',
                  maxWidth: '36rem',
                }}
              >
                H2H Creative Agency helps African brands evolve — bringing real, relatable human energy back into
                content. We turn leaders and teams into storytellers, build ecosystems that amplify your voice,
                and craft strategies that don't just look good. They resonate.
              </p>
            </motion.div>
          </div>

          <div>
            {PILLARS.map((p, i) => (
              <Pillar key={p.number} {...p} index={i} />
            ))}
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
