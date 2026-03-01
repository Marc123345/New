import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SignalGridPanel } from './SignalGridPanel';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

const CAPABILITIES = [
  { tag: 'Strategy', desc: 'Brand positioning & market analysis' },
  { tag: 'Creative', desc: 'Visual storytelling & content creation' },
  { tag: 'Growth', desc: 'Performance marketing & scaling' },
  { tag: 'Social', desc: 'Community management & engagement' },
  { tag: 'Content', desc: 'Editorial planning & production' },
  { tag: 'Analytics', desc: 'Data-driven insights & optimization' },
];

/**
 * Section Badge - Strictly Sharp Edges
 */
function SectionBadge({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className="inline-block mb-12"
    >
      <div className="inline-flex items-center gap-4 px-5 py-2 border border-purple-500/30 bg-purple-500/5 backdrop-blur-sm">
        <motion.div
          className="w-1.5 h-1.5 bg-[var(--color-secondary,#a46cfc)]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span
          className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-white"
          style={{ fontFamily: 'var(--font-stack-heading)' }}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Stacking Card - High Contrast, Sharp Edges, Original Content
 */
function StackingCard({ cap, index }: { cap: typeof CAPABILITIES[0]; index: number }) {
  // Staggers the sticky top position so previous cards peek out behind the current one
  const topOffset = `calc(15vh + ${index * 45}px)`;

  return (
    <div className="sticky w-full" style={{ top: topOffset, paddingBottom: '45px' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        className="w-full bg-[#050505] border-t border-l border-r border-white/20 shadow-[0_-15px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between min-h-[280px]"
      >
        {/* Top Header of Card */}
        <div className="p-8 md:p-12 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <span className="font-mono text-xs tracking-widest text-purple-400 opacity-80">
            // 0{index + 1}
          </span>
          <h4 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white">
            {cap.tag}
          </h4>
        </div>
        
        {/* Bottom Description of Card */}
        <div className="p-8 md:p-12 bg-[#020202] flex justify-start md:justify-end">
          <p className="text-lg md:text-xl text-[#E2DDF0] font-medium tracking-wide text-left md:text-right max-w-md">
            {cap.desc}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Subtle parallax for the background grid to give depth without ruining contrast
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <section
      ref={sectionRef}
      id="about"
      // Added relative, z-20, bg-black, and heavy padding to fix layout bleed from the section above
      className="relative z-20 w-full bg-black pt-32 md:pt-48 pb-32 overflow-hidden border-t border-white/10"
    >
      {/* Subtle Sharp Grid Background */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          y: bgY,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* --- Header Section (Original Content) --- */}
        <div className="flex flex-col items-center text-center mb-24 md:mb-40">
          <SectionBadge label="About Us" />

          <h2 className="text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[1.05] font-extrabold text-white uppercase tracking-[-0.04em] mb-10">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
            >
              From Brand Voice
            </motion.span>
            <motion.span
              className="block mt-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT_EXPO }}
            >
              <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #ffffff' }}>
                To Human
              </span>{' '}
              Connection
            </motion.span>
          </h2>

          <motion.p
            className="max-w-2xl text-lg md:text-xl text-[#E2DDF0] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_EXPO }}
          >
            We believe the most impactful brands are the ones that know how to
            connect, not just communicate. People want personality — brands that
            speak like humans and offer something meaningful.
          </motion.p>
        </div>

        {/* --- Pinned Scroll Layout --- */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
          
          {/* Left Column: Sticky Story & Signal Grid */}
          <div className="lg:w-1/2 relative">
            <div className="lg:sticky lg:top-[15vh] flex flex-col gap-8">
              
              {/* Story Box */}
              <div className="bg-[#050505] border border-white/20 p-8 md:p-12">
                <span className="block text-[0.65rem] font-bold uppercase tracking-[0.25em] text-purple-400 mb-6">
                  Our Story
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight leading-snug mb-6">
                  A social-first agency built to help brands grow by making their digital presence feel more human.
                </h3>
                <p className="text-[#E2DDF0] text-base md:text-lg leading-relaxed mb-8">
                  We help companies build authentic relationships through strategic content, thought leadership, and employee advocacy — turning every touchpoint into a meaningful conversation.
                </p>
                <div className="w-full h-px bg-white/10" />
                <p className="text-[#E2DDF0] text-base md:text-lg leading-relaxed mt-8 font-medium">
                  We combine insight with efficiency to build brand ecosystems that work — across every platform and stage of growth.
                </p>
              </div>

              {/* Signal Grid Panel embedded in a sharp container */}
              <div className="w-full h-[350px] bg-[#020202] border border-white/20 relative overflow-hidden group">
                <SignalGridPanel />
                
                {/* Tech overlay badge */}
                <div className="absolute bottom-4 right-4 flex items-center gap-3 px-3 py-2 bg-black border border-white/10">
                  <span className="text-[0.6rem] uppercase tracking-widest text-white/60 font-mono">
                    Live Network
                  </span>
                  <div className="w-2 h-2 bg-green-500 animate-pulse" />
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Scrolling Card Stack */}
          <div className="lg:w-1/2 relative pb-[10vh] pt-12 lg:pt-0">
            <div className="flex flex-col relative">
              {CAPABILITIES.map((cap, i) => (
                <StackingCard key={cap.tag} cap={cap} index={i} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}