import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useSpring, useInView } from 'motion/react';

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

const NODES: Omit<ConstellationNode, 'baseX' | 'baseY'>[] = [
  { id: 'strategy', label: 'Strategy', subLabel: 'Brand Direction', size: 52, floatOffset: 0, floatSpeed: 0.8, orbitRadius: 260, orbitAngle: 0, orbitSpeed: 0.0004 },
  { id: 'creative', label: 'Creative', subLabel: 'Visual Storytelling', size: 48, floatOffset: 1.2, floatSpeed: 0.6, orbitRadius: 300, orbitAngle: 0.7, orbitSpeed: -0.0003 },
  { id: 'growth', label: 'Growth', subLabel: 'Performance', size: 44, floatOffset: 2.1, floatSpeed: 0.9, orbitRadius: 240, orbitAngle: 1.5, orbitSpeed: 0.0005 },
  { id: 'social', label: 'Social', subLabel: 'Community', size: 46, floatOffset: 0.5, floatSpeed: 0.7, orbitRadius: 280, orbitAngle: 2.3, orbitSpeed: -0.00035 },
  { id: 'content', label: 'Content', subLabel: 'Editorial', size: 42, floatOffset: 1.8, floatSpeed: 1.0, orbitRadius: 220, orbitAngle: 3.2, orbitSpeed: 0.00045 },
  { id: 'analytics', label: 'Analytics', subLabel: 'Data Insight', size: 50, floatOffset: 3.0, floatSpeed: 0.75, orbitRadius: 310, orbitAngle: 4.0, orbitSpeed: -0.00025 },
  { id: 'storytelling', label: 'Story', subLabel: 'Narrative', size: 40, floatOffset: 0.9, floatSpeed: 0.85, orbitRadius: 260, orbitAngle: 4.8, orbitSpeed: 0.0006 },
  { id: 'ecosystem', label: 'Ecosystem', subLabel: 'Full Platform', size: 54, floatOffset: 2.5, floatSpeed: 0.65, orbitRadius: 330, orbitAngle: 5.5, orbitSpeed: -0.0003 },
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

function NodeDot({
  node,
  cursorX,
  cursorY,
  containerRef,
  isMobile,
  autoAngle,
}: {
  node: ConstellationNode;
  cursorX: number;
  cursorY: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isMobile: boolean;
  autoAngle: number;
}) {
  const [pos, setPos] = useState({ x: node.baseX, y: node.baseY });
  const [hovered, setHovered] = useState(false);
  const animRef = useRef<number>(0);
  const timeRef = useRef(Math.random() * 100);

  const springX = useSpring(node.baseX, { stiffness: 60, damping: 18, mass: 1.2 });
  const springY = useSpring(node.baseY, { stiffness: 60, damping: 18, mass: 1.2 });

  const animate = useCallback(() => {
    timeRef.current += 0.01;
    const t = timeRef.current;
    const floatY = Math.sin(t * node.floatSpeed + node.floatOffset) * 12;
    const floatX = Math.cos(t * node.floatSpeed * 0.7 + node.floatOffset) * 6;

    let targetX = node.baseX + floatX;
    let targetY = node.baseY + floatY;

    if (!isMobile && cursorX !== -9999 && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const localCX = cursorX - rect.left;
      const localCY = cursorY - rect.top;
      const dx = localCX - node.baseX;
      const dy = localCY - node.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = node.orbitRadius * 1.4;

      if (dist < maxDist) {
        const pull = Math.max(0, 1 - dist / maxDist);
        const pullStrength = pull * pull * 0.55;
        targetX = node.baseX + floatX + dx * pullStrength;
        targetY = node.baseY + floatY + dy * pullStrength;
      }
    }

    if (isMobile) {
      const angle = autoAngle * node.orbitSpeed * 1000 + node.orbitAngle;
      targetX = node.baseX + Math.cos(angle) * 20;
      targetY = node.baseY + Math.sin(angle) * 20;
    }

    springX.set(targetX);
    springY.set(targetY);
    animRef.current = requestAnimationFrame(animate);
  }, [cursorX, cursorY, isMobile, autoAngle, node, springX, springY, containerRef]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate]);

  useEffect(() => {
    const unsubX = springX.on('change', (v) => setPos((p) => ({ ...p, x: v })));
    const unsubY = springY.on('change', (v) => setPos((p) => ({ ...p, y: v })));
    return () => {
      unsubX();
      unsubY();
    };
  }, [springX, springY]);

  const halfSize = node.size / 2;

  return (
    <motion.div
      className="absolute group cursor-pointer"
      style={{
        left: pos.x - halfSize,
        top: pos.y - halfSize,
        width: node.size,
        height: node.size,
        zIndex: hovered ? 20 : 10,
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.15 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div
        className="w-full h-full rounded-full flex flex-col items-center justify-center relative overflow-visible"
        style={{
          background: hovered
            ? 'radial-gradient(circle, rgba(164,108,252,0.25) 0%, rgba(164,108,252,0.05) 100%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
          border: hovered
            ? '1px solid rgba(164,108,252,0.6)'
            : '1px solid rgba(255,255,255,0.15)',
          boxShadow: hovered
            ? '0 0 20px rgba(164,108,252,0.4), 0 0 40px rgba(164,108,252,0.15)'
            : 'none',
          transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
        }}
      >
        <span
          className="text-[0.55rem] font-bold uppercase tracking-[0.15em] leading-none text-center px-1"
          style={{ color: hovered ? '#a46cfc' : 'rgba(255,255,255,0.75)' }}
        >
          {node.label}
        </span>
      </div>

      <motion.div
        className="absolute -bottom-7 left-1/2 whitespace-nowrap pointer-events-none"
        style={{ translateX: '-50%' }}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -4 }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-[0.55rem] uppercase tracking-[0.2em]" style={{ color: 'rgba(164,108,252,0.7)' }}>
          {node.subLabel}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function OrbitalAct() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-10%' });
  const isMobile = useIsMobile();
  const [cursorPos, setCursorPos] = useState({ x: -9999, y: -9999 });
  const [autoAngle, setAutoAngle] = useState(0);
  const autoRef = useRef<number>(0);
  const [containerSize, setContainerSize] = useState({ w: 900, h: 600 });

  useEffect(() => {
    autoRef.current = requestAnimationFrame(function tick() {
      setAutoAngle((a) => a + 0.005);
      autoRef.current = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(autoRef.current);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    ro.observe(containerRef.current);
    const rect = containerRef.current.getBoundingClientRect();
    setContainerSize({ w: rect.width, h: rect.height });
    return () => ro.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setCursorPos({ x: -9999, y: -9999 });
  };

  const cx = containerSize.w / 2;
  const cy = containerSize.h / 2;

  const nodes: ConstellationNode[] = NODES.map((n, i) => {
    const baseAngle = (i / NODES.length) * Math.PI * 2 + n.orbitAngle;
    const r = isMobile ? Math.min(containerSize.w * 0.35, 130) : n.orbitRadius * (containerSize.w / 900);
    return {
      ...n,
      baseX: cx + Math.cos(baseAngle) * r,
      baseY: cy + Math.sin(baseAngle) * r * (isMobile ? 0.6 : 0.75),
    };
  });

  return (
    <div
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: '#030305', minHeight: '100vh' }}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(164,108,252,0.06) 0%, transparent 60%)`,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(164,108,252,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(164,108,252,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 py-24 md:py-40">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

          <div className="lg:w-2/5 flex-shrink-0">
            <motion.span
              className="block text-[0.6rem] font-bold uppercase tracking-[0.35em] mb-8"
              style={{ color: 'rgba(164,108,252,0.7)' }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            >
              Why H2H?
            </motion.span>

            <motion.h2
              className="text-[clamp(2.2rem,4.5vw,4rem)] font-extrabold text-white uppercase tracking-[-0.04em] leading-[1.05] mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: EASE_OUT_EXPO }}
            >
              Because we embed ourselves
              <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: '1.5px rgba(164,108,252,0.7)' }}
              >
                in your world.
              </span>
            </motion.h2>

            <motion.div
              className="w-16 h-px mb-10"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_EXPO }}
              style={{ transformOrigin: 'left', background: 'rgba(164,108,252,0.5)' }}
            />

            <motion.p
              className="text-base md:text-lg leading-relaxed mb-8"
              style={{ color: 'rgba(226,221,240,0.65)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.25, ease: EASE_OUT_EXPO }}
            >
              When you work with H2H, you don't get an agency. You get a partner — a flexible, responsive extension of your team.
            </motion.p>

            <motion.p
              className="text-base md:text-lg leading-relaxed mb-10"
              style={{ color: 'rgba(226,221,240,0.65)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE_OUT_EXPO }}
            >
              Like a living, breathing part of your organization, we adapt to your rhythm, align with your goals, and help you scale with clarity and purpose.
            </motion.p>

            <motion.p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: 'rgba(226,221,240,0.65)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.35, ease: EASE_OUT_EXPO }}
            >
              We're strategists, creatives, and storytellers who bring a mix of structure and soul — combining insight with efficiency to help you build brand ecosystems that actually work across every platform, every touchpoint, and every stage of growth.
            </motion.p>

            {!isMobile && (
              <motion.p
                className="mt-10 text-[0.65rem] uppercase tracking-[0.25em]"
                style={{ color: 'rgba(255,255,255,0.25)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                Move your cursor into the constellation
              </motion.p>
            )}
          </div>

          <div className="lg:w-3/5 relative" style={{ height: isMobile ? '400px' : '600px' }}>
            <div
              ref={containerRef}
              className="relative w-full h-full"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {nodes.map((node, i) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.08,
                    ease: EASE_OUT_EXPO,
                  }}
                  className="absolute inset-0"
                >
                  <NodeDot
                    node={node}
                    cursorX={cursorPos.x}
                    cursorY={cursorPos.y}
                    containerRef={containerRef}
                    isMobile={isMobile}
                    autoAngle={autoAngle}
                  />
                </motion.div>
              ))}

              <div
                className="absolute"
                style={{
                  left: cx - 1,
                  top: cy - 1,
                  width: 2,
                  height: 2,
                  background: 'transparent',
                }}
              >
                {nodes.map((node) => (
                  <svg
                    key={node.id}
                    className="absolute pointer-events-none overflow-visible"
                    style={{ left: 0, top: 0, width: 0, height: 0 }}
                  >
                    <line
                      x1={0}
                      y1={0}
                      x2={node.baseX - cx}
                      y2={node.baseY - cy}
                      stroke="rgba(164,108,252,0.08)"
                      strokeWidth="1"
                    />
                  </svg>
                ))}
              </div>

              <motion.div
                className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
                style={{
                  left: cx - 60,
                  top: cy - 60,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(164,108,252,0.15) 0%, rgba(164,108,252,0.03) 60%, transparent 100%)',
                  border: '1px solid rgba(164,108,252,0.2)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(164,108,252,0.1)',
                    '0 0 40px rgba(164,108,252,0.25)',
                    '0 0 20px rgba(164,108,252,0.1)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-[0.5rem] font-bold uppercase tracking-[0.2em] text-white/50 leading-tight">
                  You
                  <br />
                  (Client)
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
