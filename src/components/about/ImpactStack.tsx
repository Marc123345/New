import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Removed numbers and "Years Running" to focus purely on the impact statements
const STATS = [
  { label: 'Brands Served', detail: 'Not just served — supported over years.' },
  { label: 'Client Retention', detail: 'Relationships built on results.' },
  { label: 'Impressions Driven', detail: 'Real reach, not vanity metrics.' },
];

export function ImpactStack() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10%' });

  return (
    <div ref={containerRef} className="flex flex-col gap-4">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="about-impact-card group relative rounded-sm"
          initial={{ opacity: 0, x: 40, y: 10 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: 0.12 * i, ease: EASE_OUT_EXPO }}
          whileHover={{ x: -4, transition: { duration: 0.25 } }}
          style={{
            padding: '24px',
            background: 'rgba(164,108,252,0.03)',
            border: '1px solid rgba(164,108,252,0.1)',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Hover Gradient Effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(135deg, rgba(164,108,252,0.06) 0%, transparent 60%)',
              transition: 'opacity 0.35s ease',
            }}
          />

          <div className="relative flex flex-col gap-2">
            <span
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: '1.1rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-secondary)',
              }}
            >
              {stat.label}
            </span>

            <span
              style={{
                fontFamily: 'var(--font-stack-body)',
                fontSize: '0.85rem',
                color: 'rgba(232,226,255,0.65)',
                lineHeight: 1.5,
              }}
            >
              {stat.detail}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}