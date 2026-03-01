import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { SignalGridPanel } from './SignalGridPanel';

const CAPABILITIES = [
  { 
    id: '01', 
    tag: 'Strategy', 
    title: 'Brand Ecosystems',
    desc: 'We don’t just post; we architect. We define your unique digital footprint, positioning, and market gaps to ensure every piece of content drives measurable business goals.' 
  },
  { 
    id: '02', 
    tag: 'Creative', 
    title: 'Visual Storytelling',
    desc: 'High-end content creation that stops the scroll. From kinetic typography to cinematic video editing, we build assets that demand attention and command authority.' 
  },
  { 
    id: '03', 
    tag: 'Growth', 
    title: 'Performance Scaling',
    desc: 'Organic reach meets precision amplification. We scale your ecosystem to capture real market share, utilizing data-driven loops to maximize your return on attention.' 
  },
  { 
    id: '04', 
    tag: 'Community', 
    title: 'Human Connection',
    desc: 'Brands talk at people; humans talk with them. We manage your community, fostering authentic engagement and turning passive followers into vocal advocates.' 
  },
];

/**
 * Individual Stacking Card
 */
function StackingCard({ cap, index, total }: { cap: typeof CAPABILITIES[0], index: number, total: number }) {
  // Sticky top positioning calculates the offset so cards stack visibly like a deck
  const topOffset = `calc(15vh + ${index * 40}px)`;

  return (
    <div 
      className="sticky w-full"
      style={{ top: topOffset, paddingBottom: '40px' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full rounded-2xl md:rounded-3xl overflow-hidden relative shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
        style={{
          background: '#0a0616', // Very dark, solid background for contrast
          borderTop: '1px solid rgba(164,108,252,0.4)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Subtle inner gradient strictly for texture, no text wash-out */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row gap-8 md:gap-12 min-h-[350px]">
          {/* Left Column of Card */}
          <div className="md:w-1/3 flex flex-col justify-between">
            <span className="font-mono text-sm tracking-widest text-purple-400">
              // {cap.id}
            </span>
            <div className="mt-8 md:mt-0">
              <span className="inline-block px-3 py-1 rounded-full border border-purple-500/30 text-xs font-bold uppercase tracking-widest text-white/80 mb-4 bg-purple-500/10">
                {cap.tag}
              </span>
            </div>
          </div>

          {/* Right Column of Card */}
          <div className="md:w-2/3 flex flex-col justify-center">
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-none mb-6">
              {cap.title}
            </h3>
            <p className="text-lg md:text-xl leading-relaxed text-[#E2DDF0]">
              {cap.desc}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function AboutStory() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth out the scroll progress for a parallax effect on the background
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 });
  const bgY = useTransform(smoothProgress, [0, 1], ['0%', '20%']);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full bg-[#03000a] selection:bg-purple-500/30"
    >
      {/* Background Texture - Deep and unobtrusive */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ 
          y: bgY,
          backgroundImage: 'radial-gradient(circle at 50% 0%, #2e1065 0%, transparent 60%)' 
        }}
      />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Intro Header - High Contrast */}
        <div className="pt-32 pb-16 md:pt-48 md:pb-32 border-b border-white/10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-[clamp(2.5rem,6vw,6rem)] leading-[1.05] font-bold tracking-tighter text-white uppercase max-w-5xl">
              We engineer digital presence that <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#E2DDF0]">feels alive.</span>
            </h2>
          </motion.div>
        </div>

        {/* Pinned Scroll Section */}
        <div className="flex flex-col lg:flex-row relative">
          
          {/* Left Side: Sticky Information & Signal Grid */}
          <div className="lg:w-5/12 relative">
            <div className="lg:sticky lg:top-0 lg:h-screen py-16 md:py-32 flex flex-col justify-center pr-0 lg:pr-12">
              
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                The Paradigm Shift
              </h3>
              <p className="text-[#E2DDF0] text-lg md:text-xl leading-relaxed mb-12 max-w-md">
                We believe the most impactful brands are the ones that know how to connect, not just communicate. People want personality. We combine insight with efficiency to build ecosystems that work across every platform.
              </p>

              {/* Contained, high-contrast container for the Signal Grid */}
              <div className="w-full h-[300px] md:h-[400px] rounded-2xl border border-white/10 bg-black overflow-hidden relative shadow-[0_0_40px_rgba(164,108,252,0.1)]">
                <SignalGridPanel />
                
                {/* Overlay UI to give it a tech/dashboard feel */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/80">Network Active</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Side: Scrolling Card Stack */}
          <div className="lg:w-7/12 relative pb-[20vh] lg:pb-[30vh] pt-16 lg:pt-32">
            <div className="flex flex-col gap-4">
              {CAPABILITIES.map((cap, i) => (
                <StackingCard 
                  key={cap.id} 
                  cap={cap} 
                  index={i} 
                  total={CAPABILITIES.length} 
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}