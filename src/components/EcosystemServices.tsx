import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Changed to standard framer-motion
import { Building2, Users, Megaphone, X, ArrowLeft, ArrowRight, Check } from 'lucide-react';

const VIDEO_URL = 'https://ik.imagekit.io/qcvroy8xpd/rotating-galaxy-4k-2026-01-28-03-26-41-utc.mp4';

const PILLARS = [
  {
    subtitle: 'Pillar 01',
    title: 'Company Pages',
    description:
      "Your company's social presence is your digital storefront, but most brands leave it looking empty or generic. We turn your pages into platforms for thought leadership, brand storytelling, and meaningful engagement. We help your brand show up consistently and confidently — with a voice that feels human, even when it's speaking at scale.",
    whatWeDo: [
      'Brand awareness campaigns',
      'Product and event promotion',
      'Employer branding content',
      'Community engagement',
      'Video content',
      'Always-on posting that builds credibility',
      'Long-form content creation and website enrichment',
    ],
    closingNote: null as string | null,
    icon: React.createElement(Building2, { size: 32 }),
    stats: [
      { label: 'Avg. Engagement Lift', value: '3.2x' },
      { label: 'Brand Impressions', value: '+180%' },
      { label: 'Follower Growth', value: '+45%' },
    ],
  },
  {
    subtitle: 'Pillar 02',
    title: 'Leadership Branding',
    description:
      'People want to hear from other people. We help your executives step into the spotlight with purpose, clarity, and authenticity — positioning them as respected voices in your industry.',
    whatWeDo: [
      "Tailored content creation that reflects each leader's personality and POV",
      'Alignment between personal narratives and business strategy',
      'Positioning as industry thought leaders — not just internal champions',
      'Content and ghost-writing that drives conversations',
    ],
    closingNote:
      'By helping leaders build presence, trust, and lasting influence, we position your company as the home of the voices that are shaping the industry. A sales tactic that most companies have not yet tapped into.',
    icon: React.createElement(Users, { size: 32 }),
    stats: [
      { label: 'Profile Views', value: '+240%' },
      { label: 'Connection Growth', value: '5x' },
      { label: 'Content Reach', value: '+320%' },
    ],
  },
  {
    subtitle: 'Pillar 03',
    title: 'Advocacy Program',
    description:
      "The most trusted voices in your company aren't always in the C-suite — they're on your teams. Our Advocacy Program turns employees into empowered storytellers and brand ambassadors.",
    whatWeDo: [
      'Monthly workshops and hands-on training',
      'Shareable content kits and templates',
      'Scalable infrastructure that grows with your team',
      'Culture-first programming that boosts morale and visibility',
    ],
    closingNote:
      'We create internal champions who amplify your message and expand your reach — all through real human connection. The H2H advocacy program empowers your company message to be told in diverse, authentic voices.',
    icon: React.createElement(Megaphone, { size: 32 }),
    stats: [
      { label: 'Employee Reach', value: '10x' },
      { label: 'Organic Amplification', value: '+560%' },
      { label: 'Team Participation', value: '78%' },
    ],
  },
];

const PILLAR_ACCENTS = [
  { from: '#6b21a8', to: '#9333ea', light: 'rgba(107,33,168,0.14)', border: 'rgba(147,51,234,0.3)', dot: '#c084fc' },
  { from: '#4a1d96', to: '#7c3aed', light: 'rgba(74,29,150,0.14)', border: 'rgba(124,58,237,0.3)', dot: '#a78bfa' },
  { from: '#2e1065', to: '#5b21b6', light: 'rgba(46,16,101,0.14)', border: 'rgba(91,33,182,0.3)', dot: '#8b5cf6' },
];

interface OrbitNodeProps {
  item: typeof PILLARS[number];
  index: number;
  total: number;
  radius: number; // Added dynamic radius prop
  onSelect: (index: number) => void;
  activeLabel: number | null;
  onToggleLabel: (index: number) => void;
}

function OrbitNode({ item, index, total, radius, onSelect, activeLabel, onToggleLabel }: OrbitNodeProps) {
  const angle = (index / total) * 2 * Math.PI;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const showLabel = activeLabel === index;

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 z-30 pointer-events-auto"
      style={{ x, y }}
    >
      <motion.button
        onClick={() => onSelect(index)}
        onPointerDown={(e) => {
          if (e.pointerType === 'touch') {
            e.stopPropagation();
            onToggleLabel(index);
          }
        }}
        // The inverse rotation to keep the icon upright while the parent spins
        animate={{ rotate: -360 }}
        transition={{ duration: 120, ease: 'linear', repeat: Infinity }}
        className="group relative flex items-center justify-center p-4 focus:outline-none"
      >
        <div
          className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500 group-hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary, #2e1065), rgba(164,108,252,0.4))',
            border: '2px solid var(--color-secondary, #9333ea)',
            boxShadow: '0 0 24px rgba(164,108,252,0.35), inset 0 0 12px rgba(164,108,252,0.15)',
          }}
        >
          <div className="transition-colors text-white">
            {item.icon}
          </div>
        </div>

        <div
          className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 transition-opacity duration-500 pointer-events-none z-50 ${
            showLabel ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <span
            className="text-xs uppercase tracking-[0.2em] whitespace-nowrap px-3 py-1 rounded-sm"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              color: '#ffffff',
              background: 'rgba(41,30,86,0.95)',
              border: '1px solid var(--color-secondary, #9333ea)',
            }}
          >
            {item.subtitle}
          </span>
        </div>
      </motion.button>
    </motion.div>
  );
}

function PillarOverlay({ pillarIndex, onClose, onNavigate }: { pillarIndex: number | null; onClose: () => void; onNavigate: (index: number) => void; }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const touchRef = useRef({ startY: 0, atTop: false });

  const handleClose = useCallback(() => { onClose(); }, [onClose]);

  useEffect(() => {
    if (pillarIndex === null) return;
    setScrollProgress(0);
    setShowHint(true);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [pillarIndex]);

  useEffect(() => {
    if (pillarIndex === null) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft' && pillarIndex > 0) { e.preventDefault(); onNavigate(pillarIndex - 1); }
      if (e.key === 'ArrowRight' && pillarIndex < PILLARS.length - 1) { e.preventDefault(); onNavigate(pillarIndex + 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [pillarIndex, handleClose, onNavigate]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const p = el.scrollTop / (el.scrollHeight - el.clientHeight);
    setScrollProgress(p);
    if (p > 0) setShowHint(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current.startY = e.touches[0].clientY;
    touchRef.current.atTop = (scrollRef.current?.scrollTop ?? 0) <= 0;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current.atTop) return;
    const delta = e.changedTouches[0].clientY - touchRef.current.startY;
    if (delta > 100) handleClose();
  }, [handleClose]);

  const activeService = pillarIndex !== null ? PILLARS[pillarIndex] : null;
  const accent = pillarIndex !== null ? PILLAR_ACCENTS[pillarIndex] : PILLAR_ACCENTS[0];
  const hasPrev = pillarIndex !== null && pillarIndex > 0;
  const hasNext = pillarIndex !== null && pillarIndex < PILLARS.length - 1;

  return (
    <AnimatePresence>
      {pillarIndex !== null && activeService && (
        <motion.div
          key="pillar-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200]"
          style={{ background: 'rgba(4,4,8,0.95)', backdropFilter: 'blur(24px)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-title"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="fixed top-0 left-0 right-0 h-[2px] z-10" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full"
              style={{ width: `${scrollProgress * 100}%`, background: `linear-gradient(to right, ${accent.from}, ${accent.to})` }}
            />
          </div>

          <motion.button
            onClick={handleClose}
            aria-label="Close overlay"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 320, damping: 22 }}
            className="fixed top-4 right-4 md:top-8 md:right-8 z-10 flex h-11 w-11 items-center justify-center transition-all duration-200 hover:rotate-90"
            style={{
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.7)',
              borderRadius: 2,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          >
            <X size={18} strokeWidth={2} />
          </motion.button>

          <div
            ref={scrollRef}
            className="h-screen overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: 'touch', paddingBottom: '100px' }}
            onScroll={handleScroll}
          >
            <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-16 md:pt-24 pb-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pillarIndex}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                  className="space-y-8 sm:space-y-10"
                >
                  <div>
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08, duration: 0.4 }}
                      className="flex items-center gap-3 mb-5"
                    >
                      <span
                        className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.35em]"
                        style={{ color: accent.dot, fontFamily: 'var(--font-stack-heading)' }}
                      >
                        <span className="inline-block w-4 h-[1px]" style={{ background: accent.dot }} />
                        {activeService.subtitle}
                      </span>
                      <span className="text-[10px] tracking-[0.08em]" style={{ color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-stack-heading)' }}>
                        {pillarIndex + 1} / {PILLARS.length}
                      </span>
                    </motion.div>

                    <div className="flex items-start gap-4 sm:gap-5">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.12, type: 'spring', stiffness: 280, damping: 20 }}
                        className="flex-shrink-0 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center"
                        style={{ border: `1px solid ${accent.border}`, background: accent.light, color: accent.dot }}
                      >
                        {activeService.icon}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <motion.h2
                          id="service-title"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="font-bold leading-[1.05] tracking-[-0.025em]"
                          style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', color: '#fff', fontFamily: 'var(--font-stack-heading)' }}
                        >
                          {activeService.title}
                        </motion.h2>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.18 }}
                    className="h-px w-full"
                    style={{ background: `linear-gradient(to right, ${accent.border}, transparent)` }}
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.5 }}
                    className="leading-[1.75] text-base sm:text-lg"
                    style={{ color: 'rgba(255,255,255,0.72)', fontFamily: 'var(--font-stack-body)' }}
                  >
                    {activeService.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28, duration: 0.5 }}
                    className="grid grid-cols-3 gap-px overflow-hidden"
                    style={{ border: `1px solid ${accent.border}`, background: accent.border }}
                  >
                    {activeService.stats.map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.32 + i * 0.07 }}
                        className="flex flex-col items-center justify-center py-4 px-1.5 sm:py-7 sm:px-3 text-center"
                        style={{ background: 'rgba(4,4,8,0.9)' }}
                      >
                        <div
                          className="font-extrabold leading-none tracking-[-0.03em] mb-1"
                          style={{ fontSize: 'clamp(0.95rem, 5.5vw, 2rem)', color: accent.dot, fontFamily: 'var(--font-stack-heading)' }}
                        >
                          {stat.value}
                        </div>
                        <div
                          className="text-[9px] sm:text-[11px] leading-[1.4] tracking-[0.03em] uppercase"
                          style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-stack-body)', wordBreak: 'break-word' }}
                        >
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38, duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-[10px] uppercase tracking-[0.35em]" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-stack-heading)' }}>
                        What We Deliver
                      </span>
                      <span className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {activeService.whatWeDo.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.42 + i * 0.045, duration: 0.35 }}
                          className="flex items-start gap-3 py-3 px-4"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                        >
                          <span className="mt-[3px] flex-shrink-0" style={{ color: accent.dot }}>
                            <Check size={13} strokeWidth={2.5} />
                          </span>
                          <span className="text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.78)', fontFamily: 'var(--font-stack-body)' }}>
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
                      transition={{ delay: 0.62, duration: 0.5 }}
                      className="pl-5 text-sm sm:text-base leading-[1.75] italic"
                      style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-stack-body)', borderLeft: `2px solid ${accent.dot}` }}
                    >
                      {activeService.closingNote}
                    </motion.blockquote>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div
            className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(4,4,8,0.92)', backdropFilter: 'blur(12px)' }}
          >
            <button
              onClick={() => hasPrev && onNavigate(pillarIndex - 1)}
              disabled={!hasPrev}
              aria-label="Previous pillar"
              className="inline-flex items-center gap-2 transition-all duration-200 px-4 py-2.5"
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: hasPrev ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.18)',
                cursor: hasPrev ? 'pointer' : 'default',
                border: hasPrev ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                background: 'none',
              }}
              onMouseEnter={e => { if (hasPrev) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; } }}
              onMouseLeave={e => { if (hasPrev) { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'none'; } }}
            >
              <ArrowLeft size={14} />
              <span>Prev</span>
            </button>

            <nav className="flex items-center gap-2" aria-label="Pillar pagination">
              {PILLARS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate(i)}
                  aria-label={`Go to ${PILLARS[i].title}`}
                  aria-current={i === pillarIndex ? 'step' : undefined}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === pillarIndex ? 24 : 8,
                    height: 8,
                    background: i === pillarIndex ? accent.dot : 'rgba(255,255,255,0.18)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              ))}
            </nav>

            <button
              onClick={() => hasNext && onNavigate(pillarIndex + 1)}
              disabled={!hasNext}
              aria-label="Next pillar"
              className="inline-flex items-center gap-2 transition-all duration-200 px-4 py-2.5"
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: hasNext ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.18)',
                cursor: hasNext ? 'pointer' : 'default',
                border: hasNext ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                background: 'none',
              }}
              onMouseEnter={e => { if (hasNext) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; } }}
              onMouseLeave={e => { if (hasNext) { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.background = 'none'; } }}
            >
              <span>Next</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {showHint && scrollProgress === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
            >
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}>
                <ArrowRight size={16} style={{ color: 'rgba(255,255,255,0.35)', transform: 'rotate(90deg)' }} />
              </motion.div>
              <span className="text-[11px] tracking-[0.15em] uppercase" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-stack-heading)' }}>Scroll</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function EcosystemServices() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [isHoveringOrbit, setIsHoveringOrbit] = useState(false);
  const [activeLabel, setActiveLabel] = useState<number | null>(null);
  const [orbitRadius, setOrbitRadius] = useState(300);

  // Dynamic radius for responsive design
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setOrbitRadius(140); // Mobile
      } else if (window.innerWidth < 1024) {
        setOrbitRadius(220); // Tablet
      } else {
        setOrbitRadius(300); // Desktop
      }
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleLabel = (index: number) => {
    setActiveLabel(prev => prev === index ? null : index);
  };

  return (
    <section
      id="ecosystem"
      className="relative w-full min-h-[auto] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden py-16 sm:py-32"
      style={{ background: 'linear-gradient(160deg, #0e0820 0%, var(--color-primary, #2e1065) 40%, #120a2a 70%, #0a0612 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30"
          style={{ filter: 'brightness(0.7) contrast(1.05)' }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center pointer-events-none select-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <div
            className="inline-block mb-8 px-4 py-2"
            style={{
              border: '2px solid var(--color-secondary, #9333ea)',
              boxShadow: '4px 4px 0 var(--color-secondary, #9333ea)',
            }}
          >
            <span
              className="text-xs uppercase tracking-[0.3em]"
              style={{
                fontFamily: 'var(--font-stack-heading)',
                color: 'var(--color-secondary, #9333ea)',
              }}
            >
              The Framework
            </span>
          </div>

          <h1
            className="leading-[0.9] tracking-tighter uppercase mb-4"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(2.5rem, 10vw, 9rem)',
              textShadow: '0 20px 40px rgba(41,30,86,0.6)',
              color: 'transparent',
              WebkitTextStroke: '1.5px #ffffff',
            }}
          >
            Three Pillars. <br />
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '1.5px var(--color-secondary, #9333ea)',
              }}
            >
              One Ecosystem.
            </span>
          </h1>
          <h1
            className="leading-[0.9] tracking-tighter uppercase"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(2.5rem, 10vw, 9rem)',
              color: 'var(--color-secondary, #9333ea)',
              opacity: 0.08,
            }}
          >
            Connection
          </h1>
        </motion.div>
      </div>

      <style>
        {`
          @keyframes spin-orbit {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div
        className="hidden sm:flex absolute inset-0 z-20 overflow-visible pointer-events-none items-center justify-center"
        onMouseEnter={() => setIsHoveringOrbit(true)}
        onMouseLeave={() => setIsHoveringOrbit(false)}
      >
        <div className="relative w-[600px] h-[600px] md:w-[900px] md:h-[900px] flex items-center justify-center">
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              animation: 'spin-orbit 120s linear infinite',
              animationPlayState: isHoveringOrbit ? 'paused' : 'running'
            }}
          >
            {PILLARS.map((pillar, i) => (
              <OrbitNode
                key={i}
                item={pillar}
                index={i}
                total={PILLARS.length}
                radius={orbitRadius}
                onSelect={setSelectedService}
                activeLabel={activeLabel}
                onToggleLabel={handleToggleLabel}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-20 sm:hidden w-full px-5 mt-8 grid grid-cols-1 gap-4">
        {PILLARS.map((pillar, i) => {
          const accent = PILLAR_ACCENTS[i];
          return (
            <button
              key={i}
              onClick={() => setSelectedService(i)}
              className="w-full text-left flex items-center gap-4 p-4 rounded-xl focus:outline-none active:scale-[0.98] transition-transform"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${accent.border}`,
                boxShadow: `0 0 24px -8px ${accent.from}66`,
              }}
            >
              <div
                className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                  border: `1px solid ${accent.border}`,
                  color: '#fff',
                  boxShadow: `0 0 16px -4px ${accent.from}88`,
                }}
              >
                {pillar.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] uppercase tracking-[0.3em] mb-0.5"
                  style={{ color: accent.dot, fontFamily: 'var(--font-stack-heading)' }}
                >
                  {pillar.subtitle}
                </p>
                <p
                  className="font-bold text-base leading-tight"
                  style={{ color: '#fff', fontFamily: 'var(--font-stack-heading)' }}
                >
                  {pillar.title}
                </p>
              </div>
              <ArrowRight size={18} style={{ color: accent.dot, flexShrink: 0 }} />
            </button>
          );
        })}
      </div>

      <PillarOverlay
        pillarIndex={selectedService}
        onClose={() => setSelectedService(null)}
        onNavigate={setSelectedService}
      />
    </section>
  );
}