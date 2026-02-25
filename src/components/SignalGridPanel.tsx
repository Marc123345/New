import { useRef, useEffect, useCallback } from 'react';
import { motion, useInView } from 'motion/react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  brightness: number;
  targetBrightness: number;
  connections: number[];
}

interface Pulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  alpha: number;
}

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const valueRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!inView || !ref.current) return;
    let start = 0;
    const duration = 2000;
    const el = ref.current;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      valueRef.current = Math.round((1 - Math.pow(1 - p, 3)) * target);
      el.textContent = `${valueRef.current}${suffix}`;
      if (p < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [inView, target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export function SignalGridPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef = useRef<number>(0);
  const burstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inView = useInView(containerRef, { once: false, margin: '-100px' });
  const sizeRef = useRef({ w: 0, h: 0 });

  const buildGrid = useCallback((w: number, h: number) => {
    const cols = Math.floor(w / 80);
    const rows = Math.floor(h / 80);
    const nodes: Node[] = [];

    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const jx = (Math.random() - 0.5) * 24;
        const jy = (Math.random() - 0.5) * 24;
        nodes.push({
          x: (c / cols) * w + jx,
          y: (r / rows) * h + jy,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          radius: 1.8 + Math.random() * 1.4,
          brightness: 0.08 + Math.random() * 0.12,
          targetBrightness: 0.08 + Math.random() * 0.12,
          connections: [],
        });
      }
    }

    const maxDist = 130;
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].connections = [];
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < maxDist) {
          nodes[i].connections.push(j);
        }
      }
    }

    nodesRef.current = nodes;
    pulsesRef.current = [];
  }, []);

  const spawnPulse = useCallback(() => {
    const nodes = nodesRef.current;
    if (nodes.length === 0) return;
    const fromIdx = Math.floor(Math.random() * nodes.length);
    const conns = nodes[fromIdx].connections;
    if (conns.length === 0) return;
    const toIdx = conns[Math.floor(Math.random() * conns.length)];
    pulsesRef.current.push({
      fromNode: fromIdx,
      toNode: toIdx,
      progress: 0,
      speed: 0.008 + Math.random() * 0.012,
      alpha: 0.7 + Math.random() * 0.3,
    });
    if (pulsesRef.current.length > 60) {
      pulsesRef.current.splice(0, 10);
    }
  }, []);

  const triggerBurst = useCallback(() => {
    const nodes = nodesRef.current;
    if (nodes.length === 0) return;
    const centerIdx = Math.floor(Math.random() * nodes.length);
    const conns = nodes[centerIdx].connections;
    nodes[centerIdx].targetBrightness = 1.0;
    conns.slice(0, 5).forEach((toIdx) => {
      pulsesRef.current.push({
        fromNode: centerIdx,
        toNode: toIdx,
        progress: 0,
        speed: 0.015 + Math.random() * 0.01,
        alpha: 1.0,
      });
    });
    const scheduleNext = () => {
      const delay = 2000 + Math.random() * 3000;
      burstTimerRef.current = setTimeout(() => {
        triggerBurst();
        scheduleNext();
      }, delay);
    };
    if (!burstTimerRef.current) scheduleNext();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      sizeRef.current = { w, h };
      buildGrid(w, h);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    let pulseTimer = 0;
    let frame = 0;

    const render = (ts: number) => {
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);

      if (ts - pulseTimer > 120) {
        spawnPulse();
        pulseTimer = ts;
      }

      const nodes = nodesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hoverRadius = 110;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        const dx = n.x - mx;
        const dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < hoverRadius) {
          n.targetBrightness = 0.9 * (1 - dist / hoverRadius) + 0.15;
        } else {
          n.targetBrightness = 0.08 + Math.random() * 0.02;
        }

        n.brightness += (n.targetBrightness - n.brightness) * 0.06;
      }

      const maxDist = 130;
      for (let i = 0; i < nodes.length; i++) {
        const ni = nodes[i];
        for (const j of ni.connections) {
          const nj = nodes[j];
          const dx = ni.x - nj.x;
          const dy = ni.y - nj.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > maxDist) continue;
          const avgB = (ni.brightness + nj.brightness) / 2;
          const alpha = avgB * 0.55 * (1 - d / maxDist);
          ctx.beginPath();
          ctx.moveTo(ni.x, ni.y);
          ctx.lineTo(nj.x, nj.y);
          ctx.strokeStyle = `rgba(212,175,55,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      const pulses = pulsesRef.current;
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }
        const from = nodes[pulse.fromNode];
        const to = nodes[pulse.toNode];
        if (!from || !to) { pulses.splice(p, 1); continue; }
        const px = from.x + (to.x - from.x) * pulse.progress;
        const py = from.y + (to.y - from.y) * pulse.progress;

        const grd = ctx.createRadialGradient(px, py, 0, px, py, 8);
        grd.addColorStop(0, `rgba(212,175,55,${pulse.alpha})`);
        grd.addColorStop(0.4, `rgba(212,175,55,${pulse.alpha * 0.4})`);
        grd.addColorStop(1, 'rgba(212,175,55,0)');
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 3);
        grd.addColorStop(0, `rgba(212,175,55,${n.brightness})`);
        grd.addColorStop(1, 'rgba(212,175,55,0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,240,180,${Math.min(n.brightness * 1.8, 1)})`;
        ctx.fill();
      }

      if (frame % 3 === 0) {
        ctx.save();
        ctx.font = `bold ${Math.min(w * 0.38, 220)}px Arial Black, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255,255,255,0.018)';
        ctx.fillText('H2H', w / 2, h / 2);
        ctx.restore();
      }

      frame++;
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    triggerBurst();

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
      burstTimerRef.current = null;
    };
  }, [buildGrid, spawnPulse, triggerBurst]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ minHeight: 'clamp(360px, 60vh, 780px)', background: '#070707' }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, transparent 55%, var(--color-primary) 100%), radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <motion.div
        className="absolute top-6 left-6"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5"
          style={{
            background: 'rgba(0,0,0,0.55)',
            border: '1px solid rgba(212,175,55,0.25)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--color-secondary)',
              display: 'inline-block',
              boxShadow: '0 0 8px var(--color-secondary)',
            }}
          />
          <span
            className="text-xs uppercase"
            style={{
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.2em',
              fontFamily: 'var(--font-stack-heading)',
            }}
          >
            H2H Agency
          </span>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div
          className="flex gap-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '1rem' }}
        >
          {[
            { value: 50, suffix: '+', label: 'Brands' },
            { value: 12, suffix: '+', label: 'Markets' },
            { value: 98, suffix: '%', label: 'Retention' },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                className="font-black"
                style={{
                  fontSize: '2rem',
                  fontFamily: 'var(--font-stack-heading)',
                  color: 'var(--color-secondary)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                }}
              >
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <div
                className="text-xs uppercase"
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  color: 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.2em',
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
