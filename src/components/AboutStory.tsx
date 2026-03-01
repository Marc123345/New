import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
} from 'motion/react';
import { SignalGridPanel } from './SignalGridPanel';

// Ultra-smooth easing curve common in award-winning sites
const CUSTOM_EASE = [0.16, 1, 0.3, 1];

const CAPABILITIES = [
  { tag: 'Strategy', desc: 'Brand positioning, market analysis, and defining your unique digital footprint.' },
  { tag: 'Creative', desc: 'Visual storytelling and high-end content creation that stops the scroll.' },
  { tag: 'Growth', desc: 'Performance marketing and scaling ecosystems to capture real market share.' },
  { tag: 'Social', desc: 'Community management, authentic engagement, and audience retention.' },
  { tag: 'Content', desc: 'Editorial planning, copywriting, and end-to-end production pipelines.' },
  { tag: 'Analytics', desc: 'Data-driven insights, iterative optimization, and ROI tracking.' },
];

/**
 * Animated Word for cinematic headline reveals
 */
function AnimatedWord({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="inline-block overflow-hidden pb-2 mr-4">
      <motion.span
        className="inline-block origin-bottom"
        initial={{ y: '120%', rotateZ: 5, opacity: 0 }}
        whileInView={{ y: '0%', rotateZ: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.2, delay, ease: CUSTOM_EASE }}
      >
        {text}
      </motion.span>
    </span>
  );
}

/**
 * Expansive Interactive Row for Capabilities
 */
function CapabilityRow({
  cap,
  index,
  isHovered,
  hasActiveHover,
  onHover,
  onLeave,
}: {
  cap: typeof CAPABILITIES[0];
  index: number;
  isHovered: boolean;
  hasActiveHover: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="group relative border-b border-white/10 cursor-pointer overflow-hidden"
      animate={{
        opacity: hasActiveHover ? (isHovered ? 1 : 0.3) : 1,
      }}
      transition={{ duration: 0.4, ease: CUSTOM_EASE }}
    >
      <div className="flex flex-col justify-center py-8 md:py-12 px-4 md:px-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-6">
            <span className="text-purple-400 font-mono text-xs md:text-sm mt-2 opacity-50">
              0{index + 1}
            </span>
            <h3 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white transition-transform duration-500 group-hover:translate-x-4">
              {cap.tag}
            </h3>
          </div>
          <motion.div
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
            animate={{ rotate: isHovered ? 45 : 0 }}
          >
            <span className="text-white">↗</span>
          </motion.div>
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: CUSTOM_EASE }}
              className="ml-12 md:ml-16 overflow-hidden"
            >
              <p className="pt-6 text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
                {cap.desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Background highlight pill */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent z-0 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.6, ease: CUSTOM_EASE }}
      />
    </motion.div>
  );
}

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCap, setActiveCap] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const signalParallax = useTransform(scrollYProgress, [0, 1], ['-5%', '15%']);

  // Smooth mouse tracking for ambient glow
  const smoothX = useSpring(mousePos.x, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mousePos.y, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-[#050505] overflow-hidden"
      style={{ minHeight: '100vh', paddingBottom: '8rem' }}
    >
      {/* Ambient Mouse Tracking Light */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(164,108,252,0.8) 0%, transparent 60%)',
          x: useTransform(smoothX, x => x - 400),
          y: useTransform(smoothY, y => y - 400),
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pt-32 md:pt-48">
        
        {/* --- Header / Hook Section --- */}
        <div className="mb-32 md:mb-48">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-12 h-px bg-purple-500" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-purple-400">
              The Paradigm Shift
            </span>
          </motion.div>

          <h2 className="text-[clamp(3rem,8vw,8rem)] leading-[0.9] font-bold uppercase tracking-tighter text-white">
            <div className="flex flex-wrap">
              <AnimatedWord text="From" delay={0.1} />
              <AnimatedWord text="Brand" delay={0.15} />
              <AnimatedWord text="Voice" delay={0.2} />
            </div>
            <div className="flex flex-wrap text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.8)' }}>
              <AnimatedWord text="To" delay={0.25} />
              <AnimatedWord text="Human" delay={0.3} />
            </div>
            <div className="flex flex-wrap text-purple-400">
              <AnimatedWord text="Connection." delay={0.35} />
            </div>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6, ease: CUSTOM_EASE }}
            className="mt-12 text-xl md:text-3xl text-white/50 max-w-3xl leading-snug"
          >
            We believe the most impactful brands are the ones that know how to connect, not just communicate. People want personality.
          </motion.p>
        </div>

        {/* --- Story & Signal Overlap Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 mb-32 md:mb-48 relative">
          
          <motion.div 
            className="lg:col-span-7 lg:pr-12 z-20"
            style={{ y: parallaxY }}
          >
            <div className="bg-[#0a0a0a] border border-white/10 p-8 md:p-16 rounded-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent opacity-50" />
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                A social-first agency built to make your digital presence feel alive.
              </h3>
              <p className="text-lg md:text-xl text-white/60 leading-relaxed">
                We help companies build authentic relationships through strategic
                content, thought leadership, and employee advocacy — turning every
                touchpoint into a meaningful conversation. We combine insight with efficiency to build ecosystems that work across every stage of growth.
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-5 h-[400px] lg:h-auto lg:absolute lg:right-0 lg:top-24 lg:w-[45%] z-10"
            style={{ y: signalParallax }}
          >
            <div className="w-full h-full bg-[#111] border border-white/5 rounded-2xl overflow-hidden relative group">
               <SignalGridPanel />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
               <div className="absolute bottom-6 left-6 flex items-center gap-3">
                 <span className="relative flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                 </span>
                 <span className="font-mono text-xs uppercase tracking-widest text-white/70">Live Ecosystem</span>
               </div>
            </div>
          </motion.div>

        </div>

        {/* --- Capabilities Accordion --- */}
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-16"
          >
             <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">
              Our Capabilities
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </motion.div>

          <div className="border-t border-white/10">
            {CAPABILITIES.map((cap, i) => (
              <CapabilityRow
                key={cap.tag}
                cap={cap}
                index={i}
                isHovered={activeCap === i}
                hasActiveHover={activeCap !== null}
                onHover={() => setActiveCap(i)}
                onLeave={() => setActiveCap(null)}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}