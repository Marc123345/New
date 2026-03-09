import { motion } from 'motion/react';
import { getButtonHoverHandlers } from '../../utils/buttonHover';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function SignatureEnding() {
  const btnHover = getButtonHoverHandlers();

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col items-center text-center" style={{ paddingTop: 'clamp(2rem, 6vw, 7rem)' }}>
      <motion.div
        className="w-16 h-px mb-8 md:mb-12"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(164,108,252,0.4), transparent)', transformOrigin: 'center' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        // Updated to percentage margin for consistent responsive triggering
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1, ease: EASE_OUT_EXPO }}
      />

      <motion.h3
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        // Updated from -40px to -10%
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
        className="px-4"
        style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: 'clamp(1.4rem, 4vw, 3rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          textTransform: 'uppercase',
          color: 'var(--color-text-dark)',
          margin: 0,
          maxWidth: '700px',
        }}
      >
        Ready to make your brand{' '}
        <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--color-surface-dark)' }}>
          impossible to ignore?
        </span>
      </motion.h3>

      <motion.div
        className="relative mt-8 md:mt-10 inline-flex items-center gap-3 cursor-pointer group"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        // Added margin here as well so the button animates in slightly after the text
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT_EXPO }}
        onClick={scrollToContact}
      >
        <motion.button
          className="flex-shrink-0"
          style={{
            padding: '16px 32px',
            minHeight: '48px',
            background: 'var(--color-text-dark)',
            border: '2px solid var(--color-text-dark)',
            color: 'var(--color-background-light)',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-stack-heading)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-button)',
            transition: 'box-shadow 0.2s, transform 0.2s',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
          {...btnHover}
        >
          Start a Project
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ display: 'inline-block' }}
          >
            <path
              d="M1 8h12M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.button>
      </motion.div>

      <motion.div
        className="w-24 h-px mt-12 md:mt-16"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(164,108,252,0.2), transparent)', transformOrigin: 'center' }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        // Updated to percentage margin
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.2, delay: 0.4, ease: EASE_OUT_EXPO }}
      />
    </div>
  );
}