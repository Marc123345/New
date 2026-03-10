import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play } from 'lucide-react';

const FOUNDER_VIDEO_URL =
  'https://ik.imagekit.io/qcvroy8xpd/IMG_9186%20(1).mp4';

const STORY_VIDEO_URL =
  'https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Video%202026-03-03%20at%2019.21.41.mp4';

interface HologramOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  videoUrl?: string;
}

function FloatingParticles() {
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

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; pulse: number; speed: number; colorIndex: number }[] = [];
    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * w(),
        y: Math.random() * h(),
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.6,
        size: 0.5 + Math.random() * 2,
        alpha: 0.1 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
        colorIndex: i % 2, // 0 = purple, 1 = cyan
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w(), h());

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.speed;

        if (p.y < -10) { p.y = h() + 10; p.x = Math.random() * w(); }
        if (p.x < -10) p.x = w() + 10;
        if (p.x > w() + 10) p.x = -10;

        const a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
        const color = p.colorIndex === 0
          ? `rgba(164,108,252,${a})`
          : `rgba(80,220,255,${a})`;
        const glowColor = p.colorIndex === 0
          ? `rgba(164,108,252,${a * 0.1})`
          : `rgba(80,220,255,${a * 0.1})`;

        // Upward streak for large particles
        if (p.size > 1.5) {
          const streakLen = 6 * Math.abs(p.vy);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + streakLen);
          ctx.strokeStyle = p.colorIndex === 0
            ? `rgba(164,108,252,${a * 0.3})`
            : `rgba(80,220,255,${a * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        if (p.size > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = glowColor;
          ctx.fill();
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const grad = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            grad.addColorStop(0, `rgba(164,108,252,${0.06 * (1 - dist / 100)})`);
            grad.addColorStop(1, `rgba(80,220,255,${0.06 * (1 - dist / 100)})`);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Radial gradient overlay
      const cw = w();
      const ch = h();
      const radGrad = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, Math.max(cw, ch) * 0.7);
      radGrad.addColorStop(0, 'rgba(60,20,140,0.15)');
      radGrad.addColorStop(0.5, 'rgba(20,60,100,0.08)');
      radGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, cw, ch);

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

function HoloHUD({ playing }: { playing: boolean }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Top-left corner bracket */}
      <svg style={{ position: 'absolute', top: 12, left: 12, width: 60, height: 60, opacity: 0.7 }}>
        <motion.path
          d="M0,15 L15,0 L45,0 L60,15"
          stroke="rgba(164,108,252,0.5)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        <motion.path
          d="M0,45 L15,60 L45,60 L60,45"
          stroke="rgba(164,108,252,0.3)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        {/* Inner bracket at half scale */}
        <motion.path
          d="M8,20 L20,8 L40,8 L52,20"
          stroke="rgba(80,220,255,0.3)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />
        <motion.path
          d="M8,40 L20,52 L40,52 L52,40"
          stroke="rgba(80,220,255,0.2)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        />
        {/* Animated dashes */}
        <line x1="0" y1="20" x2="25" y2="20" stroke="rgba(164,108,252,0.2)" strokeWidth="0.5" />
        <line x1="20" y1="0" x2="20" y2="25" stroke="rgba(164,108,252,0.2)" strokeWidth="0.5" />
      </svg>

      {/* Top-right corner bracket */}
      <svg style={{ position: 'absolute', top: 12, right: 12, width: 60, height: 60, opacity: 0.7 }}>
        <motion.path
          d="M60,15 L45,0 L15,0 L0,15"
          stroke="rgba(164,108,252,0.5)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        <motion.path
          d="M60,45 L45,60 L15,60 L0,45"
          stroke="rgba(164,108,252,0.3)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        {/* Inner bracket at half scale */}
        <motion.path
          d="M52,20 L40,8 L20,8 L8,20"
          stroke="rgba(80,220,255,0.3)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />
        <motion.path
          d="M52,40 L40,52 L20,52 L8,40"
          stroke="rgba(80,220,255,0.2)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        />
        {/* Animated dashes */}
        <line x1="60" y1="20" x2="35" y2="20" stroke="rgba(164,108,252,0.2)" strokeWidth="0.5" />
        <line x1="40" y1="0" x2="40" y2="25" stroke="rgba(164,108,252,0.2)" strokeWidth="0.5" />
      </svg>

      {/* Bottom-left corner bracket */}
      <svg style={{ position: 'absolute', bottom: 12, left: 12, width: 60, height: 60, opacity: 0.7 }}>
        <motion.path
          d="M0,45 L15,60 L45,60 L60,45"
          stroke="rgba(164,108,252,0.5)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        {/* Inner bracket */}
        <motion.path
          d="M8,40 L20,52 L40,52 L52,40"
          stroke="rgba(80,220,255,0.3)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
        {/* Animated dashes */}
        <line x1="0" y1="40" x2="25" y2="40" stroke="rgba(164,108,252,0.2)" strokeWidth="0.5" />
        <line x1="20" y1="60" x2="20" y2="35" stroke="rgba(164,108,252,0.2)" strokeWidth="0.5" />
      </svg>

      {/* Bottom-right corner bracket */}
      <svg style={{ position: 'absolute', bottom: 12, right: 12, width: 60, height: 60, opacity: 0.7 }}>
        <motion.path
          d="M60,45 L45,60 L15,60 L0,45"
          stroke="rgba(164,108,252,0.5)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        {/* Inner bracket */}
        <motion.path
          d="M52,40 L40,52 L20,52 L8,40"
          stroke="rgba(80,220,255,0.3)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
        {/* Animated dashes */}
        <line x1="60" y1="40" x2="35" y2="40" stroke="rgba(164,108,252,0.2)" strokeWidth="0.5" />
        <line x1="40" y1="60" x2="40" y2="35" stroke="rgba(164,108,252,0.2)" strokeWidth="0.5" />
      </svg>

      {playing && (
        <>
          <motion.div
            style={{
              position: 'absolute',
              top: 14,
              right: 60,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(164,108,252,0.8)' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span style={{ color: 'rgba(164,108,252,0.6)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Live
            </span>
          </motion.div>

          <motion.div
            style={{
              position: 'absolute',
              top: 14,
              left: 60,
              color: 'rgba(164,108,252,0.4)',
              fontSize: '0.5rem',
              letterSpacing: '0.12em',
              fontFamily: 'monospace',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            HOLO-STREAM // 01
          </motion.div>
        </>
      )}
    </div>
  );
}

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
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
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
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
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }, []);

  useEffect(() => {
    if (!playing || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scanY = 0;
    let scanY2 = canvas.height * 0.6;
    let t = 0;
    let chromaPhase = 0;

    const drawFrame = () => {
      if (!video || video.paused || video.ended) return;

      const vw = video.videoWidth || 640;
      const vh = video.videoHeight || 360;
      canvas.width = vw;
      canvas.height = vh;
      t++;
      chromaPhase += 0.015;

      ctx.clearRect(0, 0, vw, vh);

      // Chromatic aberration — increased shift to 5
      const chromaShift = Math.sin(chromaPhase) * 5;

      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(video, chromaShift, 0, vw, vh);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.drawImage(video, 0, 0, vw, vh);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(video, -chromaShift * 0.7, 0, vw, vh);
      ctx.restore();

      // CYAN channel
      ctx.save();
      ctx.globalAlpha = 0.2;
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(video, -chromaShift * 0.5, chromaShift * 0.3, vw, vh);
      ctx.fillStyle = 'rgba(0,200,255,0.08)';
      ctx.fillRect(0, 0, vw, vh);
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const grad = ctx.createRadialGradient(
        mouseRef.current.x * vw, mouseRef.current.y * vh, 0,
        mouseRef.current.x * vw, mouseRef.current.y * vh, vw * 0.5
      );
      grad.addColorStop(0, 'rgba(164, 108, 252, 0.06)');
      grad.addColorStop(0.4, 'rgba(130, 80, 220, 0.02)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, vw, vh);
      ctx.restore();

      const edgeGrad = ctx.createLinearGradient(0, 0, 0, vh);
      edgeGrad.addColorStop(0, 'rgba(164, 108, 252, 0.08)');
      edgeGrad.addColorStop(0.15, 'rgba(164, 108, 252, 0)');
      edgeGrad.addColorStop(0.85, 'rgba(164, 108, 252, 0)');
      edgeGrad.addColorStop(1, 'rgba(164, 108, 252, 0.06)');
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = edgeGrad;
      ctx.fillRect(0, 0, vw, vh);
      ctx.restore();

      // Scan lines — increased intensity, cyan every 4th line
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      const intensity = 0.07 + 0.04 * Math.sin(t * 0.05);
      for (let y = 0; y < vh; y += 2) {
        if (y % 8 === 0) {
          // Every 4th line (every 8px since step is 2) — cyan
          const lineAlpha = intensity * 1.5;
          ctx.fillStyle = `rgba(80,220,255,${lineAlpha})`;
        } else {
          const lineAlpha = y % 4 === 0 ? intensity * 1.5 : intensity;
          ctx.fillStyle = `rgba(164, 108, 252, ${lineAlpha})`;
        }
        ctx.fillRect(0, y, vw, 1);
      }
      ctx.restore();

      scanY = (scanY + 1.2) % vh;
      scanY2 = (scanY2 + 0.7) % vh;
      const scanY3 = (t * 2.5) % vh;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const drawScan = (sy: number, bw: number, a: number, rgb: string) => {
        const sg = ctx.createLinearGradient(0, sy - bw, 0, sy + bw);
        sg.addColorStop(0, `rgba(${rgb}, 0)`);
        sg.addColorStop(0.3, `rgba(${rgb}, ${a * 0.4})`);
        sg.addColorStop(0.5, `rgba(${rgb}, ${a})`);
        sg.addColorStop(0.7, `rgba(${rgb}, ${a * 0.4})`);
        sg.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = sg;
        ctx.fillRect(0, sy - bw, vw, bw * 2);
      };
      drawScan(scanY, 25, 0.18, '164,108,252');
      drawScan(scanY2, 15, 0.10, '164,108,252');
      // Third fast cyan scan
      const sg3 = ctx.createLinearGradient(0, scanY3 - 15, 0, scanY3 + 15);
      sg3.addColorStop(0, 'rgba(80,220,255,0)');
      sg3.addColorStop(0.3, `rgba(80,220,255,${0.08 * 0.4})`);
      sg3.addColorStop(0.5, 'rgba(80,220,255,0.08)');
      sg3.addColorStop(0.7, `rgba(80,220,255,${0.08 * 0.4})`);
      sg3.addColorStop(1, 'rgba(80,220,255,0)');
      ctx.fillStyle = sg3;
      ctx.fillRect(0, scanY3 - 15, vw, 30);
      ctx.restore();

      // Iridescent shimmer bar sweeping top-to-bottom every 4 seconds
      const shimmerY = (t * 0.5) % vh;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const shimmerGrad = ctx.createLinearGradient(0, shimmerY - 6, 0, shimmerY + 6);
      shimmerGrad.addColorStop(0, 'rgba(164,108,252,0)');
      shimmerGrad.addColorStop(0.5, 'rgba(164,108,252,0.12)');
      shimmerGrad.addColorStop(1, 'rgba(164,108,252,0)');
      ctx.fillStyle = shimmerGrad;
      ctx.fillRect(0, shimmerY - 6, vw, 12);
      ctx.restore();

      // Glitch — increased frequency and max shift
      if (Math.random() > 0.90) {
        const glitchCount = 1 + Math.floor(Math.random() * 3);
        for (let g = 0; g < glitchCount; g++) {
          const gy = Math.random() * vh;
          const gh = 1 + Math.random() * 8;
          const shift = (Math.random() - 0.5) * 30;
          ctx.save();
          ctx.globalAlpha = 0.5 + Math.random() * 0.4;
          try {
            const slice = ctx.getImageData(0, Math.max(0, gy), vw, Math.min(gh, vh - gy));
            ctx.putImageData(slice, shift, gy);
          } catch (_) {}
          ctx.restore();
        }
      }

      if (Math.random() > 0.985) {
        ctx.save();
        ctx.globalAlpha = 0.04 + Math.random() * 0.06;
        ctx.fillStyle = '#a46cfc';
        ctx.fillRect(0, 0, vw, vh);
        ctx.restore();
      }

      const vigGrad = ctx.createRadialGradient(vw / 2, vh / 2, vw * 0.25, vw / 2, vh / 2, vw * 0.7);
      vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
      vigGrad.addColorStop(1, 'rgba(14,11,31,0.4)');
      ctx.save();
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, vw, vh);
      ctx.restore();

      animRef.current = requestAnimationFrame(drawFrame);
    };

    animRef.current = requestAnimationFrame(drawFrame);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [playing]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const handleVideoEnd = () => {
    setPlaying(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="holo-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="fixed inset-0"
            style={{ zIndex: 9999, background: 'rgba(6,4,20,0.98)', backdropFilter: 'blur(30px)' }}
          >
            <FloatingParticles />
          </motion.div>

          <motion.div
            key="holo-content"
            initial={{ opacity: 0, scale: 0.7, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.85, rotateX: -12, y: 40 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24, mass: 0.8 }}
            className="fixed inset-0 flex items-center justify-center px-3 pt-16 pb-3 sm:px-4 sm:pt-16 sm:pb-4 md:p-10"
            style={{ zIndex: 10000, pointerEvents: 'none', perspective: 1400 }}
          >
            <div
              className="relative"
              style={{ maxWidth: 780, width: '100%', pointerEvents: 'all' }}
              onClick={(e) => e.stopPropagation()}
              onMouseMove={handleMouseMove}
            >
              <motion.button
                onClick={onClose}
                aria-label="Close"
                className="absolute flex items-center justify-center"
                style={{
                  top: -48,
                  right: 0,
                  width: 44,
                  height: 44,
                  background: 'rgba(164, 108, 252, 0.04)',
                  border: '1px solid rgba(164, 108, 252, 0.2)',
                  borderRadius: 2,
                  color: 'rgba(164, 108, 252, 0.7)',
                  cursor: 'pointer',
                  zIndex: 10,
                }}
                whileHover={{
                  background: 'rgba(164, 108, 252, 0.1)',
                  borderColor: 'rgba(164, 108, 252, 0.5)',
                  color: 'rgba(164, 108, 252, 1)',
                  boxShadow: '0 0 20px rgba(164, 108, 252, 0.15)',
                }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} strokeWidth={2} />
              </motion.button>

              <motion.div
                style={{ position: 'relative' }}
                animate={playing ? {
                  boxShadow: [
                    '0 0 40px rgba(164,108,252,0.08), 0 0 80px rgba(130,80,220,0.04)',
                    '0 0 60px rgba(164,108,252,0.12), 0 0 120px rgba(130,80,220,0.06)',
                    '0 0 40px rgba(164,108,252,0.08), 0 0 80px rgba(130,80,220,0.04)',
                  ],
                } : {}}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Animated border frame — cycles through purple/cyan/pink */}
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: -1,
                    borderRadius: 4,
                    pointerEvents: 'none',
                    zIndex: 2,
                    border: '1px solid rgba(164,108,252,0.15)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    borderColor: playing
                      ? [
                          'rgba(164,108,252,0.4)',
                          'rgba(80,220,255,0.5)',
                          'rgba(255,80,200,0.4)',
                          'rgba(164,108,252,0.4)',
                        ]
                      : 'rgba(164,108,252,0.15)',
                    boxShadow: playing
                      ? [
                          '0 0 40px rgba(164,108,252,0.2), 0 0 80px rgba(80,220,255,0.1), inset 0 0 30px rgba(164,108,252,0.05)',
                          '0 0 60px rgba(80,220,255,0.25), 0 0 120px rgba(164,108,252,0.15), inset 0 0 50px rgba(80,220,255,0.08)',
                          '0 0 40px rgba(164,108,252,0.2), 0 0 80px rgba(80,220,255,0.1), inset 0 0 30px rgba(164,108,252,0.05)',
                        ]
                      : '0 0 20px rgba(164,108,252,0.06)',
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16/9',
                    overflow: 'hidden',
                    background: '#0e0b1f',
                    borderRadius: 4,
                    border: '1px solid rgba(164, 108, 252, 0.15)',
                  }}
                >
                  <video
                    ref={videoRef}
                    src={resolvedVideoUrl}
                    playsInline
                    onCanPlay={() => setVideoReady(true)}
                    onEnded={handleVideoEnd}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0,
                      pointerEvents: 'none',
                    }}
                  />

                  <canvas
                    ref={canvasRef}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: playing ? 'block' : 'none',
                    }}
                  />

                  <HoloHUD playing={playing} />

                  {!playing && bootPhase >= 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-6"
                      style={{ background: 'radial-gradient(ellipse at center, rgba(164, 108, 252, 0.03) 0%, transparent 60%)' }}
                    >
                      {bootPhase < 3 && (
                        <motion.div
                          style={{
                            color: bootPhase === 1
                              ? 'rgba(80,220,255,0.7)'
                              : 'rgba(164,108,252,0.5)',
                            fontSize: '0.55rem',
                            letterSpacing: '0.2em',
                            fontFamily: 'monospace',
                            textAlign: 'center',
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 1, 0.6] }}
                          transition={{ duration: 0.8 }}
                        >
                          {bootPhase === 1 && 'INITIALIZING HOLOGRAPHIC MATRIX...'}
                          {bootPhase === 2 && 'CALIBRATING SIGNAL...'}
                        </motion.div>
                      )}

                      {bootPhase >= 3 && (
                        <>
                          <motion.div
                            style={{
                              width: 130,
                              height: 130,
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: videoReady ? 'pointer' : 'default',
                            }}
                            whileHover={videoReady ? { scale: 1.06 } : {}}
                            whileTap={videoReady ? { scale: 0.94 } : {}}
                            onClick={videoReady ? handlePlay : undefined}
                          >
                            <motion.div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                border: '1.5px solid rgba(164,108,252,0.5)',
                              }}
                              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            />

                            <motion.div
                              style={{
                                position: 'absolute',
                                inset: -8,
                                borderRadius: '50%',
                                border: '1px solid rgba(164, 108, 252, 0.1)',
                              }}
                              animate={{ rotate: 360 }}
                              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                            />

                            <motion.div
                              style={{
                                position: 'absolute',
                                inset: -18,
                                borderRadius: '50%',
                                border: '1px dashed rgba(164, 108, 252, 0.06)',
                              }}
                              animate={{ rotate: -360 }}
                              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                            />

                            <motion.div
                              style={{
                                position: 'absolute',
                                inset: -28,
                                borderRadius: '50%',
                                border: '0.5px solid rgba(164, 108, 252, 0.04)',
                              }}
                              animate={{ rotate: 360 }}
                              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                            />

                            {/* Fourth ring cycling purple/cyan */}
                            <motion.div
                              style={{
                                position: 'absolute',
                                inset: -38,
                                borderRadius: '50%',
                                border: '0.5px solid rgba(164,108,252,0.04)',
                              }}
                              animate={{
                                rotate: -360,
                                borderColor: [
                                  'rgba(164,108,252,0.15)',
                                  'rgba(80,220,255,0.15)',
                                  'rgba(164,108,252,0.15)',
                                ],
                              }}
                              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                            />

                            <svg width="130" height="130" style={{ position: 'absolute', inset: 0 }}>
                              <motion.circle
                                cx="65"
                                cy="65"
                                r="60"
                                fill="none"
                                stroke="rgba(164,108,252,0.6)"
                                strokeWidth="1.5"
                                strokeDasharray="8 12"
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                                style={{ transformOrigin: 'center' }}
                              />
                            </svg>

                            <motion.div
                              style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(164,108,252,0.15) 0%, rgba(80,220,255,0.05) 50%, transparent 70%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              animate={{ boxShadow: ['0 0 30px rgba(164,108,252,0.05)', '0 0 50px rgba(164,108,252,0.1)', '0 0 30px rgba(164,108,252,0.05)'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                              <Play
                                size={28}
                                fill="rgba(164,108,252,0.8)"
                                stroke="rgba(80,220,255,0.9)"
                                strokeWidth={1.5}
                                style={{ marginLeft: 3 }}
                              />
                            </motion.div>
                          </motion.div>

                          <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                              fontSize: '0.65rem',
                              letterSpacing: '0.3em',
                              textTransform: 'uppercase',
                              fontFamily: 'monospace',
                              background: 'linear-gradient(90deg, rgba(164,108,252,0.9), rgba(80,220,255,0.9))',
                              WebkitBackgroundClip: 'text',
                              color: 'transparent',
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 70,
                        background: 'linear-gradient(to top, rgba(14, 11, 31, 0.8), transparent)',
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        padding: '0 16px 12px',
                      }}
                    >
                      <span style={{
                        color: 'rgba(164, 108, 252, 0.5)',
                        fontSize: '0.55rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        fontFamily: 'monospace',
                      }}>
                        Holographic Feed Active
                      </span>
                      <motion.div
                        style={{ display: 'flex', gap: 2 }}
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            style={{
                              width: 2,
                              background: 'rgba(164, 108, 252, 0.5)',
                              borderRadius: 1,
                            }}
                            animate={{ height: [4, 8 + Math.random() * 8, 4] }}
                            transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.08 }}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </div>

                {/* Ground projection glow */}
                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: -2,
                    left: '0%',
                    right: '0%',
                    height: 80,
                    background: 'radial-gradient(ellipse at center, rgba(164,108,252,0.25) 0%, rgba(80,220,255,0.12) 40%, transparent 70%)',
                    filter: 'blur(12px)',
                    pointerEvents: 'none',
                  }}
                  animate={{ opacity: [0.4, 1, 0.4], scaleX: [0.8, 1.1, 0.8] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Left side accent line */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: -30,
                    width: 2,
                    height: 60,
                    background: 'linear-gradient(to bottom, transparent, rgba(164,108,252,0.3), transparent)',
                    pointerEvents: 'none',
                  }}
                  animate={{ height: [40, 80, 40], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Right side accent line */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: -30,
                    width: 2,
                    height: 60,
                    background: 'linear-gradient(to bottom, transparent, rgba(80,220,255,0.2), transparent)',
                    pointerEvents: 'none',
                  }}
                  animate={{ height: [40, 80, 40], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                style={{
                  textAlign: 'center',
                  marginTop: 24,
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-stack-heading)',
                }}
              >
                {title}
              </motion.p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
