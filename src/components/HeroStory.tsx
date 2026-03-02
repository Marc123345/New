import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  MotionValue,
} from 'motion/react';

interface Chapter {
  subtitle: string;
  title: string;
  description: string;
  accent?: string;
  progressRange: [number, number, number, number];
}

const chapters: Chapter[] = [
  {
    subtitle: 'View of Africa at Night (Current)',
    title: 'The Digital Era',
    description:
      'Data networks connect fiber cable and satellite links. Businesses started moving online, but real connection remained scarce.',
    accent: 'c. 2010s',
    progressRange: [0, 0.08, 0.25, 0.33],
  },
  {
    subtitle: 'The Next Evolution',
    title: 'The AI Era',
    description:
      'Artificial intelligence transforms industries and connectivity. New nodes light up as automation takes over, but humanity gets lost in the noise.',
    accent: 'c. 2020s–Present',
    progressRange: [0.33, 0.41, 0.55, 0.66],
  },
  {
    subtitle: 'Full Illumination',
    title: 'The H2H Difference',
    description:
      'When Human Collaboration meets Digital & AI Foundations. A United, Illuminated Continent. We bring the human energy back.',
    progressRange: [0.66, 0.74, 1, 1],
  },
];

const NAV_CHAPTERS = [
  { label: 'The Old Way', bg: '#0a0a0a' },
  { label: 'The Digital Era', bg: '#0d0315' },
  { label: 'The AI Era', bg: '#050505' },
  { label: 'The H2H Difference', bg: '#0d0315' },
];

function StoryText({
  chapter,
  scrollYProgress,
}: {
  chapter: Chapter;
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(scrollYProgress, chapter.progressRange, [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, chapter.progressRange, [40, 0, 0, -40]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center px-8 md:px-14"
      style={{ opacity, y, pointerEvents: 'none' }}
    >
      {chapter.accent && (
        <span
          className="block mb-3 text-[0.55rem] font-bold uppercase tracking-[0.3em]"
          style={{ color: 'rgba(164,108,252,0.7)', fontFamily: 'var(--font-stack-heading)' }}
        >
          {chapter.accent}
        </span>
      )}
      <span
        className="block mb-4 text-xs uppercase tracking-widest font-semibold"
        style={{ color: 'rgba(164,108,252,0.5)', fontFamily: 'var(--font-stack-heading)' }}
      >
        {chapter.subtitle}
      </span>
      <div
        style={{ width: 40, height: 2, background: 'rgba(164,108,252,0.6)', marginBottom: '1.5rem' }}
      />
      <h2
        className="uppercase"
        style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: 'clamp(2rem, 5vw, 4.5rem)',
          fontWeight: 900,
          lineHeight: 0.95,
          color: 'transparent',
          WebkitTextStroke: '2px #ffffff',
          letterSpacing: '-0.03em',
          marginBottom: '1.5rem',
        }}
      >
        {chapter.title}
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-stack-body)',
          fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
          lineHeight: 1.8,
          color: 'rgba(255,255,255,0.75)',
          maxWidth: '36ch',
        }}
      >
        {chapter.description}
      </p>
    </motion.div>
  );
}

function GlobeGlow({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const glow1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.5], [0.1, 0.22, 0.45]);
  const glow2Opacity = useTransform(scrollYProgress, [0.2, 0.4, 0.66], [0, 0.28, 0.52]);
  const glow3Opacity = useTransform(scrollYProgress, [0.5, 0.75, 1], [0, 0.28, 0.72]);
  const glow3Scale = useTransform(scrollYProgress, [0.5, 1], [0.7, 1.15]);
  const nodeOpacity = useTransform(scrollYProgress, [0.3, 0.52, 0.66], [0, 1, 0.85]);

  const nodes = [
    { top: '38%', left: '47%' },
    { top: '52%', left: '44%' },
    { top: '44%', left: '55%' },
    { top: '60%', left: '50%' },
    { top: '35%', left: '52%' },
    { top: '56%', left: '40%' },
    { top: '47%', left: '58%' },
    { top: '63%', left: '46%' },
  ];

  return (
    <>
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: '22%',
          left: '28%',
          width: '44%',
          height: '52%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(164,108,252,0.55) 0%, rgba(120,60,220,0.15) 50%, transparent 75%)',
          filter: 'blur(30px)',
          opacity: glow1Opacity,
          zIndex: 2,
        }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: '30%',
          left: '32%',
          width: '36%',
          height: '42%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(180,120,255,0.62) 0%, rgba(140,80,240,0.2) 55%, transparent 80%)',
          filter: 'blur(18px)',
          opacity: glow2Opacity,
          zIndex: 3,
        }}
      />
      {nodes.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: pos.top,
            left: pos.left,
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: 'rgba(210,170,255,0.95)',
            boxShadow: '0 0 14px 5px rgba(164,108,252,0.75)',
            opacity: nodeOpacity,
            zIndex: 4,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: '18%',
          left: '24%',
          width: '52%',
          height: '62%',
          borderRadius: '50%',
          background:
            'radial-gradient(ellipse, rgba(180,100,255,0.78) 0%, rgba(164,108,252,0.35) 45%, transparent 72%)',
          filter: 'blur(10px)',
          opacity: glow3Opacity,
          scale: glow3Scale,
          zIndex: 5,
        }}
      />
    </>
  );
}

function NavDots({
  activeSection,
  onNavClick,
}: {
  activeSection: number;
  onNavClick: (i: number) => void;
}) {
  return (
    <div className="absolute right-4 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-3">
      {NAV_CHAPTERS.map((ch, index) => (
        <button
          key={index}
          onClick={() => onNavClick(index)}
          className="relative w-[6px] h-10 rounded-full overflow-hidden transition-all duration-300 hover:scale-x-150 cursor-pointer"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          aria-label={`Go to section ${index + 1}`}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-500"
            style={{
              height: activeSection >= index ? '100%' : '0%',
              opacity: activeSection >= index ? 1 : 0.3,
              background: 'var(--color-secondary)',
            }}
          />
        </button>
      ))}
    </div>
  );
}

export function HeroStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.1,
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const newActive = Math.min(Math.floor(latest * 4), 3);
    if (newActive !== activeSection) setActiveSection(newActive);
  });

  const handleNavClick = (index: number) => {
    if (!containerRef.current) return;
    const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
    const containerTop =
      containerRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: containerTop + (index / 4) * totalScrollable + 10,
      behavior: 'smooth',
    });
  };

  const globeScale = useTransform(smoothProgress, [0, 1], [0.9, 1.06]);
  const globeOpacity = useTransform(smoothProgress, [0, 0.05], [0.65, 1]);

  const bgOpacity = useTransform(smoothProgress, [0, 0.33, 0.66, 1], [0.65, 0.7, 0.75, 0.85]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: '400vh', background: '#000' }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(160deg, #06030f 0%, #0e0820 30%, #080318 70%, #030108 100%)',
            opacity: bgOpacity,
            zIndex: 0,
          }}
        />

        <div className="relative w-full h-full flex flex-col md:flex-row" style={{ zIndex: 5 }}>
          <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex items-center">
            {chapters.map((ch, i) => (
              <StoryText key={i} chapter={ch} scrollYProgress={smoothProgress} />
            ))}
          </div>

          <div className="absolute inset-0 md:relative md:w-1/2 h-full flex items-center justify-center pointer-events-none">
            <motion.div
              className="relative"
              style={{
                scale: globeScale,
                opacity: globeOpacity,
                width: 'clamp(280px, 42vw, 580px)',
                aspectRatio: '1',
              }}
            >
              <img
                src="https://ik.imagekit.io/qcvroy8xpd/Planet.png"
                alt="Globe"
                className="w-full h-full object-contain"
                style={{ display: 'block', position: 'relative', zIndex: 1 }}
                loading="lazy"
              />
              <div className="absolute inset-0" style={{ zIndex: 2 }}>
                <GlobeGlow scrollYProgress={smoothProgress} />
              </div>
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  zIndex: 6,
                  background:
                    'radial-gradient(ellipse at 60% 40%, transparent 50%, rgba(6,3,15,0.6) 80%, rgba(6,3,15,0.95) 100%)',
                }}
              />
            </motion.div>

            <div
              className="absolute pointer-events-none"
              style={{
                width: 'clamp(320px, 48vw, 660px)',
                aspectRatio: '1',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(164,108,252,0.07) 0%, transparent 70%)',
                filter: 'blur(32px)',
                zIndex: 0,
              }}
            />
          </div>
        </div>

        <NavDots activeSection={activeSection} onNavClick={handleNavClick} />

        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', zIndex: 20 }}
        >
          <motion.div
            className="h-full"
            style={{
              background: 'linear-gradient(90deg, rgba(164,108,252,0.6), rgba(164,108,252,1))',
              scaleX: smoothProgress,
              transformOrigin: 'left',
            }}
          />
        </div>
      </div>
    </div>
  );
}
