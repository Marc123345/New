import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useSpring, AnimatePresence } from 'framer-motion';

// Refined data for a "Space Nebula" feel
const NODES_DATA = [
  { id: 'strategy', label: 'Strategy', subLabel: 'Brand Direction', size: 80, x: '20%', y: '30%' },
  { id: 'creative', label: 'Creative', subLabel: 'Visual Storytelling', size: 70, x: '70%', y: '20%' },
  { id: 'growth', label: 'Growth', subLabel: 'Performance', size: 65, x: '80%', y: '60%' },
  { id: 'social', label: 'Social', subLabel: 'Community', size: 75, x: '15%', y: '70%' },
  { id: 'content', label: 'Content', subLabel: 'Editorial', size: 60, x: '45%', y: '15%' },
  { id: 'analytics', label: 'Analytics', subLabel: 'Data Insight', size: 85, x: '55%', y: '80%' },
];

function FloatingNode({ node, containerRef }: { node: any; containerRef: React.RefObject<HTMLDivElement> }) {
  const [hovered, setHovered] = useState(false);
  
  // Physics for organic floating
  const springX = useSpring(0, { stiffness: 30, damping: 15 });
  const springY = useSpring(0, { stiffness: 30, damping: 15 });

  useEffect(() => {
    // Subtle continuous movement
    const move = () => {
      springX.set(Math.random() * 20 - 10);
      springY.set(Math.random() * 20 - 10);
    };
    const interval = setInterval(move, 3000);
    move();
    return () => clearInterval(interval);
  }, [springX, springY]);

  return (
    <motion.div
      className="absolute z-20"
      style={{ 
        left: node.x, 
        top: node.y, 
        x: springX, 
        y: springY 
      }}
    >
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative flex items-center justify-center rounded-full cursor-pointer group"
        style={{
          width: node.size,
          height: node.size,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
        whileHover={{ scale: 1.1, borderColor: 'rgba(255, 255, 255, 0.5)' }}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-white text-center px-2">
          {node.label}
        </span>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -bottom-10 whitespace-nowrap bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md"
            >
              <span className="text-[9px] font-medium uppercase tracking-widest text-white">
                {node.subLabel}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function VideoCinematicAct() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoUrl = "https://ik.imagekit.io/qcvroy8xpd/Shannon_s_Space_Video_Creation.mp4?updatedAt=1772017940529";

  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black flex items-center">
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12">
        {/* Content Side */}
        <div className="flex flex-col justify-center">
          <motion.h4 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white/60 text-xs font-bold tracking-[0.5em] uppercase mb-4"
          >
            Digital Frontiers
          </motion.h4>
          <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-6xl md:text-7xl font-light text-white leading-tight mb-8"
          >
            Expand <br /> 
            <span className="italic font-serif">Your Vision</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-md text-gray-300 text-lg leading-relaxed"
          >
            We merge cinematic storytelling with deep technical expertise to build 
            the ecosystems of tomorrow.
          </motion.p>
        </div>

        {/* Interactive Side */}
        <div className="relative h-[500px] lg:h-[600px]">
          {NODES_DATA.map((node) => (
            <FloatingNode key={node.id} node={node} containerRef={containerRef} />
          ))}
        </div>
      </div>

      {/* Aesthetic Border Glow */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </section>
  );
}