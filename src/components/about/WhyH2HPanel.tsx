import { memo } from 'react';
import { motion } from 'motion/react';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PARTNER_ITEMS = [
  { tag: 'Embedded', text: 'We don\'t deliver from the outside. We embed ourselves in your world, learning your rhythm and your audience.' },
  { tag: 'Responsive', text: 'Markets shift fast. We move with you, adapting strategy in real time without losing the thread.' },
  { tag: 'Aligned', text: 'Your goals become ours. Every piece of content, every campaign, every decision maps back to what matters to you.' },
];

const SOUL_ITEMS = [
  { tag: 'Insight', text: 'Data tells us where to look. Intuition tells us what to do with it. We bring both.' },
  { tag: 'Systems', text: 'We build ecosystems, not one-offs. Every touchpoint connects to create compounding brand momentum.' },
  { tag: 'Story', text: 'People remember how you made them feel. We craft narratives that resonate, not just reach.' },
];

function WhyHeadingBlock() {
  return (
    <div className="flex flex-col items-start w-full mb-4">
      <motion.span
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(164,108,252,0.8)',
          display: 'block',
          marginBottom: '28px',
        }}
      >
        Why H2H
      </motion.span>

      <h3
        style={{
          fontSize: 'clamp(2.2rem, 7vw, 6rem)',
          fontFamily: 'var(--font-stack-heading)',
          color: 'var(--color-text-dark)',
          lineHeight: 1.05,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '-0.04em',
          margin: 0,
        }}
      >
        <span className="block overflow-hidden pb-2">
          <motion.span
            className="block"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
          >
            Because we embed
          </motion.span>
        </span>
        <span className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 1.2, delay: 0.15, ease: EASE_OUT_EXPO }}
          >
            <span style={{ color: 'transparent', WebkitTextStroke: '2px var(--color-surface-dark)' }}>
              ourselves
            </span>{' '}
            in your world.
          </motion.span>
        </span>
      </h3>
    </div>
  );
}

function PartnerBlock() {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {PARTNER_ITEMS.map((item, i) => (
        <motion.div
          key={item.tag}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: EASE_OUT_EXPO }}
        >
          <span
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-secondary)',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            {item.tag}
          </span>
          <p
            style={{
              fontFamily: 'var(--font-stack-body)',
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
              lineHeight: 1.8,
              color: 'rgba(232,226,255,0.72)',
              margin: 0,
            }}
          >
            {item.text}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function SoulBlock() {
  return (
    <div>
      <motion.div
        className="mb-7"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT_EXPO }}
        style={{
          paddingBottom: '14px',
          borderBottom: '1px solid rgba(164,108,252,0.15)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(164,108,252,0.6)',
          }}
        >
          Structure &amp; Soul
        </span>
      </motion.div>

      <div className="flex flex-col gap-4">
        {SOUL_ITEMS.map((item, i) => (
          <motion.div
            key={item.tag}
            initial={{ opacity: 0, x: 40, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12 * i, ease: EASE_OUT_EXPO }}
            className="group relative"
            style={{
              padding: '24px',
              background: 'rgba(164,108,252,0.03)',
              border: '1px solid rgba(164,108,252,0.1)',
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
            <div className="relative flex flex-col gap-2">
              <span
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-secondary)',
                }}
              >
                {item.tag}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: '0.85rem',
                  color: 'rgba(232,226,255,0.65)',
                  lineHeight: 1.6,
                }}
              >
                {item.text}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FounderVideoBlock() {
  return (
    <motion.div
      className="w-full mt-16 md:mt-24 lg:mt-32"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3, ease: EASE_OUT_EXPO }}
    >
      <motion.div
        className="relative overflow-hidden cursor-pointer group rounded-sm"
        whileHover={{ y: -8, x: -8, boxShadow: 'var(--shadow-geometric-hover)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'var(--color-background-light)',
          boxShadow: 'var(--shadow-geometric)',
          maxHeight: '500px',
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          style={{ display: 'block', maxHeight: '500px' }}
          src="https://ik.imagekit.io/qcvroy8xpd/Video_Generation_With_Earth.mp4?updatedAt=1772722343425"
        />

        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-80"
          style={{
            background: `
              linear-gradient(180deg, rgba(14,11,31,0.2) 0%, transparent 20%),
              linear-gradient(180deg, transparent 50%, rgba(14,11,31,0.9) 100%),
              linear-gradient(90deg, rgba(14,11,31,0.4) 0%, transparent 40%)
            `,
          }}
        />

        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <span
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: '0.55rem',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(164,108,252,0.7)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Meet the Founder
            </span>
            <span
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(1rem, 1.5vw, 1.4rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--color-text-dark)',
                display: 'block',
              }}
            >
              Shannon
            </span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export const WhyH2HPanel = memo(function WhyH2HPanel() {
  return (
    <div className="w-full">
      <WhyHeadingBlock />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mt-12 md:mt-16 lg:mt-20">
        <PartnerBlock />
        <SoulBlock />
      </div>

      <FounderVideoBlock />
    </div>
  );
});
