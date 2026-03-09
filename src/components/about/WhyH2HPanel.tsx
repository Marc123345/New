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

function StoryItem({
  tag,
  text,
  delay,
  isLast = false,
}: {
  tag: string;
  text: string;
  delay: number;
  isLast?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT_EXPO }}
      style={{
        paddingBottom: '1.5rem',
        marginBottom: isLast ? 0 : '1.5rem',
        borderBottom: isLast ? 'none' : '1px solid rgba(164,108,252,0.07)',
      }}
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
          fontSize: 'clamp(0.88rem, 1.15vw, 0.97rem)',
          lineHeight: 1.8,
          color: 'rgba(232,226,255,0.68)',
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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT_EXPO }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        paddingBottom: '1rem',
        marginBottom: '1.75rem',
        borderBottom: '1px solid rgba(164,108,252,0.12)',
      }}
    >
      <div
        style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'rgba(164,108,252,0.55)',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(164,108,252,0.5)',
        }}
      >
        {label}
      </span>
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
      className="group"
      style={{
        width: '100%',
        // Offset shadow creates a framing effect without clipping the image
        boxShadow: '10px 10px 0 rgba(164,108,252,0.18)',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          border: '1.5px solid rgba(164,108,252,0.18)',
        }}
      >
        {/* Hover glow */}
        <div
          className="absolute -inset-1 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(164,108,252,0.08), transparent 60%)',
            transition: 'opacity 0.5s ease',
            zIndex: 1,
          }}
        />

        <img
          src="https://ik.imagekit.io/qcvroy8xpd/image%201%20(1).png"
          alt="Shannon, Founder of H2H"
          loading="lazy"
          decoding="async"
          className="w-full block transition-transform duration-700 group-hover:scale-[1.03]"
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
              linear-gradient(180deg, rgba(14,11,31,0.08) 0%, transparent 25%),
              linear-gradient(180deg, transparent 45%, rgba(14,11,31,0.94) 100%)
            `,
          }}
        />

        {/* Caption — consolidated inside the image */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ padding: '1.5rem 1.25rem 1.25rem', zIndex: 2 }}
        >
          <span
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.48rem',
              fontWeight: 700,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(164,108,252,0.55)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            The human behind H2H
          </span>
          <span
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.52rem',
              fontWeight: 700,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-secondary)',
              display: 'block',
              marginBottom: '5px',
            }}
          >
            Founder
          </span>
          <span
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
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
    </motion.div>
  );
}

export const WhyH2HPanel = memo(function WhyH2HPanel() {
  return (
    <div className="w-full">

      {/* Heading — anchored to the left two columns, right column breathes */}
      <div
        className="grid grid-cols-1 md:grid-cols-3"
        style={{ gap: 'clamp(2rem, 4vw, 4rem)', marginBottom: 'clamp(2.5rem, 4vw, 4rem)' }}
      >
        <motion.div
          className="md:col-span-2"
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

        {/* Right column intentionally empty in heading row —
            creates visual anticipation / whitespace aligned with portrait below */}
        <div className="hidden md:block" />
      </div>

      {/* Full-width separator between heading and content grid */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: EASE_OUT_EXPO }}
        style={{
          height: '1px',
          background: 'linear-gradient(90deg, rgba(164,108,252,0.3) 0%, rgba(164,108,252,0.08) 65%, transparent 100%)',
          transformOrigin: 'left',
          marginBottom: 'clamp(2.5rem, 4vw, 4rem)',
        }}
      />

      {/* 3-column content grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 items-start"
        style={{ gap: 'clamp(2rem, 4vw, 4rem)' }}
      >
        {/* Left — Your Partner */}
        <motion.div
          className="md:order-1"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        >
          <ColumnLabel label="Your Partner" />
          {LEFT_ITEMS.map((item, i) => (
            <StoryItem
              key={item.tag}
              tag={item.tag}
              text={item.text}
              delay={0.08 + i * 0.08}
              isLast={i === LEFT_ITEMS.length - 1}
            />
          ))}
        </motion.div>

        {/* Centre — Founder portrait */}
        <motion.div
          className="md:order-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT_EXPO }}
        >
          <FounderPortrait />
        </motion.div>

        {/* Right — Structure & Soul */}
        <motion.div
          className="md:order-3"
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT_EXPO }}
        >
          <ColumnLabel label="Structure & Soul" delay={0.1} />
          {RIGHT_ITEMS.map((item, i) => (
            <StoryItem
              key={item.tag}
              tag={item.tag}
              text={item.text}
              delay={0.14 + i * 0.08}
              isLast={i === RIGHT_ITEMS.length - 1}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
});
