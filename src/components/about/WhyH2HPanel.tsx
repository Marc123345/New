import { memo } from 'react';
import { motion } from 'motion/react';
import { HologramVideoBlock } from './HologramVideoBlock';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FOUNDER_VIDEO_URL =
  'https://ik.imagekit.io/qcvroy8xpd/IMG_9186%20(1).mp4';

const PARTNER_ITEMS = [
  { tag: 'Embedded', text: 'We don\'t deliver from the outside. We embed ourselves in your world, learning your rhythm and your audience.' },
  { tag: 'Responsive', text: 'Markets shift fast. We move with you, adapting strategy in real time without losing the thread.' },
  { tag: 'Aligned', text: 'Your goals become ours. Every piece of content, every campaign, every decision maps back to what matters to you.' },
];

function WhyHeadingBlock() {
  return (
    <div className="flex flex-col items-start w-full mb-10 md:mb-14">
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
    <div className="flex flex-col gap-6 md:gap-8" style={{ maxWidth: '720px' }}>
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

function FounderVideoBlock() {
  return <HologramVideoBlock src={FOUNDER_VIDEO_URL} label="Meet the Founder" sublabel="Shannon" />;
}

export const WhyH2HPanel = memo(function WhyH2HPanel() {
  return (
    <div className="w-full">
      <WhyHeadingBlock />
      <PartnerBlock />
      <FounderVideoBlock />
    </div>
  );
});
