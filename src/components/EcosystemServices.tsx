import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { PillarOverlay } from './island/PillarOverlay';
import { PILLARS } from '../constants/ecosystem';
import { useIsMobile } from '../hooks/useIsMobile';

const VIDEO_URL = 'https://ik.imagekit.io/qcvroy8xpd/Galaxy_Excosystem_Video_Generation.mp4?updatedAt=1771520317965';
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
const ORBIT_DURATION = 18000;

interface OrbitNodeProps {
  item: typeof PILLARS[number];
  index: number;
  total: number;
  onSelect: (index: number) => void;
  orbitAngle: number;
}

const OrbitNode = ({ item, index, total, onSelect, orbitAngle }: OrbitNodeProps) => {
  const baseAngle = (index / total) * 2 * Math.PI;
  const angle = baseAngle + orbitAngle;
  const x = Math.cos(angle) * ORBIT_RADIUS;
  const y = Math.sin(angle) * ORBIT_RADIUS;

  return (
    <div
      className="absolute z-30"
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
    >
      <button
        type="button"
        onClick={() => onSelect(index)}
        className="group relative flex items-center justify-center p-3 focus:outline-none cursor-pointer"
        aria-label={`Select ${item.subtitle}`}
      >
        <div
          className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), rgba(164,108,252,0.4))',
            border: '2px solid var(--color-secondary)',
            boxShadow: '0 0 24px rgba(164,108,252,0.35), inset 0 0 12px rgba(164,108,252,0.15)',
          }}
        >
          <div style={{ color: '#ffffff' }}>{item.icon}</div>
        </div>
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
          <span
            className="text-xs uppercase tracking-[0.2em] px-3 py-1 block rounded-sm"
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
};

function useOrbitAngle(paused: boolean) {
  const angleRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const step = (now: number) => {
      if (!paused) {
        if (lastTimeRef.current !== null) {
          const delta = now - lastTimeRef.current;
          angleRef.current += (delta / ORBIT_DURATION) * 2 * Math.PI;
          setAngle(angleRef.current);
        }
        lastTimeRef.current = now;
      } else {
        lastTimeRef.current = null;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused]);

  return angle;
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
      className="relative flex items-center justify-center w-full h-full"
      style={{ perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img
            src={LAPTOP_URL}
            alt="Website at the center of everything"
            className="w-[180px] sm:w-[240px] md:w-[340px] h-auto"
            style={{
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
          width: 'clamp(180px, 26vw, 380px)',
          height: 'clamp(25px, 4vw, 60px)',
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
  const isMobile = useIsMobile();
  const orbitAngle = useOrbitAngle(isHoveringOrbit);
  const visiblePlanets = useMemo(() => isMobile ? PLANET_IMAGES.slice(0, 3) : PLANET_IMAGES, [isMobile]);

  return (
    <section
      id="ecosystem"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 sm:py-28"
      style={{ background: 'linear-gradient(160deg, #0e0820 0%, var(--color-primary) 40%, #120a2a 70%, #0a0612 100%)' }}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {!isMobile && (
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
        )}

        {visiblePlanets.map((planet, i) => (
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
            <img
              src={planet.src}
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
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

      {/* Typography Content */}
      <div className="relative z-10 w-full text-center pointer-events-none select-none px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              display: 'inline-block',
              marginBottom: '10px',
              padding: '6px 16px',
              border: '2px solid var(--color-secondary)',
              boxShadow: '4px 4px 0 var(--color-secondary)',
            }}
          >
            <span
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-stack-heading)',
                color: 'var(--color-secondary)',
              }}
            >
              Framework
            </span>
          </motion.div>
          <h1
            className="leading-tight sm:leading-[0.9] tracking-tighter uppercase mb-12 sm:mb-16"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(2rem, 8vw, 9rem)',
              textShadow: '0 20px 40px rgba(41,30,86,0.6)',
              color: 'transparent',
              WebkitTextStroke: '1.5px #ffffff',
            }}
          >
            Three Pillars. <br className="hidden sm:block" />
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '1.5px var(--color-secondary)',
              }}
            >
              One Ecosystem.
            </span>
          </h1>
        </motion.div>
      </div>

      {/* Orbit Interaction Area */}
      {/* ADDED: scale classes for perfect mobile view! */}
      <div
        className="relative z-20 flex items-center justify-center scale-[0.6] sm:scale-75 md:scale-100 transition-transform duration-500"
        onMouseEnter={() => setIsHoveringOrbit(true)}
        onMouseLeave={() => setIsHoveringOrbit(false)}
        style={{ width: ORBIT_DIAMETER + 120, height: ORBIT_DIAMETER + 120 }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{ width: ORBIT_DIAMETER + 120, height: ORBIT_DIAMETER + 120 }}
        >
          {/* Orbit Ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="absolute rounded-full"
              style={{
                width: ORBIT_DIAMETER,
                height: ORBIT_DIAMETER,
                border: '1px solid rgba(164,108,252,0.2)',
                boxShadow: '0 0 40px rgba(164,108,252,0.06)',
              }}
            />
          </div>

          {/* Center Laptop */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-auto">
            <LaptopCenter />
          </div>

          {/* Orbiting Nodes */}
          <div className="absolute inset-0 z-30">
            {PILLARS.map((pillar, i) => (
              <OrbitNode
                key={i}
                item={pillar}
                index={i}
                total={PILLARS.length}
                onSelect={setSelectedService}
                orbitAngle={orbitAngle}
              />
            ))}
          </div>
        </div>
      </div>

      <motion.p
        className="relative z-10 mt-4 sm:mt-6 text-center"
        style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
        }}
        animate={{ opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        Tap a pillar to explore
      </motion.p>

      <PillarOverlay
        pillarIndex={selectedService}
        onClose={() => setSelectedService(null)}
        onNavigate={setSelectedService}
      />
    </section>
  );
}