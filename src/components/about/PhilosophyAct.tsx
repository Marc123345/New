import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { Sparkles, Heart, Globe } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

interface MousePos {
  x: number;
  y: number;
}

interface PhilosophyCard {
  subtitle: string;
  headline: string;
  body: string;
  icon: React.ReactNode;
  accent: {
    from: string;
    to: string;
    light: string;
    border: string;
    dot: string;
  };
  delay: number;
}

const CARDS: PhilosophyCard[] = [
  {
    subtitle: '01 — Polish',
    headline: 'Perfect, polished campaigns.',
    body: 'We take craft seriously. Every pixel, every word, every touchpoint built with intention and precision.',
    icon: <Sparkles size={22} />,
    accent: {
      from: '#291e56',
      to: '#4a2d8a',
      light: 'rgba(164,108,252,0.1)',
      border: 'rgba(164,108,252,0.25)',
      dot: '#a46cfc',
    },
    delay: 0,
  },
  {
    subtitle: '02 — Humanity',
    headline: 'But people want more than that.',
    body: 'They want personality. They want to see and hear brands that speak like humans and offer something meaningful.',
    icon: <Heart size={22} />,
    accent: {
      from: '#3d2670',
      to: '#6b3fbc',
      light: 'rgba(164,108,252,0.15)',
      border: 'rgba(164,108,252,0.4)',
      dot: '#c084fc',
    },
    delay: 0.1,
  },
  {
    subtitle: '03 — Social-First',
    headline: 'H2H is built to bridge the gap.',
    body: 'A social-first agency that helps brands grow by making their digital presence feel more human — thoughtful, strategic, and real.',
    icon: <Globe size={22} />,
    accent: {
      from: '#4a2d8a',
      to: '#a46cfc',
      light: 'rgba(177,129,252,0.15)',
      border: 'rgba(177,129,252,0.45)',
      dot: '#b181fc',
    },
    delay: 0.2,
  },
];

function SectionBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className="inline-block mb-8"
    >
      <div className="inline-flex items-center gap-4 px-5 py-2 border border-white/20 bg-white/5 backdrop-blur-sm">
        <motion.div
          className="w-1.5 h-1.5 bg-[#a46cfc]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-white">
          Our Philosophy
        </span>
      </div>
    </motion.div>
  );
}

function PhilosophyCardItem({ card }: { card: PhilosophyCard }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-10%' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, delay: card.delay, ease: EASE_OUT_EXPO }}
      className="group relative w-full overflow-hidden backdrop-blur-sm border-2 transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1"
      style={{
        background: 'rgba(41,30,86,0.55)',
        borderColor: card.accent.border,
        boxShadow: `4px 4px 0px ${card.accent.dot}55`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `8px 8px 0px ${card.accent.dot}88`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `4px 4px 0px ${card.accent.dot}55`;
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${card.accent.light}, transparent 70%)`,
        }}
      />

      <div className="relative z-10 p-6 md:p-10 flex flex-col sm:flex-row items-start gap-6 md:gap-10">
        <div className="flex-shrink-0">
          <div
            className="w-14 h-14 flex items-center justify-center border-2 text-white"
            style={{
              background: `linear-gradient(135deg, ${card.accent.from}, ${card.accent.to})`,
              borderColor: card.accent.dot,
              boxShadow: `3px 3px 0px ${card.accent.dot}66`,
            }}
          >
            {card.icon}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="text-[0.6rem] font-bold uppercase tracking-[0.3em] mb-3 flex items-center gap-3"
            style={{ color: card.accent.dot }}
          >
            <span
              className="h-px w-8 flex-shrink-0"
              style={{ backgroundColor: card.accent.dot }}
            />
            {card.subtitle}
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
            {card.headline}
          </h3>

          <p className="text-sm md:text-base leading-relaxed" style={{ color: 'rgba(226,221,240,0.65)' }}>
            {card.body}
          </p>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-[2px] pointer-events-none"
        initial={{ width: '0%' }}
        animate={isInView ? { width: '100%' } : { width: '0%' }}
        transition={{ duration: 1.1, delay: card.delay + 0.3, ease: EASE_OUT_EXPO }}
        style={{ background: `linear-gradient(to right, ${card.accent.from}, ${card.accent.to})` }}
      />
    </motion.div>
  );
}

export function PhilosophyAct() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const rafRef = useRef<number>(0);
  const smoothMouseRef = useRef<MousePos>({ x: -9999, y: -9999 });
  const targetMouseRef = useRef<MousePos>({ x: -9999, y: -9999 });
  const [displayMouse, setDisplayMouse] = useState<MousePos>({ x: -9999, y: -9999 });

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animateSmooth = useCallback(() => {
    const sm = smoothMouseRef.current;
    const tg = targetMouseRef.current;
    const newX = lerp(sm.x, tg.x, 0.08);
    const newY = lerp(sm.y, tg.y, 0.08);
    smoothMouseRef.current = { x: newX, y: newY };
    setDisplayMouse({ x: newX, y: newY });
    rafRef.current = requestAnimationFrame(animateSmooth);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animateSmooth);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animateSmooth]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    targetMouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    targetMouseRef.current = { x: -9999, y: -9999 };
    smoothMouseRef.current = { x: -9999, y: -9999 };
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.5], ['0%', '100%']);

  const glowX = displayMouse.x === -9999 ? '50%' : `${displayMouse.x}px`;
  const glowY = displayMouse.y === -9999 ? '50%' : `${displayMouse.y}px`;

  return (
    <div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-24 md:py-40 overflow-hidden"
      style={{ background: '#0e0820' }}
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ opacity: 0.35 }}
        >
          <source src="https://ik.imagekit.io/qcvroy8xpd/space-shuttle-and-astronut-in-space-2026-01-28-02-50-17-utc.mp4?updatedAt=1771174796925" type="video/mp4" />
        </video>
        {/* Purple overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(88, 28, 135, 0.45)' }}
        />
        {/* Dark gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0820]/70 via-transparent to-[#0e0820]/80" />
      </div>

      {/* Grid lines — from HookAct */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '3.5rem 3.5rem',
        }}
      />

      {/* Radial purple bloom */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(147,51,234,0.18) 0%, transparent 60%)`,
        }}
      />

      {/* Cursor glow — from HookAct */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0.3,
          background: `radial-gradient(circle 420px at ${glowX} ${glowY}, rgba(164,108,252,0.22) 0%, rgba(100,60,200,0.08) 40%, transparent 70%)`,
        }}
      />

      {/* Scan line animation */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] z-[2] pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(164,108,252,0.4), transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Corner decorative — top right ping dot (from OrbitalAct) */}
      <div className="absolute top-10 right-10 z-[3] pointer-events-none">
        <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full animate-ping" />
        </div>
      </div>

      {/* Corner decorative — bottom left label (from OrbitalAct) */}
      <div className="absolute bottom-10 left-10 z-[3] flex items-center gap-4 pointer-events-none">
        <div className="h-[1px] w-20 bg-white/30" />
        <span className="text-[10px] text-white/50 uppercase tracking-[0.3em]">Philosophy.Active</span>
      </div>

      {/* Content */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div>
            <SectionBadge />
            <motion.h2
              className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold text-white uppercase tracking-[-0.04em] leading-[1.05]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE_OUT_EXPO }}
            >
              Structure
              <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: '1.5px rgba(164,108,252,0.7)' }}
              >
                & Soul
              </span>
            </motion.h2>
          </div>

          <motion.p
            className="max-w-xs text-sm md:text-base leading-relaxed"
            style={{ color: 'rgba(226,221,240,0.5)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT_EXPO }}
          >
            The collision between perfection and personality — where campaigns meet character.
          </motion.p>
        </div>

        <div className="relative flex flex-col gap-4 md:gap-5">
          <div className="absolute left-0 top-0 bottom-0 w-px hidden md:block overflow-hidden" style={{ left: '-1.5rem' }}>
            <motion.div
              className="w-full"
              style={{
                height: lineHeight,
                background: 'linear-gradient(to bottom, var(--color-secondary, #a46cfc), rgba(164,108,252,0.08))',
              }}
            />
          </div>

          {CARDS.map((card) => (
            <PhilosophyCardItem key={card.subtitle} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
