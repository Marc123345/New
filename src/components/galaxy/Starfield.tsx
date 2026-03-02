import { useEffect, useRef } from 'react';

const STAR_COUNT = 800;
const SHOOTING_STAR_INTERVAL = 2500;

const STAR_COLORS = [
  '255, 255, 255',
  '200, 220, 255',
  '170, 200, 255',
  '255, 240, 220',
  '180, 210, 255',
  '255, 230, 200',
  '160, 190, 255',
  '240, 248, 255',
];

const NEBULAE = [
  { x: 0.12, y: 0.25, r: 0.55, color: '18, 40, 90', opacity: 0.10 },
  { x: 0.65, y: 0.15, r: 0.45, color: '12, 30, 75', opacity: 0.09 },
  { x: 0.45, y: 0.6, r: 0.6, color: '8, 22, 55', opacity: 0.08 },
  { x: 0.85, y: 0.65, r: 0.4, color: '25, 45, 85', opacity: 0.07 },
  { x: 0.25, y: 0.8, r: 0.4, color: '15, 32, 70', opacity: 0.06 },
  { x: 0.55, y: 0.1, r: 0.3, color: '35, 55, 100', opacity: 0.07 },
  { x: 0.9, y: 0.35, r: 0.35, color: '10, 28, 65', opacity: 0.06 },
  { x: 0.05, y: 0.5, r: 0.5, color: '20, 38, 80', opacity: 0.05 },
  { x: 0.4, y: 0.35, r: 0.25, color: '30, 50, 95', opacity: 0.04 },
  { x: 0.75, y: 0.85, r: 0.35, color: '14, 26, 60', opacity: 0.05 },
];

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
  glow: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

function createStars(w: number, h: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    const roll = Math.random();
    const isBright = roll < 0.06;
    const isMedium = roll < 0.2;
    const nearCenter = Math.random() < 0.3;
    const cx = nearCenter ? w * (0.3 + Math.random() * 0.4) : Math.random() * w;
    const cy = nearCenter ? h * (0.2 + Math.random() * 0.6) : Math.random() * h;
    stars.push({
      x: cx + (Math.random() - 0.5) * w * 0.15,
      y: cy + (Math.random() - 0.5) * h * 0.15,
      size: isBright ? 1.4 + Math.random() * 2.0 : isMedium ? 0.7 + Math.random() * 1.0 : 0.2 + Math.random() * 0.8,
      baseAlpha: isBright ? 0.7 + Math.random() * 0.3 : isMedium ? 0.3 + Math.random() * 0.4 : 0.08 + Math.random() * 0.35,
      twinkleSpeed: 0.15 + Math.random() * 1.8,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      glow: isBright || (isMedium && Math.random() < 0.3),
    });
  }
  return stars;
}

function createShootingStar(w: number, h: number): ShootingStar {
  const side = Math.random();
  let x: number, y: number;
  if (side < 0.5) {
    x = Math.random() * w;
    y = -10;
  } else {
    x = w + 10;
    y = Math.random() * h * 0.5;
  }
  const angle = Math.PI * 0.6 + Math.random() * 0.6;
  const speed = 4 + Math.random() * 6;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 0,
    maxLife: 40 + Math.random() * 60,
    size: 1 + Math.random() * 1.5,
  };
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingRef = useRef<ShootingStar[]>([]);
  const animRef = useRef<number>(0);
  const lastShootingRef = useRef<number>(0);

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
      starsRef.current = createStars(canvas.offsetWidth, canvas.offsetHeight);
    };
    resize();

    const draw = (time: number) => {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      for (const nebula of NEBULAE) {
        const grad = ctx.createRadialGradient(
          nebula.x * cw, nebula.y * ch, 0,
          nebula.x * cw, nebula.y * ch, nebula.r * Math.max(cw, ch)
        );
        grad.addColorStop(0, `rgba(${nebula.color}, ${nebula.opacity})`);
        grad.addColorStop(0.5, `rgba(${nebula.color}, ${nebula.opacity * 0.4})`);
        grad.addColorStop(1, `rgba(${nebula.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);
      }

      const t = time * 0.001;
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const alpha = prefersReducedMotion
          ? star.baseAlpha
          : star.baseAlpha * (0.5 + 0.5 * Math.sin(t * star.twinkleSpeed + star.twinkleOffset));

        if (star.glow && alpha > 0.3) {
          const glowGrad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
          glowGrad.addColorStop(0, `rgba(${star.color}, ${alpha * 0.3})`);
          glowGrad.addColorStop(1, `rgba(${star.color}, 0)`);
          ctx.fillStyle = glowGrad;
          ctx.fillRect(star.x - star.size * 4, star.y - star.size * 4, star.size * 8, star.size * 8);
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${alpha})`;
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        if (time - lastShootingRef.current > SHOOTING_STAR_INTERVAL + Math.random() * 2000) {
          shootingRef.current.push(createShootingStar(cw, ch));
          lastShootingRef.current = time;
        }

        const shooting = shootingRef.current;
        for (let i = shooting.length - 1; i >= 0; i--) {
          const s = shooting[i];
          s.x += s.vx;
          s.y += s.vy;
          s.life++;

          const progress = s.life / s.maxLife;
          const fadeIn = Math.min(progress * 5, 1);
          const fadeOut = 1 - Math.pow(progress, 2);
          const a = fadeIn * fadeOut;

          if (a > 0.01) {
            const tailLen = 40 + s.size * 20;
            const angle = Math.atan2(s.vy, s.vx);
            const tailX = s.x - Math.cos(angle) * tailLen;
            const tailY = s.y - Math.sin(angle) * tailLen;

            const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
            grad.addColorStop(0, `rgba(200, 220, 255, 0)`);
            grad.addColorStop(0.7, `rgba(220, 235, 255, ${a * 0.3})`);
            grad.addColorStop(1, `rgba(255, 255, 255, ${a * 0.9})`);

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = s.size;
            ctx.lineCap = 'round';
            ctx.stroke();

            const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
            headGlow.addColorStop(0, `rgba(255, 255, 255, ${a * 0.6})`);
            headGlow.addColorStop(1, `rgba(200, 220, 255, 0)`);
            ctx.fillStyle = headGlow;
            ctx.fillRect(s.x - s.size * 3, s.y - s.size * 3, s.size * 6, s.size * 6);
          }

          if (s.life >= s.maxLife || s.x < -100 || s.x > cw + 100 || s.y > ch + 100) {
            shooting.splice(i, 1);
          }
        }
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
