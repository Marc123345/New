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
    icon: <Building2 size={32} />,
    stats: [{ label: 'Avg. Engagement Lift', value: '3.2x' }, { label: 'Brand Impressions', value: '+180%' }, { label: 'Follower Growth', value: '+45%' }],
  },
  {
    subtitle: 'Pillar 02',
    title: 'Leadership Branding',
    description: 'People want to hear from other people. We help your executives step into the spotlight with purpose, clarity, and authenticity — positioning them as respected voices in your industry.',
    whatWeDo: ['Tailored content creation', 'Strategic alignment', 'Industry thought leadership', 'Ghost-writing'],
    closingNote: 'By helping leaders build presence, we position your company as the home of the voices shaping the industry.',
    icon: <Users size={32} />,
    stats: [{ label: 'Profile Views', value: '+240%' }, { label: 'Connection Growth', value: '5x' }, { label: 'Content Reach', value: '+320%' }],
  },
  {
    subtitle: 'Pillar 03',
    title: 'Advocacy Program',
    description: "The most trusted voices in your company aren't always in the C-suite — they're on your teams. Our Advocacy Program turns employees into empowered storytellers.",
    whatWeDo: ['Monthly workshops', 'Shareable content kits', 'Scalable infrastructure', 'Culture-first programming'],
    closingNote: 'We create internal champions who amplify your message and expand your reach through real human connection.',
    icon: <Megaphone size={32} />,
    stats: [{ label: 'Employee Reach', value: '10x' }, { label: 'Organic Amplification', value: '+560%' }, { label: 'Team Participation', value: '78%' }],
  },
];

const PILLAR_ACCENTS = [
  { from: '#6b21a8', to: '#9333ea', light: 'rgba(107,33,168,0.14)', border: 'rgba(147,51,234,0.3)', dot: '#c084fc' },
  { from: '#4a1d96', to: '#7c3aed', light: 'rgba(74,29,150,0.14)', border: 'rgba(124,58,237,0.3)', dot: '#a78bfa' },
  { from: '#2e1065', to: '#5b21b6', light: 'rgba(46,16,101,0.14)', border: 'rgba(91,33,182,0.3)', dot: '#8b5cf6' },
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
        <div
          className="relative z-10 w-full h-full rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500 group-hover:scale-110 border-2"
          style={{
            background: 'linear-gradient(135deg, #2e1065, rgba(164,108,252,0.4))',
            borderColor: '#9333ea',
            boxShadow: '0 0 24px rgba(164,108,252,0.35)',
          }}
        >
          <div className="text-white">{item.icon}</div>
        </div>

        <AnimatePresence>
          {showLabel && (
            <motion.div
              initial={{ opacity: 0, x: isRightHalf ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRightHalf ? 10 : -10 }}
              className={`absolute whitespace-nowrap z-50 pointer-events-none ${isRightHalf ? 'left-full ml-4' : 'right-full mr-4'}`}
            >
              <span className="text-xs uppercase tracking-widest px-3 py-1 bg-black/90 border border-white/20 text-white rounded">
                {item.subtitle}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

/**
 * PillarOverlay: Full-screen detail view using createPortal
 */
function PillarOverlay({ pillarIndex, onClose, onNavigate }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  // Cache the index using a Ref to prevent exit-animation crashes
  const activeIndexRef = useRef<number | null>(null);
  if (pillarIndex !== null) {
    activeIndexRef.current = pillarIndex;
  }
  
  const displayIndex = pillarIndex !== null ? pillarIndex : activeIndexRef.current;
  const displayService = displayIndex !== null ? PILLARS[displayIndex] : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle body scroll locking and Escape key
  useEffect(() => {
    if (pillarIndex !== null) {
      document.body.style.overflow = 'hidden';
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [pillarIndex, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {pillarIndex !== null && displayService && (
        <motion.div
          key="pillar-overlay-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-xl h-[100dvh] pointer-events-auto"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[10000] flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-white/20 transition-colors text-white cursor-pointer active:scale-95"
            aria-label="Close overlay"
          >
            <X size={20} />
          </button>

          {/* Content Area */}
          <div 
            ref={scrollRef} 
            className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-6 scrollbar-hide relative z-0" 
            style={{ paddingTop: 'max(5rem, calc(3.5rem + env(safe-area-inset-top)))', paddingBottom: '4rem' }}
          >
            <div className="max-w-3xl mx-auto space-y-12">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-4 text-purple-400 font-mono tracking-tighter">
                  <span className="h-px w-8 bg-purple-500" />
                  {displayService?.subtitle}
                </div>
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter">
                  {displayService?.title}
                </h2>
                <p className="text-xl text-white/60 leading-relaxed">
                  {displayService?.description}
                </p>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {displayService?.stats?.map((s: any, i: number) => (
                  <div key={i} className="p-3 sm:p-6 border border-white/10 bg-white/5 rounded-lg text-center">
                    <div className="text-lg sm:text-2xl font-bold text-purple-400 leading-tight">{s.value}</div>
                    <div className="text-[9px] sm:text-[10px] uppercase text-white/40 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Deliverables */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-widest text-white/30">What We Deliver</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {displayService?.whatWeDo?.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded">
                      <Check size={16} className="text-purple-500 flex-shrink-0" />
                      <span className="text-sm text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="relative z-20 p-4 sm:p-6 border-t border-white/10 bg-black/80 backdrop-blur-md flex justify-between items-center" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
             <button
               type="button"
               disabled={displayIndex === 0}
               onClick={() => onNavigate(displayIndex - 1)}
               className="flex items-center gap-2 text-white/50 hover:text-white disabled:opacity-20 min-h-[44px] min-w-[44px] px-2 cursor-pointer"
             >
               <ArrowLeft size={20} /> <span className="hidden sm:inline">Prev</span>
             </button>
             <div className="flex gap-2">
                {PILLARS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 transition-all duration-300 rounded-full ${i === displayIndex ? 'w-8 bg-purple-500' : 'w-2 bg-white/20'}`}
                  />
                ))}
             </div>
             <button
               type="button"
               disabled={displayIndex === PILLARS.length - 1}
               onClick={() => onNavigate(displayIndex + 1)}
               className="flex items-center gap-2 text-white/50 hover:text-white disabled:opacity-20 min-h-[44px] min-w-[44px] px-2 cursor-pointer"
             >
               <span className="hidden sm:inline">Next</span> <ArrowRight size={20} />
             </button>
          </div>
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
      {/* Background Video */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-20">
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0e0820]/80 to-[#0e0820]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center pointer-events-none">
        <h1 className="text-6xl md:text-9xl font-bold text-white/10 uppercase tracking-tighter mb-4">
          Framework
        </h1>
        <p className="text-purple-400 font-mono tracking-widest uppercase text-sm">Three Pillars. One Ecosystem.</p>
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
      <div className="relative z-30 sm:hidden w-full px-6 mt-12 space-y-4">
        {PILLARS.map((p, i) => (
          <button 
            key={i} 
            onClick={() => setSelectedService(i)}
            className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between text-white active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-600/20 rounded-lg text-purple-400">{p.icon}</div>
              <div className="text-left">
                <div className="text-[10px] text-purple-400 uppercase">{p.subtitle}</div>
                <div className="font-bold">{p.title}</div>
              </div>
            </div>
            <ArrowRight size={20} className="text-purple-500" />
          </button>
        ))}
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