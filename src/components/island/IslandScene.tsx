import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PILLARS } from '../../constants/ecosystem';

const PILLAR_LABELS = PILLARS.map(p => p.title);
const PILLAR_SUMMARIES = [
  'Your digital storefront turned into a platform for thought leadership and brand storytelling.',
  'Executives positioned as respected industry voices with purpose, clarity, and authenticity.',
  'Employees empowered as storytellers and brand ambassadors through real human connection.',
];
const PILLAR_COLORS_HEX = ['#A46CFC', '#B181FC', '#A46CFC'];
const TRANSITION_MICRO = '0.3s ease';
const TRANSITION_MACRO = '0.5s ease';

interface IslandSceneProps {
  onPillarSelect: (index: number) => void;
}

export function IslandScene({ onPillarSelect }: IslandSceneProps) {
  const [activePillar, setActivePillar] = useState<number | null>(null);
  const [cardHovered, setCardHovered] = useState<number | null>(null);

  const handleCardEnter = useCallback((index: number) => {
    setCardHovered(index);
    setActivePillar(index);
  }, []);

  const handleCardLeave = useCallback(() => {
    setCardHovered(null);
    setActivePillar(null);
  }, []);

  const handleBridgeKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' && index < 2) {
      e.preventDefault();
      const parent = (e.currentTarget as HTMLElement).parentElement;
      const next = parent?.querySelector(`[data-bridge-index="${index + 1}"]`) as HTMLElement;
      next?.focus();
      handleCardEnter(index + 1);
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const parent = (e.currentTarget as HTMLElement).parentElement;
      const prev = parent?.querySelector(`[data-bridge-index="${index - 1}"]`) as HTMLElement;
      prev?.focus();
      handleCardEnter(index - 1);
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPillarSelect(index);
    }
  }, [onPillarSelect, handleCardEnter]);

  return (
    <div
      className="relative w-full"
      style={{ maxWidth: 1200, margin: '0 auto' }}
    >
      <div className="relative" aria-hidden="true">
        <div
          className="relative w-full overflow-hidden"
          style={{ height: 'clamp(200px, 44vw, 540px)' }}
        >
          <img
            src="https://ik.imagekit.io/qcvroy8xpd/Rectangle%20(1).png"
            alt="Three Pillars"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(251,251,252,0.15) 0%, rgba(251,251,252,0.05) 50%, rgba(251,251,252,0.6) 100%)',
            }}
          />
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: 120,
            background: 'linear-gradient(to top, #fbfbfc 0%, transparent 100%)',
          }}
        />
      </div>

      <nav
        className="relative flex items-center px-4 sm:px-6 lg:px-16"
        style={{ height: 40, marginTop: -20 }}
        role="group"
        aria-label="Core service navigation"
      >
        <div
          className="absolute top-1/2 left-4 right-4 sm:left-6 sm:right-6 lg:left-16 lg:right-16 h-px"
          aria-hidden="true"
          style={{ background: 'rgba(164,108,252,0.15)' }}
        />

        {[0, 1, 2].map((i) => {
          const isActive = activePillar === i;
          return (
            <button
              key={i}
              data-bridge-index={i}
              onClick={() => onPillarSelect(i)}
              onMouseEnter={() => handleCardEnter(i)}
              onMouseLeave={handleCardLeave}
              onKeyDown={(e) => handleBridgeKeyDown(e, i)}
              aria-label={`${PILLAR_LABELS[i]} - Core service ${i + 1} of 3`}
              aria-current={isActive ? 'true' : undefined}
              tabIndex={0}
              className="relative flex items-center justify-center cursor-pointer border-none bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                flex: 1,
                zIndex: 2,
                outlineColor: PILLAR_COLORS_HEX[i],
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 32,
                  height: 32,
                  border: `1px solid ${isActive ? PILLAR_COLORS_HEX[i] : 'rgba(35,35,35,0.1)'}`,
                  backgroundColor: isActive ? PILLAR_COLORS_HEX[i] + '15' : '#fbfbfc',
                  transition: `all ${TRANSITION_MICRO}`,
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-stack-heading)',
                    fontSize: 10,
                    letterSpacing: '0.05em',
                    color: isActive ? PILLAR_COLORS_HEX[i] : 'rgba(35,35,35,0.25)',
                    transition: `color ${TRANSITION_MICRO}`,
                  }}
                >
                  0{i + 1}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      <div
        className="grid grid-cols-1 md:grid-cols-3 px-4 sm:px-6 lg:px-16"
        style={{ gap: 0, marginTop: 4 }}
        role="group"
        aria-label="Core services overview"
      >
        {PILLAR_LABELS.map((label, i) => {
          const isActive = activePillar === i || cardHovered === i;
          return (
            <motion.button
              key={label}
              onClick={() => onPillarSelect(i)}
              onMouseEnter={() => handleCardEnter(i)}
              onMouseLeave={handleCardLeave}
              aria-label={`View details for ${label}`}
              className="relative text-left cursor-pointer border-none bg-transparent group focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
              style={{
                padding: '20px 16px',
                outlineColor: PILLAR_COLORS_HEX[i],
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-px"
                aria-hidden="true"
                style={{
                  background: isActive
                    ? `linear-gradient(to right, ${PILLAR_COLORS_HEX[i]}60, ${PILLAR_COLORS_HEX[i]}10)`
                    : 'rgba(35,35,35,0.06)',
                  transition: `background ${TRANSITION_MACRO}`,
                }}
              />

              <div
                className="absolute left-0 top-0 bottom-0 w-[2px] md:block hidden"
                aria-hidden="true"
                style={{
                  background: isActive ? PILLAR_COLORS_HEX[i] : 'transparent',
                  opacity: isActive ? 0.6 : 0,
                  transition: `all ${TRANSITION_MICRO}`,
                }}
              />

              <div className="flex items-start gap-3 md:block">
                <div
                  className="flex-shrink-0 flex items-center justify-center md:hidden"
                  style={{
                    width: 32,
                    height: 32,
                    border: `1px solid ${isActive ? PILLAR_COLORS_HEX[i] : 'rgba(35,35,35,0.1)'}`,
                    backgroundColor: isActive ? PILLAR_COLORS_HEX[i] + '15' : 'rgba(35,35,35,0.03)',
                    transition: `all ${TRANSITION_MICRO}`,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-stack-heading)',
                      fontSize: 10,
                      letterSpacing: '0.05em',
                      color: isActive ? PILLAR_COLORS_HEX[i] : 'rgba(35,35,35,0.25)',
                    }}
                  >
                    0{i + 1}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    style={{
                      fontFamily: 'var(--font-stack-heading)',
                      fontSize: 'clamp(1rem, 3.5vw, 1.25rem)',
                      fontWeight: 700,
                      color: isActive ? 'var(--color-text-dark)' : 'rgba(35,35,35,0.55)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                      marginBottom: 8,
                      transition: `color ${TRANSITION_MICRO}`,
                    }}
                  >
                    {label}
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-stack-body)',
                      fontSize: 13,
                      lineHeight: 1.7,
                      color: isActive ? 'rgba(35,35,35,0.55)' : 'rgba(35,35,35,0.35)',
                      marginBottom: 12,
                      transition: `color ${TRANSITION_MACRO}`,
                    }}
                  >
                    {PILLAR_SUMMARIES[i]}
                  </p>

                  <span
                    className="inline-flex items-center gap-1.5"
                    style={{
                      fontFamily: 'var(--font-stack-heading)',
                      fontSize: 10,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase' as const,
                      color: isActive ? PILLAR_COLORS_HEX[i] : 'rgba(35,35,35,0.2)',
                      transition: `color ${TRANSITION_MICRO}`,
                    }}
                  >
                    View details
                    <ArrowRight
                      size={11}
                      style={{
                        transform: isActive ? 'translateX(3px)' : 'translateX(0)',
                        transition: `transform ${TRANSITION_MICRO}`,
                      }}
                    />
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
