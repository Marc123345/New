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
    <div
      className="inline-block px-4 py-2 mb-6"
      style={{
        border: '2px solid var(--color-secondary, #a46cfc)',
        boxShadow: '4px 4px 0 var(--color-secondary, #a46cfc)',
      }}
    >
      <span
        className="text-xs font-bold uppercase tracking-[0.3em]"
        style={{
          color: 'var(--color-secondary, #a46cfc)',
          fontFamily: 'var(--font-stack-heading)',
        }}
      >
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
            <span
              className="text-3xl md:text-4xl font-black tracking-tight"
              style={{ color: 'var(--color-secondary, #a46cfc)' }}
            >{stat.value}</span>
            <span className="text-[0.6rem] uppercase tracking-[0.25em] text-white/50 font-mono">{stat.label}</span>
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
          <div className="w-12 h-px mx-auto mb-4" style={{ background: 'rgba(164,108,252,0.5)' }} />
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
          className="inline-flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300"
          style={{
            border: '2px solid #fbfbfc',
            background: 'transparent',
            color: '#fbfbfc',
            boxShadow: '4px 4px 0 rgba(164,108,252,0.7)',
          }}
          whileHover={{
            x: -2,
            y: -2,
            boxShadow: '6px 6px 0 #a46cfc',
          }}
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
  const videoOpacity = useTransform(smoothProgress, [0, 0.05, 0.95, 1], [0.8, 0.95, 0.95, 0.8]);

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
              src="https://ik.imagekit.io/qcvroy8xpd/envato_video_gen_Mar_01_2026_13_47_54.mp4"
              type="video/mp4"
            />
          </motion.video>

          {/* Purple dark overlay */}
          <div className="absolute inset-0 bg-[#0d0618]/70 pointer-events-none" />
          {/* Top vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />
          {/* Radial vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)] pointer-events-none" />
        </motion.div>

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
          style={{ background: 'linear-gradient(to right, transparent, rgba(164,108,252,0.25), transparent)' }}
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
            background: 'linear-gradient(to right, var(--color-primary, #291e56), var(--color-secondary, #a46cfc))',
          }}
        />

        {/* Corner UI — top right */}
        <div className="absolute top-10 right-10 z-20 pointer-events-none">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: '1px solid rgba(164,108,252,0.3)' }}>
            <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: 'var(--color-secondary, #a46cfc)' }} />
          </div>
        </div>

        {/* Corner UI — bottom left */}
        <div className="absolute bottom-10 left-10 z-20 flex items-center gap-4 pointer-events-none">
          <div className="h-px w-16" style={{ background: 'rgba(164,108,252,0.35)' }} />
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono" style={{ color: 'rgba(164,108,252,0.5)' }}>Partner.Effect</span>
        </div>

        {/* Scroll hint (only at start) */}
        <motion.div
          style={{ opacity: useTransform(smoothProgress, [0, 0.08], [1, 0]) }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[0.55rem] uppercase tracking-[0.3em] text-white/30 font-mono">Scroll to explore</span>
          <motion.div
            className="w-px h-8"
            style={{ background: 'linear-gradient(to bottom, rgba(164,108,252,0.6), transparent)' }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
