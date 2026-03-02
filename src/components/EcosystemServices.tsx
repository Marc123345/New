import { useState } from 'react';
import { motion } from 'motion/react';
import { PillarOverlay } from './island/PillarOverlay';
import { PILLARS, SERVICES } from '../constants/ecosystem';
import { SpacePlanets3D } from './space/SpacePlanets3D';
import { PillarCubes3D } from './ecosystem/PillarCubes3D';

const VIDEO_URL = 'https://ik.imagekit.io/qcvroy8xpd/rotating-galaxy-4k-2026-01-28-03-26-41-utc.mp4';

const PILLAR_LABELS = PILLARS.map((p) => p.subtitle);

export function EcosystemServices() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [activeLabel, setActiveLabel] = useState<number | null>(null);

  const handlePillarClick = (index: number) => {
    const serviceIndex = SERVICES.indexOf(PILLARS[index]);
    setSelectedService(serviceIndex);
  };

  return (
    <section
      id="ecosystem"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 sm:py-32"
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
        <SpacePlanets3D preset="ecosystem" style={{ opacity: 0.75 }} />
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
              fontSize: 'clamp(2.5rem, 10vw, 9rem)',
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
              fontSize: 'clamp(2.5rem, 10vw, 9rem)',
              color: 'var(--color-secondary)',
              opacity: 0.08,
            }}
          >
            Connection
          </h1>
        </motion.div>
      </div>

      <div className="relative z-20 w-full max-w-3xl mx-auto px-6 mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full overflow-hidden"
          style={{
            height: 'clamp(320px, 45vw, 520px)',
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.18)',
            boxShadow: '4px 4px 0 rgba(164,108,252,0.7)',
            transition: 'box-shadow 0.18s ease, transform 0.18s ease',
          }}
          whileHover={{
            x: -2,
            y: -2,
          }}
        >
          <PillarCubes3D onPillarClick={handlePillarClick} />

          <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-around pb-4 px-4 pointer-events-none">
            {PILLAR_LABELS.map((label, i) => (
              <button
                key={i}
                className="pointer-events-auto px-3 py-1 text-xs uppercase tracking-[0.2em] transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  color: '#ffffff',
                  background: 'rgba(41,30,86,0.85)',
                  border: '1px solid var(--color-secondary)',
                  boxShadow: activeLabel === i ? '2px 2px 0 rgba(164,108,252,0.8)' : 'none',
                }}
                onClick={() => {
                  handlePillarClick(i);
                  setActiveLabel(i);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <PillarOverlay
        pillarIndex={selectedService}
        onClose={() => setSelectedService(null)}
        onNavigate={setSelectedService}
      />
    </section>
  );
}
