import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

// depth: 1 (front) to 3 (back)
const NODES_DATA = [
  { id: '1', label: 'Strategy', x: 20, y: 30, depth: 1.2, size: 90 },
  { id: '2', label: 'Creative', x: 70, y: 25, depth: 1.8, size: 70 },
  { id: '3', label: 'Growth', x: 85, y: 65, depth: 1.1, size: 80 },
  { id: '4', label: 'Social', x: 15, y: 75, depth: 2.2, size: 60 },
  { id: '5', label: 'Data', x: 45, y: 85, depth: 1.5, size: 75 },
  { id: '6', label: 'Narrative', x: 55, y: 15, depth: 2.5, size: 55 },
];

function InteractiveNode({ node, mouseX, mouseY }: { node: any, mouseX: any, mouseY: any }) {
  // Parallax movement based on depth
  const x = useTransform(mouseX, (val: number) => (val * 50) / node.depth);
  const y = useTransform(mouseY, (val: number) => (val * 50) / node.depth);
  
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        x,
        y,
        filter: `blur(${node.depth > 2 ? '2px' : '0px'})`,
        opacity: 1 / node.depth + 0.3,
      }}
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.1, boxShadow: "0 0 40px rgba(255,255,255,0.2)" }}
        className="relative flex items-center justify-center rounded-full cursor-pointer border border-white/20 bg-white/5 backdrop-blur-xl transition-colors hover:bg-white/10"
        style={{ width: node.size, height: node.size }}
      >
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
        
        <span className="text-[10px] font-bold uppercase tracking-widest text-white text-center px-2 leading-tight">
          {node.label}
        </span>

        {/* Floating Detail Tag */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black text-[9px] font-black uppercase tracking-tighter"
            >
              Explore Node
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function OrbitalAct() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track normalized mouse position (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothed versions for the video and text
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 100 });

  // Video and Text parallax transforms
  const videoScale = useTransform(smoothX, [-0.5, 0.5], [1.1, 1.15]);
  const videoX = useTransform(smoothX, [-0.5, 0.5], [-20, 20]);
  const textX = useTransform(smoothX, [-0.5, 0.5], [10, -10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen overflow-hidden bg-[#050505] flex items-center justify-center"
    >
      {/* 1. Cinematic Background Video Layer */}
      <motion.div 
        style={{ scale: videoScale, x: videoX }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-70"
        >
          <source src="https://ik.imagekit.io/qcvroy8xpd/envato_video_gen_Feb_23_2026_16_41_55.mp4?updatedAt=1771864939536" type="video/mp4" />
        </video>
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </motion.div>

      {/* 2. Middle Ground: Hero Text */}
      <motion.div 
        style={{ x: textX }}
        className="relative z-10 text-center pointer-events-none px-4"
      >
        <motion.h4 
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 0.6, letterSpacing: "0.5em" }}
          className="text-white text-xs font-bold uppercase mb-4"
        >
          The Future of Digital
        </motion.h4>
        <h2 className="text-7xl md:text-9xl font-black text-white uppercase leading-[0.85] tracking-tighter italic">
          Deep <br /> Space
        </h2>
      </motion.div>

      {/* 3. Foreground: Interactive Parallax Nodes */}
      <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
        <div className="relative w-full h-full pointer-events-auto">
          {NODES_DATA.map((node) => (
            <InteractiveNode 
              key={node.id} 
              node={node} 
              mouseX={smoothX} 
              mouseY={smoothY} 
            />
          ))}
        </div>
      </div>

      {/* 4. Decorative UI Elements */}
      <div className="absolute bottom-10 left-10 z-30 flex items-center gap-4">
         <div className="h-[1px] w-20 bg-white/30" />
         <span className="text-[10px] text-white/50 uppercase tracking-[0.3em]">System.Active</span>
      </div>
      
      <div className="absolute top-10 right-10 z-30">
        <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
        </div>
      </div>

    </section>
  );
}