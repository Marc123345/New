import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Globe, ChevronLeft, ChevronRight } from 'lucide-react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

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
}

const CARDS: PhilosophyCard[] = [
  {
    subtitle: '01 — Polish',
    headline: 'Perfect, polished campaigns.',
    body: 'We take craft seriously. Every pixel, every word, every touchpoint built with intention and precision.',
    icon: <Sparkles size={22} />,
    accent: {
      from: '#374151',
      to: '#6b7280',
      light: 'rgba(156,163,175,0.12)',
      border: 'rgba(156,163,175,0.3)',
      dot: '#d1d5db',
    },
  },
  {
    subtitle: '02 — Humanity',
    headline: 'But people want more than that.',
    body: 'They want personality. They want to see and hear brands that speak like humans and offer something meaningful.',
    icon: <Heart size={22} />,
    accent: {
      from: '#6b21a8',
      to: '#9333ea',
      light: 'rgba(147,51,234,0.15)',
      border: 'rgba(147,51,234,0.4)',
      dot: '#c084fc',
    },
  },
  {
    subtitle: '03 — Social-First',
    headline: 'H2H is built to bridge the gap.',
    body: 'A social-first agency that helps brands grow by making their digital presence feel more human — thoughtful, strategic, and real.',
    icon: <Globe size={22} />,
    accent: {
      from: '#5b21b6',
      to: '#a855f7',
      light: 'rgba(168,85,247,0.15)',
      border: 'rgba(168,85,247,0.45)',
      dot: '#e879f9',
    },
  },
];

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

export function PhilosophyAct() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const dragStartX = useRef(0);
  const card = CARDS[index];

  const navigate = (newDir: number) => {
    const next = index + newDir;
    if (next < 0 || next >= CARDS.length) return;
    setDirection(newDir);
    setIndex(next);
  };

  const handleDragStart = (_: any, info: any) => {
    dragStartX.current = info.point.x;
  };

  const handleDragEnd = (_: any, info: any) => {
    const delta = info.offset.x;
    if (delta < -50) navigate(1);
    else if (delta > 50) navigate(-1);
  };

  return (
    <div
      className="relative w-full py-24 md:py-40 overflow-hidden"
      style={{ background: '#0e0820' }}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(147,51,234,0.08) 0%, transparent 60%)`,
        }}
      />

      <div className="max-w-[1100px] mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
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

        <div className="relative">
          <div className="overflow-hidden rounded-2xl" style={{ touchAction: 'pan-y' }}>
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={index}
                custom={direction}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                className="group relative w-full overflow-hidden rounded-2xl border backdrop-blur-sm cursor-grab active:cursor-grabbing select-none"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderColor: card.accent.border,
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 30% 50%, ${card.accent.light}, transparent 70%)`,
                  }}
                />

                <div className="relative z-10 p-8 md:p-14 flex flex-col sm:flex-row items-start gap-6 md:gap-10 min-h-[220px]">
                  <div className="flex-shrink-0">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center border border-white/10 text-white"
                      style={{
                        background: `linear-gradient(135deg, ${card.accent.from}, ${card.accent.to})`,
                        boxShadow: `inset 0 0 10px rgba(255,255,255,0.15), 0 0 20px ${card.accent.light}`,
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
                      <span className="h-px w-8 flex-shrink-0" style={{ backgroundColor: card.accent.dot }} />
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

                <div
                  className="absolute bottom-0 left-0 h-[2px] w-full pointer-events-none"
                  style={{ background: `linear-gradient(to right, ${card.accent.from}, ${card.accent.to})` }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {CARDS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                  className="relative h-1.5 transition-all duration-500 rounded-full overflow-hidden"
                  style={{
                    width: i === index ? '2.5rem' : '0.5rem',
                    backgroundColor: i === index ? card.accent.dot : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                disabled={index === 0}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-25 transition-all active:scale-95"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => navigate(1)}
                disabled={index === CARDS.length - 1}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-25 transition-all active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
