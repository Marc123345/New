import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E1306C',
  tiktok: '#69C9D0',
  youtube: '#FF0000',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  facebook: '#1877F2',
};

const PLATFORMS = Object.keys(PLATFORM_COLORS);

const PLATFORM_ICONS: Record<string, (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => void> = {
  instagram: (ctx, x, y, r) => {
    ctx.strokeStyle = PLATFORM_COLORS.instagram;
    ctx.lineWidth = r * 0.15;
    ctx.beginPath();
    ctx.roundRect(x - r * 0.55, y - r * 0.55, r * 1.1, r * 1.1, r * 0.25);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, r * 0.28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + r * 0.32, y - r * 0.32, r * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = PLATFORM_COLORS.instagram;
    ctx.fill();
  },
  tiktok: (ctx, x, y, r) => {
    ctx.fillStyle = PLATFORM_COLORS.tiktok;
    ctx.font = `bold ${r * 1.1}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u266A', x, y);
  },
  youtube: (ctx, x, y, r) => {
    ctx.fillStyle = PLATFORM_COLORS.youtube;
    ctx.beginPath();
    ctx.roundRect(x - r * 0.6, y - r * 0.4, r * 1.2, r * 0.8, r * 0.18);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(x - r * 0.15, y - r * 0.22);
    ctx.lineTo(x + r * 0.3, y);
    ctx.lineTo(x - r * 0.15, y + r * 0.22);
    ctx.closePath();
    ctx.fill();
  },
  twitter: (ctx, x, y, r) => {
    ctx.fillStyle = PLATFORM_COLORS.twitter;
    ctx.font = `bold ${r * 1.15}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\uD835\uDD4F', x, y);
  },
  linkedin: (ctx, x, y, r) => {
    ctx.fillStyle = PLATFORM_COLORS.linkedin;
    ctx.beginPath();
    ctx.roundRect(x - r * 0.55, y - r * 0.55, r * 1.1, r * 1.1, r * 0.18);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${r * 0.75}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('in', x, y);
  },
  facebook: (ctx, x, y, r) => {
    ctx.fillStyle = PLATFORM_COLORS.facebook;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${r * 0.7}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('f', x + r * 0.04, y + r * 0.03);
  },
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Avatar {
  angle: number;
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  platform: string;
  pulsePhase: number;
  label: string;
}

interface DataPulse {
  fromAngle: number;
  toCenter: boolean;
  progress: number;
  speed: number;
  platform: string;
  orbitRadius: number;
}

const AVATAR_LABELS = ['Emma', 'James', 'Sofia', 'Luca', 'Aisha', 'Carlos'];

export function SignalGridPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const avatarsRef = useRef<Avatar[]>([]);
  const pulsesRef = useRef<DataPulse[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const mouseRef = useRef({ x: -9999, y: -9999 });

  const buildScene = useCallback((w: number, h: number) => {
    const baseR = Math.min(w, h) * 0.3;

    avatarsRef.current = PLATFORMS.map((platform, i) => ({
      angle: (i / PLATFORMS.length) * Math.PI * 2,
      orbitRadius: baseR + (Math.random() - 0.5) * baseR * 0.2,
      orbitSpeed: (0.0005 + Math.random() * 0.0003) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.min(w, h) * 0.05,
      platform,
      pulsePhase: Math.random() * Math.PI * 2,
      label: AVATAR_LABELS[i % AVATAR_LABELS.length],
    }));

    pulsesRef.current = [];
  }, []);

  const spawnPulse = useCallback(() => {
    const avatars = avatarsRef.current;
    if (!avatars.length) return;
    const av = avatars[Math.floor(Math.random() * avatars.length)];
    pulsesRef.current.push({
      fromAngle: av.angle,
      toCenter: Math.random() > 0.4,
      progress: 0,
      speed: 0.008 + Math.random() * 0.008,
      platform: av.platform,
      orbitRadius: av.orbitRadius,
    });
    if (pulsesRef.current.length > 30) pulsesRef.current.splice(0, 5);
  }, []);

  const drawFaceAvatar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    r: number,
    platform: string,
    glow: number,
    label: string,
  ) => {
    const color = PLATFORM_COLORS[platform];

    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = r * 1.5 * glow;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(10,10,15,0.92)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.85 + glow * 0.15;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();

    const faceGrad = ctx.createRadialGradient(x, y - r * 0.15, 0, x, y, r);
    faceGrad.addColorStop(0, 'rgba(255,220,180,0.9)');
    faceGrad.addColorStop(0.6, 'rgba(220,170,120,0.75)');
    faceGrad.addColorStop(1, 'rgba(160,100,60,0.5)');
    ctx.fillStyle = faceGrad;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.98, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(40,25,10,0.9)';
    ctx.beginPath();
    ctx.ellipse(x - r * 0.28, y - r * 0.1, r * 0.12, r * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + r * 0.28, y - r * 0.1, r * 0.12, r * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(40,25,10,0.7)';
    ctx.lineWidth = r * 0.09;
    ctx.beginPath();
    ctx.arc(x, y + r * 0.22, r * 0.28, 0.1, Math.PI - 0.1);
    ctx.stroke();
    ctx.restore();

    const iconR = r * 0.35;
    const iconX = x + r * 0.6;
    const iconY = y - r * 0.6;
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
    PLATFORM_ICONS[platform]?.(ctx, iconX, iconY, iconR);
    ctx.restore();

    ctx.save();
    ctx.font = `600 ${r * 0.35}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(label, x, y + r * 1.15);
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = rect.width || 400;
      const h = rect.height || 400;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      sizeRef.current = { w, h };
      buildScene(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', () => {
      mouseRef.current = { x: -9999, y: -9999 };
    });

    let lastPulse = 0;

    const render = (ts: number) => {
      const { w, h } = sizeRef.current;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
      bgGrad.addColorStop(0, 'rgba(15,10,22,1)');
      bgGrad.addColorStop(1, 'rgba(5,3,8,1)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      if (ts - lastPulse > 700) {
        spawnPulse();
        lastPulse = ts;
      }

      const avatars = avatarsRef.current;
      for (const av of avatars) {
        av.angle += av.orbitSpeed;
      }

      const coreR = Math.min(w, h) * 0.08;

      ctx.save();
      const outerGlow = ctx.createRadialGradient(cx, cy, coreR * 0.5, cx, cy, coreR * 4);
      outerGlow.addColorStop(0, 'rgba(255,255,255,0.08)');
      outerGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = outerGlow;
      ctx.fillRect(cx - coreR * 4, cy - coreR * 4, coreR * 8, coreR * 8);
      ctx.restore();

      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.5);
      coreGlow.addColorStop(0, 'rgba(255,255,255,0.95)');
      coreGlow.addColorStop(0.2, 'rgba(220,225,255,0.6)');
      coreGlow.addColorStop(0.5, 'rgba(140,160,255,0.12)');
      coreGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save();
      ctx.shadowColor = 'rgba(200,210,255,0.8)';
      ctx.shadowBlur = 35;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fillStyle = coreGlow;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.font = `800 ${coreR * 0.8}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(15,10,25,0.95)';
      ctx.fillText('H2H', cx, cy);
      ctx.restore();

      for (const av of avatars) {
        const ax = cx + Math.cos(av.angle) * av.orbitRadius;
        const ay = cy + Math.sin(av.angle) * av.orbitRadius;
        const color = PLATFORM_COLORS[av.platform];
        const dx = ax - mouseRef.current.x;
        const dy = ay - mouseRef.current.y;
        const hovered = Math.sqrt(dx * dx + dy * dy) < av.size * 1.8;

        const glowAmt = Math.sin(ts * 0.002 + av.pulsePhase) * 0.3 + 0.5 + (hovered ? 0.5 : 0);

        const lineAlpha = 0.1 + glowAmt * 0.15;
        const grad = ctx.createLinearGradient(cx, cy, ax, ay);
        grad.addColorStop(0, `${color}00`);
        grad.addColorStop(0.3, `${color}${Math.floor(lineAlpha * 255).toString(16).padStart(2, '0')}`);
        grad.addColorStop(0.7, `${color}${Math.floor(lineAlpha * 255).toString(16).padStart(2, '0')}`);
        grad.addColorStop(1, `${color}00`);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ax, ay);
        ctx.strokeStyle = grad;
        ctx.lineWidth = hovered ? 1.5 : 0.8;
        ctx.stroke();

        drawFaceAvatar(ctx, ax, ay, av.size, av.platform, glowAmt, av.label);
      }

      const pulses = pulsesRef.current;
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }

        const startX = p.toCenter ? cx + Math.cos(p.fromAngle) * p.orbitRadius : cx;
        const startY = p.toCenter ? cy + Math.sin(p.fromAngle) * p.orbitRadius : cy;
        const endX = p.toCenter ? cx : cx + Math.cos(p.fromAngle) * p.orbitRadius;
        const endY = p.toCenter ? cy : cy + Math.sin(p.fromAngle) * p.orbitRadius;

        const px = startX + (endX - startX) * p.progress;
        const py = startY + (endY - startY) * p.progress;

        const color = PLATFORM_COLORS[p.platform];
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 8);
        grd.addColorStop(0, color + 'ff');
        grd.addColorStop(0.4, color + '66');
        grd.addColorStop(1, color + '00');
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        if (Math.random() < 0.25) {
          particlesRef.current.push({
            x: px,
            y: py,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            alpha: 0.5 + Math.random() * 0.3,
            life: 0,
            maxLife: 25 + Math.random() * 15,
            color,
            size: 1 + Math.random() * 1.5,
          });
        }
      }

      const parts = particlesRef.current;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        const a = p.alpha * (1 - p.life / p.maxLife);
        if (a <= 0 || p.life >= p.maxLife) {
          parts.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(a * 255).toString(16).padStart(2, '0');
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [buildScene, spawnPulse]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ minHeight: '100%', background: '#08050f' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      <motion.div
        className="absolute top-3 left-3"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="inline-flex items-center gap-2 px-2.5 py-1"
          style={{
            background: 'rgba(0,0,0,0.55)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            borderRadius: 3,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#ffffff',
              display: 'inline-block',
              boxShadow: '0 0 6px rgba(255,255,255,0.5)',
            }}
          />
          <span
            className="text-[0.55rem] uppercase"
            style={{
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.18em',
              fontFamily: 'var(--font-stack-heading)',
            }}
          >
            H2H Network
          </span>
        </div>
      </motion.div>
    </div>
  );
}
