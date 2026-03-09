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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
      className="mb-6 last:mb-0 md:mb-8"
    >
      <span
        style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: '0.55rem',
          fontWeight: 700,
          letterSpacing: '0.25em',
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
          fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)',
          lineHeight: 1.7,
          color: 'rgba(232,226,255,0.72)',
          margin: 0,
        }}
      >
        {text}
      </p>
    </motion.div>
  );
}

function FounderPortrait() {
  return (
    <motion.div
      className="relative w-full max-w-[280px] mx-auto md:max-w-none"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1, ease: EASE_OUT_EXPO }}
    >
      <div className="relative flex justify-center">
        <div
          className="relative overflow-hidden group"
          style={{
            width: '100%',
            transform: 'rotate(-2deg)',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'rotate(0deg) translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'rotate(-2deg) translateY(0)';
          }}
        >
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
              borderRadius: '4px',
            }}
          >
            <img
              src="https://ik.imagekit.io/qcvroy8xpd/image%201%20(1).png"
              alt="Shannon, Founder of H2H"
              loading="lazy"
              decoding="async"
              className="w-full block transition-transform duration-700 group-hover:scale-105"
              style={{
                aspectRatio: '3 / 4',
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(180deg, rgba(14,11,31,0.15) 0%, transparent 30%),
                  linear-gradient(180deg, transparent 55%, rgba(14,11,31,0.85) 100%)
                `,
              }}
            />
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 p-5"
            style={{ zIndex: 2 }}
          >
            <span
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: '0.5rem',
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
                fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: 'var(--color-text-dark)',
              }}
            >
              Shannon
            </span>
          </div>
        </div>
      </div>

      <motion.div
        className="text-center mt-5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4, ease: EASE_OUT_EXPO }}
        style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: '0.45rem',
          fontWeight: 700,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(164,108,252,0.4)',
        }}
      >
        The human behind H2H
      </motion.div>
    </motion.div>
  );
}

export const WhyH2HPanel = memo(function WhyH2HPanel() {
  return (
    <div className="w-full">
      <motion.div
        className="mb-10 md:mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
      >
        <span
          style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.3em',
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
            fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: 'var(--color-text-dark)',
            margin: 0,
            maxWidth: '800px'
          }}
        >
          Because we embed ourselves{' '}
          <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--color-surface-dark)' }}>
            in your world.
          </span>
        </h3>
      </motion.div>

      <div className="flex flex-col md:grid md:grid-cols-12 gap-12 md:gap-8 lg:gap-12 items-start">
        {/* On Mobile: Founder shows up first. On Desktop: Shows up in the middle. */}
        <div className="md:col-span-4 flex justify-center md:order-2">
          <FounderPortrait />
        </div>

        <div className="md:col-span-4 md:order-1">
          <motion.span
            className="block mb-6 md:mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-dark)',
              borderBottom: '1px solid rgba(164,108,252,0.2)',
              paddingBottom: '12px'
            }}
          >
            Your Partner
          </motion.span>
          {LEFT_ITEMS.map((item, i) => (
            <StoryItem key={item.tag} tag={item.tag} text={item.text} delay={0.1 + i * 0.08} />
          ))}
        </div>

        <div className="md:col-span-4 md:order-3">
          <motion.span
            className="block mb-6 md:mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT_EXPO }}
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-dark)',
              borderBottom: '1px solid rgba(164,108,252,0.2)',
              paddingBottom: '12px'
            }}
          >
            Structure & Soul
          </motion.span>
          {RIGHT_ITEMS.map((item, i) => (
            <StoryItem key={item.tag} tag={item.tag} text={item.text} delay={0.15 + i * 0.08} />
          ))}
        </div>
      </div>
    </div>
  );
});