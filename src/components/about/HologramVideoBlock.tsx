import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Maximize2 } from 'lucide-react';

interface HologramVideoBlockProps {
  src: string;
  label?: string;
  sublabel?: string;
}

function HoloHUD({ playing }: { playing: boolean }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 3 }}>
      <svg style={{ position: 'absolute', top: 12, left: 12, width: 40, height: 40, opacity: 0.5 }}>
        <motion.path d="M0,10 L10,0 L30,0 L40,10" stroke="rgba(164,108,252,0.5)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.3 }} />
        <motion.path d="M0,30 L10,40 L30,40 L40,30" stroke="rgba(164,108,252,0.3)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }} />
      </svg>
      <svg style={{ position: 'absolute', top: 12, right: 12, width: 40, height: 40, opacity: 0.5 }}>
        <motion.path d="M40,10 L30,0 L10,0 L0,10" stroke="rgba(164,108,252,0.5)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.3 }} />
        <motion.path d="M40,30 L30,40 L10,40 L0,30" stroke="rgba(164,108,252,0.3)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }} />
      </svg>
      <svg style={{ position: 'absolute', bottom: 12, left: 12, width: 40, height: 40, opacity: 0.5 }}>
        <motion.path d="M0,30 L10,40 L30,40 L40,30" stroke="rgba(164,108,252,0.5)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.4 }} />
      </svg>
      <svg style={{ position: 'absolute', bottom: 12, right: 12, width: 40, height: 40, opacity: 0.5 }}>
        <motion.path d="M40,30 L30,40 L10,40 L0,30" stroke="rgba(164,108,252,0.5)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.4 }} />
      </svg>

      {playing && (
        <motion.div
          style={{ position: 'absolute', top: 14, right: 60, display: 'flex', alignItems: 'center', gap: 6 }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
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
      )}
    </div>
  );
}

export const HologramVideoBlock = memo(function HologramVideoBlock({ src, label, sublabel }: HologramVideoBlockProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const [playing, setPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // Canvas hologram draw loop — runs whenever video is playing
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scanY = 0;
    let scanY2 = 200;
    let t = 0;
    let chromaPhase = 0;
    let running = true;

    const drawFrame = () => {
      if (!running) return;
      if (video.readyState >= 2) {
        const vw = video.videoWidth || canvas.offsetWidth;
        const vh = video.videoHeight || canvas.offsetHeight;
        if (canvas.width !== vw || canvas.height !== vh) {
          canvas.width = vw;
          canvas.height = vh;
        }
        t++;
        chromaPhase += 0.015;

        ctx.clearRect(0, 0, vw, vh);

        // Base video frame
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.drawImage(video, 0, 0, vw, vh);
        ctx.restore();

        // Chromatic aberration
        const chromaShift = Math.sin(chromaPhase) * (playing ? 2 : 0.5);
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(video, chromaShift, 0, vw, vh);
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(video, -chromaShift * 0.7, 0, vw, vh);
        ctx.restore();

        // Purple radial glow (mouse-tracked)
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const grad = ctx.createRadialGradient(
          mouseRef.current.x * vw, mouseRef.current.y * vh, 0,
          mouseRef.current.x * vw, mouseRef.current.y * vh, vw * 0.5
        );
        grad.addColorStop(0, 'rgba(164,108,252,0.05)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, vw, vh);
        ctx.restore();

        // Scan lines
        ctx.save();
        ctx.globalCompositeOperation = 'overlay';
        const intensity = 0.025 + 0.015 * Math.sin(t * 0.05);
        for (let y = 0; y < vh; y += 2) {
          ctx.fillStyle = `rgba(164,108,252,${y % 4 === 0 ? intensity * 1.4 : intensity})`;
          ctx.fillRect(0, y, vw, 1);
        }
        ctx.restore();

        // Scan beam
        if (playing) {
          scanY = (scanY + 1.2) % vh;
          scanY2 = (scanY2 + 0.7) % vh;
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          const drawScan = (sy: number, w: number, a: number) => {
            const sg = ctx.createLinearGradient(0, sy - w, 0, sy + w);
            sg.addColorStop(0, 'rgba(164,108,252,0)');
            sg.addColorStop(0.5, `rgba(164,108,252,${a})`);
            sg.addColorStop(1, 'rgba(164,108,252,0)');
            ctx.fillStyle = sg;
            ctx.fillRect(0, sy - w, vw, w * 2);
          };
          drawScan(scanY, 25, 0.08);
          drawScan(scanY2, 15, 0.04);
          ctx.restore();

          // Glitch
          if (Math.random() > 0.95) {
            const gy = Math.random() * vh;
            const gh = 1 + Math.random() * 6;
            const shift = (Math.random() - 0.5) * 16;
            ctx.save();
            ctx.globalAlpha = 0.5;
            try {
              const slice = ctx.getImageData(0, Math.max(0, gy), vw, Math.min(gh, vh - gy));
              ctx.putImageData(slice, shift, gy);
            } catch (_) {}
            ctx.restore();
          }
        }

        // Vignette
        const vigGrad = ctx.createRadialGradient(vw / 2, vh / 2, vw * 0.3, vw / 2, vh / 2, vw * 0.75);
        vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
        vigGrad.addColorStop(1, 'rgba(14,11,31,0.45)');
        ctx.save();
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, vw, vh);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(drawFrame);
    };

    animRef.current = requestAnimationFrame(drawFrame);
    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [playing]);

  // Sync video play state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [playing]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(p => !p);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 2500);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setShowControls(false), 600);
  }, []);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(hideTimer.current);
    setShowControls(true);
  }, []);

  return (
    <motion.div
      className="w-full mt-16 md:mt-24 lg:mt-32"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3 }}
    >
      <motion.div
        style={{ position: 'relative' }}
        animate={playing ? {
          boxShadow: [
            '0 0 40px rgba(164,108,252,0.08), 0 0 80px rgba(130,80,220,0.04)',
            '0 0 60px rgba(164,108,252,0.14), 0 0 120px rgba(130,80,220,0.07)',
            '0 0 40px rgba(164,108,252,0.08), 0 0 80px rgba(130,80,220,0.04)',
          ],
        } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Animated border */}
        <motion.div
          style={{
            position: 'absolute', inset: -1, borderRadius: 4,
            border: '1px solid rgba(164,108,252,0.15)',
            pointerEvents: 'none', zIndex: 10,
          }}
          animate={{
            borderColor: playing
              ? ['rgba(164,108,252,0.2)', 'rgba(164,108,252,0.45)', 'rgba(164,108,252,0.2)']
              : 'rgba(164,108,252,0.15)',
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Video container */}
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            background: '#0a0818',
            borderRadius: 4,
            border: '1px solid rgba(164,108,252,0.15)',
            maxHeight: '520px',
            cursor: 'pointer',
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleToggle}
        >
          {/* Hidden video source */}
          <video
            ref={videoRef}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            onEnded={() => setPlaying(false)}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              opacity: 0,
              pointerEvents: 'none',
            }}
          />

          {/* Hologram canvas — always renders */}
          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              maxHeight: '520px',
              objectFit: 'cover',
            }}
          />

          {/* HUD corner brackets */}
          <HoloHUD playing={playing} />

          {/* Center play/pause button */}
          <AnimatePresence>
            {(showControls || !playing) && (
              <motion.div
                key="center-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: showControls && playing ? 'rgba(14,11,31,0.25)' : 'transparent',
                  zIndex: 5,
                  pointerEvents: 'none',
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: 72, height: 72,
                    borderRadius: '50%',
                    background: 'rgba(14,11,31,0.65)',
                    border: '1.5px solid rgba(164,108,252,0.5)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(164,108,252,0.15)',
                    pointerEvents: 'all',
                    cursor: 'pointer',
                  }}
                  onClick={handleToggle}
                >
                  {playing ? (
                    <Pause size={26} fill="rgba(164,108,252,0.9)" stroke="rgba(164,108,252,0.9)" strokeWidth={1} />
                  ) : (
                    <Play size={26} fill="rgba(164,108,252,0.9)" stroke="rgba(164,108,252,0.9)" strokeWidth={1} style={{ marginLeft: 4 }} />
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fullscreen button */}
          <AnimatePresence>
            {(showControls || !playing) && (
              <motion.button
                key="fullscreen-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleFullscreen}
                aria-label="Fullscreen"
                style={{
                  position: 'absolute', bottom: 14, right: 14,
                  zIndex: 6,
                  width: 36, height: 36,
                  borderRadius: 3,
                  background: 'rgba(14,11,31,0.65)',
                  border: '1px solid rgba(164,108,252,0.3)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'rgba(164,108,252,0.8)',
                }}
              >
                <Maximize2 size={14} strokeWidth={1.5} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Label (bottom-left) */}
          {(label || sublabel) && (
            <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 6, pointerEvents: 'none' }}>
              {label && (
                <span style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: '0.55rem', fontWeight: 700,
                  letterSpacing: '0.3em', textTransform: 'uppercase',
                  color: 'rgba(164,108,252,0.7)', display: 'block', marginBottom: 5,
                }}>
                  {label}
                </span>
              )}
              {sublabel && (
                <span style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: 'clamp(1rem,1.5vw,1.4rem)',
                  fontWeight: 800, letterSpacing: '-0.02em',
                  color: 'var(--color-text-dark)', display: 'block',
                }}>
                  {sublabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom glow */}
        <motion.div
          style={{
            position: 'absolute', bottom: -2, left: '5%', right: '5%',
            height: 50,
            background: 'radial-gradient(ellipse at center, rgba(164,108,252,0.1) 0%, transparent 70%)',
            filter: 'blur(12px)', pointerEvents: 'none',
          }}
          animate={{ opacity: [0.3, 0.7, 0.3], scaleX: [0.9, 1.05, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
});
