import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PillarOverlay } from './island/PillarOverlay';
import { PILLARS, SERVICES } from '../constants/ecosystem';

const VIDEO_URL = 'https://ik.imagekit.io/qcvroy8xpd/rotating-galaxy-4k-2026-01-28-03-26-41-utc.mp4';

interface OrbitNodeProps {
  item: typeof PILLARS[number];
  index: number;
  total: number;
  onSelect: (serviceIndex: number) => void;
}

const OrbitNode = ({ item, index, total, onSelect }: OrbitNodeProps) => {
  const angle = (index / total) * 2 * Math.PI;
  const radius = 300;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  const serviceIndex = SERVICES.indexOf(item);

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 z-30 pointer-events-auto"
      style={{ x, y }}
    >
      <motion.button
        onClick={() => onSelect(serviceIndex)}
        animate={{ rotate: -360 }}
        transition={{ duration: 100, ease: 'linear', repeat: Infinity }}
        className="group relative flex items-center justify-center p-4 focus:outline-none"
      >
        <div
          className="relative z-10 w-14 h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500 group-hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), rgba(164,108,252,0.4))',
            border: '2px solid var(--color-secondary)',
            boxShadow: '0 0 24px rgba(164,108,252,0.35), inset 0 0 12px rgba(164,108,252,0.15)',
          }}
        >
          <div className="transition-colors" style={{ color: '#ffffff' }}>
            {item.icon}
          </div>
        </div>

        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-50">
          <span
            className="text-xs uppercase tracking-[0.2em] whitespace-nowrap px-3 py-1"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              color: '#ffffff',
              background: 'rgba(41,30,86,0.95)',
              border: '1px solid var(--color-secondary)',
            }}
          >
            {item.subtitle}
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
};

export function EcosystemServices() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [isHoveringOrbit, setIsHoveringOrbit] = useState(false);

  return (
    <section
      id="ecosystem"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-32"
      style={{ background: 'linear-gradient(160deg, #0e0820 0%, var(--color-primary) 40%, #120a2a 70%, #0a0612 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-40"
          style={{ filter: 'brightness(0.7) contrast(1.05)' }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center pointer-events-none select-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <div
            className="inline-block mb-8 px-4 py-2"
            style={{
              border: '2px solid var(--color-secondary)',
              boxShadow: '4px 4px 0 var(--color-secondary)',
            }}
          >
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{
                fontFamily: 'var(--font-stack-heading)',
                color: 'var(--color-secondary)',
              }}
            >
              The Framework
            </span>
          </div>

          <h1
            className="leading-[0.9] tracking-tighter uppercase mb-4"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(4rem, 10vw, 9rem)',
              textShadow: '0 20px 40px rgba(41,30,86,0.6)',
              color: 'transparent',
              WebkitTextStroke: '1.5px #ffffff',
            }}
          >
            Three Pillars. <br />
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '1.5px var(--color-secondary)',
              }}
            >
              One Ecosystem.
            </span>
          </h1>
          <h1
            className="leading-[0.9] tracking-tighter uppercase"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(4rem, 10vw, 9rem)',
              color: 'var(--color-secondary)',
              opacity: 0.08,
            }}
          >
            Connection
          </h1>
        </motion.div>
      </div>

      <div
        className="absolute inset-0 z-20 overflow-visible pointer-events-none flex items-center justify-center"
        onMouseEnter={() => setIsHoveringOrbit(true)}
        onMouseLeave={() => setIsHoveringOrbit(false)}
      >
        <div className="relative w-[600px] h-[600px] md:w-[900px] md:h-[900px] flex items-center justify-center">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{
              duration: isHoveringOrbit ? 0 : 120,
              ease: 'linear',
              repeat: Infinity,
            }}
            style={{ animationPlayState: isHoveringOrbit ? 'paused' : 'running' }}
          >
            {PILLARS.map((pillar, i) => (
              <OrbitNode
                key={i}
                item={pillar}
                index={i}
                total={PILLARS.length}
                onSelect={setSelectedService}
              />
            ))}
          </motion.div>
        </div>
      </div>

      <PillarOverlay
        pillarIndex={selectedService}
        onClose={() => setSelectedService(null)}
        onNavigate={setSelectedService}
      />
    </section>
  );
}
