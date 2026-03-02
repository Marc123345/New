import { useEffect, useRef } from 'react';

const STAR_COUNT = 900;
const SHOOTING_STAR_INTERVAL = 1800;

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
  { x: 0.12, y: 0.25, r: 0.55, color: '18, 40, 90', opacity: 0.10, driftX: 0.003, driftY: 0.002, breathSpeed: 0.4 },
  { x: 0.65, y: 0.15, r: 0.45, color: '12, 30, 75', opacity: 0.09, driftX: -0.002, driftY: 0.003, breathSpeed: 0.3 },
  { x: 0.45, y: 0.6, r: 0.6, color: '8, 22, 55', opacity: 0.08, driftX: 0.004, driftY: -0.001, breathSpeed: 0.5 },
  { x: 0.85, y: 0.65, r: 0.4, color: '25, 45, 85', opacity: 0.07, driftX: -0.003, driftY: 0.002, breathSpeed: 0.35 },
  { x: 0.25, y: 0.8, r: 0.4, color: '15, 32, 70', opacity: 0.06, driftX: 0.002, driftY: -0.003, breathSpeed: 0.45 },
  { x: 0.55, y: 0.1, r: 0.3, color: '35, 55, 100', opacity: 0.07, driftX: -0.001, driftY: 0.004, breathSpeed: 0.25 },
  { x: 0.9, y: 0.35, r: 0.35, color: '10, 28, 65', opacity: 0.06, driftX: 0.003, driftY: 0.001, breathSpeed: 0.55 },
  { x: 0.05, y: 0.5, r: 0.5, color: '20, 38, 80', opacity: 0.05, driftX: -0.002, driftY: -0.002, breathSpeed: 0.3 },
  { x: 0.4, y: 0.35, r: 0.25, color: '30, 50, 95', opacity: 0.04, driftX: 0.001, driftY: 0.003, breathSpeed: 0.6 },
  { x: 0.75, y: 0.85, r: 0.35, color: '14, 26, 60', opacity: 0.05, driftX: -0.003, driftY: -0.001, breathSpeed: 0.4 },
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
  depth: number;
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

interface CosmicFlare {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  maxRadius: number;
  color: string;
}

interface DustLane {
  y: number;
  speed: number;
  width: number;
  opacity: number;
  waveAmp: number;
  waveFreq: number;
  phase: number;
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
      depth: 0.3 + Math.random() * 0.7,
    });
  }
  return stars;
}

function createShootingStar(w: number, h: number): ShootingStar {
  const side = Math.random();
  let x: number, y: number;
  if (side < 0.4) {
    x = Math.random() * w;
    y = -10;
  } else if (side < 0.7) {
    x = w + 10;
    y = Math.random() * h * 0.5;
  } else {
    x = Math.random() * w * 0.3;
    y = -10;
  }
  const angle = Math.PI * 0.5 + Math.random() * 0.8;
  const speed = 5 + Math.random() * 8;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 0,
    maxLife: 35 + Math.random() * 70,
    size: 0.8 + Math.random() * 1.8,
  };
}

function createDustLanes(h: number): DustLane[] {
  const lanes: DustLane[] = [];
  for (let i = 0; i < 4; i++) {
    lanes.push({
      y: h * (0.15 + Math.random() * 0.7),
      speed: 0.15 + Math.random() * 0.3,
      width: 30 + Math.random() * 60,
      opacity: 0.012 + Math.random() * 0.018,
      waveAmp: 15 + Math.random() * 25,
      waveFreq: 0.002 + Math.random() * 0.003,
      phase: Math.random() * Math.PI * 2,
    });
  }
  return lanes;
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingRef = useRef<ShootingStar[]>([]);
  const flaresRef = useRef<CosmicFlare[]>([]);
  const dustRef = useRef<DustLane[]>([]);
  const animRef = useRef<number>(0);
  const lastShootingRef = useRef<number>(0);
  const lastFlareRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

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
      dustRef.current = createDustLanes(canvas.offsetHeight);
    };
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
      mouseRef.current.targetY = (e.clientY - rect.top) / rect.height;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const draw = (time: number) => {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.03;
      mouse.y += (mouse.targetY - mouse.y) * 0.03;

      const parallaxX = (mouse.x - 0.5) * 2;
      const parallaxY = (mouse.y - 0.5) * 2;

      const t = time * 0.001;

      for (const nebula of NEBULAE) {
        const breathScale = 1 + 0.08 * Math.sin(t * nebula.breathSpeed);
        const driftOffsetX = Math.sin(t * nebula.driftX) * cw * 0.02;
        const driftOffsetY = Math.cos(t * nebula.driftY) * ch * 0.02;
        const nebulaParallaxX = parallaxX * 8;
        const nebulaParallaxY = parallaxY * 8;
        const nx = nebula.x * cw + driftOffsetX + nebulaParallaxX;
        const ny = nebula.y * ch + driftOffsetY + nebulaParallaxY;
        const nr = nebula.r * Math.max(cw, ch) * breathScale;

        const breathOpacity = nebula.opacity * (0.85 + 0.15 * Math.sin(t * nebula.breathSpeed * 1.3));

        const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
        grad.addColorStop(0, `rgba(${nebula.color}, ${breathOpacity})`);
        grad.addColorStop(0.5, `rgba(${nebula.color}, ${breathOpacity * 0.4})`);
        grad.addColorStop(1, `rgba(${nebula.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);
      }

      const dustLanes = dustRef.current;
      for (const lane of dustLanes) {
        lane.phase += lane.speed * 0.01;
        ctx.save();
        ctx.globalAlpha = lane.opacity;
        ctx.beginPath();
        for (let x = 0; x <= cw; x += 4) {
          const waveY = lane.y + Math.sin(x * lane.waveFreq + lane.phase) * lane.waveAmp
            + Math.sin(x * lane.waveFreq * 2.3 + lane.phase * 0.7) * lane.waveAmp * 0.4;
          const dustParallaxY = parallaxY * 3;
          if (x === 0) {
            ctx.moveTo(x, waveY + dustParallaxY);
          } else {
            ctx.lineTo(x, waveY + dustParallaxY);
          }
        }
        for (let x = cw; x >= 0; x -= 4) {
          const waveY = lane.y + lane.width + Math.sin(x * lane.waveFreq + lane.phase + 0.5) * lane.waveAmp
            + Math.sin(x * lane.waveFreq * 2.3 + lane.phase * 0.7 + 0.5) * lane.waveAmp * 0.4;
          const dustParallaxY = parallaxY * 3;
          ctx.lineTo(x, waveY + dustParallaxY);
        }
        ctx.closePath();
        const dustGrad = ctx.createLinearGradient(0, lane.y - lane.waveAmp, 0, lane.y + lane.width + lane.waveAmp);
        dustGrad.addColorStop(0, 'rgba(20, 40, 80, 0)');
        dustGrad.addColorStop(0.3, 'rgba(25, 50, 100, 1)');
        dustGrad.addColorStop(0.5, 'rgba(30, 55, 110, 1)');
        dustGrad.addColorStop(0.7, 'rgba(25, 50, 100, 1)');
        dustGrad.addColorStop(1, 'rgba(20, 40, 80, 0)');
        ctx.fillStyle = dustGrad;
        ctx.fill();
        ctx.restore();
      }

      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const alpha = prefersReducedMotion
          ? star.baseAlpha
          : star.baseAlpha * (0.4 + 0.6 * Math.sin(t * star.twinkleSpeed + star.twinkleOffset));

        const pxOffset = parallaxX * star.depth * 12;
        const pyOffset = parallaxY * star.depth * 12;
        const sx = star.x + pxOffset;
        const sy = star.y + pyOffset;

        if (star.glow && alpha > 0.3) {
          const glowGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.size * 5);
          glowGrad.addColorStop(0, `rgba(${star.color}, ${alpha * 0.35})`);
          glowGrad.addColorStop(0.5, `rgba(${star.color}, ${alpha * 0.1})`);
          glowGrad.addColorStop(1, `rgba(${star.color}, 0)`);
          ctx.fillStyle = glowGrad;
          ctx.fillRect(sx - star.size * 5, sy - star.size * 5, star.size * 10, star.size * 10);
        }

        if (star.glow && star.size > 1.8 && alpha > 0.5) {
          ctx.save();
          ctx.globalAlpha = alpha * 0.15;
          ctx.strokeStyle = `rgba(${star.color}, 1)`;
          ctx.lineWidth = 0.5;
          const spikeLen = star.size * 6;
          ctx.beginPath();
          ctx.moveTo(sx - spikeLen, sy);
          ctx.lineTo(sx + spikeLen, sy);
          ctx.moveTo(sx, sy - spikeLen);
          ctx.lineTo(sx, sy + spikeLen);
          ctx.stroke();
          ctx.restore();
        }

        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${alpha})`;
        ctx.fill();
      }

      const brightStars = stars.filter(s => s.glow && s.baseAlpha > 0.5);
      if (brightStars.length > 1) {
        ctx.save();
        ctx.globalAlpha = 0.025 + 0.015 * Math.sin(t * 0.3);
        ctx.strokeStyle = 'rgba(180, 210, 255, 1)';
        ctx.lineWidth = 0.4;
        for (let i = 0; i < brightStars.length; i++) {
          for (let j = i + 1; j < brightStars.length; j++) {
            const a = brightStars[i];
            const b = brightStars[j];
            const ax = a.x + parallaxX * a.depth * 12;
            const ay = a.y + parallaxY * a.depth * 12;
            const bx = b.x + parallaxX * b.depth * 12;
            const by = b.y + parallaxY * b.depth * 12;
            const dx = ax - bx;
            const dy = ay - by;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120 && dist > 20) {
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(bx, by);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      if (!prefersReducedMotion) {
        if (time - lastShootingRef.current > SHOOTING_STAR_INTERVAL + Math.random() * 1500) {
          shootingRef.current.push(createShootingStar(cw, ch));
          if (Math.random() < 0.3) {
            setTimeout(() => {
              shootingRef.current.push(createShootingStar(cw, ch));
            }, 200 + Math.random() * 400);
          }
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
            const tailLen = 50 + s.size * 25;
            const angle = Math.atan2(s.vy, s.vx);
            const tailX = s.x - Math.cos(angle) * tailLen;
            const tailY = s.y - Math.sin(angle) * tailLen;

            const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
            grad.addColorStop(0, `rgba(200, 220, 255, 0)`);
            grad.addColorStop(0.6, `rgba(220, 235, 255, ${a * 0.3})`);
            grad.addColorStop(0.85, `rgba(240, 248, 255, ${a * 0.6})`);
            grad.addColorStop(1, `rgba(255, 255, 255, ${a * 0.95})`);

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(s.x, s.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = s.size;
            ctx.lineCap = 'round';
            ctx.stroke();

            const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 4);
            headGlow.addColorStop(0, `rgba(255, 255, 255, ${a * 0.7})`);
            headGlow.addColorStop(0.4, `rgba(200, 225, 255, ${a * 0.2})`);
            headGlow.addColorStop(1, `rgba(200, 220, 255, 0)`);
            ctx.fillStyle = headGlow;
            ctx.fillRect(s.x - s.size * 4, s.y - s.size * 4, s.size * 8, s.size * 8);
          }

          if (s.life >= s.maxLife || s.x < -100 || s.x > cw + 100 || s.y > ch + 100) {
            shooting.splice(i, 1);
          }
        }

        if (time - lastFlareRef.current > 5000 + Math.random() * 8000) {
          flaresRef.current.push({
            x: Math.random() * cw,
            y: Math.random() * ch,
            life: 0,
            maxLife: 80 + Math.random() * 60,
            maxRadius: 60 + Math.random() * 100,
            color: ['20, 50, 120', '30, 60, 130', '15, 35, 90'][Math.floor(Math.random() * 3)],
          });
          lastFlareRef.current = time;
        }

        const flares = flaresRef.current;
        for (let i = flares.length - 1; i >= 0; i--) {
          const f = flares[i];
          f.life++;
          const progress = f.life / f.maxLife;
          const fadeIn = Math.min(progress * 4, 1);
          const fadeOut = 1 - Math.pow(Math.max(0, (progress - 0.5) * 2), 2);
          const a = fadeIn * fadeOut * 0.07;
          const radius = f.maxRadius * (0.5 + progress * 0.5);

          if (a > 0.001) {
            const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, radius);
            grad.addColorStop(0, `rgba(${f.color}, ${a})`);
            grad.addColorStop(0.6, `rgba(${f.color}, ${a * 0.3})`);
            grad.addColorStop(1, `rgba(${f.color}, 0)`);
            ctx.fillStyle = grad;
            ctx.fillRect(f.x - radius, f.y - radius, radius * 2, radius * 2);
          }

          if (f.life >= f.maxLife) {
            flares.splice(i, 1);
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
      window.removeEventListener('mousemove', handleMouseMove);
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
