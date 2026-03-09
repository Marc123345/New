import { memo } from 'react';
import { motion } from 'motion/react';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const LEFT_ITEMS = [
  { tag: 'Embedded', text: 'We don\'t deliver from the outside. We embed ourselves in your world, learning your rhythm and your audience.' },
  { tag: 'Responsive', text: 'Markets shift fast. We move with you, adapting strategy in real time without losing the thread.' },
  { tag: 'Aligned', text: 'Your goals become ours. Every piece of content, every campaign, every decision maps back to what matters to you.' },
];

const RIGHT_ITEMS = [
  { tag: 'Insight', text: 'Data tells us where to look. Intuition tells us what to do with it. We bring both.' },
  { tag: 'Systems', text: 'We build ecosystems, not one-offs. Every touchpoint connects to create compounding brand momentum.' },
  { tag: 'Story', text: 'People remember how you made them feel. We craft narratives that resonate, not just reach.' },
];

function StoryItem({ tag, text, delay }: { tag: string; text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
      style={{ marginBottom: '1.5rem' }}
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
        {tag}
      </span>
      <p
        style={{
          fontFamily: 'var(--font-stack-body)',
          fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
          lineHeight: 1.75,
          color: 'rgba(232,226,255,0.72)',
          margin: 0,
        }}
      >
        {text}
      </p>
    </motion.div>
  );
}

function ColumnLabel({ label, delay = 0 }: { label: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT_EXPO }}
      style={{ marginBottom: '1.75rem' }}
    >
      <span
        style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(164,108,252,0.5)',
          display: 'block',
          marginBottom: '6px',
        }}
      >
        {label}
      </span>
      <div
        style={{
          width: '2rem',
          height: '1px',
          background: 'rgba(164,108,252,0.3)',
        }}
      />
    </motion.div>
  );
}

function FounderPortrait() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, ease: EASE_OUT_EXPO }}
      style={{ width: '100%' }}
    >
      <div
        className="group relative overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '320px',
          margin: '0 auto',
          transform: 'rotate(-2deg)',
        }}
      >
        {/* Hover glow */}
        <div
          className="absolute -inset-1 opacity-0 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(135deg, rgba(164,108,252,0.15), transparent 60%)',
            transition: 'opacity 0.5s ease',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            border: '2px solid var(--color-surface-dark)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <img
            src="https://ik.imagekit.io/qcvroy8xpd/image%201%20(1).png"
            alt="Shannon, Founder of H2H"
            loading="lazy"
            decoding="async"
            className="w-full block"
            style={{
              aspectRatio: '3 / 4',
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />

          {/* Gradient overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(180deg, rgba(14,11,31,0.15) 0%, transparent 30%),
                linear-gradient(180deg, transparent 55%, rgba(14,11,31,0.9) 100%)
              `,
            }}
          />

          {/* Caption over image */}
          <div
            className="absolute bottom-0 left-0 right-0 p-5"
            style={{ zIndex: 2 }}
          >
            <span
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: '0.55rem',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--color-secondary)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Founder
            </span>
            <span
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: 'var(--color-text-dark)',
                display: 'block',
              }}
            >
              Shannon
            </span>
          </div>
        </div>
      </div>

      <motion.p
        className="text-center mt-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4, ease: EASE_OUT_EXPO }}
        style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: '0.55rem',
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(164,108,252,0.35)',
        }}
      >
        The human behind H2H
      </motion.p>
    </motion.div>
  );
}

export const WhyH2HPanel = memo(function WhyH2HPanel() {
  return (
    <div className="w-full">
      {/* Section heading */}
      <motion.div
        className="mb-10 md:mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
      >
        <span
          style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: '0.62rem',
            fontWeight: 700,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(164,108,252,0.7)',
            display: 'block',
            marginBottom: '16px',
          }}
        >
          Why H2H
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(1.6rem, 3.2vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: 'var(--color-text-dark)',
            margin: 0,
          }}
        >
          Because we embed ourselves{' '}
          <span style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--color-surface-dark)' }}>
            in your world.
          </span>
        </h3>
      </motion.div>

      {/* 3-column symmetric grid: text | portrait | text */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 items-center"
        style={{ gap: 'clamp(2rem, 4vw, 4rem)' }}
      >
        {/* Left column — Your Partner */}
        <div className="md:order-1">
          <ColumnLabel label="Your Partner" />
          {LEFT_ITEMS.map((item, i) => (
            <StoryItem key={item.tag} tag={item.tag} text={item.text} delay={0.1 + i * 0.08} />
          ))}
        </div>

        {/* Centre — Founder portrait */}
        <div className="md:order-2 flex justify-center">
          <FounderPortrait />
        </div>

        {/* Right column — Structure & Soul */}
        <div className="md:order-3">
          <ColumnLabel label="Structure & Soul" delay={0.1} />
          {RIGHT_ITEMS.map((item, i) => (
            <StoryItem key={item.tag} tag={item.tag} text={item.text} delay={0.15 + i * 0.08} />
          ))}
        </div>
      </div>
    </div>
  );
});
