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
  const [storyOpen, setStoryOpen] = useState(false);
  const [founderOpen, setFounderOpen] = useState(false);

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
            className="text-xl md:text-2xl"
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
            <HeroButton variant="primary" onClick={() => setStoryOpen(true)}>
              Hear Our Story
            </HeroButton>
            <HeroButton variant="outline" onClick={() => setFounderOpen(true)}>
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
        isOpen={storyOpen}
        onClose={() => setStoryOpen(false)}
        title="Hear Our Story"
      />

      <HologramOverlay
        isOpen={founderOpen}
        onClose={() => setFounderOpen(false)}
        title="Meet the Founder"
      />

      <style>{`
        @keyframes waveFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(139,92,246,0.3)); }
          50% { filter: drop-shadow(0 0 18px rgba(139,92,246,0.6)) drop-shadow(0 0 40px rgba(124,58,237,0.2)); }
        }
        .outline-text {
          position: relative;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.12);
          background: linear-gradient(
            110deg,
            rgba(139,92,246,0.6) 0%,
            #a78bfa 20%,
            #e0d4ff 35%,
            #c4b5fd 50%,
            #8b5cf6 65%,
            #a78bfa 80%,
            rgba(139,92,246,0.6) 100%
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
