import { motion } from 'motion/react';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function SpinningH2H() {
  return (
    <motion.div
      className="hidden md:flex items-center justify-center flex-shrink-0"
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      // Updated from -40px to -10% to sync with the rest of the About section
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ width: 110, height: 110, position: 'relative' }}
      >
        <svg viewBox="0 0 200 200" width="110" height="110">
          <defs>
            <path
              id="h2h-circle-path"
              d="M 100,100 m -72,0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0"
            />
          </defs>
          <text
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '17.5px',
              fontWeight: 700,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
            }}
            fill="var(--color-secondary)"
          >
            <textPath href="#h2h-circle-path" startOffset="0%">
              H2H Agency &#x2022; H2H Agency &#x2022; H2H Agency &#x2022;
            </textPath>
          </text>
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.span
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-dark)',
            }}
          >
            H2H
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}