import { motion } from 'motion/react';

// Using the same premium easing curve from your other components
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function SpinningH2H() {
  return (
    <motion.div
      className="hidden md:flex items-center justify-center flex-shrink-0 cursor-pointer"
      // Added blur and a slightly more dramatic scale for the initial load
      initial={{ opacity: 0, scale: 0.5, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
      // Tactile hover effect
      whileHover={{ scale: 1.08 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        // Slightly slower rotation for a more deliberate, elegant feel
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        style={{ 
          width: 120, // Slightly increased to give the text more breathing room
          height: 120, 
          position: 'relative',
          // A subtle, colored glow to give it depth against the background
          filter: 'drop-shadow(0 8px 16px rgba(164,108,252,0.15))' 
        }}
      >
        <svg viewBox="0 0 200 200" width="120" height="120" className="overflow-visible">
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
              letterSpacing: '0.38em', // Slightly increased tracking for clarity on the curve
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
            // Counter-rotation keeps the center text perfectly upright
            animate={{ rotate: -360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-dark)',
            }}
            // Added a smooth color transition on hover for an extra layer of polish
            className="transition-colors duration-500 hover:text-[var(--color-secondary)]"
          >
            H2H
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}