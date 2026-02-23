import React, { useState } from 'react';
import { motion } from 'motion/react';
import { VideoOverlay } from './VideoOverlay';

function HeroButton({ variant, children, onClick }: { variant: 'primary' | 'outline'; children: React.ReactNode; onClick?: () => void }) {
  const isPrimary = variant === 'primary';
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-block px-5 py-3 sm:px-8 sm:py-4 border-2 cursor-pointer uppercase"
      style={{
        fontFamily: 'var(--font-stack-heading)',
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        background: isPrimary ? '#fbfbfc' : 'transparent',
        color: isPrimary ? '#291e56' : '#fbfbfc',
        borderColor: '#fbfbfc',
        boxShadow: hovered
          ? `6px 6px 0 #a46cfc`
          : `4px 4px 0 rgba(164,108,252,0.7)`,
        transform: hovered ? 'translate(-2px, -2px)' : 'translate(0, 0)',
        transition: 'box-shadow 0.18s ease, transform 0.18s ease',
      }}
    >
      {children}
    </button>
  );
}

export function HeroTitle({ children }: { children?: React.ReactNode }) {
  const [videoOpen, setVideoOpen] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[60vh]">
      <header>
        <motion.h1
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.05 }}
          style={{
            fontSize: 'clamp(2rem, 8vw, 5rem)',
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-stack-heading)',
            color: '#ffffff',
            marginBottom: 'var(--space-6x)',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}
        >
          From <span className="outline-text">B2B</span>{' '}
          to <span className="outline-text">H2H</span>
          <br />
          Build a Brand People
          <br />
          Want to Talk To
        </motion.h1>

        <motion.p
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.2 }}
          className="text-base sm:text-xl md:text-2xl"
          style={{
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.6,
            maxWidth: '36rem',
            marginBottom: 'var(--space-6x)',
            textShadow: '0 1px 10px rgba(0,0,0,0.4)',
          }}
        >
          People don't only want to connect with brands anymore;
          they connect with the people behind them.
        </motion.p>

        <motion.div
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.35 }}
          className="flex flex-wrap gap-4"
        >
          <HeroButton variant="primary" onClick={() => setVideoOpen(true)}>
            Hear Our Story
          </HeroButton>
          <HeroButton variant="outline" onClick={() => setVideoOpen(true)}>
            Our Journey
          </HeroButton>
        </motion.div>
      </header>

      {children && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {children}
        </motion.div>
      )}

      <VideoOverlay
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
      />

      <style jsx>{`
        .outline-text {
          -webkit-text-stroke: 2px #ffffff;
          color: transparent;
        }
      `}</style>
    </div>
  );
}
