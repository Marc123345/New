import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'motion/react';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const STATS = [
  { value: 120, suffix: '+', label: 'Brands Served', detail: 'Not just served — supported over years.' },
  { value: 6, suffix: '', label: 'Years Running', detail: 'Most clients stay past year 2.' },
  { value: 98, suffix: '%', label: 'Client Retention', detail: 'Relationships built on results.' },
  { value: 40, suffix: 'M+', label: 'Impressions Driven', detail: 'Real reach, not vanity metrics.' },
];

const COUNTER_DURATION = 1800;

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function useCounterBatch(targets: number[], active: boolean) {
  const [values, setValues] = useState(() => targets.map(() => 0));
  const rafRef = useRef(0);
  const startRef = useRef(0);

  const tick = useCallback((now: number) => {
    if (!startRef.current) startRef.current = now;
    const elapsed = now - startRef.current;
    const progress = Math.min(elapsed / COUNTER_DURATION, 1);
    const eased = easeOutQuart(progress);

    setValues(targets.map(t => Math.round(eased * t)));

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [targets]);

  useEffect(() => {
    if (!active) return;
    startRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, tick]);

  return values;
}

export function ImpactStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Changed from -60px to -10% for better responsive scroll triggering
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  const targets = STATS.map(s => s.value);
  const counters = useCounterBatch(targets, isInView);

  return (
    <div ref={containerRef} className="flex flex-col gap-3">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="about-impact-card group relative rounded-sm"
          initial={{ opacity: 0, x: 40, y: 10 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          // Changed from -40px to -10% for consistent reveal
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: 0.12 * i, ease: EASE_OUT_EXPO }}
          whileHover={{ x: -4, transition: { duration: 0.25 } }}
          style={{
            padding: '20px 24px',
            background: 'rgba(164,108,252,0.03)',
            border: '1px solid rgba(164,108,252,0.1)',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(135deg, rgba(164,108,252,0.06) 0%, transparent 60%)',
              transition: 'opacity 0.35s ease',
            }}
          />

          <div className="relative flex items-baseline gap-4">
            <span
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 800,
                color: 'var(--color-secondary)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
                minWidth: '90px',
              }}
            >
              {counters[i]}{stat.suffix}
            </span>

            <div className="flex flex-col">
              <span
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-dark)',
                }}
              >
                {stat.label}
              </span>

              <span
                className="about-impact-detail"
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: '0.78rem',
                  color: 'rgba(232,226,255,0.45)',
                  lineHeight: 1.4,
                  marginTop: '2px',
                  maxHeight: 0,
                  overflow: 'hidden',
                  opacity: 0,
                  transition: 'max-height 0.35s ease, opacity 0.3s ease, margin-top 0.3s ease',
                }}
              >
                {stat.detail}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}