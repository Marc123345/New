import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { PILLARS } from '../../constants/ecosystem';
import { useOverlay } from '../../hooks/useOverlay';

const ALL_SERVICES = PILLARS;

const PILLAR_ACCENTS = [
  { from: '#6b21a8', to: '#9333ea', light: 'rgba(107,33,168,0.14)', border: 'rgba(147,51,234,0.3)', dot: '#c084fc' },
  { from: '#4a1d96', to: '#7c3aed', light: 'rgba(74,29,150,0.14)', border: 'rgba(124,58,237,0.3)', dot: '#a78bfa' },
  { from: '#2e1065', to: '#5b21b6', light: 'rgba(46,16,101,0.14)', border: 'rgba(91,33,182,0.3)', dot: '#8b5cf6' },
];

interface PillarOverlayProps {
  pillarIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function PillarOverlay({ pillarIndex, onClose, onNavigate }: PillarOverlayProps) {
  useOverlay(pillarIndex !== null, onClose);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pillarIndex === null) return;
    const timer = setTimeout(() => modalRef.current?.focus(), 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && pillarIndex > 0) { e.preventDefault(); onNavigate(pillarIndex - 1); }
      if (e.key === 'ArrowRight' && pillarIndex < ALL_SERVICES.length - 1) { e.preventDefault(); onNavigate(pillarIndex + 1); }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => { clearTimeout(timer); window.removeEventListener('keydown', handleKeyDown); };
  }, [pillarIndex, onClose, onNavigate]);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [pillarIndex]);

  const activeService = pillarIndex !== null ? ALL_SERVICES[pillarIndex] : null;
  const accent = pillarIndex !== null ? PILLAR_ACCENTS[pillarIndex] : PILLAR_ACCENTS[0];
  const hasPrev = pillarIndex !== null && pillarIndex > 0;
  const hasNext = pillarIndex !== null && pillarIndex < ALL_SERVICES.length - 1;

  return (
    <AnimatePresence>
      {pillarIndex !== null && activeService && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0 z-[150]"
            style={{ background: 'rgba(4,4,8,0.82)', backdropFilter: 'blur(20px)' }}
          />

          <motion.div
            key="container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[151] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-8"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-title"
          >
            <AnimatePresence mode="wait">
              <motion.div
                ref={modalRef}
                key={pillarIndex}
                tabIndex={-1}
                initial={{ opacity: 0, y: 48, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28, mass: 0.85 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full focus:outline-none flex flex-col"
                style={{
                  maxWidth: 760,
                  maxHeight: '88dvh',
                  borderRadius: '0',
                  background: 'linear-gradient(145deg, #0d0d14 0%, #111118 100%)',
                  border: `1px solid ${accent.border}`,
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px -16px rgba(0,0,0,0.8), 0 0 60px -20px ${accent.from}55`,
                }}
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="h-[3px] w-full origin-left flex-shrink-0"
                  style={{ background: `linear-gradient(to right, ${accent.from}, ${accent.to}, transparent)` }}
                />

                <div
                  className="relative flex-shrink-0 px-5 pt-6 pb-5 sm:px-8 sm:pt-8 sm:pb-7"
                  style={{ borderBottom: `1px solid rgba(255,255,255,0.06)` }}
                >
                  <div
                    className="absolute right-6 top-4 select-none pointer-events-none font-black leading-none hidden sm:block"
                    aria-hidden="true"
                    style={{
                      fontSize: 'clamp(5rem, 12vw, 8rem)',
                      color: 'rgba(255,255,255,0.03)',
                      fontFamily: 'var(--font-stack-heading)',
                      lineHeight: 1,
                    }}
                  >
                    {String(pillarIndex + 1).padStart(2, '0')}
                  </div>

                  <motion.button
                    onClick={onClose}
                    aria-label="Close overlay"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25, type: 'spring', stiffness: 320, damping: 22 }}
                    className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 flex h-9 w-9 items-center justify-center transition-all duration-200 hover:rotate-90"
                    style={{
                      border: '1px solid rgba(255,255,255,0.12)',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.6)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                  >
                    <X size={16} strokeWidth={2} />
                  </motion.button>

                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12, duration: 0.45 }}
                    className="flex items-center gap-3 mb-4 sm:mb-5"
                  >
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.35em]"
                      style={{ color: accent.dot, fontFamily: 'var(--font-stack-heading)' }}
                    >
                      <span
                        className="inline-block w-4 h-[1px]"
                        style={{ background: accent.dot }}
                      />
                      {activeService.subtitle}
                    </span>
                    <span
                      className="text-[10px] tracking-[0.08em]"
                      style={{ color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-stack-heading)' }}
                    >
                      {pillarIndex + 1} / {ALL_SERVICES.length}
                    </span>
                  </motion.div>

                  <div className="flex items-start gap-5">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 280, damping: 20 }}
                      className="flex-shrink-0 flex h-14 w-14 items-center justify-center"
                      style={{
                        border: `1px solid ${accent.border}`,
                        background: accent.light,
                        color: accent.dot,
                      }}
                    >
                      {activeService.icon}
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <motion.h3
                        id="service-title"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="font-bold leading-[1.1] tracking-[-0.025em]"
                        style={{
                          fontSize: 'clamp(1.9rem, 4.5vw, 2.6rem)',
                          color: '#fff',
                          fontFamily: 'var(--font-stack-heading)',
                        }}
                      >
                        {activeService.title}
                      </motion.h3>
                    </div>
                  </div>
                </div>

                <div
                  ref={contentRef}
                  className="flex-1 overflow-y-auto"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: `${accent.border} transparent` }}
                >
                  <div className="px-5 py-5 sm:px-8 sm:py-7 space-y-6 sm:space-y-8">

                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.28, duration: 0.5 }}
                      className="leading-[1.75] text-base"
                      style={{ color: 'rgba(255,255,255,0.58)', fontFamily: 'var(--font-stack-body)' }}
                    >
                      {activeService.description}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.34, duration: 0.5 }}
                      className="grid grid-cols-3 gap-px overflow-hidden"
                      style={{ border: `1px solid ${accent.border}`, background: accent.border }}
                    >
                      {activeService.stats.map((stat: { value: string; label: string }, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + i * 0.07, type: 'spring', stiffness: 300, damping: 22 }}
                          className="flex flex-col items-center justify-center py-4 px-2 sm:py-5 sm:px-4 text-center"
                          style={{ background: '#0d0d14' }}
                        >
                          <div
                            className="font-extrabold leading-none tracking-[-0.03em] mb-1.5"
                            style={{
                              fontSize: 'clamp(1.1rem, 4vw, 1.85rem)',
                              color: accent.dot,
                              fontFamily: 'var(--font-stack-heading)',
                            }}
                          >
                            {stat.value}
                          </div>
                          <div
                            className="text-[10px] sm:text-[11px] leading-[1.4] tracking-[0.03em]"
                            style={{ color: 'rgba(255,255,255,0.32)', fontFamily: 'var(--font-stack-body)' }}
                          >
                            {stat.label}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.48, duration: 0.5 }}
                    >
                      <div
                        className="flex items-center gap-3 mb-4"
                      >
                        <span
                          className="text-[10px] uppercase tracking-[0.35em]"
                          style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-stack-heading)' }}
                        >
                          What We Deliver
                        </span>
                        <span
                          className="flex-1 h-px"
                          style={{ background: 'rgba(255,255,255,0.06)' }}
                        />
                      </div>

                      <ul className="grid sm:grid-cols-2 gap-2">
                        {(activeService.whatWeDo as string[]).map((item: string, i: number) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.52 + i * 0.045, duration: 0.38 }}
                            className="flex items-start gap-3 py-2.5 px-3"
                            style={{
                              background: 'rgba(255,255,255,0.025)',
                              border: '1px solid rgba(255,255,255,0.05)',
                            }}
                          >
                            <span
                              className="mt-[1px] flex-shrink-0"
                              style={{ color: accent.dot }}
                            >
                              <Check size={13} strokeWidth={2.5} />
                            </span>
                            <span
                              className="text-[0.875rem] leading-snug"
                              style={{ color: 'rgba(255,255,255,0.62)', fontFamily: 'var(--font-stack-body)' }}
                            >
                              {item}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    {activeService.closingNote && (
                      <motion.blockquote
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.72, duration: 0.5 }}
                        className="relative pl-5 text-[0.9rem] leading-[1.75] italic"
                        style={{
                          color: 'rgba(255,255,255,0.42)',
                          fontFamily: 'var(--font-stack-body)',
                          borderLeft: `2px solid ${accent.dot}`,
                        }}
                      >
                        {activeService.closingNote}
                      </motion.blockquote>
                    )}

                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="flex-shrink-0 flex items-center justify-between px-3 py-3 sm:px-8 sm:py-5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.25)' }}
                >
                  <button
                    onClick={() => hasPrev && onNavigate(pillarIndex - 1)}
                    disabled={!hasPrev}
                    aria-label="Previous pillar"
                    className="group inline-flex items-center gap-1.5 sm:gap-2 transition-all duration-200 px-2.5 py-2 sm:px-4 sm:py-2.5"
                    style={{
                      fontFamily: 'var(--font-stack-heading)',
                      fontSize: 11,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: hasPrev ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.12)',
                      cursor: hasPrev ? 'pointer' : 'default',
                      border: hasPrev ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                      background: 'none',
                    }}
                    onMouseEnter={e => { if (hasPrev) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
                    onMouseLeave={e => { if (hasPrev) { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'none'; } }}
                  >
                    <ArrowLeft size={13} />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  <nav className="flex items-center gap-2" aria-label="Pillar pagination">
                    {ALL_SERVICES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => onNavigate(i)}
                        aria-label={`Go to ${ALL_SERVICES[i].title}`}
                        aria-current={i === pillarIndex ? 'step' : undefined}
                        className="transition-all duration-300"
                        style={{
                          width: i === pillarIndex ? 28 : 7,
                          height: 7,
                          background: i === pillarIndex ? accent.dot : 'rgba(255,255,255,0.1)',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          borderRadius: 0,
                        }}
                      />
                    ))}
                  </nav>

                  <button
                    onClick={() => hasNext && onNavigate(pillarIndex + 1)}
                    disabled={!hasNext}
                    aria-label="Next pillar"
                    className="group inline-flex items-center gap-1.5 sm:gap-2 transition-all duration-200 px-2.5 py-2 sm:px-4 sm:py-2.5"
                    style={{
                      fontFamily: 'var(--font-stack-heading)',
                      fontSize: 11,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: hasNext ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.12)',
                      cursor: hasNext ? 'pointer' : 'default',
                      border: hasNext ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                      background: 'none',
                    }}
                    onMouseEnter={e => { if (hasNext) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
                    onMouseLeave={e => { if (hasNext) { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'none'; } }}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ArrowRight size={13} />
                  </button>
                </motion.div>

              </motion.div>
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
