import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { PillarOverlay } from './island/PillarOverlay';
import { PILLARS, SERVICES } from '../constants/ecosystem';

const VIDEO_URL = 'https://ik.imagekit.io/qcvroy8xpd/rotating-galaxy-4k-2026-01-28-03-26-41-utc.mp4';

function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    type Star = { x: number; y: number; r: number; alpha: number; speed: number; twinkleOffset: number };
    const stars: Star[] = Array.from({ length: 220 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 0.12 + 0.02,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      t += 0.008;
      for (const s of stars) {
        const twinkle = s.alpha + Math.sin(t * s.speed * 6 + s.twinkleOffset) * 0.08;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, twinkle))})`;
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.55 }}
    />
  );
}

interface OrbitNodeProps {
  item: typeof PILLARS[number];
  index: number;
  total: number;
  onSelect: (serviceIndex: number) => void;
  phaseOffset: number;
}

const PILLAR_TOOLTIPS = [
  'Building your brand into a compelling digital platform with consistent storytelling.',
  'Positioning executives as trusted industry voices that drive real business results.',
  'Turning employees into empowered brand ambassadors for authentic organic reach.',
];

const OrbitNode = ({ item, onSelect, phaseOffset }: OrbitNodeProps) => {
  const [hovered, setHovered] = useState(false);
  const angle = phaseOffset;
  const radius = 300;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  const serviceIndex = SERVICES.indexOf(item);

  return (
    <div
      className="absolute top-1/2 left-1/2 z-30 pointer-events-auto"
      style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
    >
      <div className="relative flex items-center justify-center">
        <motion.button
          onClick={() => onSelect(serviceIndex)}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          onTouchStart={() => setHovered(v => !v)}
          animate={{
            scale: hovered ? 1.12 : 1,
          }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative flex items-center justify-center p-2 focus:outline-none cursor-pointer"
          aria-label={item.title}
        >
          <div
            className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500"
            style={{
              background: hovered
                ? 'linear-gradient(135deg, rgba(164,108,252,0.55), rgba(91,33,182,0.6))'
                : 'linear-gradient(135deg, var(--color-primary), rgba(164,108,252,0.4))',
              border: hovered
                ? '2px solid rgba(200,160,255,0.9)'
                : '2px solid var(--color-secondary)',
              boxShadow: hovered
                ? '0 0 32px rgba(164,108,252,0.7), 0 0 60px rgba(164,108,252,0.3), inset 0 0 16px rgba(164,108,252,0.25)'
                : '0 0 20px rgba(164,108,252,0.3), inset 0 0 10px rgba(164,108,252,0.12)',
            }}
          >
            <div style={{ color: hovered ? '#fff' : 'rgba(255,255,255,0.85)' }}>
              {item.icon}
            </div>
          </div>
        </motion.button>

        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6, scale: hovered ? 1 : 0.95 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none z-50 w-52"
          style={{ transformOrigin: 'left center' }}
        >
          <div
            className="rounded-xl p-3 backdrop-blur-xl"
            style={{
              background: 'rgba(22,12,52,0.92)',
              border: '1px solid rgba(164,108,252,0.45)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(164,108,252,0.15)',
            }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.22em] mb-1"
              style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-stack-heading)' }}
            >
              {item.subtitle}
            </p>
            <p
              className="text-sm font-semibold text-white mb-1.5 leading-tight"
              style={{ fontFamily: 'var(--font-stack-heading)' }}
            >
              {item.title}
            </p>
            <p className="text-xs text-white/60 leading-snug">
              {PILLAR_TOOLTIPS[SERVICES.indexOf(item)] ?? ''}
            </p>
            <div
              className="mt-2 text-[10px] uppercase tracking-wider font-medium"
              style={{ color: 'rgba(164,108,252,0.8)', fontFamily: 'var(--font-stack-heading)' }}
            >
              Click to explore →
            </div>
          </div>
          <div
            className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0"
            style={{
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderRight: '6px solid rgba(164,108,252,0.45)',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

function OrbitRingDecoration() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className="rounded-full"
        style={{
          width: 610,
          height: 610,
          border: '1px solid rgba(164,108,252,0.09)',
          boxShadow: '0 0 40px rgba(164,108,252,0.04) inset',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          border: '1px dashed rgba(164,108,252,0.07)',
        }}
      />
    </div>
  );
}

export function EcosystemServices() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const nebulaY1 = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const nebulaY2 = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const starsY   = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);
  const headlineOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
  const headlineX       = useTransform(scrollYProgress, [0.05, 0.22], [-30, 0]);

  const fgParallaxX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const fgParallaxY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);
  const midParallaxX = useTransform(smoothX, [-0.5, 0.5], [-4, 4]);
  const midParallaxY = useTransform(smoothY, [-0.5, 0.5], [-4, 4]);

  const orbitAngle = useMotionValue(0);
  const orbitRef = useRef<number>(0);
  const lastTime = useRef<number>(0);

  const tick = useCallback((time: number) => {
    if (lastTime.current) {
      const dt = (time - lastTime.current) / 1000;
      orbitAngle.set(orbitAngle.get() + dt * (Math.PI * 2) / 90);
    }
    lastTime.current = time;
    orbitRef.current = requestAnimationFrame(tick);
  }, [orbitAngle]);

  useEffect(() => {
    orbitRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(orbitRef.current);
  }, [tick]);

  const [orbitDeg, setOrbitDeg] = useState(0);
  useEffect(() => {
    return orbitAngle.on('change', v => setOrbitDeg((v * 180) / Math.PI));
  }, [orbitAngle]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [mouseX, mouseY]);

  return (
    <section
      id="ecosystem"
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 sm:py-32"
      style={{ background: 'linear-gradient(160deg, #0e0820 0%, var(--color-primary) 40%, #120a2a 70%, #0a0612 100%)' }}
      onMouseMove={handleMouseMove}
    >
      {/* Layer 0: Starfield */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ y: starsY }}
      >
        <Starfield />
      </motion.div>

      {/* Layer 1: Galaxy video */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-1"
        style={{ x: midParallaxX, y: midParallaxY }}
      >
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
      </motion.div>

      {/* Layer 2: Nebula A */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-2"
        style={{ y: nebulaY1 }}
      >
        <div
          className="absolute w-[70%] h-[70%]"
          style={{
            top: '15%',
            left: '15%',
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(91,33,182,0.18) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </motion.div>

      {/* Layer 2b: Nebula B – offset hue, slower parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-2"
        style={{ y: nebulaY2 }}
      >
        <div
          className="absolute w-[50%] h-[55%]"
          style={{
            top: '30%',
            right: '5%',
            background: 'radial-gradient(ellipse 70% 50% at 60% 50%, rgba(164,108,252,0.10) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute w-[40%] h-[40%]"
          style={{
            top: '10%',
            left: '5%',
            background: 'radial-gradient(ellipse 60% 40% at 40% 50%, rgba(46,16,101,0.22) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-3 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/40" />
      </div>

      {/* Headline layer (foreground parallax) */}
      <motion.div
        className="relative z-10 container mx-auto px-6 text-center pointer-events-none select-none"
        style={{ x: fgParallaxX, y: fgParallaxY }}
      >
        {/* Section label */}
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

        {/* Main headline with scroll fade-in */}
        <motion.div
          style={{ opacity: headlineOpacity, x: headlineX }}
        >
          <h1
            className="leading-[0.9] tracking-tighter uppercase mb-2"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(2.5rem, 10vw, 9rem)',
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(255,255,255,0.9)',
              textShadow: '0 0 60px rgba(164,108,252,0.25), 0 20px 40px rgba(41,30,86,0.5)',
              paintOrder: 'stroke fill',
            }}
          >
            Three Pillars.
          </h1>
          <h1
            className="leading-[0.9] tracking-tighter uppercase mb-6"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(2.5rem, 10vw, 9rem)',
              color: 'transparent',
              WebkitTextStroke: '1.5px var(--color-secondary)',
              textShadow: '0 0 80px rgba(164,108,252,0.45), 0 0 120px rgba(164,108,252,0.2)',
              paintOrder: 'stroke fill',
            }}
          >
            One Ecosystem.
          </h1>

          {/* Subheading */}
          <p
            className="text-sm sm:text-base text-white/55 tracking-wide max-w-md mx-auto"
            style={{ fontFamily: 'var(--font-stack-heading)', letterSpacing: '0.06em' }}
          >
            Three specialized pillars working together as one connected system.
          </p>
        </motion.div>

        {/* Drifting background word */}
        <motion.h1
          className="leading-[0.9] tracking-tighter uppercase mt-2 pointer-events-none"
          animate={{ x: [0, 12, 0], opacity: [0.06, 0.09, 0.06] }}
          transition={{ duration: 18, ease: 'easeInOut', repeat: Infinity }}
          style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(2.5rem, 10vw, 9rem)',
            color: 'var(--color-secondary)',
          }}
        >
          Connection
        </motion.h1>
      </motion.div>

      {/* Orbit layer */}
      <div className="absolute inset-0 z-20 overflow-visible pointer-events-none flex items-center justify-center">
        <div className="relative w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] md:w-[900px] md:h-[900px] flex items-center justify-center">
          <OrbitRingDecoration />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            {PILLARS.map((pillar, i) => (
              <OrbitNode
                key={i}
                item={pillar}
                index={i}
                total={PILLARS.length}
                onSelect={setSelectedService}
                phaseOffset={(i / PILLARS.length) * 2 * Math.PI + (orbitDeg * Math.PI / 180)}
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
    </section>
  );
}
