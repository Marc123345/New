import { useState } from 'react';
import { motion } from 'motion/react';
import { PillarOverlay } from './island/PillarOverlay';
import { PILLARS, SERVICES } from '../constants/ecosystem';

const MACBOOK_MOCKUP = 'https://ik.imagekit.io/qcvroy8xpd/macbook-mockup-front-view_1332-60629.avif';

const ORBIT_RADIUS = 42;

interface OrbitNodeProps {
  item: typeof PILLARS[number];
  index: number;
  total: number;
  onSelect: (serviceIndex: number) => void;
}

const OrbitNode = ({ item, index, total, onSelect }: OrbitNodeProps) => {
  const angle = (index / total) * 360 - 90;
  const rad = (angle * Math.PI) / 180;
  const x = 50 + ORBIT_RADIUS * Math.cos(rad);
  const y = 50 + ORBIT_RADIUS * Math.sin(rad);

  const serviceIndex = SERVICES.indexOf(item);

  const isLeft = x < 48;
  const isRight = x > 52;
  const isTop = y < 45;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 30,
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.4 + index * 0.15, ease: 'easeOut' }}
    >
      <button
        onClick={() => onSelect(serviceIndex)}
        className="group relative flex flex-col items-center gap-2 focus:outline-none"
        style={{ width: 80 }}
      >
        <motion.div
          whileHover={{ scale: 1.15 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative w-14 h-14 rounded-full backdrop-blur-md flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(20,20,20,0.9), rgba(40,40,40,0.85))',
            border: '1.5px solid var(--color-secondary)',
            boxShadow: '0 0 20px rgba(164,108,252,0.25), inset 0 0 10px rgba(164,108,252,0.08)',
          }}
        >
          <div style={{ color: 'var(--color-secondary)' }}>
            {item.icon}
          </div>
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'radial-gradient(circle, rgba(164,108,252,0.15) 0%, transparent 70%)' }}
          />
        </motion.div>

        <div
          className={`absolute whitespace-nowrap pointer-events-none ${
            isTop ? 'bottom-full mb-3' : 'top-full mt-3'
          } ${isLeft ? 'right-0' : isRight ? 'left-0' : 'left-1/2 -translate-x-1/2'}`}
        >
          <div
            className="px-3 py-1.5 text-center"
            style={{
              border: '1px solid rgba(164,108,252,0.3)',
              background: 'rgba(255,255,255,0.97)',
              boxShadow: '2px 2px 0 rgba(164,108,252,0.2)',
            }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.2em] leading-none mb-0.5"
              style={{ fontFamily: 'var(--font-stack-heading)', color: 'var(--color-secondary)' }}
            >
              {item.subtitle}
            </p>
            <p
              className="text-[11px] font-semibold uppercase tracking-wide leading-none"
              style={{ fontFamily: 'var(--font-stack-heading)', color: 'var(--color-text-dark)' }}
            >
              {item.title}
            </p>
          </div>
        </div>
      </button>
    </motion.div>
  );
};

export function EcosystemServices() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <section
      id="ecosystem"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-24"
      style={{ background: 'var(--color-background-light)' }}
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 55%, rgba(164,108,252,0.07) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(96,165,250,0.04) 0%, transparent 45%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(35,35,35,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(35,35,35,0.035) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-center">
        <motion.div
          className="text-center mb-10 pointer-events-none select-none"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div
            className="inline-block mb-5 px-4 py-1.5"
            style={{
              border: '2px solid var(--color-secondary)',
              boxShadow: '3px 3px 0 var(--color-secondary)',
            }}
          >
            <span
              className="text-[11px] uppercase tracking-[0.3em]"
              style={{ fontFamily: 'var(--font-stack-heading)', color: 'var(--color-secondary)' }}
            >
              The Framework
            </span>
          </div>

          <h2
            className="leading-[0.88] tracking-tighter uppercase"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(2.8rem, 8vw, 7rem)',
              color: 'transparent',
              WebkitTextStroke: '1.5px var(--color-text-dark)',
            }}
          >
            Three Pillars.{' '}
            <span style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--color-secondary)' }}>
              One Ecosystem.
            </span>
          </h2>

          <p
            className="mt-4 text-sm sm:text-base max-w-lg mx-auto leading-relaxed"
            style={{ color: 'var(--color-text-dark)', opacity: 0.55, fontFamily: 'var(--font-stack-body, sans-serif)' }}
          >
            Three interconnected pillars that work in harmony to build, amplify, and scale your brand presence.
          </p>
        </motion.div>

        <div
          className="relative w-full"
          style={{ paddingBottom: '62%', maxWidth: 860 }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="absolute inset-0">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              style={{ zIndex: 5 }}
            >
              <circle
                cx="50"
                cy="50"
                r={ORBIT_RADIUS}
                fill="none"
                stroke="rgba(164,108,252,0.18)"
                strokeWidth="0.3"
                strokeDasharray="1.2 2"
              />
              <circle
                cx="50"
                cy="50"
                r={ORBIT_RADIUS - 0.1}
                fill="none"
                stroke="rgba(164,108,252,0.06)"
                strokeWidth="1.5"
              />
            </svg>

            <motion.svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              style={{ zIndex: 6 }}
              animate={{ rotate: isHovering ? 0 : 360 }}
              transition={{ duration: 80, ease: 'linear', repeat: Infinity }}
            >
              <circle
                cx="50"
                cy="50"
                r={ORBIT_RADIUS}
                fill="none"
                stroke="url(#orbitGrad)"
                strokeWidth="0.25"
                strokeDasharray="6 94"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="orbitGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(164,108,252,0.9)" />
                  <stop offset="100%" stopColor="rgba(164,108,252,0)" />
                </linearGradient>
              </defs>
            </motion.svg>

            <motion.div
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '46%',
                zIndex: 10,
              }}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
            >
              <img
                src={MACBOOK_MOCKUP}
                alt="Website preview"
                className="w-full h-auto object-contain"
                style={{
                  filter:
                    'drop-shadow(0 20px 50px rgba(164,108,252,0.22)) drop-shadow(0 6px 20px rgba(0,0,0,0.14))',
                }}
              />
            </motion.div>

            {PILLARS.map((pillar, i) => (
              <OrbitNode
                key={i}
                item={pillar}
                index={i}
                total={PILLARS.length}
                onSelect={setSelectedService}
              />
            ))}
          </div>
        </div>

        <motion.p
          className="mt-6 text-xs uppercase tracking-[0.25em] text-center pointer-events-none select-none"
          style={{ color: 'var(--color-text-dark)', opacity: 0.3, fontFamily: 'var(--font-stack-heading)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Click any pillar to explore
        </motion.p>
      </div>

      <PillarOverlay
        pillarIndex={selectedService}
        onClose={() => setSelectedService(null)}
        onNavigate={setSelectedService}
      />
    </section>
  );
}
