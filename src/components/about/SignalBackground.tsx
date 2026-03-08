import { useRef, useEffect, useCallback, memo } from 'react';

const LINE_COUNT = 16;
const POINTS_PER_LINE = 40;
const TARGET_INTERVAL = 1000 / 30;

function generateWaveLine(
  index: number,
  total: number,
  width: number,
  height: number,
  time: number,
) {
  const y = (height / (total + 1)) * (index + 1);
  const points: string[] = [];

  for (let i = 0; i <= POINTS_PER_LINE; i++) {
    const x = (width / POINTS_PER_LINE) * i;
    const noise = Math.sin(i * 0.15 + index * 0.7 + time * 0.4) * 12;
    const scatter = Math.sin(i * 0.4 + index * 2.3 + time) * 14 + Math.cos(i * 0.25 + time * 0.7) * 8;
    const py = y + noise + scatter;
    points.push(`${x.toFixed(0)},${py.toFixed(0)}`);
  }

  return `M${points.join(' L')}`;
}

export const SignalBackground = memo(function SignalBackground() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const rafRef = useRef(0);
  const timeRef = useRef(0);
  const lastFrameRef = useRef(0);

  const animate = useCallback((now: number) => {
    const elapsed = now - lastFrameRef.current;
    if (elapsed < TARGET_INTERVAL) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    lastFrameRef.current = now - (elapsed % TARGET_INTERVAL);
    timeRef.current += elapsed / 1000;

    const svg = svgRef.current;
    if (!svg) {
      rafRef.current = requestAnimationFrame(animate);
      return;
    }

    const w = svg.clientWidth || 1400;
    const h = svg.clientHeight || 800;

    for (let i = 0; i < LINE_COUNT; i++) {
      const path = pathRefs.current[i];
      if (path) {
        path.setAttribute('d', generateWaveLine(i, LINE_COUNT, w, h, timeRef.current));
      }
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    lastFrameRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.12, contain: 'strict' }}
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
    </div>
  );
});
