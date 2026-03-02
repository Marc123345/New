import { useEffect, useRef } from 'react';

const STAR_COUNT = 280;
const NEBULA_COLORS = [
  { x: 0.65, y: 0.45, r: 0.35, color: '41, 30, 86' },
  { x: 0.3, y: 0.7, r: 0.3, color: '164, 108, 252' },
  { x: 0.8, y: 0.2, r: 0.25, color: '30, 60, 120' },
];

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const stars: Star[] = [];
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 0.4 + Math.random() * 1.6,
        baseAlpha: 0.15 + Math.random() * 0.65,
        twinkleSpeed: 0.3 + Math.random() * 1.2,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;

    const draw = (time: number) => {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      for (const nebula of NEBULA_COLORS) {
        const grad = ctx.createRadialGradient(
          nebula.x * cw, nebula.y * ch, 0,
          nebula.x * cw, nebula.y * ch, nebula.r * Math.max(cw, ch)
        );
        grad.addColorStop(0, `rgba(${nebula.color}, 0.12)`);
        grad.addColorStop(1, `rgba(${nebula.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);
      }

      const t = time * 0.001;
      for (const star of stars) {
        const alpha = prefersReducedMotion
          ? star.baseAlpha
          : star.baseAlpha * (0.6 + 0.4 * Math.sin(t * star.twinkleSpeed + star.twinkleOffset));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }
    };

    if (prefersReducedMotion) {
      draw(0);
      return;
    }

    const loop = (time: number) => {
      draw(time);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  );
}
