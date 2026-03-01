import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'motion/react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

interface MousePos {
  x: number;
  y: number;
}

function SectionBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className="inline-block mb-10"
    >
      <div className="inline-flex items-center gap-4 px-5 py-2 border border-white/20 bg-white/5 backdrop-blur-sm">
        <motion.div
          className="w-1.5 h-1.5 bg-[var(--color-secondary,#a46cfc)]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-white">
          About Us
        </span>
      </div>
    </motion.div>
  );
}

export function HookAct() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<MousePos>({ x: -9999, y: -9999 });
  const [isHovering, setIsHovering] = useState(false);
  const [connectionWarm, setConnectionWarm] = useState(false);
  const isInView = useInView(sectionRef, { once: false, margin: '-10%' });
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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    targetMouseRef.current = { x, y };
    setMouse({ x, y });
    setIsHovering(true);

    const connectionEl = document.getElementById('connection-word');
    if (connectionEl) {
      const cRect = connectionEl.getBoundingClientRect();
      const cx = cRect.left + cRect.width / 2 - rect.left;
      const cy = cRect.top + cRect.height / 2 - rect.top;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      setConnectionWarm(dist < 180);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setConnectionWarm(false);
    targetMouseRef.current = { x: -9999, y: -9999 };
    smoothMouseRef.current = { x: -9999, y: -9999 };
  };

  const glowOpacity = isHovering ? 1 : isInView ? 0.3 : 0;
  const glowX = displayMouse.x === -9999 ? '50%' : `${displayMouse.x}px`;
  const glowY = displayMouse.y === -9999 ? '50%' : `${displayMouse.y}px`;

  return (
    <div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden cursor-none select-none"
      style={{ background: '#030303' }}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '3.5rem 3.5rem',
        }}
      />

      <div
        className="absolute inset-0 z-1 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(circle 420px at ${glowX} ${glowY}, rgba(164,108,252,0.22) 0%, rgba(100,60,200,0.08) 40%, transparent 70%)`,
        }}
      />

      {isHovering && (
        <motion.div
          className="absolute z-20 pointer-events-none"
          style={{
            left: displayMouse.x,
            top: displayMouse.y,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <div
            className="w-5 h-5 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(164,108,252,0.9) 0%, rgba(164,108,252,0.2) 60%, transparent 100%)',
              boxShadow: '0 0 20px rgba(164,108,252,0.6)',
            }}
          />
        </motion.div>
      )}

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-12 flex flex-col items-center text-center py-32 md:py-40">
        <SectionBadge />

        <motion.div
          className="mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE_OUT_EXPO }}
        >
          <h2 className="text-[clamp(2.8rem,7vw,6rem)] leading-[1.02] font-extrabold uppercase tracking-[-0.04em]">
            <motion.span
              className="block text-white"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE_OUT_EXPO }}
            >
              From Brand Voice
            </motion.span>

            <motion.span
              className="block mt-2"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.12, ease: EASE_OUT_EXPO }}
            >
              <span
                className="text-transparent mr-3"
                style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.5)' }}
              >
                To Human
              </span>
              <motion.span
                id="connection-word"
                className="inline-block relative"
                animate={{
                  color: connectionWarm ? '#a46cfc' : '#ffffff',
                  textShadow: connectionWarm
                    ? '0 0 40px rgba(164,108,252,0.8), 0 0 80px rgba(164,108,252,0.4)'
                    : '0 0 0px rgba(164,108,252,0)',
                  fontStyle: connectionWarm ? 'italic' : 'normal',
                }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                Connection
              </motion.span>
            </motion.span>
          </h2>
        </motion.div>

        <motion.p
          className="max-w-2xl text-lg md:text-xl leading-relaxed"
          style={{ color: 'rgba(226,221,240,0.75)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE_OUT_EXPO }}
        >
          At H2H we believe the most impactful brands are the ones that know how
          to connect, not just communicate.
        </motion.p>

        {!isHovering && (
          <motion.div
            className="mt-14 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <span className="text-[0.6rem] uppercase tracking-[0.3em] text-white/30 font-mono">
              Move your cursor
            </span>
            <motion.div
              className="w-px h-8"
              style={{ background: 'linear-gradient(to bottom, rgba(164,108,252,0.6), transparent)' }}
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, #030303)',
        }}
      />
    </div>
  );
}
