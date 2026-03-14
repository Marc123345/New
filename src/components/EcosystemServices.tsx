import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { motion } from 'motion/react';
import { PillarOverlay } from './island/PillarOverlay';
import { PILLARS } from '../constants/ecosystem';
import { useIsMobile } from '../hooks/useIsMobile';

const VIDEO_URL = 'https://ik.imagekit.io/qcvroy8xpd/Galaxy_Excosystem_Video_Generation.mp4?updatedAt=1771520317965';

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
  onSelect: (index: number) => void;
  containerRef: (el: HTMLDivElement | null) => void;
}

const OrbitNode = memo(({ item, index, onSelect, containerRef }: OrbitNodeProps) => {
  const label = `0${index + 1}`;

  return (
    <div
      ref={containerRef}
      className="absolute z-30"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    >
      <button
        type="button"
        onClick={() => onSelect(index)}
        className="group relative flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
        aria-label={`Select ${item.subtitle}`}
      >
        {/* Circle with number */}
        <div
          className="relative z-10 w-14 h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), rgba(164,108,252,0.4))',
            border: '2px solid var(--color-secondary)',
            boxShadow: '0 0 24px rgba(164,108,252,0.35), inset 0 0 12px rgba(164,108,252,0.15)',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: '1.15rem',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}>
            {label}
          </span>
        </div>

        {/* Always-visible tooltip */}
        <div
          style={{
            background: 'rgba(41,30,86,0.95)',
            border: '1px solid rgba(164,108,252,0.5)',
            borderRadius: 2,
            padding: '4px 10px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 0 12px rgba(164,108,252,0.15)',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: '0.5rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#ffffff',
            display: 'block',
            textAlign: 'center',
          }}>
            {item.title}
          </span>
          <span style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: '0.48rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#a46cfc',
            display: 'block',
            textAlign: 'center',
            marginTop: 3,
            fontWeight: 700,
            textShadow: '0 0 8px rgba(164,108,252,0.8)',
          }}>
            ✦ Click to explore
          </span>
        </div>
      </button>
    </div>
  );
});

const ORBIT_DIAMETER = ORBIT_RADIUS * 2;

export function EcosystemServices() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const visiblePlanets = useMemo(() => isMobile ? PLANET_IMAGES.slice(0, 3) : PLANET_IMAGES, [isMobile]);

  // Single RAF — updates orbit node positions via DOM (no React state updates per frame)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>(new Array(PILLARS.length).fill(null));
  const orbitAngleRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const rafRef = useRef(0);

  const nodeRefCallbacks = useMemo(
    () => PILLARS.map((_, i) => (el: HTMLDivElement | null) => { nodeRefs.current[i] = el; }),
    []
  );

  useEffect(() => {
    const tick = (now: number) => {
      if (lastTimeRef.current !== null) {
        orbitAngleRef.current += ((now - lastTimeRef.current) / ORBIT_DURATION) * 2 * Math.PI;
      }
      lastTimeRef.current = now;

      const angle = orbitAngleRef.current;
      const total = PILLARS.length;
      nodeRefs.current.forEach((el, index) => {
        if (!el) return;
        const a = (index / total) * 2 * Math.PI + angle;
        const x = Math.cos(a) * ORBIT_RADIUS;
        const y = Math.sin(a) * ORBIT_RADIUS;
        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleSelect = useCallback((i: number) => setSelectedService(i), []);
  const handleClose = useCallback(() => setSelectedService(null), []);

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
              Services
            </span>
          </motion.div>
          <h2
            className="leading-tight sm:leading-[0.9] tracking-tighter uppercase mb-6 sm:mb-8"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(2rem, 8vw, 9rem)',
              textShadow: '0 20px 40px rgba(41,30,86,0.6)',
              color: 'transparent',
              WebkitTextStroke: '1.5px #ffffff',
            }}
          >
            The 3-Pillar <br className="hidden sm:block" />
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '1.5px var(--color-secondary)',
              }}
            >
              Social Media Ecosystem.
            </span>
          </h2>
          <p
            className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-4"
            style={{ color: 'rgba(209,213,219,0.9)', lineHeight: 1.7, fontFamily: 'var(--font-stack-body)', fontWeight: 600 }}
          >
            Built for real connection. Designed for measurable growth.
          </p>
          <p
            className="text-sm sm:text-base max-w-2xl mx-auto mb-3"
            style={{ color: 'rgba(209,213,219,0.65)', lineHeight: 1.8, fontFamily: 'var(--font-stack-body)' }}
          >
            We don't see social media as a channel, we see it as a living ecosystem. One that, when structured strategically, turns visibility into trust, and trust into action.
          </p>
          <p
            className="text-sm sm:text-base max-w-2xl mx-auto mb-10 sm:mb-14"
            style={{ color: 'rgba(209,213,219,0.65)', lineHeight: 1.8, fontFamily: 'var(--font-stack-body)' }}
          >
            That's why we built the 3-Pillar Social Media Ecosystem — a framework designed to humanize your brand across three key layers: your company, your leadership, and your people.
          </p>
        </motion.div>
      </div>

      <motion.p
        className="relative z-10 mb-4 sm:mb-6 text-center"
        style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#ffffff',
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        Tap a pillar to explore
      </motion.p>

      {/* Orbit Interaction Area */}
      {/* ADDED: scale classes for perfect mobile view! */}
      <div
        className="relative z-20 flex items-center justify-center scale-[0.6] sm:scale-75 md:scale-100 transition-transform duration-500"
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

          {/* Center: CSS Laptop Mockup */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.8)) drop-shadow(0 0 40px rgba(164,108,252,0.4))', userSelect: 'none' }}
            >
              {/* Lid / Screen */}
              <div style={{
                width: 220,
                background: 'linear-gradient(160deg, #1a1030 0%, #0d0820 100%)',
                borderRadius: '10px 10px 2px 2px',
                border: '2px solid rgba(164,108,252,0.55)',
                padding: '8px 8px 6px 8px',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)',
                position: 'relative',
              }}>
                {/* Screen image */}
                <div style={{
                  background: '#050310',
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: '1px solid rgba(164,108,252,0.3)',
                  boxShadow: '0 0 20px rgba(164,108,252,0.25) inset',
                }}>
                  <img
                    src="https://ik.imagekit.io/qcvroy8xpd/unnamed%20(2)%201.png?updatedAt=1773188163565"
                    alt="H2H"
                    draggable={false}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
                {/* Screen glow overlay */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '10px 10px 2px 2px',
                  background: 'linear-gradient(135deg, rgba(164,108,252,0.06) 0%, transparent 50%)',
                  pointerEvents: 'none',
                }} />
                {/* Webcam dot */}
                <div style={{
                  position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: '50%',
                  background: 'rgba(164,108,252,0.5)',
                  boxShadow: '0 0 6px rgba(164,108,252,0.8)',
                }} />
              </div>

              {/* Hinge strip */}
              <div style={{
                width: 220,
                height: 5,
                background: 'linear-gradient(to bottom, rgba(164,108,252,0.4), rgba(80,40,140,0.6))',
                borderLeft: '2px solid rgba(164,108,252,0.4)',
                borderRight: '2px solid rgba(164,108,252,0.4)',
              }} />

              {/* Base / Keyboard */}
              <div style={{
                width: 236,
                marginLeft: -8,
                height: 24,
                background: 'linear-gradient(to bottom, #1c1035, #110c28)',
                border: '2px solid rgba(164,108,252,0.45)',
                borderTop: 'none',
                borderRadius: '0 0 8px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              }}>
                {/* Trackpad */}
                <div style={{
                  width: 56,
                  height: 12,
                  background: 'rgba(164,108,252,0.08)',
                  border: '1px solid rgba(164,108,252,0.25)',
                  borderRadius: 3,
                }} />
              </div>
            </motion.div>
          </div>

          {/* Orbiting Nodes */}
          <div className="absolute inset-0 z-30">
            {PILLARS.map((pillar, i) => (
              <OrbitNode
                key={i}
                item={pillar}
                index={i}
                onSelect={handleSelect}
                containerRef={nodeRefCallbacks[i]}
              />
            ))}
          </div>
        </div>
      </div>

      <PillarOverlay
        pillarIndex={selectedService}
        onClose={handleClose}
        onNavigate={handleSelect}
      />

      {/* Why the 3-Pillar System Works */}
      <motion.div
        className="relative z-10 w-full text-center px-5 sm:px-8 mt-8 sm:mt-10 pb-4"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="mx-auto"
          style={{ maxWidth: '680px', borderTop: '1px solid rgba(164,108,252,0.2)', paddingTop: '2.5rem' }}
        >
          <p
            className="text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] font-bold mb-4"
            style={{ color: 'rgba(164,108,252,0.7)', fontFamily: 'var(--font-stack-heading)' }}
          >
            Why the 3-Pillar System Works
          </p>
          <p
            className="text-sm sm:text-base md:text-lg"
            style={{ color: 'rgba(209,213,219,0.6)', lineHeight: 1.8, fontFamily: 'var(--font-stack-body)' }}
          >
            This living ecosystem is designed to strengthen brand presence, build executive visibility, empower employees to share the company narrative, and drive real business results. By activating all three pillars, you create a brand that speaks with one voice — powered by many humans.
          </p>
        </div>
      </motion.div>
    </section>
  );
}