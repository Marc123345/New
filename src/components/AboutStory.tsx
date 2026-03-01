import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HookAct } from './about/HookAct';
import { PhilosophyAct } from './about/PhilosophyAct';
import { OrbitalAct } from './about/OrbitalAct';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const SLIDES = [
  { id: 'hook', label: 'Our Hook', component: <HookAct /> },
  { id: 'philosophy', label: 'Philosophy', component: <PhilosophyAct /> },
  { id: 'orbital', label: 'Why H2H', component: <OrbitalAct /> },
];

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export function AboutStory() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const dragStartX = useRef(0);

  const navigate = (newDir: number) => {
    const next = index + newDir;
    if (next < 0 || next >= SLIDES.length) return;
    setDirection(newDir);
    setIndex(next);
  };

  const goTo = (i: number) => {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  };

  const handleDragEnd = (_: any, info: any) => {
    const delta = info.offset.x;
    if (delta < -60) navigate(1);
    else if (delta > 60) navigate(-1);
  };

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden"
      style={{ background: '#030303' }}
    >
      <div className="relative w-full overflow-hidden" style={{ minHeight: '100vh' }}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={SLIDE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="w-full cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'pan-y' }}
          >
            {SLIDES[index].component}
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className="absolute bottom-6 left-0 right-0 z-50 flex items-center justify-center gap-6 px-6"
        style={{ pointerEvents: 'none' }}
      >
        <div className="flex items-center gap-4" style={{ pointerEvents: 'auto' }}>
          <button
            onClick={() => navigate(-1)}
            disabled={index === 0}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-white/15 bg-black/40 backdrop-blur-sm text-white disabled:opacity-20 hover:bg-white/10 transition-all active:scale-95"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => goTo(i)}
                className="flex items-center gap-2 group"
              >
                <div
                  className="h-1 rounded-full transition-all duration-500"
                  style={{
                    width: i === index ? '2rem' : '0.4rem',
                    background: i === index ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                  }}
                />
                <span
                  className="text-[0.55rem] font-bold uppercase tracking-[0.2em] transition-all duration-300 hidden sm:block"
                  style={{
                    color: i === index ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)',
                    opacity: i === index ? 1 : 0,
                    width: i === index ? 'auto' : 0,
                    overflow: 'hidden',
                  }}
                >
                  {slide.label}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate(1)}
            disabled={index === SLIDES.length - 1}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-white/15 bg-black/40 backdrop-blur-sm text-white disabled:opacity-20 hover:bg-white/10 transition-all active:scale-95"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
