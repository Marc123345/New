import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Users, Megaphone, X, ArrowLeft, ArrowRight, Check } from 'lucide-react';

const VIDEO_URL = 'https://ik.imagekit.io/qcvroy8xpd/rotating-galaxy-4k-2026-01-28-03-26-41-utc.mp4';

const PILLARS = [
  {
    subtitle: 'Pillar 01',
    title: 'Company Pages',
    description: "Your company's social presence is your digital storefront, but most brands leave it looking empty or generic. We turn your pages into platforms for thought leadership, brand storytelling, and meaningful engagement.",
    whatWeDo: ['Brand awareness campaigns', 'Product promotion', 'Employer branding', 'Community engagement', 'Video content'],
    closingNote: null,
    icon: <Building2 size={28} />,
    image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200',
    stats: [{ label: 'Avg. Engagement Lift', value: '3.2x' }, { label: 'Brand Impressions', value: '+180%' }, { label: 'Follower Growth', value: '+45%' }],
  },
  {
    subtitle: 'Pillar 02',
    title: 'Leadership Branding',
    description: 'People want to hear from other people. We help your executives step into the spotlight with purpose, clarity, and authenticity — positioning them as respected voices in your industry.',
    whatWeDo: ['Tailored content creation', 'Strategic alignment', 'Industry thought leadership', 'Ghost-writing'],
    closingNote: 'By helping leaders build presence, we position your company as the home of the voices shaping the industry.',
    icon: <Users size={28} />,
    image: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1200',
    stats: [{ label: 'Profile Views', value: '+240%' }, { label: 'Connection Growth', value: '5x' }, { label: 'Content Reach', value: '+320%' }],
  },
  {
    subtitle: 'Pillar 03',
    title: 'Advocacy Program',
    description: "The most trusted voices in your company aren't always in the C-suite — they're on your teams. Our Advocacy Program turns employees into empowered storytellers.",
    whatWeDo: ['Monthly workshops', 'Shareable content kits', 'Scalable infrastructure', 'Culture-first programming'],
    closingNote: 'We create internal champions who amplify your message and expand your reach through real human connection.',
    icon: <Megaphone size={28} />,
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200',
    stats: [{ label: 'Employee Reach', value: '10x' }, { label: 'Organic Amplification', value: '+560%' }, { label: 'Team Participation', value: '78%' }],
  },
];

const PILLAR_ACCENTS = [
  { from: '#291e56', to: '#4a2d8a', light: 'rgba(164,108,252,0.12)', border: 'rgba(164,108,252,0.35)', dot: '#a46cfc' },
  { from: '#3d2670', to: '#7c4bc0', light: 'rgba(177,129,252,0.15)', border: 'rgba(177,129,252,0.45)', dot: '#c084fc' },
  { from: '#4a2d8a', to: '#a46cfc', light: 'rgba(177,129,252,0.18)', border: 'rgba(177,129,252,0.5)', dot: '#b181fc' },
];

/**
 * OrbitNode: Individual interactive icons in the desktop orbit
 */
function OrbitNode({ item, index, total, radius, onSelect, activeLabel, onToggleLabel }: any) {
  const angle = (index / total) * 2 * Math.PI;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const showLabel = activeLabel === index;
  const isRightHalf = x > 0;
  const accent = PILLAR_ACCENTS[index];

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 z-30"
      style={{ x, y, marginLeft: -32, marginTop: -32 }} 
    >
      <motion.button
        onClick={() => onSelect(index)}
        onMouseEnter={() => onToggleLabel(index)}
        onMouseLeave={() => onToggleLabel(null)}
        animate={{ rotate: -360 }}
        transition={{ duration: 120, ease: 'linear', repeat: Infinity }}
        className="group relative flex items-center justify-center w-16 h-16 rounded-full focus:outline-none pointer-events-auto"
      >
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: accent.dot }}
        />

        <div
          className="relative z-10 w-full h-full rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500 group-hover:scale-110 border border-white/20"
          style={{
            background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
            boxShadow: `inset 0 0 12px rgba(255,255,255,0.2), 0 0 24px ${accent.light}`,
          }}
        >
          <div className="text-white drop-shadow-md">{item.icon}</div>
        </div>

        <AnimatePresence>
          {showLabel && (
            <motion.div
              initial={{ opacity: 0, x: isRightHalf ? 10 : -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: isRightHalf ? 10 : -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute whitespace-nowrap z-50 pointer-events-none ${isRightHalf ? 'left-full ml-6' : 'right-full mr-6'}`}
            >
              <div
                className="px-4 py-2 bg-[#0e0820]/90 backdrop-blur-xl border shadow-xl"
                style={{ borderColor: accent.border, boxShadow: `4px 4px 0 ${accent.dot}44` }}
              >
                <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: accent.dot }}>
                  {item.subtitle}
                </div>
                <div className="text-white text-sm font-semibold tracking-wide">
                  {item.title}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

/**
 * PillarOverlay: Modal view using createPortal
 */
function PillarOverlay({ pillarIndex, onClose, onNavigate }: any) {
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
        if (e.key === 'ArrowRight' && displayIndex < PILLARS.length - 1) onNavigate(displayIndex + 1);
        if (e.key === 'ArrowLeft' && displayIndex > 0) onNavigate(displayIndex - 1);
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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {pillarIndex !== null && displayService && (
        <motion.div
          key="pillar-overlay-backdrop"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.3 }}
          // We added an onClick here to close the modal when clicking outside of it
          onClick={onClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0e0820]/80 p-4 sm:p-6 md:p-12 pointer-events-auto"
        >
          {/* Inner Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            // We stop propagation here so clicking INSIDE the modal doesn't trigger the close
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col w-full max-w-4xl bg-[#0e0820] rounded-2xl shadow-2xl overflow-hidden"
            style={{
              maxHeight: 'calc(100vh - 2rem)', // Ensures it doesn't touch the top/bottom of screen
              border: `2px solid ${accent.border}`,
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px ${accent.light}`,
            }}
          >
            {/* Ambient Glow */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-64 blur-[100px] rounded-full opacity-30 pointer-events-none transition-colors duration-700"
              style={{ backgroundColor: accent.dot }}
            />

            {/* Close Button Inside the Modal */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-[10000] flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/20 bg-black/40 hover:bg-white/20 transition-all text-white cursor-pointer active:scale-95 group backdrop-blur-md"
              aria-label="Close overlay"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Content Area */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto min-h-0 px-6 sm:px-10 py-10 scrollbar-hide relative z-10" 
            >
              <div className="max-w-3xl mx-auto space-y-12">
                {/* Hero Image */}
                {displayService?.image && (
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
                    {displayService?.title}
                  </h2>
                  <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl">
                    {displayService?.description}
                  </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div 
                  key={`stats-${displayIndex}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="grid grid-cols-3 gap-3 sm:gap-6"
                >
                  {displayService?.stats?.map((s: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 sm:p-6 bg-black/20 backdrop-blur-md text-center relative overflow-hidden group transition-all duration-300 rounded-lg"
                      style={{
                        border: `1px solid ${accent.border}`,
                        boxShadow: `4px 4px 0 ${accent.dot}44`,
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = `6px 6px 0 ${accent.dot}66`; (e.currentTarget as HTMLDivElement).style.transform = `translate(-2px, -2px)`;}}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = `4px 4px 0 ${accent.dot}44`; (e.currentTarget as HTMLDivElement).style.transform = `translate(0, 0)`;}}
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

                {/* Deliverables */}
                <motion.div 
                  key={`deliv-${displayIndex}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="space-y-6"
                >
                  <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold">What We Deliver</h4>
                  <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                    {displayService?.whatWeDo?.map((item: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-4 bg-white/5 border rounded-lg transition-all duration-200"
                        style={{
                          borderColor: accent.border,
                        }}
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

                {displayService?.closingNote && (
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

            {/* Navigation Footer */}
            <div className="relative z-20 p-4 sm:p-6 border-t border-white/10 bg-black/40 backdrop-blur-xl flex justify-between items-center">
               <button
                 type="button"
                 disabled={displayIndex === 0}
                 onClick={() => onNavigate(displayIndex - 1)}
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
                 onClick={() => onNavigate(displayIndex + 1)}
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

export function EcosystemServices() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [isHoveringOrbit, setIsHoveringOrbit] = useState(false);
  const [activeLabel, setActiveLabel] = useState<number | null>(null);
  const [orbitRadius, setOrbitRadius] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      setOrbitRadius(window.innerWidth < 640 ? 140 : window.innerWidth < 1024 ? 220 : 300);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0e0820]">
      {/* Background Video with Radial Fade */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-[0.15]">
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0e0820_90%)]" />
      </div>

      {/* Central Hub & Text — hidden on mobile, shown on desktop */}
      <div className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none z-10">
        <div
          className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full blur-[100px]"
          style={{ background: 'rgba(164,108,252,0.08)' }}
        />
        <div className="relative text-center">
          <h1
            className="font-bold uppercase tracking-tighter mb-4"
            style={{
              fontSize: 'clamp(3rem, 12vw, 9rem)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.2)',
            }}
          >
            Framework
          </h1>
          <p
            className="font-mono tracking-widest uppercase text-xs sm:text-sm"
            style={{ color: 'var(--color-secondary, #a46cfc)' }}
          >
            Three Pillars. One Ecosystem.
          </p>
        </div>
      </div>

      {/* Interactive Orbit (Desktop) */}
      <div 
        className="hidden sm:flex absolute inset-0 z-20 items-center justify-center pointer-events-none"
      >
        <div 
          className="relative w-[600px] h-[600px] pointer-events-auto"
          onMouseEnter={() => setIsHoveringOrbit(true)}
          onMouseLeave={() => setIsHoveringOrbit(false)}
        >
          {/* Faint Orbit Track */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{ width: orbitRadius * 2, height: orbitRadius * 2, border: '1px solid rgba(164,108,252,0.12)' }}
          />

          <div
            className="absolute inset-0"
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
                onToggleLabel={setActiveLabel}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Grid */}
      <div className="relative z-30 sm:hidden w-full px-6 py-16 space-y-4 flex flex-col">
        <div className="text-center mb-8">
          <h1
            className="font-bold uppercase tracking-tighter mb-3"
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(2.2rem, 11vw, 5rem)',
              lineHeight: 1.05,
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.25)',
              letterSpacing: '-0.02em',
            }}
          >
            Framework
          </h1>
          <p
            className="font-mono uppercase"
            style={{
              fontSize: 'clamp(0.65rem, 3vw, 0.8rem)',
              letterSpacing: '0.2em',
              color: 'var(--color-secondary)',
            }}
          >
            Three Pillars. One Ecosystem.
          </p>
        </div>
        {PILLARS.map((p, i) => {
          const accent = PILLAR_ACCENTS[i];
          return (
            <button
              key={i}
              onClick={() => setSelectedService(i)}
              className="group w-full p-5 bg-white/5 backdrop-blur-sm border flex items-center justify-between text-white overflow-hidden relative"
              style={{
                borderColor: accent.border,
                borderWidth: '2px',
                borderRadius: 0,
                boxShadow: `4px 4px 0 ${accent.dot}55`,
                transition: 'box-shadow 0.18s ease, transform 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `6px 6px 0 ${accent.dot}88`;
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `4px 4px 0 ${accent.dot}55`;
                e.currentTarget.style.transform = 'translate(0, 0)';
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `linear-gradient(90deg, ${accent.light}, transparent)` }}
              />
              <div className="flex items-center gap-4 relative z-10">
                <div
                  className="p-3 border"
                  style={{
                    background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                    borderColor: accent.dot,
                    boxShadow: `3px 3px 0 ${accent.dot}55`,
                  }}
                >
                  {p.icon}
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: accent.dot }}>
                    {p.subtitle}
                  </div>
                  <div className="font-bold tracking-wide">{p.title}</div>
                </div>
              </div>
              <ArrowRight size={20} className="relative z-10 transition-transform group-hover:translate-x-1" style={{ color: accent.dot }} />
            </button>
          );
        })}
      </div>

      <PillarOverlay
        pillarIndex={selectedService}
        onClose={() => setSelectedService(null)}
        onNavigate={setSelectedService}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}} />
    </section>
  );
}