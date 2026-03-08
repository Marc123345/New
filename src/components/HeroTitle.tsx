import React, { useState, useCallback, memo } from 'react';
import { motion } from 'motion/react';
import { HologramOverlay } from './HologramOverlay';

const FADE_IN_UP = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as number[] }
};

const FADE_TRANSITIONS = {
  h1: { ...FADE_IN_UP.transition, delay: 0.05 },
  p: { ...FADE_IN_UP.transition, delay: 0.2 },
  cta: { ...FADE_IN_UP.transition, delay: 0.35 },
};

const H1_STYLE = {
  fontSize: 'clamp(2.2rem, 7vw, 5rem)',
  lineHeight: 1.08,
  letterSpacing: '-0.03em',
  fontFamily: 'var(--font-stack-heading)',
  color: '#ffffff',
  marginBottom: 'var(--space-6x)',
  textShadow: '0 2px 20px rgba(0,0,0,0.5)',
} as const;

const P_STYLE = {
  color: 'rgba(255,255,255,0.85)',
  lineHeight: 1.6,
  maxWidth: '36rem',
  marginBottom: 'var(--space-6x)',
  textShadow: '0 1px 10px rgba(0,0,0,0.4)',
} as const;

const BTN_BASE = {
  fontFamily: 'var(--font-stack-heading)',
  fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
  letterSpacing: '0.15em',
  borderColor: '#fbfbfc',
  transition: 'box-shadow 0.18s ease, transform 0.18s ease',
} as const;

const HeroButton = memo(function HeroButton({ variant, children, onClick }: { variant: 'primary' | 'outline'; children: React.ReactNode; onClick?: () => void }) {
  const isPrimary = variant === 'primary';
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-block px-5 py-3 sm:px-8 sm:py-4 border-2 cursor-pointer uppercase"
      style={{
        ...BTN_BASE,
        background: isPrimary ? '#fbfbfc' : 'transparent',
        color: isPrimary ? '#291e56' : '#fbfbfc',
        boxShadow: hovered
          ? '6px 6px 0 #a46cfc'
          : '4px 4px 0 rgba(164,108,252,0.7)',
        transform: hovered ? 'translate(-2px, -2px)' : 'translate(0, 0)',
      }}
    >
      {children}
    </button>
  );
});

const CHILD_ANIM = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 1, delay: 0.4 },
};

export function HeroTitle({ children }: { children?: React.ReactNode }) {
  const [videoOpen, setVideoOpen] = useState(false);
  const [hologramOpen, setHologramOpen] = useState(false);

  const openVideo = useCallback(() => setVideoOpen(true), []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);
  const openHologram = useCallback(() => setHologramOpen(true), []);
  const closeHologram = useCallback(() => setHologramOpen(false), []);

  return (
    <div className="flex flex-col gap-8 lg:gap-12">
      <div>
        <header>
          <motion.h1
            {...FADE_IN_UP}
            transition={FADE_TRANSITIONS.h1}
            style={H1_STYLE}
          >
            From <span className="outline-text">B2B</span>{' '}
            to <span className="outline-text">H2H</span>
            <br className="hidden sm:block" />
            {' '}Build a Brand People
            <br className="hidden sm:block" />
            {' '}Want to Talk To
          </motion.h1>

          <motion.p
            {...FADE_IN_UP}
            transition={FADE_TRANSITIONS.p}
            className="text-base sm:text-xl md:text-2xl"
            style={P_STYLE}
          >
            People don't only want to connect with brands anymore;
            they connect with the people behind them.
          </motion.p>

          <motion.div
            {...FADE_IN_UP}
            transition={FADE_TRANSITIONS.cta}
            className="flex flex-wrap gap-4"
          >
            <HeroButton variant="primary" onClick={openVideo}>
              Hear Our Story
            </HeroButton>
            <HeroButton variant="outline" onClick={openHologram}>
              Meet the Founder
            </HeroButton>
          </motion.div>
        </header>
      </div>

      {children && (
        <motion.div {...CHILD_ANIM}>
          {children}
        </motion.div>
      )}

      <HologramOverlay
        isOpen={videoOpen}
        onClose={closeVideo}
        title="Hear Our Story"
        videoUrl="https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Video%202026-03-03%20at%2019.21.41.mp4"
      />

      <HologramOverlay
        isOpen={hologramOpen}
        onClose={closeHologram}
      />
    </div>
  );
}
