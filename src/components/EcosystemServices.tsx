import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { PillarOverlay } from './island/PillarOverlay';
import { PILLARS, SERVICES } from '../constants/ecosystem';

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

interface OrbitNodeProps {
  item: typeof PILLARS[number];
  index: number;
  total: number;
  onSelect: (serviceIndex: number) => void;
  activeLabel: number | null;
  onToggleLabel: (index: number) => void;
}

const OrbitNode = ({ item, index, total, onSelect, activeLabel, onToggleLabel }: OrbitNodeProps) => {
  const angle = (index / total) * 2 * Math.PI;
  const radius = 300;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  const serviceIndex = SERVICES.indexOf(item);
  const showLabel = activeLabel === index;

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 z-30 pointer-events-auto"
      style={{ x, y }}
    >
      <motion.button
        onClick={() => onSelect(serviceIndex)}
        onPointerDown={(e) => {
          if (e.pointerType === 'touch') {
            e.stopPropagation();
            onToggleLabel(index);
          }
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 100, ease: 'linear', repeat: Infinity }}
        className="group relative flex items-center justify-center p-4 focus:outline-none"
      >
        <div
          className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500 group-hover:scale-110"
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

        <div
          className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 transition-opacity duration-500 pointer-events-none z-50 ${
            showLabel ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
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

export function EcosystemServices() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [isHoveringOrbit, setIsHoveringOrbit] = useState(false);
  const [activeLabel, setActiveLabel] = useState<number | null>(null);

  const handleToggleLabel = (index: number) => {
    setActiveLabel(prev => prev === index ? null : index);
  };

  return (
    <section
      id="ecosystem"
      className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-hidden"
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
            <img
              src={planet.src}
              alt=""
              className="w-full h-full object-cover"
              style={{ borderRadius: '50%' }}
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

      <div className="relative z-10 w-full text-center pointer-events-none select-none pt-16 sm:pt-24">
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
              style={{
                fontFamily: 'var(--font-stack-heading)',
                color: 'var(--color-secondary)',
              }}
            >
              The Framework
            </span>
          </div>

          <h1
            className="leading-[0.9] tracking-tighter uppercase mb-2"
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
        </motion.div>
      </div>

      <div
        className="relative z-20 w-full flex-1 flex items-center justify-center"
        style={{ minHeight: '70vh' }}
        onMouseEnter={() => setIsHoveringOrbit(true)}
        onMouseLeave={() => setIsHoveringOrbit(false)}
      >
        <div className="relative w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] md:w-[900px] md:h-[900px] flex items-center justify-center">

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[1, 0.65].map((scale, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${scale * 100}%`,
                  height: `${scale * 100}%`,
                  border: '1px solid rgba(164,108,252,0.15)',
                  boxShadow: i === 0 ? '0 0 40px rgba(164,108,252,0.06)' : 'none',
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-auto">
            <LaptopCenter />
          </div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{
              duration: isHoveringOrbit ? 0 : 120,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {PILLARS.map((pillar, i) => (
              <OrbitNode
                key={i}
                item={pillar}
                index={i}
                total={PILLARS.length}
                onSelect={setSelectedService}
                activeLabel={activeLabel}
                onToggleLabel={handleToggleLabel}
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
