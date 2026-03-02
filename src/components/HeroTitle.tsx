import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HologramOverlay } from './HologramOverlay';
import { HeroGalaxy } from './galaxy/HeroGalaxy';

function HeroButton({ variant, children, onClick }: { variant: 'primary' | 'outline'; children: React.ReactNode; onClick?: () => void }) {
  const isPrimary = variant === 'primary';
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-block px-8 py-4 border-2 cursor-pointer uppercase"
      style={{
        fontFamily: 'var(--font-stack-heading)',
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        background: isPrimary ? '#1a1a2e' : 'transparent',
        color: isPrimary ? '#ffffff' : '#1a1a2e',
        borderColor: '#1a1a2e',
        boxShadow: hovered
          ? `6px 6px 0 rgba(0,0,0,0.25)`
          : `4px 4px 0 rgba(0,0,0,0.12)`,
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
  const [hologramOpen, setHologramOpen] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <div className="flex flex-col gap-8 lg:gap-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
        <header>
          <motion.h1
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.05 }}
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 5rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              fontFamily: 'var(--font-stack-heading)',
              color: '#0f0f1a',
              marginBottom: 'var(--space-6x)',
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
            className="text-xl md:text-2xl"
            style={{
              color: 'rgba(15,15,26,0.65)',
              lineHeight: 1.6,
              maxWidth: '36rem',
              marginBottom: 'var(--space-6x)',
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
            <HeroButton variant="outline" onClick={() => setHologramOpen(true)}>
              Meet the Founder
            </HeroButton>
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center"
        >
          <HeroGalaxy />
        </motion.div>
      </div>

      {children && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {children}
        </motion.div>
      )}

      <HologramOverlay
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        title="Hear Our Story"
      />

      <HologramOverlay
        isOpen={hologramOpen}
        onClose={() => setHologramOpen(false)}
      />

      <style>{`
        @keyframes waveFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(180,130,40,0.2)); }
          50% { filter: drop-shadow(0 0 14px rgba(180,130,40,0.4)); }
        }
        .outline-text {
          position: relative;
          -webkit-text-stroke: 1.5px rgba(0,0,0,0.06);
          background: linear-gradient(
            110deg,
            #b07d20 0%,
            #d4a843 20%,
            #f0c96a 35%,
            #d4a843 50%,
            #9a6c18 65%,
            #d4a843 80%,
            #b07d20 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: waveFlow 6s linear infinite, glowPulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
