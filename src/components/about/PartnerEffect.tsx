import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

interface MousePos {
  x: number;
  y: number;
}

const CHAPTERS = [
  {
    id: 'opening',
    badge: '01 — Partnership',
    headline: ["You don't hire H2H.", 'You work with H2H.'],
    body: null,
  },
  {
    id: 'dayinlife',
    badge: '02 — Adaptability',
    headline: null,
    body: 'Embedded across industries. Fluent in every brand voice. We move at your pace, match your ambition, and show up like a team member — not a vendor.',
    stats: [
      { value: '50+', label: 'Active Clients' },
      { value: '12+', label: 'Industries Served' },
      { value: '360°', label: 'Brand Coverage' },
    ],
  },
  {
    id: 'humanity',
    badge: '03 — Culture',
    quote: '"Real conversations. Real creative. Real results — with people who genuinely care about your brand."',
  },
  {
    id: 'closing',
    badge: '04 — Process',
    closing: ['Because at H2H,', 'partnership isn\'t a promise —', 'it\'s our process.'],
  },
];

function SectionBadge({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-4 px-5 py-2 border border-white/20 bg-black/30 backdrop-blur-sm mb-6">
      <motion.div
        className="w-1.5 h-1.5 bg-white"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/70">
        {label}
      </span>
    </div>
  );
}

function OpeningChapter({ progress }: { progress: any }) {
  const opacity = useTransform(progress, [0, 0.08, 0.18, 0.25], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, 0.08, 0.18, 0.25], [60, 0, 0, -40]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
    >
      <SectionBadge label="01 — Partnership" />
      <h2 className="text-[clamp(2.6rem,6.5vw,5.5rem)] font-extrabold uppercase tracking-[-0.04em] leading-[1.02] text-white">
        <span className="block">You don&apos;t hire H2H.</span>
        <span
          className="block mt-2 text-transparent"
          style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.6)' }}
        >
          You work with H2H.
        </span>
      </h2>
    </motion.div>
  );
}

function DayInLifeChapter({ progress }: { progress: any }) {
  const opacity = useTransform(progress, [0.22, 0.3, 0.42, 0.5], [0, 1, 1, 0]);
  const y = useTransform(progress, [0.22, 0.3, 0.42, 0.5], [50, 0, 0, -40]);

  const stats = [
    { value: '50+', label: 'Active Clients' },
    { value: '12+', label: 'Industries Served' },
    { value: '360°', label: 'Brand Coverage' },
  ];

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
    >
      <SectionBadge label="02 — Adaptability" />
      <p className="max-w-xl text-lg md:text-xl leading-relaxed text-white/80 mb-10">
        Embedded across industries. Fluent in every brand voice. We move at your pace, match your ambition, and show up like a team member — not a vendor.
      </p>
      <div className="flex items-center gap-8 md:gap-16">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: EASE_OUT_EXPO }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-3xl md:text-4xl font-black text-white tracking-tight">{stat.value}</span>
            <span className="text-[0.6rem] uppercase tracking-[0.25em] text-white/40 font-mono">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function HumanityChapter({ progress }: { progress: any }) {
  const opacity = useTransform(progress, [0.47, 0.55, 0.67, 0.75], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0.47, 0.55, 0.67, 0.75], [0.94, 1, 1, 0.96]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
    >
      <SectionBadge label="03 — Culture" />
      <blockquote className="max-w-2xl">
        <p className="text-[clamp(1.4rem,3.5vw,2.4rem)] font-light italic leading-[1.4] text-white/90">
          &ldquo;Real conversations. Real creative. Real results — with people who genuinely care about your brand.&rdquo;
        </p>
        <footer className="mt-6">
          <div className="w-12 h-px bg-white/30 mx-auto mb-4" />
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-white/40 font-mono">The H2H Way</span>
        </footer>
      </blockquote>
    </motion.div>
  );
}

function ClosingChapter({ progress }: { progress: any }) {
  const opacity = useTransform(progress, [0.72, 0.8, 1], [0, 1, 1]);
  const y = useTransform(progress, [0.72, 0.8, 1], [50, 0, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none"
    >
      <SectionBadge label="04 — Process" />
      <h2 className="text-[clamp(2rem,5vw,4.2rem)] font-extrabold uppercase tracking-[-0.04em] leading-[1.06] text-white mb-8">
        <span className="block">Because at H2H,</span>
        <span
          className="block mt-1 text-transparent"
          style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.5)' }}
        >
          partnership isn&apos;t a promise —
        </span>
        <span className="block mt-1">it&apos;s our process.</span>
      </h2>
      <div className="pointer-events-auto">
        <motion.a
          href="#contact"
          className="inline-flex items-center gap-3 px-8 py-4 border border-white/30 bg-white/5 backdrop-blur-sm text-white text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white hover:text-black"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Work With Us
          <span className="w-4 h-px bg-current inline-block" />
        </motion.a>
      </div>
    </motion.div>
  );
}

export function PartnerEffect() {
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
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 25, stiffness: 80 });

  const videoScale = useTransform(smoothProgress, [0, 1], [1, 1.08]);
  const videoOpacity = useTransform(smoothProgress, [0, 0.05, 0.95, 1], [0.6, 0.75, 0.75, 0.6]);

  const glowX = displayMouse.x === -9999 ? '50%' : `${displayMouse.x}px`;
  const glowY = displayMouse.y === -9999 ? '50%' : `${displayMouse.y}px`;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full"
      style={{ height: '500vh', background: '#030303' }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100vh' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background video */}
        <motion.div
          style={{ scale: videoScale }}
          className="absolute inset-0 z-0 pointer-events-none origin-center"
        >
          <motion.video
            autoPlay
            loop
            muted
            playsInline
            style={{ opacity: videoOpacity }}
            className="w-full h-full object-cover"
          >
            <source
              src="https://ik.imagekit.io/qcvroy8xpd/envato_video%20_gen_Mar_01_2026_13_47_54.mp4"
              type="video/mp4"
            />
          </motion.video>

          {/* Top vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70 pointer-events-none" />
          {/* Radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.55)_100%)] pointer-events-none" />
        </motion.div>

        {/* Grid texture */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '3.5rem 3.5rem',
          }}
        />

        {/* Cursor glow */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none transition-opacity duration-500"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(circle 380px at ${glowX} ${glowY}, rgba(255,255,255,0.06) 0%, transparent 70%)`,
          }}
        />

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-[1px] z-[2] pointer-events-none"
          style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)' }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />

        {/* Chapters */}
        <div className="absolute inset-0 z-10">
          <OpeningChapter progress={smoothProgress} />
          <DayInLifeChapter progress={smoothProgress} />
          <HumanityChapter progress={smoothProgress} />
          <ClosingChapter progress={smoothProgress} />
        </div>

        {/* Scroll progress bar */}
        <motion.div
          className="absolute left-0 bottom-0 h-[2px] z-20 pointer-events-none"
          style={{
            width: useTransform(smoothProgress, [0, 1], ['0%', '100%']),
            background: 'linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.6))',
          }}
        />

        {/* Corner UI — top right */}
        <div className="absolute top-10 right-10 z-20 pointer-events-none">
          <div className="w-10 h-10 border border-white/15 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
          </div>
        </div>

        {/* Corner UI — bottom left */}
        <div className="absolute bottom-10 left-10 z-20 flex items-center gap-4 pointer-events-none">
          <div className="h-px w-16 bg-white/25" />
          <span className="text-[10px] text-white/35 uppercase tracking-[0.3em] font-mono">Partner.Effect</span>
        </div>

        {/* Scroll hint (only at start) */}
        <motion.div
          style={{ opacity: useTransform(smoothProgress, [0, 0.08], [1, 0]) }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[0.55rem] uppercase tracking-[0.3em] text-white/30 font-mono">Scroll to explore</span>
          <motion.div
            className="w-px h-8"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
