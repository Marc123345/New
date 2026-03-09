import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { motion } from 'motion/react';
import { Play, Pause } from 'lucide-react';

interface HologramVideoBlockProps {
  src: string;
  label?: string;
  sublabel?: string;
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

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; pulse: number; speed: number }[] = [];
    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * w(),
        y: Math.random() * h(),
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.6,
        size: 0.5 + Math.random() * 2,
        alpha: 0.1 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
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
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(164, 108, 252, ${a})`;
        ctx.fill();

        if (p.size > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(164, 108, 252, ${a * 0.1})`;
          ctx.fill();
        }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(164, 108, 252, ${0.06 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

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
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
    />
  );
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
        <>
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

          <motion.div
            style={{ position: 'absolute', top: 14, left: 60, color: 'rgba(164,108,252,0.4)', fontSize: '0.5rem', letterSpacing: '0.12em', fontFamily: 'monospace' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            HOLO-STREAM // 01
          </motion.div>
        </>
      )}
    </div>
  );
}

export const HologramVideoBlock = memo(function HologramVideoBlock({ src, label, sublabel }: HologramVideoBlockProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [bootPhase, setBootPhase] = useState(0);
  const [hovering, setHovering] = useState(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const t1 = setTimeout(() => setBootPhase(1), 300);
    const t2 = setTimeout(() => setBootPhase(2), 900);
    const t3 = setTimeout(() => setBootPhase(3), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    if (!playing || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scanY = 0;
    let scanY2 = 200;
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

      const chromaShift = Math.sin(chromaPhase) * 2;
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

      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      const intensity = 0.03 + 0.02 * Math.sin(t * 0.05);
      for (let y = 0; y < vh; y += 2) {
        const lineAlpha = y % 4 === 0 ? intensity * 1.5 : intensity;
        ctx.fillStyle = `rgba(164, 108, 252, ${lineAlpha})`;
        ctx.fillRect(0, y, vw, 1);
      }
      ctx.restore();

      scanY = (scanY + 1.2) % vh;
      scanY2 = (scanY2 + 0.7) % vh;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const drawScan = (sy: number, w: number, a: number) => {
        const sg = ctx.createLinearGradient(0, sy - w, 0, sy + w);
        sg.addColorStop(0, 'rgba(164, 108, 252, 0)');
        sg.addColorStop(0.3, `rgba(177, 129, 252, ${a * 0.4})`);
        sg.addColorStop(0.5, `rgba(164, 108, 252, ${a})`);
        sg.addColorStop(0.7, `rgba(177, 129, 252, ${a * 0.4})`);
        sg.addColorStop(1, 'rgba(164, 108, 252, 0)');
        ctx.fillStyle = sg;
        ctx.fillRect(0, sy - w, vw, w * 2);
      };
      drawScan(scanY, 25, 0.1);
      drawScan(scanY2, 15, 0.05);
      ctx.restore();

      if (Math.random() > 0.94) {
        const glitchCount = 1 + Math.floor(Math.random() * 3);
        for (let g = 0; g < glitchCount; g++) {
          const gy = Math.random() * vh;
          const gh = 1 + Math.random() * 8;
          const shift = (Math.random() - 0.5) * 20;
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
    return () => { cancelAnimationFrame(animRef.current); };
  }, [playing]);

  const handleToggle = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      cancelAnimationFrame(animRef.current);
      setPlaying(false);
    } else if (videoReady) {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
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
            '0 0 40px rgba(164, 108, 252, 0.08), 0 0 80px rgba(130, 80, 220, 0.04)',
            '0 0 60px rgba(164, 108, 252, 0.14), 0 0 120px rgba(130, 80, 220, 0.07)',
            '0 0 40px rgba(164, 108, 252, 0.08), 0 0 80px rgba(130, 80, 220, 0.04)',
          ],
        } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Pulsing border layer */}
        <motion.div
          style={{
            position: 'absolute',
            inset: -1,
            borderRadius: 4,
            border: '1px solid rgba(164,108,252,0.15)',
            pointerEvents: 'none',
            zIndex: 4,
          }}
          animate={{
            borderColor: playing
              ? ['rgba(164,108,252,0.2)', 'rgba(164,108,252,0.4)', 'rgba(164,108,252,0.2)']
              : 'rgba(164,108,252,0.15)',
            boxShadow: playing
              ? [
                  '0 0 20px rgba(164,108,252,0.06), inset 0 0 20px rgba(164,108,252,0.02)',
                  '0 0 40px rgba(164,108,252,0.12), inset 0 0 30px rgba(164,108,252,0.04)',
                  '0 0 20px rgba(164,108,252,0.06), inset 0 0 20px rgba(164,108,252,0.02)',
                ]
              : '0 0 20px rgba(164,108,252,0.06)',
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div
          style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            background: '#0e0b1f',
            borderRadius: 4,
            border: '1px solid rgba(164,108,252,0.15)',
            cursor: 'pointer',
            maxHeight: '500px',
          }}
          onClick={handleToggle}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Hidden video source */}
          <video
            ref={videoRef}
            src={src}
            playsInline
            onCanPlay={() => setVideoReady(true)}
            onEnded={() => setPlaying(false)}
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

          {/* Hologram canvas (shown when playing) */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: playing ? 'block' : 'none',
              zIndex: 2,
            }}
          />

          {/* Particles background (shown when not playing) */}
          {!playing && <FloatingParticles />}

          {/* HUD corner brackets */}
          <HoloHUD playing={playing} />

          {/* Boot / play button */}
          {!playing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 24,
                background: 'radial-gradient(ellipse at center, rgba(164,108,252,0.04) 0%, transparent 60%)',
                zIndex: 4,
                minHeight: '260px',
              }}
            >
              {bootPhase < 3 && bootPhase >= 1 && (
                <motion.div
                  style={{ color: 'rgba(164,108,252,0.5)', fontSize: '0.55rem', letterSpacing: '0.2em', fontFamily: 'monospace', textAlign: 'center' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0.6] }}
                  transition={{ duration: 0.8 }}
                >
                  {bootPhase === 1 ? 'INITIALIZING HOLOGRAPHIC MATRIX...' : 'CALIBRATING SIGNAL...'}
                </motion.div>
              )}

              {bootPhase >= 3 && (
                <>
                  <motion.div
                    style={{
                      width: 110,
                      height: 110,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    whileHover={videoReady ? { scale: 1.06 } : {}}
                    whileTap={videoReady ? { scale: 0.94 } : {}}
                  >
                    <motion.div
                      style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(164,108,252,0.25)' }}
                      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                      style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1px solid rgba(164,108,252,0.1)' }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                      style={{ position: 'absolute', inset: -18, borderRadius: '50%', border: '1px dashed rgba(164,108,252,0.06)' }}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                    />
                    <svg width="110" height="110" style={{ position: 'absolute', inset: 0 }}>
                      <motion.circle
                        cx="55" cy="55" r="52"
                        fill="none"
                        stroke="rgba(164,108,252,0.3)"
                        strokeWidth="1"
                        strokeDasharray="8 12"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                        style={{ transformOrigin: 'center' }}
                      />
                    </svg>
                    <motion.div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(164,108,252,0.1) 0%, transparent 70%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      animate={{ boxShadow: ['0 0 30px rgba(164,108,252,0.05)', '0 0 50px rgba(164,108,252,0.12)', '0 0 30px rgba(164,108,252,0.05)'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Play size={24} fill="rgba(164,108,252,0.5)" stroke="rgba(164,108,252,0.9)" strokeWidth={1.5} style={{ marginLeft: 3 }} />
                    </motion.div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ color: 'rgba(164,108,252,0.6)', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'monospace' }}
                  >
                    {videoReady ? '[ ENGAGE HOLOGRAM ]' : '[ ACQUIRING SIGNAL... ]'}
                  </motion.p>
                </>
              )}
            </motion.div>
          )}

          {/* Pause overlay on hover when playing */}
          {playing && hovering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(14,11,31,0.3)',
                zIndex: 5,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'rgba(164,108,252,0.1)',
                  border: '1px solid rgba(164,108,252,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Pause size={20} stroke="rgba(164,108,252,0.9)" strokeWidth={1.5} />
              </div>
            </motion.div>
          )}

          {/* Playing: waveform bar + status */}
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
                background: 'linear-gradient(to top, rgba(14,11,31,0.85), transparent)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                padding: '0 16px 12px',
                zIndex: 5,
              }}
            >
              <span style={{ color: 'rgba(164,108,252,0.5)', fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                Holographic Feed Active
              </span>
              <motion.div
                style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    style={{ width: 2, background: 'rgba(164,108,252,0.5)', borderRadius: 1 }}
                    animate={{ height: [4, 10 + i * 2, 4] }}
                    transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, delay: i * 0.08 }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Label overlay (always visible at bottom-left) */}
          {(label || sublabel) && !playing && bootPhase >= 3 && (
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: 24,
                zIndex: 6,
                pointerEvents: 'none',
              }}
            >
              {label && (
                <span style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(164,108,252,0.7)',
                  display: 'block',
                  marginBottom: 6,
                }}>
                  {label}
                </span>
              )}
              {sublabel && (
                <span style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: 'clamp(1rem, 1.5vw, 1.4rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-text-dark)',
                  display: 'block',
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
            position: 'absolute',
            bottom: -2,
            left: '5%',
            right: '5%',
            height: 50,
            background: 'radial-gradient(ellipse at center, rgba(164,108,252,0.1) 0%, transparent 70%)',
            filter: 'blur(12px)',
            pointerEvents: 'none',
          }}
          animate={{ opacity: [0.3, 0.7, 0.3], scaleX: [0.9, 1.05, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
});
