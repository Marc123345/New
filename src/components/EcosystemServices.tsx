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

interface LaptopMockupProps {
  wrapperRef: (el: HTMLDivElement | null) => void;
}

const LaptopMockup = memo(({ wrapperRef }: LaptopMockupProps) => (
  <motion.div
    animate={{ y: [0, -14, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    style={{ position: 'relative', userSelect: 'none' }}
  >
    {/* Ambient ground glow */}
    <motion.div
      animate={{ opacity: [0.5, 0.9, 0.5], scaleX: [1, 1.15, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', bottom: -28, left: '50%',
        transform: 'translateX(-50%)',
        width: 180, height: 28,
        background: 'radial-gradient(ellipse, rgba(164,108,252,0.55) 0%, transparent 70%)',
        filter: 'blur(10px)',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />

    {/* 3D perspective wrapper — updated imperatively via wrapperRef */}
    <div
      ref={wrapperRef}
      style={{
        transformStyle: 'preserve-3d',
        transform: 'perspective(1000px) rotateX(8deg) rotateY(-5deg)',
        position: 'relative', zIndex: 1,
      }}
    >
      {/* ── SCREEN LID ── */}
      <motion.div
        animate={{
          boxShadow: [
            '0 0 0 1.5px rgba(164,108,252,0.4), 0 0 24px rgba(164,108,252,0.2), inset 0 1px 0 rgba(255,255,255,0.07)',
            '0 0 0 1.5px rgba(164,108,252,0.8), 0 0 48px rgba(164,108,252,0.5), 0 0 80px rgba(164,108,252,0.15), inset 0 1px 0 rgba(255,255,255,0.07)',
            '0 0 0 1.5px rgba(164,108,252,0.4), 0 0 24px rgba(164,108,252,0.2), inset 0 1px 0 rgba(255,255,255,0.07)',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 240,
          background: 'linear-gradient(160deg, #1c1138 0%, #0d0820 100%)',
          borderRadius: '12px 12px 2px 2px',
          padding: '10px 10px 7px',
          position: 'relative',
        }}
      >
        {/* Webcam */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5], boxShadow: ['0 0 4px rgba(164,108,252,0.6)', '0 0 10px rgba(164,108,252,1)', '0 0 4px rgba(164,108,252,0.6)'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
            width: 5, height: 5, borderRadius: '50%',
            background: 'rgba(164,108,252,0.8)',
          }}
        />

        {/* Screen bezel + image */}
        <div style={{
          background: '#04020e',
          borderRadius: 5,
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(164,108,252,0.25)',
        }}>
          <img
            src="https://ik.imagekit.io/qcvroy8xpd/unnamed%20(2)%201.png?updatedAt=1773188163565"
            alt="H2H"
            draggable={false}
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />

          {/* Scanlines */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 4px)',
          }} />

          {/* Moving scan glow */}
          <motion.div
            animate={{ y: ['-100%', '220%'] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }}
            style={{
              position: 'absolute', left: 0, right: 0, height: '35%',
              background: 'linear-gradient(to bottom, transparent, rgba(164,108,252,0.10), transparent)',
              pointerEvents: 'none',
            }}
          />

          {/* Corner reflection */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 35%)',
          }} />
        </div>

        {/* Lid top shine */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
          borderRadius: '12px 12px 0 0',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)',
          pointerEvents: 'none',
        }} />
      </motion.div>

      {/* ── HINGE ── */}
      <div style={{
        width: 240, height: 6,
        background: 'linear-gradient(to bottom, rgba(164,108,252,0.55), rgba(60,30,110,0.8))',
        borderLeft: '1.5px solid rgba(164,108,252,0.5)',
        borderRight: '1.5px solid rgba(164,108,252,0.5)',
      }} />

      {/* ── BASE (keyboard + trackpad) ── */}
      <div style={{
        width: 258, marginLeft: -9,
        background: 'linear-gradient(175deg, #1e1240 0%, #0f0924 60%, #0a0618 100%)',
        border: '1.5px solid rgba(164,108,252,0.45)',
        borderTop: 'none',
        borderRadius: '0 0 10px 10px',
        padding: '6px 8px 8px',
        boxShadow: '0 16px 40px rgba(0,0,0,0.8), inset 0 -1px 0 rgba(164,108,252,0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Keyboard rows */}
        {[11, 11, 10, 10].map((count, row) => (
          <div key={row} style={{ display: 'flex', gap: 2, marginBottom: 2, justifyContent: 'center' }}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} style={{
                flex: i === 0 && row === 3 ? 2 : 1,
                height: 5,
                background: 'rgba(164,108,252,0.07)',
                border: '1px solid rgba(164,108,252,0.18)',
                borderRadius: 1.5,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              }} />
            ))}
          </div>
        ))}

        {/* Spacebar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <div style={{
            width: 80, height: 5,
            background: 'rgba(164,108,252,0.07)',
            border: '1px solid rgba(164,108,252,0.18)',
            borderRadius: 1.5,
          }} />
        </div>

        {/* Trackpad */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: 68, height: 14,
            background: 'rgba(164,108,252,0.06)',
            border: '1px solid rgba(164,108,252,0.22)',
            borderRadius: 4,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }} />
        </div>

        {/* Base shine */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 45%)',
          pointerEvents: 'none', borderRadius: '0 0 10px 10px',
        }} />

        {/* Subtle RGB edge glow on base bottom */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, rgba(164,108,252,0.6), rgba(200,150,255,0.8), rgba(164,108,252,0.6), transparent)',
            borderRadius: '0 0 10px 10px',
          }}
        />
      </div>
    </div>
  </motion.div>
));

const ORBIT_DIAMETER = ORBIT_RADIUS * 2;

export function EcosystemServices() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const visiblePlanets = useMemo(() => isMobile ? PLANET_IMAGES.slice(0, 3) : PLANET_IMAGES, [isMobile]);

  // Single RAF driving both orbit animation and laptop tilt (no React state updates)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>(new Array(PILLARS.length).fill(null));
  const laptopWrapperRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const tiltRef = useRef({ x: 0, y: 0 });
  const orbitAngleRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const rafRef = useRef(0);

  // Stable ref callbacks for orbit nodes
  const nodeRefCallbacks = useMemo(
    () => PILLARS.map((_, i) => (el: HTMLDivElement | null) => { nodeRefs.current[i] = el; }),
    []
  );
  const laptopRef = useCallback((el: HTMLDivElement | null) => { laptopWrapperRef.current = el; }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
    };

    const tick = (now: number) => {
      // Update orbit angle
      if (lastTimeRef.current !== null) {
        const delta = now - lastTimeRef.current;
        orbitAngleRef.current += (delta / ORBIT_DURATION) * 2 * Math.PI;
      }
      lastTimeRef.current = now;

      // Update orbit node positions directly via DOM
      const angle = orbitAngleRef.current;
      const total = PILLARS.length;
      nodeRefs.current.forEach((el, index) => {
        if (!el) return;
        const baseAngle = (index / total) * 2 * Math.PI;
        const a = baseAngle + angle;
        const x = Math.cos(a) * ORBIT_RADIUS;
        const y = Math.sin(a) * ORBIT_RADIUS;
        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      });

      // Update laptop tilt directly via DOM
      tiltRef.current.x += (mouseRef.current.x - tiltRef.current.x) * 0.06;
      tiltRef.current.y += (mouseRef.current.y - tiltRef.current.y) * 0.06;
      if (laptopWrapperRef.current) {
        const rx = 8 - tiltRef.current.y * 6;
        const ry = -5 + tiltRef.current.x * 7;
        laptopWrapperRef.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

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
              loading="lazy"
              decoding="async"
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

          {/* Center: Dynamic Laptop */}
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <LaptopMockup wrapperRef={laptopRef} />
          </div>

          {/* Orbiting Nodes */}
          <div className="absolute inset-0 z-30">
            {PILLARS.map((pillar, i) => (
              <OrbitNode
                key={i}
                item={pillar}
                index={i}
                onSelect={setSelectedService}
                containerRef={nodeRefCallbacks[i]}
              />
            ))}
          </div>
        </div>
      </div>

      <PillarOverlay
        pillarIndex={selectedService}
        onClose={() => setSelectedService(null)}
        onNavigate={setSelectedService}
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
