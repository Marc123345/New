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
      className="mb-8 last:mb-0"
    >
      <span
        style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: '0.6rem',
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

export function StoryColumns() {
  return (
    <div className="w-full">
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
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
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: 'var(--color-text-dark)',
            margin: 0,
          }}
        >
          Because we embed ourselves{' '}
          <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--color-surface-dark)' }}>
            in your world.
          </span>
        </h3>
      </motion.div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0">
        <div className="md:pr-12 lg:pr-16">
          <motion.span
            className="block mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-dark)',
            }}
          >
            Your Partner
          </motion.span>
          {LEFT_ITEMS.map((item, i) => (
            <StoryItem key={item.tag} tag={item.tag} text={item.text} delay={0.1 + i * 0.1} />
          ))}
        </div>

        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2" style={{ width: '1px' }}>
          <motion.div
            className="w-full h-full"
            style={{ background: 'linear-gradient(180deg, transparent, rgba(164,108,252,0.25), transparent)', transformOrigin: 'top' }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.2, delay: 0.3, ease: EASE_OUT_EXPO }}
          />
          <motion.span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE_OUT_EXPO }}
            style={{
              writingMode: 'vertical-rl',
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.5rem',
              fontWeight: 700,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(164,108,252,0.35)',
              transform: 'translateX(-50%) translateY(-50%) rotate(180deg)',
            }}
          >
            From strategy to soul
          </motion.span>
        </div>

        <div className="md:pl-12 lg:pl-16">
          <motion.span
            className="block mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT_EXPO }}
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-text-dark)',
            }}
          >
            Structure & Soul
          </motion.span>
          {RIGHT_ITEMS.map((item, i) => (
            <StoryItem key={item.tag} tag={item.tag} text={item.text} delay={0.15 + i * 0.1} />
          ))}
        </div>
      </div>
    </div>
  );
}
