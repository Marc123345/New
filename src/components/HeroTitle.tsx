import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HologramOverlay } from './HologramOverlay';

const LINES = [
  ['from', 'B2B', 'to', 'H2H'],
  ['Build', 'a', 'Brand', 'People'],
  ['want', 'to', 'talk', 'to.'],
];

function WordReveal() {
  let globalIndex = 0;
  return (
    <h1
      className="hero-wordreveal"
      style={{
        fontFamily: "'Aeonik', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '3.4vw',
        fontWeight: 300,
        lineHeight: 1.1,
        color: '#0a0a0a',
        margin: 0,
        letterSpacing: '-0.01em',
      }}
    >
      {LINES.map((words, li) => (
        <div
          key={li}
          style={{ display: 'block', overflow: 'hidden', position: 'relative' }}
        >
          {words.map((word, wi) => {
            const delay = (globalIndex++) * 0.06 + 0.1;
            return (
              <React.Fragment key={wi}>
                <motion.span
                  style={{
                    display: 'inline-block',
                    position: 'relative',
                    top: '-0.1em',
                    transformOrigin: 'bottom left',
                  }}
                  initial={{ y: '1.5em', rotate: 12 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
                {wi < words.length - 1 && (
                  <span style={{ display: 'inline-block', width: '0.28em' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      ))}

      <style>{`
        @media (max-width: 1280px) { .hero-wordreveal { font-size: 4.2vw !important; } }
        @media (max-width: 1024px) { .hero-wordreveal { font-size: 5.2vw !important; } }
        @media (max-width: 812px)  { .hero-wordreveal { font-size: 7vw !important; } }
        @media (max-width: 480px)  { .hero-wordreveal { font-size: 8.5vw !important; } }
        @media (min-aspect-ratio: 21/9) { .hero-wordreveal { font-size: 2.6vw !important; } }
      `}</style>
    </h1>
  );
}

function HeroButton({
  variant, children, onClick,
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
      className="inline-flex items-center cursor-pointer"
      style={{
        fontFamily: "'Aeonik', 'Helvetica Neue', sans-serif",
        fontSize: 'clamp(0.6rem, 1.1vw, 0.68rem)',
        fontWeight: 400,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        padding: '10px 24px',
        borderRadius: 999,
        border: `1.5px solid ${isPrimary ? '#0a0a0a' : 'rgba(10,10,10,0.25)'}`,
        background: isPrimary
          ? hovered ? '#a46cfc' : '#0a0a0a'
          : hovered ? 'rgba(10,10,10,0.06)' : 'transparent',
        color: isPrimary ? '#ffffff' : '#0a0a0a',
        transition: 'background 0.22s ease, border-color 0.22s ease',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.5vh, 24px)' }}>
      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "'Aeonik', 'Helvetica Neue', sans-serif",
          fontSize: 'clamp(0.6rem, 1vw, 0.7rem)',
          fontWeight: 400,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(10,10,10,0.4)',
          margin: 0,
        }}
      >
        Human-to-Human Brand Communication
      </motion.p>

      <WordReveal />

      <motion.div
        style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
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
