import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

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

function FounderPortrait() {
  const portraitRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: portraitRef,
    offset: ['start end', 'end start'],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const captionX = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  return (
    <motion.div
      ref={portraitRef}
      className="relative w-full my-16 md:my-20"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, ease: EASE_OUT_EXPO }}
    >
      <div className="relative flex justify-center md:justify-start md:ml-[8%]">
        <div
          className="relative overflow-hidden group"
          style={{
            maxWidth: '380px',
            width: '100%',
            transform: 'rotate(-2deg)',
          }}
        >
          <motion.div
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
            <motion.div style={{ y: imgY, scale: 1.08 }}>
              <img
                src="https://ik.imagekit.io/qcvroy8xpd/image%201%20(1).png"
                alt="Shannon, Founder of H2H"
                className="w-full block"
                style={{
                  aspectRatio: '3 / 4',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                }}
              />
            </motion.div>

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

          <motion.div
            className="absolute bottom-0 left-0 right-0 p-5"
            style={{ y: captionX, zIndex: 2 }}
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
                fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: 'var(--color-text-dark)',
              }}
            >
              Shannon
            </span>
          </motion.div>
        </div>

        <motion.div
          className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE_OUT_EXPO }}
          style={{
            writingMode: 'vertical-rl',
            fontFamily: 'var(--font-stack-heading)',
            fontSize: '0.5rem',
            fontWeight: 700,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(164,108,252,0.3)',
            transform: 'translateY(-50%) rotate(180deg)',
          }}
        >
          The human behind H2H
        </motion.div>
      </div>
    </motion.div>
  );
}

export function StoryColumns() {
  return (
    <div className="w-full">
      <motion.div
        className="mb-6"
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

      <FounderPortrait />

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
