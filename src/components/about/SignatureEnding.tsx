import { motion, useAnimation } from 'motion/react';
import { getButtonHoverHandlers } from '../../utils/buttonHover';

// Consistent premium easing curve
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function SignatureEnding() {
  const btnHover = getButtonHoverHandlers();
  const controls = useAnimation();

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
  };

  return (
    <div 
      className="relative w-full flex flex-col items-center text-center" 
      style={{ paddingTop: 'clamp(4rem, 8vw, 7rem)', paddingBottom: '4rem' }}
    >
      {/* Subtle Ambient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at center 40%, rgba(164,108,252,0.08) 0%, transparent 60%)',
          zIndex: 0
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          className="w-20 h-px mb-12"
          style={{ 
            background: 'linear-gradient(90deg, transparent, rgba(164,108,252,0.6), transparent)', 
            transformOrigin: 'center' 
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
        />

        {/* Masked Typography Reveal */}
        <h3
          style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            margin: 0,
            maxWidth: '800px',
          }}
        >
          <span className="block overflow-hidden pb-2">
            <motion.span
              className="block"
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 1, ease: EASE_OUT_EXPO }}
              style={{ color: 'var(--color-text-dark)' }}
            >
              Ready to make your brand
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 1, delay: 0.15, ease: EASE_OUT_EXPO }}
              style={{ 
                color: 'transparent', 
                WebkitTextStroke: '1px var(--color-surface-dark)' 
              }}
            >
              impossible to ignore?
            </motion.span>
          </span>
        </h3>

        <motion.div
          className="relative mt-12 inline-flex items-center gap-3 cursor-pointer group"
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE_OUT_EXPO }}
          onClick={scrollToContact}
          onMouseEnter={() => controls.start('hover')}
          onMouseLeave={() => controls.start('initial')}
        >
          {/* Animated Button with Arrow */}
          <motion.button
            className="flex-shrink-0 relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{
              padding: '18px 42px',
              background: 'var(--color-text-dark)',
              border: '2px solid var(--color-text-dark)',
              color: 'var(--color-background-light)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-stack-heading)',
              cursor: 'pointer',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
            {...btnHover}
          >
            <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">
              Start a Project
            </span>
            <motion.svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="relative z-10"
              variants={{
                initial: { x: -4, opacity: 0.5 },
                hover: { x: 2, opacity: 1 }
              }}
              initial="initial"
              animate={controls}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <path
                d="M1 8h12M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
            
            {/* Hover Fill Effect */}
            <div 
              className="absolute inset-0 bg-[var(--color-secondary)] opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-0"
            />
          </motion.button>
        </motion.div>

        <motion.div
          className="w-32 h-px mt-20"
          style={{ 
            background: 'linear-gradient(90deg, transparent, rgba(164,108,252,0.3), transparent)', 
            transformOrigin: 'center' 
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE_OUT_EXPO }}
        />
      </div>
    </div>
  );
}