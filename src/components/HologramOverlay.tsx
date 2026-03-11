import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play } from 'lucide-react';

const FOUNDER_VIDEO_URL = 'https://ik.imagekit.io/qcvroy8xpd/IMG_9186%20(1).mp4';
const STORY_VIDEO_URL = 'https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Video%202026-03-03%20at%2019.21.41.mp4';

interface HologramOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  videoUrl?: string;
}

// ─── Space background canvas ───────────────────────────────────────────────
function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    // Stars
    const stars: { x: number; y: number; r: number; a: number; phase: number; speed: number }[] = [];
    for (let i = 0; i < 220; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: 0.3 + Math.random() * 1.2,
        a: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.018,
      });
    }

    let t = 0;

    const draw = () => {
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      // Background
      const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, w * 0.8);
      bg.addColorStop(0, '#050118');
      bg.addColorStop(0.5, '#030112');
      bg.addColorStop(1, '#010008');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      t += 0.008;

      // Stars
      for (const s of stars) {
        const alpha = s.a * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed * 10));
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`;
        ctx.fill();
      }

      // ── Ringed planet (left) ──────────────────────────────────
      const px = w * 0.12, py = h * 0.28, pr = Math.min(w, h) * 0.06;
      // Planet glow
      const planetGlow = ctx.createRadialGradient(px, py, 0, px, py, pr * 2.5);
      planetGlow.addColorStop(0, 'rgba(164,108,252,0.08)');
      planetGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = planetGlow;
      ctx.fillRect(px - pr * 3, py - pr * 3, pr * 6, pr * 6);
      // Rings (back half, ellipse)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(px, py, pr * 2.2, pr * 0.45, -0.3, Math.PI, Math.PI * 2);
      ctx.strokeStyle = 'rgba(164,108,252,0.18)';
      ctx.lineWidth = pr * 0.35;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(px, py, pr * 2.6, pr * 0.55, -0.3, Math.PI, Math.PI * 2);
      ctx.strokeStyle = 'rgba(140,90,252,0.10)';
      ctx.lineWidth = pr * 0.18;
      ctx.stroke();
      ctx.restore();
      // Planet body
      const planetFill = ctx.createRadialGradient(px - pr * 0.25, py - pr * 0.25, 0, px, py, pr);
      planetFill.addColorStop(0, 'rgba(200,160,255,0.55)');
      planetFill.addColorStop(0.5, 'rgba(120,60,200,0.45)');
      planetFill.addColorStop(1, 'rgba(40,10,100,0.6)');
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fillStyle = planetFill;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(164,108,252,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Rings (front half)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(px, py, pr * 2.2, pr * 0.45, -0.3, 0, Math.PI);
      ctx.strokeStyle = 'rgba(164,108,252,0.22)';
      ctx.lineWidth = pr * 0.35;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(px, py, pr * 2.6, pr * 0.55, -0.3, 0, Math.PI);
      ctx.strokeStyle = 'rgba(140,90,252,0.12)';
      ctx.lineWidth = pr * 0.18;
      ctx.stroke();
      ctx.restore();

      // ── Spiral galaxy (right) ─────────────────────────────────
      const gx = w * 0.88, gy = h * 0.22, gr = Math.min(w, h) * 0.07;
      for (let arm = 0; arm < 3; arm++) {
        const armOffset = (arm / 3) * Math.PI * 2;
        for (let i = 0; i < 60; i++) {
          const frac = i / 60;
          const angle = armOffset + frac * Math.PI * 2.5 + t * 0.05;
          const radius = frac * gr;
          const x = gx + Math.cos(angle) * radius;
          const y = gy + Math.sin(angle) * radius * 0.5;
          const alpha = (1 - frac) * 0.35;
          const r = 0.5 + (1 - frac) * 1.5;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          const hue = arm === 0 ? '164,108,252' : arm === 1 ? '180,120,255' : '200,140,255';
          ctx.fillStyle = `rgba(${hue},${alpha})`;
          ctx.fill();
        }
      }
      // Galaxy core glow
      const galGlow = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr * 0.4);
      galGlow.addColorStop(0, 'rgba(200,160,255,0.25)');
      galGlow.addColorStop(1, 'rgba(100,50,200,0)');
      ctx.fillStyle = galGlow;
      ctx.beginPath();
      ctx.ellipse(gx, gy, gr * 0.4, gr * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}

// ─── Wireframe globe canvas ────────────────────────────────────────────────
function WireframeGlobe({ size }: { size: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const cx = size / 2, cy = size / 2, r = size * 0.42;
    let rotY = 0;

    const project = (lat: number, lon: number) => {
      const x = r * Math.cos(lat) * Math.sin(lon + rotY);
      const y = r * Math.sin(lat);
      const z = r * Math.cos(lat) * Math.cos(lon + rotY);
      const scale = (z + r * 1.5) / (r * 2.5);
      return { x: cx + x * scale, y: cy - y * scale, z, scale };
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      rotY += 0.004;

      // Outer glow
      const glow = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.2);
      glow.addColorStop(0, 'rgba(164,108,252,0.06)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, size, size);

      // Latitude lines (8 lines)
      for (let li = -3; li <= 3; li++) {
        const lat = (li / 4) * (Math.PI / 2) * 0.95;
        ctx.beginPath();
        let started = false;
        for (let j = 0; j <= 64; j++) {
          const lon = (j / 64) * Math.PI * 2;
          const p = project(lat, lon);
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(164,108,252,0.35)`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // Longitude lines (12 lines)
      for (let li = 0; li < 12; li++) {
        const lon = (li / 12) * Math.PI * 2;
        ctx.beginPath();
        let started = false;
        for (let j = 0; j <= 48; j++) {
          const lat = ((j / 48) - 0.5) * Math.PI;
          const p = project(lat, lon);
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        }
        ctx.strokeStyle = `rgba(164,108,252,0.25)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Equator highlight
      ctx.beginPath();
      for (let j = 0; j <= 64; j++) {
        const lon = (j / 64) * Math.PI * 2;
        const p = project(0, lon);
        if (j === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(180,120,255,0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Globe edge glow
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(164,108,252,0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner atmosphere tint
      const atmo = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r);
      atmo.addColorStop(0, 'rgba(100,50,220,0)');
      atmo.addColorStop(1, 'rgba(120,60,230,0.06)');
      ctx.fillStyle = atmo;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, display: 'block' }}
    />
  );
}

// ─── Flat disc canvas ──────────────────────────────────────────────────────
function FlatDisc({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const cx = width / 2, cy = height * 0.38;
    const rx = width * 0.46, ry = height * 0.28;
    let t = 0;
    let scanAngle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.015;
      scanAngle = (scanAngle + 0.008) % (Math.PI * 2);

      // Disc glow underneath
      const discGlow = ctx.createRadialGradient(cx, cy + ry * 0.2, 0, cx, cy, rx * 1.1);
      discGlow.addColorStop(0, `rgba(140,80,240,${0.06 + 0.03 * Math.sin(t)})`);
      discGlow.addColorStop(0.5, 'rgba(80,40,180,0.04)');
      discGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = discGlow;
      ctx.fillRect(0, 0, width, height);

      // Clip to ellipse
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.clip();

      // Disc fill
      const discFill = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
      discFill.addColorStop(0, 'rgba(80,40,160,0.35)');
      discFill.addColorStop(0.6, 'rgba(50,20,120,0.25)');
      discFill.addColorStop(1, 'rgba(20,10,60,0.15)');
      ctx.fillStyle = discFill;
      ctx.fillRect(0, 0, width, height);

      // Radial grid lines
      const numLines = 16;
      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2;
        const ex = cx + Math.cos(angle) * rx;
        const ey = cy + Math.sin(angle) * ry;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = 'rgba(164,108,252,0.12)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Concentric rings
      const numRings = 6;
      for (let i = 1; i <= numRings; i++) {
        const frac = i / numRings;
        const pulse = i === 1 ? 0.55 + 0.15 * Math.sin(t * 1.5) : 0.12 + 0.05 * Math.sin(t + i);
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * frac, ry * frac, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(164,108,252,${pulse})`;
        ctx.lineWidth = i === 1 ? 1.5 : 0.5;
        ctx.stroke();
      }

      // Rotating scan sweep
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, rx, scanAngle, scanAngle + 0.3);
      ctx.lineTo(cx, cy);
      ctx.fillStyle = 'rgba(164,108,252,0.08)';
      ctx.fill();

      ctx.restore();

      // Disc edge
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(164,108,252,${0.5 + 0.2 * Math.sin(t)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Outer glow ring
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx * 1.04, ry * 1.04, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(140,90,252,${0.12 + 0.06 * Math.sin(t * 0.7)})`;
      ctx.lineWidth = 4;
      ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', bottom: 0, left: 0, width, height, display: 'block', pointerEvents: 'none' }}
    />
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export function HologramOverlay({ isOpen, onClose, title = 'Meet the Founder', videoUrl }: HologramOverlayProps) {
  const resolvedVideoUrl = videoUrl ?? FOUNDER_VIDEO_URL;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [bootPhase, setBootPhase] = useState(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      setBootPhase(0);
      const t1 = setTimeout(() => setBootPhase(1), 200);
      const t2 = setTimeout(() => setBootPhase(2), 700);
      const t3 = setTimeout(() => setBootPhase(3), 1200);
      return () => {
        document.removeEventListener('keydown', onKey);
        document.body.style.overflow = '';
        clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      };
    }
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setPlaying(false);
      setVideoReady(false);
      setBootPhase(0);
    }
  }, [isOpen]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
  }, []);

  // Holographic video canvas effect
  useEffect(() => {
    if (!playing || !videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let scanY = 0, scanY2 = 0, t = 0, chromaPhase = 0;

    const drawFrame = () => {
      if (!video || video.paused || video.ended) return;
      const vw = video.videoWidth || 640, vh = video.videoHeight || 360;
      canvas.width = vw; canvas.height = vh;
      t++; chromaPhase += 0.015;
      ctx.clearRect(0, 0, vw, vh);
      const chromaShift = Math.sin(chromaPhase) * 5;
      ctx.save(); ctx.globalAlpha = 0.3; ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(video, chromaShift, 0, vw, vh); ctx.restore();
      ctx.save(); ctx.globalAlpha = 0.85; ctx.drawImage(video, 0, 0, vw, vh); ctx.restore();
      ctx.save(); ctx.globalAlpha = 0.2; ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(video, -chromaShift * 0.7, 0, vw, vh); ctx.restore();
      // Purple channel
      ctx.save(); ctx.globalAlpha = 0.2; ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(video, -chromaShift * 0.5, chromaShift * 0.3, vw, vh); ctx.restore();
      // Scan lines
      ctx.save(); ctx.globalCompositeOperation = 'overlay';
      const intensity = 0.07 + 0.04 * Math.sin(t * 0.05);
      for (let y = 0; y < vh; y += 2) {
        const la = y % 4 === 0 ? intensity * 1.5 : intensity;
        ctx.fillStyle = `rgba(164,108,252,${la})`;
        ctx.fillRect(0, y, vw, 1);
      }
      ctx.restore();
      // Scan beams
      scanY = (scanY + 1.5) % vh; scanY2 = (scanY2 + 0.8) % vh;
      const scanY3 = (t * 2.5) % vh;
      ctx.save(); ctx.globalCompositeOperation = 'screen';
      const drawScan = (sy: number, w: number, a: number, color: string) => {
        const sg = ctx.createLinearGradient(0, sy - w, 0, sy + w);
        sg.addColorStop(0, 'rgba(0,0,0,0)');
        sg.addColorStop(0.5, `rgba(${color},${a})`);
        sg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sg; ctx.fillRect(0, sy - w, vw, w * 2);
      };
      drawScan(scanY, 25, 0.18, '164,108,252');
      drawScan(scanY2, 15, 0.10, '164,108,252');
      drawScan(scanY3, 8, 0.08, '180,120,255');
      ctx.restore();
      // Glitch
      if (Math.random() > 0.90) {
        const gc = 1 + Math.floor(Math.random() * 3);
        for (let g = 0; g < gc; g++) {
          const gy = Math.random() * vh, gh = 1 + Math.random() * 8, shift = (Math.random() - 0.5) * 30;
          ctx.save(); ctx.globalAlpha = 0.5 + Math.random() * 0.4;
          try { const sl = ctx.getImageData(0, Math.max(0, gy), vw, Math.min(gh, vh - gy)); ctx.putImageData(sl, shift, gy); } catch (_) {}
          ctx.restore();
        }
      }
      // Vignette
      const vig = ctx.createRadialGradient(vw / 2, vh / 2, vw * 0.25, vw / 2, vh / 2, vw * 0.7);
      vig.addColorStop(0, 'rgba(0,0,0,0)'); vig.addColorStop(1, 'rgba(5,2,20,0.45)');
      ctx.fillStyle = vig; ctx.fillRect(0, 0, vw, vh);
      animRef.current = requestAnimationFrame(drawFrame);
    };
    animRef.current = requestAnimationFrame(drawFrame);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [playing]);

  const handlePlay = () => { if (videoRef.current) { videoRef.current.play(); setPlaying(true); } };
  const handleVideoEnd = () => setPlaying(false);

  const GLOBE_SIZE = 160;
  const DISC_W = 520;
  const DISC_H = 120;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="holo-backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onClose}
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{ zIndex: 9999, background: 'rgba(4,2,16,0.98)', backdropFilter: 'blur(8px)' }}
        >
          <SpaceBackground />

          {/* Content — stops propagation so clicks here don't close the overlay */}
          <motion.div
            key="holo-content"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22, mass: 0.9 }}
            style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onClick={(e) => e.stopPropagation()}
            onMouseMove={handleMouseMove}
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute', top: -44, right: 0,
                width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(164,108,252,0.04)', border: '1px solid rgba(164,108,252,0.25)',
                borderRadius: 2, color: 'rgba(164,108,252,0.7)', cursor: 'pointer', zIndex: 10,
              }}
              whileHover={{ background: 'rgba(164,108,252,0.12)', borderColor: 'rgba(164,108,252,0.6)', color: 'rgba(180,130,255,1)', boxShadow: '0 0 20px rgba(164,108,252,0.3)' }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} strokeWidth={2} />
            </motion.button>

            {/* ── Globe ── */}
            <motion.div
              style={{ position: 'relative', zIndex: 3 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <WireframeGlobe size={GLOBE_SIZE} />
              {/* Globe bottom glow for beam origin */}
              <div style={{
                position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
                width: 40, height: 12,
                background: 'radial-gradient(ellipse, rgba(164,108,252,0.6) 0%, transparent 70%)',
                filter: 'blur(4px)',
              }} />
            </motion.div>

            {/* ── Light beam ── */}
            <div style={{ position: 'relative', width: 2, zIndex: 2, overflow: 'visible' }}>
              {/* Core beam */}
              <motion.div
                style={{
                  width: 2, height: 90,
                  background: 'linear-gradient(to bottom, rgba(164,108,252,0.9), rgba(164,108,252,0.2))',
                  margin: '0 auto',
                  boxShadow: '0 0 8px rgba(164,108,252,0.6), 0 0 20px rgba(164,108,252,0.3)',
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Beam glow spread */}
              <motion.div
                style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: 20, height: 90,
                  background: 'linear-gradient(to bottom, rgba(164,108,252,0.15), rgba(164,108,252,0.03))',
                  filter: 'blur(6px)',
                }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Particles flowing down the beam */}
              {[0, 0.33, 0.66].map((delay, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                    width: 3, height: 3, borderRadius: '50%',
                    background: 'rgba(180,120,255,0.9)',
                    boxShadow: '0 0 6px rgba(164,108,252,0.8)',
                  }}
                  animate={{ top: [0, 90], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay, ease: 'linear' }}
                />
              ))}
            </div>

            {/* ── Video / disc area ── */}
            <div style={{ position: 'relative', width: DISC_W, zIndex: 4 }}>
              {/* Disc canvas behind video */}
              <FlatDisc width={DISC_W} height={DISC_H} />

              {/* Video panel — above the disc, centered */}
              <div style={{ position: 'relative', zIndex: 5, marginTop: -DISC_H * 0.1 }}>
                <motion.div
                  style={{ position: 'relative', maxWidth: 700, width: '100%', margin: '0 auto' }}
                  animate={{ boxShadow: ['0 0 30px rgba(164,108,252,0.12)', '0 0 60px rgba(164,108,252,0.22)', '0 0 30px rgba(164,108,252,0.12)'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {/* Animated iridescent border */}
                  <motion.div
                    style={{ position: 'absolute', inset: -1, borderRadius: 3, border: '1.5px solid', zIndex: 2, pointerEvents: 'none' }}
                    animate={{ borderColor: ['rgba(164,108,252,0.6)', 'rgba(200,140,255,0.7)', 'rgba(130,70,240,0.5)', 'rgba(164,108,252,0.6)'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />

                  <div style={{
                    position: 'relative', width: '100%', aspectRatio: '16/9',
                    overflow: 'hidden', background: '#050218', borderRadius: 3,
                    border: '1px solid rgba(164,108,252,0.15)',
                  }}>
                    <video
                      ref={videoRef}
                      src={resolvedVideoUrl}
                      playsInline
                      onCanPlay={() => setVideoReady(true)}
                      onEnded={handleVideoEnd}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0, pointerEvents: 'none' }}
                    />
                    <canvas
                      ref={canvasRef}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: playing ? 'block' : 'none' }}
                    />

                    {/* HUD corners */}
                    {[['top-0 left-0', 'M0,16 L16,0'], ['top-0 right-0 scale-x-[-1]', 'M0,16 L16,0'], ['bottom-0 left-0 scale-y-[-1]', 'M0,16 L16,0'], ['bottom-0 right-0 scale-x-[-1] scale-y-[-1]', 'M0,16 L16,0']].map(([pos, d], i) => (
                      <svg key={i} className={`absolute ${pos}`} style={{ width: 24, height: 24, opacity: 0.7 }}>
                        <motion.path d={d} stroke="rgba(164,108,252,0.8)" strokeWidth="1.5" fill="none"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: i * 0.1 }} />
                      </svg>
                    ))}

                    {/* Boot / play state */}
                    {!playing && bootPhase >= 1 && (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-5"
                        style={{ background: 'radial-gradient(ellipse at center, rgba(164,108,252,0.04) 0%, transparent 60%)' }}
                      >
                        {bootPhase < 3 && (
                          <motion.div
                            style={{ fontSize: '0.55rem', letterSpacing: '0.2em', fontFamily: 'monospace', textAlign: 'center' }}
                            animate={{ opacity: [0, 1, 0.6] }} transition={{ duration: 0.8 }}
                          >
                            <span style={{ color: bootPhase === 1 ? 'rgba(164,108,252,0.7)' : 'rgba(180,120,255,0.6)' }}>
                              {bootPhase === 1 ? 'INITIALIZING HOLOGRAPHIC MATRIX...' : 'CALIBRATING SIGNAL...'}
                            </span>
                          </motion.div>
                        )}
                        {bootPhase >= 3 && (
                          <>
                            <motion.div
                              style={{ width: 110, height: 110, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: videoReady ? 'pointer' : 'default' }}
                              whileHover={videoReady ? { scale: 1.06 } : {}}
                              whileTap={videoReady ? { scale: 0.94 } : {}}
                              onClick={videoReady ? handlePlay : undefined}
                            >
                              {/* Rings */}
                              <motion.div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(164,108,252,0.5)' }}
                                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />
                              <motion.div style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: '1px solid rgba(164,108,252,0.2)' }}
                                animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
                              <motion.div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '1px dashed rgba(164,108,252,0.15)' }}
                                animate={{ rotate: -360 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }} />
                              <motion.div style={{ position: 'absolute', inset: -30, borderRadius: '50%', border: '1px solid transparent' }}
                                animate={{ borderColor: ['rgba(164,108,252,0.12)', 'rgba(180,120,255,0.12)', 'rgba(164,108,252,0.12)'] }}
                                transition={{ duration: 2, repeat: Infinity }} />
                              {/* SVG dashed circle */}
                              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                                <motion.circle cx="55" cy="55" r="50" fill="none" stroke="rgba(164,108,252,0.6)" strokeWidth="1.5" strokeDasharray="6 10"
                                  animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                                  style={{ transformOrigin: 'center' }} />
                              </svg>
                              {/* Inner glow + icon */}
                              <motion.div
                                style={{ width: 52, height: 52, borderRadius: '50%', background: 'radial-gradient(circle, rgba(164,108,252,0.15) 0%, rgba(120,60,220,0.05) 50%, transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                animate={{ boxShadow: ['0 0 20px rgba(164,108,252,0.1)', '0 0 40px rgba(164,108,252,0.25)', '0 0 20px rgba(164,108,252,0.1)'] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Play size={24} fill="rgba(164,108,252,0.8)" stroke="rgba(180,130,255,0.9)" strokeWidth={1.5} style={{ marginLeft: 3 }} />
                              </motion.div>
                            </motion.div>

                            <motion.p
                              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                              style={{
                                fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'monospace',
                                background: 'linear-gradient(90deg, rgba(164,108,252,0.9), rgba(200,140,255,0.9))',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                              }}
                            >
                              {videoReady ? '[ ENGAGE HOLOGRAM ]' : '[ ACQUIRING SIGNAL... ]'}
                            </motion.p>
                          </>
                        )}
                      </motion.div>
                    )}

                    {playing && (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
                          background: 'linear-gradient(to top, rgba(5,2,24,0.85), transparent)',
                          pointerEvents: 'none', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 14px 10px',
                        }}
                      >
                        <span style={{ color: 'rgba(164,108,252,0.5)', fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                          Holographic Feed Active
                        </span>
                        <motion.div style={{ display: 'flex', gap: 2 }} animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          {[...Array(5)].map((_, i) => (
                            <motion.div key={i} style={{ width: 2, background: 'rgba(164,108,252,0.6)', borderRadius: 1 }}
                              animate={{ height: [4, 8 + Math.random() * 8, 4] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }} />
                          ))}
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Title */}
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              style={{ textAlign: 'center', marginTop: 20, fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'var(--font-stack-heading)', color: 'rgba(164,108,252,0.5)' }}
            >
              {title}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
