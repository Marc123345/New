import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { PILLARS } from '../../constants/ecosystem';
import { useOverlay } from '../../hooks/useOverlay';

const ALL_SERVICES = PILLARS;

const PILLAR_ACCENTS = [
  { from: '#6b21a8', to: '#9333ea', light: 'rgba(107,33,168,0.12)', border: 'rgba(147,51,234,0.28)', dot: '#c084fc', rgb: '192,132,252' },
  { from: '#4a1d96', to: '#7c3aed', light: 'rgba(74,29,150,0.12)', border: 'rgba(124,58,237,0.28)', dot: '#a78bfa', rgb: '167,139,250' },
  { from: '#2e1065', to: '#5b21b6', light: 'rgba(46,16,101,0.12)', border: 'rgba(91,33,182,0.28)', dot: '#8b5cf6', rgb: '139,92,246' },
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

  // Keep last non-null index so content doesn't vanish during exit animation
  const lastIndexRef = useRef<number>(0);
  const displayIndex = pillarIndex !== null ? pillarIndex : lastIndexRef.current;
  if (pillarIndex !== null) lastIndexRef.current = pillarIndex;

  const activeService = ALL_SERVICES[displayIndex];
  const accent = PILLAR_ACCENTS[displayIndex] ?? PILLAR_ACCENTS[0];
  const hasPrev = displayIndex > 0;
  const hasNext = displayIndex < ALL_SERVICES.length - 1;

  // Keyboard navigation
  useEffect(() => {
    if (pillarIndex === null) return;
    const timer = setTimeout(() => modalRef.current?.focus(), 80);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowLeft' && hasPrev) { e.preventDefault(); onNavigate(displayIndex - 1); }
      if (e.key === 'ArrowRight' && hasNext) { e.preventDefault(); onNavigate(displayIndex + 1); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => { clearTimeout(timer); window.removeEventListener('keydown', handleKeyDown); };
  }, [pillarIndex, displayIndex, hasPrev, hasNext, onClose, onNavigate]);

  // Scroll to top on pillar change
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pillarIndex]);

  const isOpen = pillarIndex !== null && !!activeService;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(2,2,6,0.88)', backdropFilter: 'blur(18px)' }}
          />

          {/* Dialog */}
          <motion.div
            key="dialog-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center sm:p-6"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pillar-title"
          >
            <AnimatePresence mode="wait">
              <motion.div
                ref={modalRef}
                key={`pillar-${displayIndex}`}
                tabIndex={-1}
                // Mobile: slides up from bottom. Desktop: scales in from center.
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full focus:outline-none flex flex-col"
                style={{
                  maxWidth: 740,
                  // Full height on mobile (sheet), capped on desktop
                  maxHeight: 'min(92vh, 92dvh)',
                  height: 'auto',
                  // Rounded corners only on top for mobile sheet feel
                  borderRadius: '16px 16px 0 0',
                  background: 'linear-gradient(158deg, #0c0b13 0%, #100e1a 100%)',
                  border: `1px solid ${accent.border}`,
                  boxShadow: `
                    0 0 0 1px rgba(255,255,255,0.04),
                    0 40px 100px -20px rgba(0,0,0,0.9),
                    0 0 80px -30px rgba(${accent.rgb},0.2)
                  `,
                  // Full rounded on desktop
                  '@media (min-width: 640px)': { borderRadius: 16 },
                }}
              >
                {/* Accent top bar */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="h-[3px] w-full origin-left flex-shrink-0"
                  style={{
                    background: `linear-gradient(90deg, ${accent.from}, ${accent.to}, transparent)`,
                    borderRadius: '16px 16px 0 0',
                  }}
                />

                {/* Header */}
                <div
                  className="relative flex-shrink-0 px-5 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-7"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {/* Ghost number */}
                  <div
                    aria-hidden="true"
                    className="absolute right-5 sm:right-7 top-3 select-none pointer-events-none font-black leading-none"
                    style={{
                      fontSize: 'clamp(4rem, 10vw, 7rem)',
                      color: 'rgba(255,255,255,0.03)',
                      fontFamily: 'var(--font-stack-heading)',
                      lineHeight: 1,
                    }}
                  >
                    {String(displayIndex + 1).padStart(2, '0')}
                  </div>

                  {/* Close button — larger tap target on mobile */}
                  <motion.button
                    onClick={onClose}
                    aria-label="Close"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 340, damping: 22 }}
                    className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center transition-all duration-200 hover:rotate-90"
                    style={{
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(255,255,255,0.04)',
                      color: 'rgba(255,255,255,0.5)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                  >
                    <X size={15} strokeWidth={2} />
                  </motion.button>

                  {/* Subtitle + counter */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="flex items-center gap-3 mb-4"
                    style={{ paddingLeft: '48px' }}
                  >
                    <span
                      className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-[0.35em]"
                      style={{ color: accent.dot, fontFamily: 'var(--font-stack-heading)' }}
                    >
                      <span className="inline-block w-4 h-px" style={{ background: accent.dot }} />
                      {activeService.subtitle}
                    </span>
                    <span
                      className="text-[9px] tracking-[0.08em]"
                      style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-stack-heading)' }}
                    >
                      {displayIndex + 1} / {ALL_SERVICES.length}
                    </span>
                  </motion.div>

                  {/* Icon + Title */}
                  <div className="flex items-start gap-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.55 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.18, type: 'spring', stiffness: 300, damping: 20 }}
                      className="flex-shrink-0 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center"
                      style={{ border: `1px solid ${accent.border}`, background: accent.light, color: accent.dot }}
                    >
                      {activeService.icon}
                    </motion.div>

                    <motion.h3
                      id="pillar-title"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                      className="font-bold leading-[1.08] tracking-[-0.025em] pt-0.5"
                      style={{
                        fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                        color: '#fff',
                        fontFamily: 'var(--font-stack-heading)',
                      }}
                    >
                      {activeService.title}
                    </motion.h3>
                  </div>
                </div>

                {/* Scrollable body */}
                <div
                  ref={contentRef}
                  className="flex-1 overflow-y-auto min-h-0"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${accent.border} transparent`,
                  }}
                >
                  <div className="px-5 sm:px-8 py-6 sm:py-7 space-y-7 sm:space-y-8">

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.26, duration: 0.45 }}
                      className="leading-[1.78] text-sm sm:text-base"
                      style={{ color: 'rgba(255,255,255,0.52)', fontFamily: 'var(--font-stack-body)' }}
                    >
                      {activeService.description}
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.32, duration: 0.45 }}
                      className="grid grid-cols-3 gap-px overflow-hidden"
                      style={{ border: `1px solid ${accent.border}`, background: accent.border }}
                    >
                      {activeService.stats.map((stat: { value: string; label: string }, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.38 + i * 0.065, type: 'spring', stiffness: 320, damping: 22 }}
                          className="flex flex-col items-center justify-center py-4 sm:py-5 px-3 text-center"
                          style={{ background: '#0c0b13' }}
                        >
                          <div
                            className="font-extrabold leading-none tracking-[-0.03em] mb-1.5"
                            style={{
                              fontSize: 'clamp(1.25rem, 3.2vw, 1.75rem)',
                              color: accent.dot,
                              fontFamily: 'var(--font-stack-heading)',
                            }}
                          >
                            {stat.value}
                          </div>
                          <div
                            className="text-[10px] sm:text-[11px] leading-[1.35] tracking-[0.025em]"
                            style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-stack-body)' }}
                          >
                            {stat.label}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* What We Deliver */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.46, duration: 0.45 }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em]"
                          style={{ color: 'rgba(255,255,255,0.24)', fontFamily: 'var(--font-stack-heading)' }}
                        >
                          What We Deliver
                        </span>
                        <span className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                      </div>

                      <ul className="grid sm:grid-cols-2 gap-2">
                        {(activeService.whatWeDo as string[]).map((item: string, i: number) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.04, duration: 0.36 }}
                            className="flex items-start gap-3 py-2.5 px-3"
                            style={{
                              background: 'rgba(255,255,255,0.022)',
                              border: '1px solid rgba(255,255,255,0.045)',
                            }}
                          >
                            <span className="mt-[2px] flex-shrink-0" style={{ color: accent.dot }}>
                              <Check size={12} strokeWidth={2.5} />
                            </span>
                            <span
                              className="text-xs sm:text-[0.875rem] leading-snug"
                              style={{ color: 'rgba(255,255,255,0.58)', fontFamily: 'var(--font-stack-body)' }}
                            >
                              {item}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Closing note */}
                    {activeService.closingNote && (
                      <motion.blockquote
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.68, duration: 0.45 }}
                        className="relative pl-5 text-[0.875rem] leading-[1.78] italic"
                        style={{
                          color: 'rgba(255,255,255,0.38)',
                          fontFamily: 'var(--font-stack-body)',
                          borderLeft: `2px solid ${accent.dot}`,
                        }}
                      >
                        {activeService.closingNote}
                      </motion.blockquote>
                    )}

                    {/* Bottom padding so last item clears the sticky footer */}
                    <div className="h-2" />
                  </div>
                </div>

                {/* Footer navigation */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.38 }}
                  className="flex-shrink-0 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.28)' }}
                >
                  {/* Prev */}
                  <button
                    onClick={() => hasPrev && onNavigate(displayIndex - 1)}
                    disabled={!hasPrev}
                    aria-label="Previous pillar"
                    className="inline-flex items-center gap-2 transition-all duration-200 px-3 sm:px-4 py-2.5 min-w-[44px] min-h-[44px]"
                    style={{
                      fontFamily: 'var(--font-stack-heading)',
                      fontSize: 10,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: hasPrev ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)',
                      cursor: hasPrev ? 'pointer' : 'default',
                      border: hasPrev ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                      background: 'none',
                    }}
                    onMouseEnter={e => { if (hasPrev) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
                    onMouseLeave={e => { if (hasPrev) { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'none'; } }}
                  >
                    <ArrowLeft size={12} />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  {/* Dot pagination */}
                  <nav className="flex items-center gap-2" aria-label="Pillar pagination">
                    {ALL_SERVICES.map((svc, i) => (
                      <button
                        key={i}
                        onClick={() => onNavigate(i)}
                        aria-label={`Go to ${svc.title}`}
                        aria-current={i === displayIndex ? 'step' : undefined}
                        className="transition-all duration-300 relative"
                        style={{
                          width: i === displayIndex ? 26 : 7,
                          height: 7,
                          background: i === displayIndex ? accent.dot : 'rgba(255,255,255,0.1)',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          borderRadius: 0,
                          // Larger touch target via pseudo-element workaround
                          minWidth: 7,
                          minHeight: 44,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      />
                    ))}
                  </nav>

                  {/* Next */}
                  <button
                    onClick={() => hasNext && onNavigate(displayIndex + 1)}
                    disabled={!hasNext}
                    aria-label="Next pillar"
                    className="inline-flex items-center gap-2 transition-all duration-200 px-3 sm:px-4 py-2.5 min-w-[44px] min-h-[44px]"
                    style={{
                      fontFamily: 'var(--font-stack-heading)',
                      fontSize: 10,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: hasNext ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)',
                      cursor: hasNext ? 'pointer' : 'default',
                      border: hasNext ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                      background: 'none',
                    }}
                    onMouseEnter={e => { if (hasNext) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
                    onMouseLeave={e => { if (hasNext) { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'none'; } }}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ArrowRight size={12} />
                  </button>
                </motion.div>

              </motion.div>
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}