import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HologramOverlay } from './HologramOverlay';

const LINES = [
  ['We', 'help', 'brands'],
  ['become', 'truly'],
  ['unforgettable.'],
];

function WordReveal() {
  let globalIndex = 0;
  return (
    <h1
      style={{
        fontFamily: "'Aeonik', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '2.5vw',
        fontWeight: 400,
        lineHeight: 1.1,
        color: '#000',
        margin: 0,
        letterSpacing: '-0.01em',
      }}
    >
      {LINES.map((words, li) => (
        <div
          key={li}
          style={{
            display: 'block',
            overflow: 'hidden',
            width: '100%',
            position: 'relative',
          }}
        >
          {words.map((word, wi) => {
            const delay = (globalIndex++ ) * 0.06 + 0.1;
            return (
              <React.Fragment key={wi}>
                <motion.span
                  style={{
                    display: 'inline-block',
                    position: 'relative',
                    top: '-0.1em',
                    transformOrigin: 'bottom left',
                  }}
                  initial={{ y: '1.5em', rotate: 15 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{
                    duration: 0.85,
                    delay,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {word}
                </motion.span>
                {wi < words.length - 1 && (
                  <span style={{ display: 'inline-block', width: '0.3em' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      ))}

      <style>{`
        @media (max-width: 812px) {
          .hero-wordreveal { font-size: 6vw !important; }
        }
        @media (max-width: 380px) {
          .hero-wordreveal { font-size: 7vw !important; }
        }
        @media (min-aspect-ratio: 21/9) {
          .hero-wordreveal { font-size: 1.7vw !important; }
        }
      `}</style>
    </h1>
  );
}

function HeroButton({
  variant,
  children,
  onClick,
}: {
  variant: 'primary' | 'outline';
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const isPrimary = variant === 'primary';
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-block px-5 py-3 sm:px-8 sm:py-4 border-2 cursor-pointer uppercase"
      style={{
        fontFamily: "'Aeonik', 'Helvetica Neue', sans-serif",
        fontSize: 'clamp(0.62rem, 1.3vw, 0.72rem)',
        letterSpacing: '0.15em',
        background: isPrimary ? '#0a0a0a' : 'transparent',
        color: isPrimary ? '#fff' : '#0a0a0a',
        borderColor: '#0a0a0a',
        boxShadow: hovered ? `4px 4px 0 #a46cfc` : `3px 3px 0 rgba(0,0,0,0.15)`,
        transform: hovered ? 'translate(-1px, -1px)' : 'translate(0,0)',
        transition: 'box-shadow 0.18s ease, transform 0.18s ease',
      }}
    >
      {children}
    </button>
  );
}

export function HeroTitle() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [hologramOpen, setHologramOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <WordReveal />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "'Aeonik', 'Helvetica Neue', sans-serif",
          fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)',
          color: 'rgba(0,0,0,0.45)',
          lineHeight: 1.6,
          maxWidth: '30rem',
          margin: 0,
        }}
      >
        A social-first agency helping African brands grow through
        human connection, strategic storytelling, and award-winning
        digital experiences.
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <HeroButton variant="primary" onClick={() => setVideoOpen(true)}>
          Hear Our Story
        </HeroButton>
        <HeroButton variant="outline" onClick={() => setHologramOpen(true)}>
          Meet the Founder
        </HeroButton>
      </motion.div>

      <HologramOverlay
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        title="Hear Our Story"
        videoUrl="https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Video%202026-03-03%20at%2019.21.41.mp4"
      />
      <HologramOverlay
        isOpen={hologramOpen}
        onClose={() => setHologramOpen(false)}
      />
    </div>
  );
}
