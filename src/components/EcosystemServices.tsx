import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { PillarOverlay } from './island/PillarOverlay';
import { PILLARS } from '../constants/ecosystem';

const VIDEO_URL = 'https://ik.imagekit.io/qcvroy8xpd/rotating-galaxy-4k-2026-01-28-03-26-41-utc.mp4';
const LAPTOP_URL = 'https://ik.imagekit.io/qcvroy8xpd/download.png';

const PLANET_IMAGES = [
  { src: 'https://ik.imagekit.io/qcvroy8xpd/jupiter.jpg', size: 260, top: '5%', left: '68%', duration: 18, delay: 0 },
  { src: 'https://ik.imagekit.io/qcvroy8xpd/saturn.jpg', size: 180, top: '60%', left: '78%', duration: 24, delay: 3 },
  { src: 'https://ik.imagekit.io/qcvroy8xpd/neptune.jpg', size: 140, top: '15%', left: '-4%', duration: 20, delay: 1 },
  { src: 'https://ik.imagekit.io/qcvroy8xpd/venus.jpg', size: 110, top: '72%', left: '3%', duration: 22, delay: 5 },
  { src: 'https://ik.imagekit.io/qcvroy8xpd/mars.jpg', size: 90, top: '40%', left: '85%', duration: 16, delay: 2 },
  { src: 'https://ik.imagekit.io/qcvroy8xpd/uranus.jpg', size: 120, top: '82%', left: '45%', duration: 28, delay: 4 },
  { src: 'https://ik.imagekit.io/qcvroy8xpd/mercury.jpg', size: 70, top: '5%', left: '40%', duration: 14, delay: 6 },
];

const ORBIT_RADIUS = 220;
const ORBIT_DURATION = 18000; // ms for a full revolution

// ─── Orbit ring rendered via CSS animation so it never triggers React re-renders ───
function OrbitRing({ paused }: { paused: boolean }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: ORBIT_RADIUS * 2,
        height: ORBIT_RADIUS * 2,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        border: '1px solid rgba(164,108,252,0.25)',
        boxShadow: '0 0 40px rgba(164,108,252,0.08), inset 0 0 40px rgba(164,108,252,0.04)',
        animation: `orbit-pulse 4s ease-in-out infinite`,
      }}
    />
  );
}

// ─── Orbit group: rotates via CSS animation, pausing on hover ───
interface OrbitGroupProps {
  paused: boolean;
  onSelect: (index: number) => void;
  selectedService: number | null;
}

function OrbitGroup({ paused, onSelect, selectedService }: OrbitGroupProps) {
  const groupRef = useRef<HTMLDivElement>(null);

  // Capture the current rotation angle when pausing so it stays in place
  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    if (paused) {
      const computed = getComputedStyle(el);
      const matrix = new DOMMatrixReadOnly(computed.transform);
      const angle = Math.atan2(matrix.m12, matrix.m11);
      el.style.animationDelay = `-${((angle / (2 * Math.PI) + 1) % 1) * ORBIT_DURATION}ms`;
      el.style.animationPlayState = 'paused';
    } else {
      el.style.animationPlayState = 'running';
    }
  }, [paused]);

  return (
    <div
      ref={groupRef}
      className="absolute inset-0"
      style={{
        animation: `orbit-spin ${ORBIT_DURATION}ms linear infinite`,
        animationPlayState: paused ? 'paused' : 'running',
      }}
    >
      {PILLARS.map((pillar, i) => {
        const baseAngle = (i / PILLARS.length) * 360; // degrees, spread evenly
        const rad = (baseAngle * Math.PI) / 180;
        const x = Math.cos(rad) * ORBIT_RADIUS;
        const y = Math.sin(rad) * ORBIT_RADIUS;
        // Counter-rotate the node so icons stay upright as the group spins
        return (
          <OrbitNode
            key={i}
            item={pillar}
            index={i}
            x={x}
            y={y}
            paused={paused}
            isSelected={selectedService === i}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}

interface OrbitNodeProps {
  item: typeof PILLARS[number];
  index: number;
  x: number;
  y: number;
  paused: boolean;
  isSelected: boolean;
  onSelect: (index: number) => void;
}

function OrbitNode({ item, index, x, y, paused, isSelected, onSelect }: OrbitNodeProps) {
  // Determine tooltip direction based on horizontal position
  const tooltipOnLeft = x > 0;

  return (
    <div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        // Counter-rotate to keep icons upright while the group spins
        animation: `orbit-counter-spin ${ORBIT_DURATION}ms linear infinite`,
        animationPlayState: paused ? 'paused' : 'running',
      }}
    >
      <button
        type="button"
        onClick={() => onSelect(index)}
        onKeyDown={(e) => e.key === 'Enter' && onSelect(index)}
        aria-label={`View ${item.subtitle}`}
        aria-pressed={isSelected}
        className="group relative flex items-center justify-center p-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-full cursor-pointer"
      >
        {/* Pulsing selection ring */}
        {isSelected && (
          <span
            className="absolute inset-0 rounded-full"
            style={{
              animation: 'selection-pulse 1.5s ease-out infinite',
              border: '2px solid var(--color-secondary)',
            }}
          />
        )}

        <div
          className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:scale-110"
          style={{
            background: isSelected
              ? 'linear-gradient(135deg, rgba(164,108,252,0.7), rgba(164,108,252,0.3))'
              : 'linear-gradient(135deg, var(--color-primary), rgba(164,108,252,0.4))',
            border: `2px solid ${isSelected ? 'var(--color-secondary)' : 'rgba(164,108,252,0.6)'}`,
            boxShadow: isSelected
              ? '0 0 32px rgba(164,108,252,0.6), inset 0 0 16px rgba(164,108,252,0.2)'
              : '0 0 24px rgba(164,108,252,0.35), inset 0 0 12px rgba(164,108,252,0.15)',
          }}
        >
          <div style={{ color: '#ffffff' }}>{item.icon}</div>
        </div>

        {/* Smart tooltip: flips side based on x position */}
        <div
          className={`absolute ${tooltipOnLeft ? 'right-full mr-3' : 'left-full ml-3'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap`}
        >
          <span
            className="text-xs uppercase tracking-[0.2em] px-3 py-1 block"
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
      </button>
    </div>
  );
}

function LaptopCenter() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [12, -12]);
  const rotateY = useTransform(mouseX, [-150, 150], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set(e.clientX - cx);
    mouseY.set(e.clientY - cy);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src={LAPTOP_URL}
            alt="Website at the center of everything"
            style={{
              width: 'clamp(180px, 24vw, 340px)',
              height: 'auto',
              filter: 'drop-shadow(0 0 32px rgba(164,108,252,0.55)) drop-shadow(0 24px 48px rgba(0,0,0,0.8))',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            draggable={false}
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 'clamp(200px, 26vw, 380px)',
          height: 'clamp(30px, 4vw, 60px)',
          bottom: '-10%',
          left: '50%',
          translateX: '-50%',
          background: 'radial-gradient(ellipse, rgba(164,108,252,0.25) 0%, transparent 70%)',
          filter: 'blur(12px)',
        }}
        animate={{ scaleX: [1, 0.85, 1], opacity: [0.6, 0.35, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

const ORBIT_DIAMETER = ORBIT_RADIUS * 2;

export function EcosystemServices() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [isHoveringOrbit, setIsHoveringOrbit] = useState(false);

  const handleSelect = useCallback((index: number) => {
    setSelectedService((prev) => (prev === index ? null : index));
  }, []);

  const handleClose = useCallback(() => setSelectedService(null), []);

  return (
    <>
      {/* Inject keyframes once */}
      <style>{`
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbit-counter-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes orbit-pulse {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 40px rgba(164,108,252,0.08), inset 0 0 40px rgba(164,108,252,0.04); }
          50%       { opacity: 1;   box-shadow: 0 0 60px rgba(164,108,252,0.16), inset 0 0 60px rgba(164,108,252,0.08); }
        }
        @keyframes selection-pulse {
          0%   { transform: scale(1);    opacity: 1; }
          100% { transform: scale(1.8);  opacity: 0; }
        }
      `}</style>

      <section
        id="ecosystem"
        className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 sm:py-28"
        style={{ background: 'linear-gradient(160deg, #0e0820 0%, var(--color-primary) 40%, #120a2a 70%, #0a0612 100%)' }}
      >
        {/* ── Background ── */}
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

          {PLANET_IMAGES.map((planet, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full overflow-hidden"
              style={{
                width: planet.size,
                height: planet.size,
                top: planet.top,
                left: planet.left,
                opacity: 0.55,
                filter: 'blur(0.5px)',
              }}
              animate={{ y: [0, -18, 0], rotate: [0, 360] }}
              transition={{
                y: { duration: planet.duration, repeat: Infinity, ease: 'easeInOut', delay: planet.delay },
                rotate: { duration: planet.duration * 3, repeat: Infinity, ease: 'linear', delay: planet.delay },
              }}
            >
              <img src={planet.src} alt="" className="w-full h-full object-cover" style={{ borderRadius: '50%' }} />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.08) 0%, transparent 60%)',
                  boxShadow: 'inset -4px -4px 16px rgba(0,0,0,0.6)',
                }}
              />
            </motion.div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50" />
        </div>

        {/* ── Heading ── */}
        <div className="relative z-10 w-full text-center pointer-events-none select-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <div
              className="inline-block mb-6 px-4 py-2"
              style={{
                border: '2px solid var(--color-secondary)',
                boxShadow: '4px 4px 0 var(--color-secondary)',
              }}
            >
              <span
                className="text-xs uppercase tracking-[0.3em]"
                style={{ fontFamily: 'var(--font-stack-heading)', color: 'var(--color-secondary)' }}
              >
                The Framework
              </span>
            </div>

            <h1
              className="leading-[0.9] tracking-tighter uppercase mb-10 sm:mb-14"
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(2.5rem, 10vw, 9rem)',
                textShadow: '0 20px 40px rgba(41,30,86,0.6)',
                color: 'transparent',
                WebkitTextStroke: '1.5px #ffffff',
              }}
            >
              Three Pillars. <br />
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--color-secondary)' }}>
                One Ecosystem.
              </span>
            </h1>
          </motion.div>
        </div>

        {/* ── Orbit ── */}
        <div
          className="relative z-20 flex items-center justify-center"
          onMouseEnter={() => setIsHoveringOrbit(true)}
          onMouseLeave={() => setIsHoveringOrbit(false)}
          style={{ width: ORBIT_DIAMETER + 120, height: ORBIT_DIAMETER + 120 }}
        >
          {/* Static orbit ring */}
          <OrbitRing paused={isHoveringOrbit} />

          {/* Laptop in center */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-auto">
            <LaptopCenter />
          </div>

          {/* Spinning orbit group */}
          <OrbitGroup
            paused={isHoveringOrbit}
            onSelect={handleSelect}
            selectedService={selectedService}
          />
        </div>

        {/* ── Pillar count indicator ── */}
        <motion.div
          className="relative z-10 mt-6 flex gap-3 items-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          {PILLARS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: selectedService === i ? 24 : 6,
                height: 6,
                background: selectedService === i ? 'var(--color-secondary)' : 'rgba(164,108,252,0.35)',
              }}
            />
          ))}
        </motion.div>

        <PillarOverlay
          pillarIndex={selectedService}
          onClose={handleClose}
          onNavigate={setSelectedService}
        />
      </section>
    </>
  );
}