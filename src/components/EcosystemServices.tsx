import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { PillarOverlay } from './island/PillarOverlay';
import { PILLARS } from '../constants/ecosystem';

const VIDEO_URL = 'https://ik.imagekit.io/qcvroy8xpd/rotating-galaxy-4k-2026-01-28-03-26-41-utc.mp4';

const PILLAR_ACCENTS = [
  { from: '#291e56', to: '#4a2d8a', light: 'rgba(164,108,252,0.12)', border: 'rgba(164,108,252,0.35)', dot: '#a46cfc' },
  { from: '#3d2670', to: '#7c4bc0', light: 'rgba(177,129,252,0.15)', border: 'rgba(177,129,252,0.45)', dot: '#c084fc' },
  { from: '#4a2d8a', to: '#a46cfc', light: 'rgba(177,129,252,0.18)', border: 'rgba(177,129,252,0.5)', dot: '#b181fc' },
];

interface OrbitNodeProps {
  item: typeof PILLARS[number];
  index: number;
  total: number;
  radius: number;
  onSelect: (index: number) => void;
  activeLabel: number | null;
  onToggleLabel: (index: number | null) => void;
}

function OrbitNode({ item, index, total, radius, onSelect, activeLabel, onToggleLabel }: OrbitNodeProps) {
  const angle = (index / total) * 2 * Math.PI;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const showLabel = activeLabel === index;
  const isRightHalf = x > 0;
  const accent = PILLAR_ACCENTS[index];

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 z-30"
      style={{ x, y, marginLeft: -32, marginTop: -32 }}
    >
      <motion.button
        onClick={() => onSelect(index)}
        onMouseEnter={() => onToggleLabel(index)}
        onMouseLeave={() => onToggleLabel(null)}
        animate={{ rotate: -360 }}
        transition={{ duration: 120, ease: 'linear', repeat: Infinity }}
        className="group relative flex items-center justify-center w-16 h-16 rounded-full focus:outline-none pointer-events-auto"
      >
        <div
          className="absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: accent.dot }}
        />
        <div
          className="relative z-10 w-full h-full rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500 group-hover:scale-110 border border-white/20"
          style={{
            background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
            boxShadow: `inset 0 0 12px rgba(255,255,255,0.2), 0 0 24px ${accent.light}`,
          }}
        >
          <div className="text-white drop-shadow-md">{item.icon}</div>
        </div>

        <AnimatePresence>
          {showLabel && (
            <motion.div
              initial={{ opacity: 0, x: isRightHalf ? 10 : -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: isRightHalf ? 10 : -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute whitespace-nowrap z-50 pointer-events-none ${isRightHalf ? 'left-full ml-6' : 'right-full mr-6'}`}
            >
              <div
                className="px-4 py-2 bg-[#0e0820]/90 backdrop-blur-xl border shadow-xl"
                style={{ borderColor: accent.border, boxShadow: `4px 4px 0 ${accent.dot}44` }}
              >
                <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: accent.dot }}>
                  {item.subtitle}
                </div>
                <div className="text-white text-sm font-semibold tracking-wide">
                  {item.title}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

export function EcosystemServices() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [isHoveringOrbit, setIsHoveringOrbit] = useState(false);
  const [activeLabel, setActiveLabel] = useState<number | null>(null);
  const [orbitRadius, setOrbitRadius] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      setOrbitRadius(window.innerWidth < 640 ? 140 : window.innerWidth < 1024 ? 220 : 300);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section
      id="ecosystem"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0e0820]"
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-[0.15]">
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0e0820_90%)]" />
      </div>

      <div className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none z-10">
        <div
          className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full blur-[100px]"
          style={{ background: 'rgba(164,108,252,0.08)' }}
        />
        <div className="relative text-center">
          <h1
            className="font-bold uppercase tracking-tighter mb-4"
            style={{
              fontSize: 'clamp(3rem, 12vw, 9rem)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.2)',
            }}
          >
            Framework
          </h1>
          <p
            className="font-mono tracking-widest uppercase text-xs sm:text-sm"
            style={{ color: 'var(--color-secondary, #a46cfc)' }}
          >
            Three Pillars. One Ecosystem.
          </p>
        </div>
      </div>

      <div
        className="hidden sm:flex absolute inset-0 z-20 items-center justify-center pointer-events-none"
      >
        <div
          className="relative w-[600px] h-[600px] pointer-events-auto"
          onMouseEnter={() => setIsHoveringOrbit(true)}
          onMouseLeave={() => setIsHoveringOrbit(false)}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: orbitRadius * 2, height: orbitRadius * 2, border: '1px solid rgba(164,108,252,0.12)' }}
          />

          <div
            className="absolute inset-0"
            style={{
              animation: 'spin-orbit 120s linear infinite',
              animationPlayState: isHoveringOrbit ? 'paused' : 'running',
            }}
          >
            {PILLARS.map((pillar, i) => (
              <OrbitNode
                key={i}
                item={pillar}
                index={i}
                total={PILLARS.length}
                radius={orbitRadius}
                onSelect={setSelectedService}
                activeLabel={activeLabel}
                onToggleLabel={setActiveLabel}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-30 sm:hidden w-full px-6 py-16 space-y-4 flex flex-col">
        <div className="text-center mb-8">
          <h1
            className="font-bold uppercase tracking-tighter mb-3"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(2.2rem, 11vw, 5rem)',
              lineHeight: 1.05,
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.25)',
              letterSpacing: '-0.02em',
            }}
          >
            Framework
          </h1>
          <p
            className="font-mono uppercase"
            style={{
              fontSize: 'clamp(0.65rem, 3vw, 0.8rem)',
              letterSpacing: '0.2em',
              color: 'var(--color-secondary)',
            }}
          >
            Three Pillars. One Ecosystem.
          </p>
        </div>
        {PILLARS.map((p, i) => {
          const accent = PILLAR_ACCENTS[i];
          return (
            <button
              key={i}
              onClick={() => setSelectedService(i)}
              className="group w-full p-5 bg-white/5 backdrop-blur-sm border flex items-center justify-between text-white overflow-hidden relative"
              style={{
                borderColor: accent.border,
                borderWidth: '2px',
                borderRadius: 0,
                boxShadow: `4px 4px 0 ${accent.dot}55`,
                transition: 'box-shadow 0.18s ease, transform 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `6px 6px 0 ${accent.dot}88`;
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `4px 4px 0 ${accent.dot}55`;
                e.currentTarget.style.transform = 'translate(0, 0)';
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `linear-gradient(90deg, ${accent.light}, transparent)` }}
              />
              <div className="flex items-center gap-4 relative z-10">
                <div
                  className="p-3 border"
                  style={{
                    background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                    borderColor: accent.dot,
                    boxShadow: `3px 3px 0 ${accent.dot}55`,
                  }}
                >
                  {p.icon}
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: accent.dot }}>
                    {p.subtitle}
                  </div>
                  <div className="font-bold tracking-wide">{p.title}</div>
                </div>
              </div>
              <ArrowRight size={20} className="relative z-10 transition-transform group-hover:translate-x-1" style={{ color: accent.dot }} />
            </button>
          );
        })}
      </div>

      <PillarOverlay
        pillarIndex={selectedService}
        onClose={() => setSelectedService(null)}
        onNavigate={setSelectedService}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}} />
    </section>
  );
}
