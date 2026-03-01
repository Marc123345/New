import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useSpring, useInView, AnimatePresence } from 'framer-motion';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

interface ConstellationNode {
  id: string;
  label: string;
  subLabel: string;
  baseX: number;
  baseY: number;
  size: number;
  floatOffset: number;
  floatSpeed: number;
  orbitRadius: number;
  orbitAngle: number;
  orbitSpeed: number;
}

const NODES_DATA: Omit<ConstellationNode, 'baseX' | 'baseY'>[] = [
  { id: 'strategy', label: 'Strategy', subLabel: 'Brand Direction', size: 60, floatOffset: 0, floatSpeed: 0.8, orbitRadius: 260, orbitAngle: 0, orbitSpeed: 0.0004 },
  { id: 'creative', label: 'Creative', subLabel: 'Visual Storytelling', size: 55, floatOffset: 1.2, floatSpeed: 0.6, orbitRadius: 300, orbitAngle: 0.7, orbitSpeed: -0.0003 },
  { id: 'growth', label: 'Growth', subLabel: 'Performance', size: 50, floatOffset: 2.1, floatSpeed: 0.9, orbitRadius: 240, orbitAngle: 1.5, orbitSpeed: 0.0005 },
  { id: 'social', label: 'Social', subLabel: 'Community', size: 52, floatOffset: 0.5, floatSpeed: 0.7, orbitRadius: 280, orbitAngle: 2.3, orbitSpeed: -0.00035 },
  { id: 'content', label: 'Content', subLabel: 'Editorial', size: 48, floatOffset: 1.8, floatSpeed: 1.0, orbitRadius: 220, orbitAngle: 3.2, orbitSpeed: 0.00045 },
  { id: 'analytics', label: 'Analytics', subLabel: 'Data Insight', size: 58, floatOffset: 3.0, floatSpeed: 0.75, orbitRadius: 310, orbitAngle: 4.0, orbitSpeed: -0.00025 },
  { id: 'storytelling', label: 'Story', subLabel: 'Narrative', size: 45, floatOffset: 0.9, floatSpeed: 0.85, orbitRadius: 260, orbitAngle: 4.8, orbitSpeed: 0.0006 },
  { id: 'ecosystem', label: 'Ecosystem', subLabel: 'Full Platform', size: 65, floatOffset: 2.5, floatSpeed: 0.65, orbitRadius: 330, orbitAngle: 5.5, orbitSpeed: -0.0003 },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

/**
 * NodeDot Component
 * Handles the individual physics and glass styling for each service node.
 */
function NodeDot({
  node,
  cursorX,
  cursorY,
  containerRef,
  isMobile,
  autoAngle,
  onPositionUpdate,
}: {
  node: ConstellationNode;
  cursorX: number;
  cursorY: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isMobile: boolean;
  autoAngle: number;
  onPositionUpdate: (id: string, x: number, y: number) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const animRef = useRef<number>(0);
  const timeRef = useRef(Math.random() * 100);

  const springX = useSpring(node.baseX, { stiffness: 40, damping: 20, mass: 1 });
  const springY = useSpring(node.baseY, { stiffness: 40, damping: 20, mass: 1 });

  const animate = useCallback(() => {
    timeRef.current += 0.01;
    const t = timeRef.current;
    const floatY = Math.sin(t * node.floatSpeed + node.floatOffset) * 15;
    const floatX = Math.cos(t * node.floatSpeed * 0.7 + node.floatOffset) * 8;

    let targetX = node.baseX + floatX;
    let targetY = node.baseY + floatY;

    if (!isMobile && cursorX !== -9999 && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const localCX = cursorX - rect.left;
      const localCY = cursorY - rect.top;
      const dx = localCX - node.baseX;
      const dy = localCY - node.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 300;

      if (dist < maxDist) {
        const pullStrength = Math.pow(1 - dist / maxDist, 2) * 0.6;
        targetX += dx * pullStrength;
        targetY += dy * pullStrength;
      }
    }

    springX.set(targetX);
    springY.set(targetY);
    onPositionUpdate(node.id, springX.get(), springY.get());
    
    animRef.current = requestAnimationFrame(animate);
  }, [cursorX, cursorY, isMobile, node, springX, springY, containerRef, onPositionUpdate]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  return (
    <motion.div
      className="absolute z-10"
      style={{ x: springX, y: springY, left: -node.size / 2, top: -node.size / 2 }}
    >
      <motion.div
        className="relative group cursor-pointer flex items-center justify-center rounded-full"
        style={{
          width: node.size,
          height: node.size,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        whileHover={{ 
          scale: 1.1, 
          backgroundColor: 'rgba(164, 108, 252, 0.1)',
          borderColor: 'rgba(164, 108, 252, 0.5)',
          boxShadow: '0 0 30px rgba(164, 108, 252, 0.2)' 
        }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 group-hover:text-white transition-colors text-center px-2">
          {node.label}
        </span>

        {/* Floating Sublabel */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#a46cfc]">
                {node.subLabel}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export function OrbitalAct() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [cursorPos, setCursorPos] = useState({ x: -9999, y: -9999 });
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number, y: number }>>({});

  // Sync node positions for the SVG lines
  const updateNodePos = useCallback((id: string, x: number, y: number) => {
    setNodePositions(prev => ({ ...prev, [id]: { x, y } }));
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          w: containerRef.current.offsetWidth,
          h: containerRef.current.offsetHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const cx = containerSize.w / 2;
  const cy = containerSize.h / 2;

  const nodes = useMemo(() => {
    return NODES_DATA.map((n, i) => {
      const angle = (i / NODES_DATA.length) * Math.PI * 2 + n.orbitAngle;
      const r = isMobile ? Math.min(containerSize.w * 0.4, 140) : n.orbitRadius * (containerSize.w / 1000);
      return {
        ...n,
        baseX: cx + Math.cos(angle) * r,
        baseY: cy + Math.sin(angle) * r * 0.85,
      };
    });
  }, [cx, cy, isMobile, containerSize.w]);

  return (
    <section className="relative w-full min-h-screen bg-[#030305] flex items-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #a46cfc33 0%, transparent 70%)' }} />
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left Content */}
        <div className="max-w-xl">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h4 className="text-[#a46cfc] text-xs font-bold tracking-[0.4em] uppercase mb-6">Partner Ecosystem</h4>
            <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.9] uppercase mb-8">
              Embedded <br /> 
              <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>in your team</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              We operate as a flexible extension of your organization. Like a living organism, our constellation of services adapts to your rhythm.
            </p>
          </motion.div>
        </div>

        {/* Right Visualization */}
        <div 
          ref={containerRef}
          className="relative w-full h-[500px] md:h-[650px] cursor-crosshair"
          onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
          onMouseLeave={() => setCursorPos({ x: -9999, y: -9999 })}
        >
          {/* Central Anchor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-24 h-24 rounded-full border border-[#a46cfc55] bg-[#a46cfc11] flex items-center justify-center text-center backdrop-blur-md shadow-[0_0_40px_rgba(164,108,252,0.2)]">
               <span className="text-[10px] font-black uppercase tracking-tighter text-white">The<br/>Core</span>
            </div>
          </div>

          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            {nodes.map((node) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;
              return (
                <line
                  key={`line-${node.id}`}
                  x1={cx}
                  y1={cy}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="url(#lineGradient)"
                  strokeWidth="0.5"
                />
              );
            })}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(164,108,252,0)" />
                <stop offset="100%" stopColor="rgba(164,108,252,0.5)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Service Nodes */}
          {nodes.map((node) => (
            <NodeDot
              key={node.id}
              node={node}
              cursorX={cursorPos.x}
              cursorY={cursorPos.y}
              containerRef={containerRef}
              isMobile={isMobile}
              autoAngle={0}
              onPositionUpdate={updateNodePos}
            />
          ))}
        </div>
      </div>
    </section>
  );
}