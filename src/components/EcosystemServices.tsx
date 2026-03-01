/**
 * PillarOverlay: Full-screen detail view using createPortal
 */
function PillarOverlay({ pillarIndex, onClose, onNavigate }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  // Cache the index using a Ref. This is completely immune to render-cycle crashes
  // and keeps the data alive perfectly for Framer Motion's exit animation.
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
          // Added pointer-events-auto to forcefully break out of any invisible traps
          className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-xl h-[100dvh] pointer-events-auto"
        >
          {/* Close Button - Changed to fixed and added explicit z-index/pointer rules */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Stop clicks from bleeding through
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