import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { PILLARS } from '../../constants/ecosystem';

const PILLAR_ACCENTS = [
  { from: '#291e56', to: '#4a2d8a', light: 'rgba(164,108,252,0.12)', border: 'rgba(164,108,252,0.35)', dot: '#a46cfc' },
  { from: '#3d2670', to: '#7c4bc0', light: 'rgba(177,129,252,0.15)', border: 'rgba(177,129,252,0.45)', dot: '#c084fc' },
  { from: '#4a2d8a', to: '#a46cfc', light: 'rgba(177,129,252,0.18)', border: 'rgba(177,129,252,0.5)', dot: '#b181fc' },
];

interface PillarOverlayProps {
  pillarIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function PillarOverlay({ pillarIndex, onClose, onNavigate }: PillarOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const activeIndexRef = useRef<number | null>(null);
  if (pillarIndex !== null) {
    activeIndexRef.current = pillarIndex;
  }

  const displayIndex = pillarIndex !== null ? pillarIndex : activeIndexRef.current;
  const displayService = displayIndex !== null ? PILLARS[displayIndex] : null;
  const accent = displayIndex !== null ? PILLAR_ACCENTS[displayIndex] : PILLAR_ACCENTS[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (pillarIndex !== null) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowRight' && displayIndex !== null && displayIndex < PILLARS.length - 1) onNavigate(displayIndex + 1);
        if (e.key === 'ArrowLeft' && displayIndex !== null && displayIndex > 0) onNavigate(displayIndex - 1);
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [pillarIndex, onClose, displayIndex, onNavigate]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [pillarIndex]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {pillarIndex !== null && displayService && (
        <motion.div
          key="pillar-overlay-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0e0820]/80 p-4 sm:p-6 md:p-12 pointer-events-auto"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col w-full max-w-4xl bg-[#0e0820] shadow-2xl overflow-hidden"
            style={{
              maxHeight: 'calc(100vh - 2rem)',
              border: `2px solid ${accent.border}`,
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px ${accent.light}`,
              borderRadius: '1rem',
            }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-64 blur-[100px] rounded-full opacity-30 pointer-events-none transition-colors duration-700"
              style={{ backgroundColor: accent.dot }}
            />

            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-[10000] flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/20 bg-black/40 hover:bg-white/20 transition-all text-white cursor-pointer active:scale-95 group backdrop-blur-md"
              aria-label="Close overlay"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto min-h-0 px-6 sm:px-10 py-10 scrollbar-hide relative z-10"
            >
              <div className="max-w-3xl mx-auto space-y-12">
                {displayService.image && (
                  <motion.div
                    key={`image-${displayIndex}`}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full overflow-hidden rounded-xl"
                    style={{
                      height: 'clamp(200px, 30vw, 320px)',
                      border: `2px solid ${accent.border}`,
                      boxShadow: `6px 6px 0 ${accent.dot}55`,
                    }}
                  >
                    <img
                      src={displayService.image}
                      alt={displayService.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(to top, #0e0820 0%, transparent 50%, ${accent.from}88 100%)` }}
                    />
                    <div className="absolute bottom-4 left-5">
                      <div className="flex items-center gap-3 font-mono tracking-tighter uppercase text-sm font-semibold" style={{ color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                        <span className="h-px w-8" style={{ backgroundColor: accent.dot }} />
                        {displayService.subtitle}
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  key={`header-${displayIndex}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4 pt-2"
                >
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-none">
                    {displayService.title}
                  </h2>
                  <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">
                    {displayService.description}
                  </p>
                </motion.div>

                <motion.div
                  key={`stats-${displayIndex}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="grid grid-cols-3 gap-3 sm:gap-6"
                >
                  {displayService.stats.map((s, i) => (
                    <div
                      key={i}
                      className="p-4 sm:p-6 bg-black/20 backdrop-blur-md text-center relative overflow-hidden group transition-all duration-300 rounded-lg"
                      style={{
                        border: `1px solid ${accent.border}`,
                        boxShadow: `4px 4px 0 ${accent.dot}44`,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.boxShadow = `6px 6px 0 ${accent.dot}66`;
                        (e.currentTarget as HTMLDivElement).style.transform = `translate(-2px, -2px)`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.boxShadow = `4px 4px 0 ${accent.dot}44`;
                        (e.currentTarget as HTMLDivElement).style.transform = `translate(0, 0)`;
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `radial-gradient(circle at center, ${accent.light} 0%, transparent 70%)` }}
                      />
                      <div className="relative z-10 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight" style={{ color: accent.dot }}>{s.value}</div>
                      <div className="relative z-10 text-[10px] sm:text-xs uppercase tracking-wider text-white/50 mt-2">{s.label}</div>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  key={`deliv-${displayIndex}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="space-y-6"
                >
                  <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold">What We Deliver</h4>
                  <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                    {(displayService.whatWeDo as string[]).map((item: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 bg-white/5 border rounded-lg transition-all duration-200"
                        style={{ borderColor: accent.border }}
                      >
                        <div
                          className="flex-shrink-0 w-6 h-6 flex items-center justify-center border rounded-md"
                          style={{ borderColor: accent.dot, color: accent.dot, background: 'rgba(0,0,0,0.2)' }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-sm sm:text-base text-white/90">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {displayService.closingNote && (
                  <motion.div
                    key={`close-${displayIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 bg-white/5 text-center rounded-lg"
                    style={{ border: `1px solid ${accent.border}` }}
                  >
                    <p className="text-white/70 italic text-sm sm:text-base">"{displayService.closingNote}"</p>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="relative z-20 p-4 sm:p-6 border-t border-white/10 bg-black/40 backdrop-blur-xl flex justify-between items-center">
              <button
                type="button"
                disabled={displayIndex === 0}
                onClick={() => displayIndex !== null && onNavigate(displayIndex - 1)}
                className="flex items-center gap-2 disabled:opacity-20 min-h-[44px] min-w-[44px] px-4 cursor-pointer uppercase rounded-md"
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  border: '1px solid #fbfbfc',
                  color: '#fbfbfc',
                  background: 'transparent',
                  transition: 'background 0.2s ease, color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (displayIndex === 0) return;
                  e.currentTarget.style.background = '#fbfbfc';
                  e.currentTarget.style.color = '#0e0820';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#fbfbfc';
                }}
              >
                <ArrowLeft size={16} /> <span className="hidden sm:inline">Prev</span>
              </button>

              <div className="flex gap-3">
                {PILLARS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onNavigate(i)}
                    className="group relative flex items-center justify-center h-8"
                    aria-label={`Go to pillar ${i + 1}`}
                  >
                    <div
                      className={`h-1.5 transition-all duration-500 rounded-full ${i === displayIndex ? 'w-10' : 'w-2 bg-white/20 group-hover:bg-white/40'}`}
                      style={{ backgroundColor: i === displayIndex ? accent.dot : undefined }}
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={displayIndex === PILLARS.length - 1}
                onClick={() => displayIndex !== null && onNavigate(displayIndex + 1)}
                className="flex items-center gap-2 disabled:opacity-20 min-h-[44px] min-w-[44px] px-4 cursor-pointer uppercase rounded-md"
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  border: '1px solid #fbfbfc',
                  color: '#fbfbfc',
                  background: 'transparent',
                  transition: 'background 0.2s ease, color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (displayIndex === PILLARS.length - 1) return;
                  e.currentTarget.style.background = '#fbfbfc';
                  e.currentTarget.style.color = '#0e0820';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#fbfbfc';
                }}
              >
                <span className="hidden sm:inline">Next</span> <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
