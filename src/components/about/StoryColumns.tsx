import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

// A slightly more dramatic easing curve for that "premium" feel
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1, delay, ease: EASE_OUT_EXPO }}
      className="mb-10 last:mb-0 group"
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
          marginBottom: '12px',
        }}
        className="transition-transform duration-500 origin-left group-hover:scale-105"
      >
        {tag}
      </span>
      <p
        style={{
          fontFamily: 'var(--font-stack-body)',
          fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
          lineHeight: 1.8,
          color: 'rgba(232,226,255,0.72)',
          margin: 0,
        }}
        className="transition-colors duration-500 group-hover:text-[rgba(232,226,255,0.95)]"
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

  // Wrapping scroll progress in a spring makes the parallax buttery smooth
  const smoothScroll = useSpring(scrollYProgress, { damping: 30, stiffness: 100, mass: 1 });
  
  // Increased movement range for a more pronounced parallax
  const imgY = useTransform(smoothScroll, [0, 1], ['-12%', '12%']);
  const captionX = useTransform(smoothScroll, [0, 1], ['-8%', '8%']);

  return (
    <motion.div
      ref={portraitRef}
      className="relative w-full my-20 md:my-32"
      initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
    >
      <div className="relative flex justify-center md:justify-start md:ml-[8%]">
        <div
          className="relative overflow-hidden group cursor-pointer"
          style={{
            maxWidth: '380px',
            width: '100%',
            transform: 'rotate(-2deg)',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(0deg) scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotate(-2deg) scale(1)')}
        >
          <motion.div
            className="absolute -inset-1 opacity-0 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(135deg, rgba(164,108,252,0.25), transparent 60%)',
              transition: 'opacity 0.7s ease',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
            }}
          >
            <motion.div style={{ y: imgY, scale: 1.15 }} className="transition-transform duration-700 group-hover:scale-105">
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
                  linear-gradient(180deg, rgba(14,11,31,0.05) 0%, transparent 40%),
                  linear-gradient(180deg, transparent 50%, rgba(14,11,31,0.95) 100%)
                `,
              }}
            />
          </div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 p-6"
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
                marginBottom: '6px',
              }}
            >
              Founder
            </span>
            <span
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--color-text-dark)',
              }}
            >
              Shannon
            </span>
          </motion.div>
        </div>

        <motion.div
          className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2"
          initial={{ opacity: 0, x: -30, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: EASE_OUT_EXPO }}
          style={{
            writingMode: 'vertical-rl',
            fontFamily: 'var(--font-stack-heading)',
            fontSize: '0.55rem',
            fontWeight: 700,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'rgba(164,108,252,0.4)',
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
      <div className="mb-12">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(164,108,252,0.8)',
            display: 'block',
            marginBottom: '20px',
          }}
        >
          Why H2H
        </motion.span>
        
        {/* Masked Typography Reveal for Main Heading */}
        <h3
          style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          <span className="block overflow-hidden pb-1">
            <motion.span
              className="block"
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 1, ease: EASE_OUT_EXPO }}
              style={{ color: 'var(--color-text-dark)' }}
            >
              Because we embed ourselves
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 1, delay: 0.1, ease: EASE_OUT_EXPO }}
              style={{ 
                color: 'transparent', 
                WebkitTextStroke: '1px var(--color-surface-dark)' 
              }}
            >
              in your world.
            </motion.span>
          </span>
        </h3>
      </div>

      <FounderPortrait />

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-0 mt-12">
        <div className="md:pr-16 lg:pr-24">
          <motion.span
            className="block mb-10"
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-text-dark)',
            }}
          >
            Your Partner
          </motion.span>
          {LEFT_ITEMS.map((item, i) => (
            <StoryItem key={item.tag} tag={item.tag} text={item.text} delay={0.1 + i * 0.15} />
          ))}
        </div>

        {/* Enhanced Middle Divider */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2" style={{ width: '1px' }}>
          <motion.div
            className="w-full h-full"
            style={{ 
              background: 'linear-gradient(180deg, transparent 0%, rgba(164,108,252,0.4) 50%, transparent 100%)', 
              transformOrigin: 'top' 
            }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap px-4 py-8 bg-black/20 backdrop-blur-md rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6, ease: EASE_OUT_EXPO }}
            style={{
              writingMode: 'vertical-rl',
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.55rem',
              fontWeight: 700,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'rgba(164,108,252,0.6)',
              transform: 'translateX(-50%) translateY(-50%) rotate(180deg)',
            }}
          >
            From strategy to soul
          </motion.span>
        </div>

        <div className="md:pl-16 lg:pl-24 pt-8 md:pt-32">
          <motion.span
            className="block mb-10"
            initial={{ opacity: 0, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_EXPO }}
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-text-dark)',
            }}
          >
            Structure & Soul
          </motion.span>
          {RIGHT_ITEMS.map((item, i) => (
            <StoryItem key={item.tag} tag={item.tag} text={item.text} delay={0.2 + i * 0.15} />
          ))}
        </div>
      </div>
    </div>
  );
}