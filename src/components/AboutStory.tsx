import { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  Variants,
  AnimatePresence,
} from 'motion/react';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

const scaleInItem: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

const CAPABILITIES = [
  { tag: 'Strategy', desc: 'Brand positioning & market analysis' },
  { tag: 'Creative', desc: 'Visual storytelling & content creation' },
  { tag: 'Growth', desc: 'Performance marketing & scaling' },
  { tag: 'Social', desc: 'Community management & engagement' },
  { tag: 'Content', desc: 'Editorial planning & production' },
  { tag: 'Analytics', desc: 'Data-driven insights & optimization' },
];

const HOLOGRAM_STYLES = `
  @keyframes holoScanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(200%); }
  }
  @keyframes holoGlitch {
    0%, 93%, 100% { transform: translate(0, 0) skewX(0deg); opacity: 1; }
    93.5% { transform: translate(-8px, 2px) skewX(-2deg); opacity: 0.8; }
    94% { transform: translate(6px, -1px) skewX(1.5deg); opacity: 0.9; }
    94.5% { transform: translate(-3px, 0) skewX(0deg); opacity: 1; }
    95% { transform: translate(0, 3px) skewX(-0.5deg); opacity: 0.85; }
    95.5% { transform: translate(0, 0) skewX(0deg); opacity: 1; }
  }
  @keyframes holoBorderFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes holoFlicker {
    0%, 100% { opacity: 1; }
    41% { opacity: 1; }
    42% { opacity: 0.6; }
    43% { opacity: 1; }
    77% { opacity: 1; }
    77.5% { opacity: 0.7; }
    78% { opacity: 1; }
  }
  @keyframes holoDataStream {
    0% { background-position: 0 0; }
    100% { background-position: 0 -200px; }
  }
  @keyframes holoCornerPulse {
    0%, 100% { opacity: 0.4; box-shadow: 0 0 6px rgba(164,108,252,0.3); }
    50% { opacity: 1; box-shadow: 0 0 16px rgba(164,108,252,0.8), 0 0 30px rgba(164,108,252,0.3); }
  }
  @keyframes rgbShift {
    0%, 100% { text-shadow: -1px 0 #ff0040, 1px 0 #00d4ff; }
    25% { text-shadow: -2px 0 #ff0040, 2px 0 #00d4ff; }
    50% { text-shadow: 0 0 #ff0040, 0 0 #00d4ff; }
    75% { text-shadow: -1px 1px #ff0040, 1px -1px #00d4ff; }
  }
  @keyframes holoNoise {
    0% { transform: translate(0, 0); }
    10% { transform: translate(-1px, 1px); }
    20% { transform: translate(1px, -1px); }
    30% { transform: translate(-1px, 0); }
    40% { transform: translate(0, 1px); }
    50% { transform: translate(1px, 0); }
    60% { transform: translate(-1px, -1px); }
    70% { transform: translate(1px, 1px); }
    80% { transform: translate(0, -1px); }
    90% { transform: translate(-1px, 0); }
    100% { transform: translate(0, 0); }
  }
`;

function HologramContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  useEffect(() => {
    const triggerGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200 + Math.random() * 300);
    };
    const interval = setInterval(() => {
      if (Math.random() > 0.6) triggerGlitch();
    }, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  const chromaX = (mousePos.x - 0.5) * 6;
  const chromaY = (mousePos.y - 0.5) * 6;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
      style={{
        position: 'relative',
        animation: glitchActive ? 'holoGlitch 0.3s ease forwards' : undefined,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -3,
          padding: 3,
          background: 'linear-gradient(135deg, #a46cfc, #00d4ff, #ff0040, #a46cfc, #00d4ff)',
          backgroundSize: '400% 400%',
          animation: 'holoBorderFlow 6s ease infinite',
          zIndex: 0,
          clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))',
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          background: 'var(--color-background-light)',
          clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))',
        }} />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))',
          animation: 'holoFlicker 8s ease-in-out infinite',
          boxShadow: isHovered
            ? `0 0 30px rgba(164,108,252,0.4), 0 0 60px rgba(164,108,252,0.15), 0 0 100px rgba(0,212,255,0.1), inset 0 0 30px rgba(164,108,252,0.1)`
            : `0 0 20px rgba(164,108,252,0.2), 0 0 50px rgba(164,108,252,0.08)`,
          transition: 'box-shadow 0.4s ease',
        }}
      >
        <div style={{
          position: 'relative',
          filter: isHovered ? `drop-shadow(${chromaX}px ${chromaY}px 0 rgba(255,0,64,0.15)) drop-shadow(${-chromaX}px ${-chromaY}px 0 rgba(0,212,255,0.15))` : undefined,
          transition: 'filter 0.15s ease',
        }}>
          {children}
        </div>

        <div
          className="pointer-events-none"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(164,108,252,0.04) 2px, rgba(164,108,252,0.04) 4px)',
            mixBlendMode: 'screen',
          }}
        />

        <div
          className="pointer-events-none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '30%',
            top: 0,
            zIndex: 11,
            background: 'linear-gradient(180deg, rgba(164,108,252,0.12) 0%, transparent 100%)',
            animation: 'holoScanline 4s linear infinite',
          }}
        />

        <div
          className="pointer-events-none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '8%',
            top: 0,
            zIndex: 12,
            background: 'linear-gradient(180deg, rgba(0,212,255,0.08) 0%, transparent 100%)',
            animation: 'holoScanline 2.5s linear infinite',
            animationDelay: '-1.2s',
          }}
        />

        <div
          className="pointer-events-none"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 13,
            background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(164,108,252,0.12) 0%, transparent 50%)`,
            transition: isHovered ? 'none' : 'background 0.5s ease',
          }}
        />

        {glitchActive && (
          <>
            <div
              className="pointer-events-none"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 20,
                background: 'rgba(164,108,252,0.06)',
                animation: 'holoNoise 0.1s steps(5) infinite',
              }}
            />
            <div
              className="pointer-events-none"
              style={{
                position: 'absolute',
                top: `${Math.random() * 80}%`,
                left: 0,
                right: 0,
                height: `${5 + Math.random() * 15}%`,
                zIndex: 21,
                background: 'rgba(0,212,255,0.08)',
                transform: `translateX(${(Math.random() - 0.5) * 10}px)`,
              }}
            />
          </>
        )}

        {isHovered && (
          <div
            className="pointer-events-none"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 14,
              opacity: 0.03,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='0' y='10' font-size='8' fill='%23a46cfc' font-family='monospace'%3E01101%3C/text%3E%3Ctext x='0' y='25' font-size='8' fill='%23a46cfc' font-family='monospace'%3E10011%3C/text%3E%3Ctext x='0' y='40' font-size='8' fill='%23a46cfc' font-family='monospace'%3E11010%3C/text%3E%3Ctext x='0' y='55' font-size='8' fill='%23a46cfc' font-family='monospace'%3E00110%3C/text%3E%3C/svg%3E")`,
              animation: 'holoDataStream 3s linear infinite',
            }}
          />
        )}
      </div>

      {[
        { top: -1, left: -1 },
        { top: -1, right: -1 },
        { bottom: -1, left: -1 },
        { bottom: -1, right: -1 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            ...pos,
            width: 8,
            height: 8,
            border: '2px solid #a46cfc',
            zIndex: 5,
            animation: `holoCornerPulse ${2 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          } as React.CSSProperties}
        />
      ))}

      <motion.div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 15,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#00ff88',
            boxShadow: '0 0 8px #00ff88, 0 0 16px rgba(0,255,136,0.4)',
          }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span style={{
          fontSize: '0.5rem',
          fontFamily: 'monospace',
          color: 'rgba(164,108,252,0.6)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          animation: 'rgbShift 4s ease infinite',
        }}>
          LIVE
        </span>
      </motion.div>

      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          zIndex: 15,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 2,
        }}
      >
        {[0.6, 0.8, 0.4, 1, 0.7, 0.5, 0.9].map((h, i) => (
          <motion.div
            key={i}
            style={{
              width: 2,
              height: 12 * h,
              background: 'rgba(164,108,252,0.4)',
              display: 'inline-block',
            }}
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  );
}

function SectionBadge({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className="inline-block mb-10"
    >
      <div
        className="inline-flex items-center gap-2.5 px-4 py-1.5"
        style={{
          border: '1px solid rgba(164,108,252,0.15)',
          borderRadius: '100px',
          background: 'rgba(164,108,252,0.05)',
        }}
      >
        <motion.span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'var(--color-secondary)',
            display: 'inline-block',
            boxShadow: '0 0 8px rgba(164,108,252,0.5)',
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span
          className="text-[0.55rem] font-bold uppercase tracking-[0.3em]"
          style={{
            fontFamily: 'var(--font-stack-heading)',
            color: 'var(--color-surface-dark)',
          }}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCapability, setActiveCapability] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const contentParallax = useTransform(scrollYProgress, [0, 1], ['2%', '-2%']);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: 'var(--color-primary)',
        padding: 'clamp(6rem, 12vw, 12rem) clamp(1.5rem, 5vw, 3rem)',
      }}
    >
      <style>{HOLOGRAM_STYLES}</style>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, var(--color-primary) 0%, transparent 12%),
            linear-gradient(0deg, var(--color-primary) 0%, transparent 12%)
          `,
          zIndex: 1,
        }}
      />

      <motion.div
        className="relative z-10 w-full mx-auto flex flex-col items-center"
        style={{ y: contentParallax, maxWidth: '1300px' }}
      >
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <SectionBadge label="About Us" />

          <h2
            style={{
              fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)',
              fontFamily: 'var(--font-stack-heading)',
              color: 'var(--color-text-dark)',
              lineHeight: 1.05,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
              textAlign: 'center',
              margin: 0,
            }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
            >
              From Brand Voice
            </motion.span>
            <motion.span
              className="block mt-1"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.12, ease: EASE_OUT_EXPO }}
            >
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--color-surface-dark)' }}>
                To Human
              </span>{' '}
              Connection
            </motion.span>
          </h2>
        </div>

        <motion.div
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div className="lg:col-span-5" variants={fadeUpItem}>
            <HologramContainer>
              <div style={{ position: 'relative' }}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full object-cover"
                  style={{ aspectRatio: '4 / 5', display: 'block' }}
                  src="https://ik.imagekit.io/qcvroy8xpd/Shannon_s_Space_Video_Creation.mp4"
                />
                <div
                  className="pointer-events-none"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `
                      linear-gradient(180deg, rgba(14,11,31,0.3) 0%, transparent 25%),
                      linear-gradient(180deg, transparent 70%, rgba(14,11,31,0.5) 100%)
                    `,
                  }}
                />
              </div>
            </HologramContainer>
          </motion.div>

          <motion.div
            className="lg:col-span-7 flex flex-col justify-center"
            variants={fadeUpItem}
          >
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT_EXPO }}
            >
              <span
                className="inline-block mb-6"
                style={{
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(164,108,252,0.6)',
                  fontFamily: 'var(--font-stack-heading)',
                }}
              >
                Our Story
              </span>

              <p
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.05rem, 1.6vw, 1.2rem)',
                  lineHeight: 1.75,
                  color: 'rgba(232,226,255,0.55)',
                  marginBottom: '1.5rem',
                }}
              >
                We started with a simple belief: the most impactful brands don't just
                broadcast -- they connect. In a world saturated with noise, people
                gravitate toward brands that feel human, speak with personality, and
                offer something genuinely meaningful.
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.05rem, 1.6vw, 1.2rem)',
                  lineHeight: 1.75,
                  color: 'rgba(232,226,255,0.55)',
                  marginBottom: '1.5rem',
                }}
              >
                That's why we built a social-first agency grounded in insight and
                efficiency -- helping brands grow by making every digital touchpoint
                feel real and every interaction count.
              </p>

              <p
                className="font-semibold"
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.05rem, 1.6vw, 1.2rem)',
                  lineHeight: 1.75,
                  color: 'var(--color-text-dark)',
                  marginBottom: '2.5rem',
                }}
              >
                We combine strategy, creative, and data to build brand ecosystems
                that work -- across every platform and stage of growth.
              </p>

              <motion.div
                className="h-px mb-8"
                style={{ background: 'rgba(164,108,252,0.2)', transformOrigin: 'left' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease: EASE_OUT_EXPO }}
              />

            </motion.div>
          </motion.div>
        </motion.div>

        <div className="w-full mt-16 md:mt-24">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.tag}
                variants={scaleInItem}
                onHoverStart={() => setActiveCapability(i)}
                onHoverEnd={() => setActiveCapability(null)}
                className="relative px-4 py-4 cursor-default transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{
                  border: '2px solid var(--color-surface-dark)',
                  background: activeCapability === i
                    ? 'rgba(164,108,252,0.08)'
                    : 'var(--color-background-light)',
                  boxShadow: activeCapability === i
                    ? 'var(--shadow-geometric-hover)'
                    : '6px 6px 0 var(--color-secondary)',
                  transition: 'background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
                }}
              >
                <span
                  className="block text-[0.7rem] font-semibold uppercase tracking-[0.15em]"
                  style={{
                    fontFamily: 'var(--font-stack-heading)',
                    color: activeCapability === i ? 'var(--color-text-dark)' : 'rgba(232,226,255,0.5)',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {cap.tag}
                </span>
                <AnimatePresence>
                  {activeCapability === i && (
                    <motion.span
                      className="block mt-1.5 text-[0.65rem]"
                      style={{
                        color: 'rgba(232,226,255,0.4)',
                        fontFamily: 'var(--font-stack-body)',
                        lineHeight: 1.4,
                      }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {cap.desc}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
