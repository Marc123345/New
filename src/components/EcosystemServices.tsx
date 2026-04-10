import { useState, useEffect, useRef, useMemo, useCallback, memo, type RefCallback } from 'react';
import { motion, useInView } from 'motion/react';
import { PillarOverlay } from './island/PillarOverlay';
import { PILLARS, DIGITAL_HOME } from '../constants/ecosystem';


const VIDEO_URL = 'https://ik.imagekit.io/qcvroy8xpd/Galaxy_Excosystem_Video_Generation%20(2).mp4';

const ORBIT_RADIUS = 240;
const ORBIT_DURATION = 20000;

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
      className="absolute z-30 pointer-events-auto"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    >
      <button
        type="button"
        onClick={() => onSelect(index)}
        className="group relative flex flex-col items-center gap-2 focus:outline-none cursor-pointer"
        aria-label={`Select ${item.subtitle}`}
      >
        {/* Circle with number */}
        <div
          className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(164,108,252,0.5)]"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), rgba(164,108,252,0.5))',
            border: '2px solid var(--color-secondary)',
            boxShadow: '0 0 30px rgba(164,108,252,0.3)',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: '1.25rem',
            fontWeight: 900,
            color: '#ffffff',
          }}>
            {label}
          </span>
        </div>

        {/* Label card */}
        <div
          className="transition-all duration-300 group-hover:translate-y-1"
          style={{
            background: 'rgba(41,30,86,0.92)',
            border: '1px solid rgba(164,108,252,0.4)',
            borderRadius: 4,
            padding: '6px 14px',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#ffffff',
            display: 'block',
            textAlign: 'center',
            fontWeight: 700,
          }}>
            {item.title}
          </span>
          <span style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: '0.5rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-secondary)',
            display: 'block',
            textAlign: 'center',
            marginTop: 2,
          }}>
            Tap to explore
          </span>
        </div>
      </button>
    </div>
  );
});

const ORBIT_DIAMETER = ORBIT_RADIUS * 2;

export function EcosystemServices() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [digitalHomeOpen, setDigitalHomeOpen] = useState(false);
  const handleIpadClick = useCallback(() => setDigitalHomeOpen(true), []);
  const handleDigitalHomeClose = useCallback(() => setDigitalHomeOpen(false), []);

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Pause the three infinite motion animations (CTA badge bob, iPad float,
  // iPad screen glow orb) when the section is off-screen.
  const sectionInView = useInView(sectionRef, { margin: "120px 0px" });

  // Force video play when section becomes visible — mobile Safari needs this
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (sectionInView) {
      v.muted = true;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [sectionInView]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>(new Array(PILLARS.length).fill(null));
  const orbitAngleRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const rafRef = useRef(0);
  const visibleRef = useRef(false);

  const nodeRefCallbacks = useMemo(
    () => PILLARS.map((_, i) => (el: HTMLDivElement | null) => { nodeRefs.current[i] = el; }),
    []
  );

  // Pause orbit rAF when section is off-screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const tick = (now: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (!visibleRef.current) { lastTimeRef.current = null; return; }

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
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleSelect = useCallback((i: number) => setSelectedService(i), []);
  const handleClose = useCallback(() => setSelectedService(null), []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0e0820 0%, var(--color-primary) 40%, #120a2a 70%, #0a0612 100%)',
        paddingTop: 'clamp(80px, 12vh, 140px)',
        paddingBottom: 'clamp(60px, 8vh, 100px)',
      }}
    >
      {/* Background Video */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          // @ts-ignore — needed for older iOS
          webkit-playsinline=""
          preload="metadata"
          src={VIDEO_URL}
          className="w-full h-full object-cover opacity-30"
          style={{ filter: 'brightness(0.6) contrast(1.1)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,6,18,0.95) 0%, rgba(10,6,18,0.6) 40%, rgba(10,6,18,0.95) 100%)' }} />
      </div>

      {/* ── HEADER ── */}
      <div className="relative z-10 w-full text-center px-5 sm:px-8 mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[1px]" style={{ background: 'var(--color-secondary)' }} />
            <span style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.65rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--color-secondary)',
              fontWeight: 700,
            }}>
              Our Framework
            </span>
            <div className="w-8 h-[1px]" style={{ background: 'var(--color-secondary)' }} />
          </div>

          <h2
            className="leading-[0.9] tracking-tighter uppercase mb-8"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(2.5rem, 8vw, 8rem)',
              fontWeight: 900,
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(255,255,255,0.85)',
            }}
          >
            The 3-Pillar<br />
            <span style={{ WebkitTextStroke: '1.5px var(--color-secondary)' }}>
              Ecosystem.
            </span>
          </h2>

          <p
            className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-3"
            style={{ color: 'rgba(209,213,219,0.85)', lineHeight: 1.7, fontFamily: 'var(--font-stack-body)', fontWeight: 600 }}
          >
            Built for real connection. Designed for measurable growth.
          </p>

        </motion.div>
      </div>

      {/* ── CTA BADGE ── */}
      <motion.div
        className="relative z-10 mb-6 sm:mb-8"
        animate={sectionInView ? { y: [0, -4, 0] } : { y: 0 }}
        transition={sectionInView ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
      >
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          fontFamily: 'var(--font-stack-heading)',
          fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'var(--color-secondary)',
          padding: '8px 20px',
          border: '1px solid rgba(164,108,252,0.4)',
          background: 'rgba(41,30,86,0.3)',
          backdropFilter: 'blur(8px)',
        }}>
          ↗ Tap a pillar to explore
        </span>
      </motion.div>

      {/* ── ORBIT SYSTEM ── */}
      <div
        className="relative z-20 flex items-center justify-center scale-[0.7] sm:scale-[0.78] md:scale-90 lg:scale-100 transition-transform duration-500"
        style={{ width: ORBIT_DIAMETER + 140, height: ORBIT_DIAMETER + 140, marginTop: '-20px', marginBottom: '-20px' }}
      >
        <div className="relative flex items-center justify-center" style={{ width: ORBIT_DIAMETER + 140, height: ORBIT_DIAMETER + 140 }}>
          {/* Orbit rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute rounded-full" style={{
              width: ORBIT_DIAMETER, height: ORBIT_DIAMETER,
              border: '1px solid rgba(164,108,252,0.15)',
              boxShadow: '0 0 60px rgba(164,108,252,0.04)',
            }} />
            <div className="absolute rounded-full" style={{
              width: ORBIT_DIAMETER - 40, height: ORBIT_DIAMETER - 40,
              border: '1px dashed rgba(164,108,252,0.08)',
            }} />
          </div>

          {/* Center: Purple iPad — click opens the laptop showcase */}
          <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
            <motion.div
              animate={sectionInView ? { y: [0, -12, 0] } : { y: 0 }}
              transition={sectionInView ? { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
              style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.8)) drop-shadow(0 0 50px rgba(164,108,252,0.35))' }}
            >
              <button
                type="button"
                aria-label="Explore Website & Content Hub showcase"
                onClick={handleIpadClick}
                style={{
                  width: 200,
                  height: 270,
                  background: 'linear-gradient(160deg, #1a1030, #0d0820)',
                  borderRadius: 16,
                  border: '2px solid rgba(164,108,252,0.5)',
                  padding: '14px 10px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.04)';
                  e.currentTarget.style.borderColor = 'rgba(164,108,252,0.9)';
                  e.currentTarget.style.boxShadow = '0 0 60px rgba(164,108,252,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(164,108,252,0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Camera dot */}
                <div style={{
                  position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: '50%',
                  background: 'var(--color-secondary)', boxShadow: '0 0 8px var(--color-secondary)',
                }} />
                {/* Screen */}
                <div style={{
                  flex: 1, width: '100%', borderRadius: 8, overflow: 'hidden',
                  background: 'linear-gradient(165deg, #0a0618 0%, #14092a 50%, #0a0618 100%)',
                  border: '1px solid rgba(164,108,252,0.25)',
                  boxShadow: '0 0 24px rgba(164,108,252,0.2) inset',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 10, padding: '12px 10px',
                  position: 'relative',
                }}>
                  {/* Animated glow orb behind the text */}
                  <motion.div
                    animate={sectionInView ? { opacity: [0.55, 1, 0.55], scale: [0.9, 1.1, 0.9] } : { opacity: 0.7, scale: 1 }}
                    transition={sectionInView ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
                    style={{
                      position: 'absolute', top: '18%', left: '50%',
                      width: 44, height: 44, borderRadius: '50%',
                      marginLeft: -22,
                      background: 'radial-gradient(circle, rgba(164,108,252,0.65) 0%, rgba(164,108,252,0.1) 55%, transparent 75%)',
                      filter: 'blur(6px)',
                    }}
                  />

                  {/* Icon */}
                  <div style={{
                    position: 'relative',
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 16px rgba(164,108,252,0.5)',
                    zIndex: 1,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>

                  {/* Title */}
                  <div style={{
                    position: 'relative',
                    textAlign: 'center',
                    zIndex: 1,
                    fontFamily: 'var(--font-stack-heading)',
                    fontSize: 8,
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    lineHeight: 1.2,
                    textShadow: '0 0 10px rgba(164,108,252,0.5)',
                    marginTop: 2,
                  }}>
                    Website /<br />Digital Content Hub
                  </div>

                  {/* Click to explore pill */}
                  <div style={{
                    position: 'relative',
                    zIndex: 1,
                    fontFamily: 'var(--font-stack-heading)',
                    fontSize: 6,
                    fontWeight: 700,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: 'var(--color-secondary)',
                    padding: '3px 8px',
                    border: '1px solid rgba(164,108,252,0.5)',
                    borderRadius: 999,
                    background: 'rgba(164,108,252,0.08)',
                    marginTop: 4,
                  }}>
                    Click to explore
                  </div>
                </div>
              </button>
            </motion.div>
          </div>

          {/* Orbiting Nodes — wrapper is click-through so the iPad button
              behind it stays reachable. Individual orbit nodes re-enable
              pointer events on themselves. */}
          <div className="absolute inset-0 z-30 pointer-events-none">
            {PILLARS.map((pillar, i) => (
              <OrbitNode key={i} item={pillar} index={i} onSelect={handleSelect} containerRef={nodeRefCallbacks[i]} />
            ))}
          </div>
        </div>
      </div>

      <PillarOverlay pillarIndex={selectedService} onClose={handleClose} onNavigate={handleSelect} />
      <PillarOverlay pillarIndex={null} onClose={handleDigitalHomeClose} onNavigate={() => {}} standalone={digitalHomeOpen ? DIGITAL_HOME : null} />

    </section>
  );
}
