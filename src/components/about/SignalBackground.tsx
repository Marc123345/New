import { useRef, useEffect, useCallback } from 'react';
import { useScroll, useTransform, motion, useMotionValueEvent } from 'motion/react';

const LINE_COUNT = 28;
const POINTS_PER_LINE = 80;

function generateWaveLine(
  index: number,
  total: number,
  width: number,
  height: number,
  coherence: number,
  time: number,
) {
  const y = (height / (total + 1)) * (index + 1);
  const points: string[] = [];

  for (let i = 0; i <= POINTS_PER_LINE; i++) {
    const x = (width / POINTS_PER_LINE) * i;
    const noise = Math.sin(i * 0.15 + index * 0.7 + time * 0.4) * 12;
    const scatter = (1 - coherence) * (Math.sin(i * 0.4 + index * 2.3 + time) * 18 + Math.cos(i * 0.25 + time * 0.7) * 10);
    const signal = coherence * Math.sin(i * 0.08 + time * 0.3) * 6;
    const py = y + noise + scatter + signal;
    points.push(`${x.toFixed(1)},${py.toFixed(1)}`);
  }

  return `M${points.join(' L')}`;
}

export function SignalBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const coherenceRef = useRef(0);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const lastFrameRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const coherenceMotion = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.85, 0.85, 0]);

  useMotionValueEvent(coherenceMotion, 'change', (v) => {
    coherenceRef.current = v;
  });

  const animate = useCallback((now: number) => {
    if (!svgRef.current) return;
    const delta = lastFrameRef.current ? (now - lastFrameRef.current) / 1000 : 0.016;
    lastFrameRef.current = now;
    timeRef.current += delta;

    const svg = svgRef.current;
    const w = svg.clientWidth || 1400;
    const h = svg.clientHeight || 800;

    for (let i = 0; i < LINE_COUNT; i++) {
      const path = pathRefs.current[i];
      if (!path) continue;
      const d = generateWaveLine(i, LINE_COUNT, w, h, coherenceRef.current, timeRef.current);
      path.setAttribute('d', d);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.12 }}
    >
      <svg
        ref={svgRef}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {Array.from({ length: LINE_COUNT }, (_, i) => (
          <path
            key={i}
            ref={(el) => { pathRefs.current[i] = el; }}
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth={0.8}
            opacity={0.3 + (i / LINE_COUNT) * 0.4}
          />
        ))}
      </svg>
    </motion.div>
  );
}
