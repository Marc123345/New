import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';

interface HologramVideoBlockProps {
  src: string;
  label?: string;
  sublabel?: string;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function HoloHUD({ playing }: { playing: boolean }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3 }}>
      {/* Top-left bracket */}
      <svg style={{ position: 'absolute', top: 12, left: 12, width: 36, height: 36, opacity: 0.45 }}>
        <motion.path d="M0,8 L8,0 L28,0" stroke="rgba(164,108,252,0.6)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2 }} />
        <motion.path d="M0,8 L0,28" stroke="rgba(164,108,252,0.4)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.4 }} />
      </svg>
      {/* Top-right bracket */}
      <svg style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, opacity: 0.45 }}>
        <motion.path d="M36,8 L28,0 L8,0" stroke="rgba(164,108,252,0.6)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.2 }} />
        <motion.path d="M36,8 L36,28" stroke="rgba(164,108,252,0.4)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.4 }} />
      </svg>
      {/* Bottom-left bracket */}
      <svg style={{ position: 'absolute', bottom: 56, left: 12, width: 36, height: 36, opacity: 0.45 }}>
        <motion.path d="M0,28 L0,8" stroke="rgba(164,108,252,0.4)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.3 }} />
        <motion.path d="M0,28 L8,36 L28,36" stroke="rgba(164,108,252,0.6)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
      </svg>
      {/* Bottom-right bracket */}
      <svg style={{ position: 'absolute', bottom: 56, right: 12, width: 36, height: 36, opacity: 0.45 }}>
        <motion.path d="M36,28 L36,8" stroke="rgba(164,108,252,0.4)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.3 }} />
        <motion.path d="M36,28 L28,36 L8,36" stroke="rgba(164,108,252,0.6)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
      </svg>

      {/* Live indicator */}
      {playing && (
        <motion.div
          style={{ position: 'absolute', top: 16, right: 56, display: 'flex', alignItems: 'center', gap: 5 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        >
          <motion.div
            style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(164,108,252,0.9)' }}
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span style={{ color: 'rgba(164,108,252,0.55)', fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
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
  const progressRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);

  // Canvas draw loop — always renders the current video frame with hologram effects
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scanY = 0;
    let scanY2 = 150;
    let t = 0;
    let chromaPhase = 0;
    let running = true;

    const draw = () => {
      if (!running) return;
      if (video.readyState >= 2) {
        const vw = video.videoWidth || 640;
        const vh = video.videoHeight || 360;
        if (canvas.width !== vw || canvas.height !== vh) {
          canvas.width = vw;
          canvas.height = vh;
        }
        t++;
        chromaPhase += 0.012;

        ctx.clearRect(0, 0, vw, vh);

        // Base frame
        ctx.save();
        ctx.globalAlpha = 0.88;
        ctx.drawImage(video, 0, 0, vw, vh);
        ctx.restore();

        // Chromatic aberration
        const shift = Math.sin(chromaPhase) * (playing ? 2.5 : 0.8);
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(video, shift, 0, vw, vh);
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = 0.12;
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(video, -shift * 0.6, 0, vw, vh);
        ctx.restore();

        // Mouse-tracked purple glow
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const grd = ctx.createRadialGradient(
          mouseRef.current.x * vw, mouseRef.current.y * vh, 0,
          mouseRef.current.x * vw, mouseRef.current.y * vh, vw * 0.55
        );
        grd.addColorStop(0, 'rgba(164,108,252,0.045)');
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, vw, vh);
        ctx.restore();

        // Scan lines
        ctx.save();
        ctx.globalCompositeOperation = 'overlay';
        const li = 0.022 + 0.012 * Math.sin(t * 0.04);
        for (let y = 0; y < vh; y += 2) {
          ctx.fillStyle = `rgba(164,108,252,${y % 4 === 0 ? li * 1.3 : li})`;
          ctx.fillRect(0, y, vw, 1);
        }
        ctx.restore();

        // Scan beams (only when playing)
        if (playing) {
          scanY = (scanY + 1.1) % vh;
          scanY2 = (scanY2 + 0.65) % vh;
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ([{ sy: scanY, w: 22, a: 0.07 }, { sy: scanY2, w: 14, a: 0.04 }]).forEach(({ sy, w, a }) => {
            const sg = ctx.createLinearGradient(0, sy - w, 0, sy + w);
            sg.addColorStop(0, 'rgba(164,108,252,0)');
            sg.addColorStop(0.5, `rgba(164,108,252,${a})`);
            sg.addColorStop(1, 'rgba(164,108,252,0)');
            ctx.fillStyle = sg;
            ctx.fillRect(0, sy - w, vw, w * 2);
          });
          ctx.restore();

          // Occasional glitch
          if (Math.random() > 0.96) {
            const gy = Math.random() * vh;
            const gh = 1 + Math.random() * 5;
            ctx.save();
            ctx.globalAlpha = 0.45;
            try {
              const slice = ctx.getImageData(0, Math.max(0, gy), vw, Math.min(gh, vh - gy));
              ctx.putImageData(slice, (Math.random() - 0.5) * 14, gy);
            } catch (_) {}
            ctx.restore();
          }
        }

        // Vignette
        const vig = ctx.createRadialGradient(vw / 2, vh / 2, vw * 0.28, vw / 2, vh / 2, vw * 0.78);
        vig.addColorStop(0, 'rgba(0,0,0,0)');
        vig.addColorStop(1, 'rgba(14,11,31,0.48)');
        ctx.save();
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, vw, vh);
        ctx.restore();
      }
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [playing]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => { setDuration(video.duration); setVideoReady(true); };
    const onTime = () => { if (!scrubbing) setCurrentTime(video.currentTime); };
    const onEnded = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('timeupdate', onTime);
    video.addEventListener('ended', onEnded);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, [scrubbing]);

  // Sync muted
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  // Fullscreen change listener
  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !videoReady) return;
    if (video.paused) video.play();
    else video.pause();
  }, [videoReady]);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setMuted(m => !m);
  }, []);

  const toggleFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen();
  }, []);

  const handleVideoClick = useCallback(() => {
    togglePlay();
  }, [togglePlay]);

  const handlePlayPause = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    togglePlay();
  }, [togglePlay]);

  // Controls auto-hide
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    if (playing) {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [playing]);

  useEffect(() => {
    if (!playing) {
      clearTimeout(hideTimer.current);
      setShowControls(true);
    } else {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(hideTimer.current);
  }, [playing]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
    showControlsTemporarily();
  }, [showControlsTemporarily]);

  // Progress bar scrubbing
  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    const video = videoRef.current;
    if (!bar || !video || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  }, [duration]);

  const handleProgressMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setScrubbing(true);
    seek(e);
    const onMove = (ev: MouseEvent) => {
      const bar = progressRef.current;
      const video = videoRef.current;
      if (!bar || !video || !duration) return;
      const rect = bar.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      video.currentTime = pct * duration;
      setCurrentTime(pct * duration);
    };
    const onUp = () => {
      setScrubbing(false);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [seek, duration]);

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <motion.div
      className="w-full mt-16 md:mt-24 lg:mt-32"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.3 }}
    >
      {/* Outer glow wrapper */}
      <motion.div
        style={{ position: 'relative' }}
        animate={playing ? {
          boxShadow: [
            '0 0 40px rgba(164,108,252,0.07), 0 0 80px rgba(130,80,220,0.03)',
            '0 0 60px rgba(164,108,252,0.13), 0 0 120px rgba(130,80,220,0.06)',
            '0 0 40px rgba(164,108,252,0.07), 0 0 80px rgba(130,80,220,0.03)',
          ],
        } : { boxShadow: '0 0 20px rgba(164,108,252,0.05)' }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Pulsing border */}
        <motion.div
          style={{
            position: 'absolute', inset: -1, borderRadius: 4,
            border: '1px solid rgba(164,108,252,0.15)',
            pointerEvents: 'none', zIndex: 10,
          }}
          animate={{
            borderColor: playing
              ? ['rgba(164,108,252,0.2)', 'rgba(164,108,252,0.45)', 'rgba(164,108,252,0.2)']
              : 'rgba(164,108,252,0.2)',
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Player container */}
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            background: '#06030f',
            borderRadius: 4,
            maxHeight: '520px',
            cursor: showControls ? 'default' : 'none',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { if (playing) setShowControls(false); }}
          onClick={handleVideoClick}
        >
          {/* Hidden video element */}
          <video
            ref={videoRef}
            src={src}
            muted={muted}
            playsInline
            preload="metadata"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0, pointerEvents: 'none' }}
          />

          {/* Hologram canvas */}
          <canvas
            ref={canvasRef}
            style={{ display: 'block', width: '100%', maxHeight: '520px', objectFit: 'cover' }}
          />

          {/* HUD brackets */}
          <HoloHUD playing={playing} />

          {/* Label — bottom-left, above controls */}
          {(label || sublabel) && (
            <div style={{ position: 'absolute', bottom: 60, left: 16, zIndex: 4, pointerEvents: 'none' }}>
              {label && (
                <span style={{ fontFamily: 'var(--font-stack-heading)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(164,108,252,0.7)', display: 'block', marginBottom: 4 }}>
                  {label}
                </span>
              )}
              {sublabel && (
                <span style={{ fontFamily: 'var(--font-stack-heading)', fontSize: 'clamp(0.9rem,1.4vw,1.3rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-text-dark)', display: 'block' }}>
                  {sublabel}
                </span>
              )}
            </div>
          )}

          {/* Big centered play button — only when paused */}
          <AnimatePresence>
            {!playing && videoReady && (
              <motion.div
                key="big-play"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 5, pointerEvents: 'none',
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleVideoClick}
                  style={{
                    width: 72, height: 72,
                    borderRadius: '50%',
                    background: 'rgba(14,11,31,0.72)',
                    border: '1.5px solid rgba(164,108,252,0.55)',
                    backdropFilter: 'blur(14px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 40px rgba(164,108,252,0.18)',
                    cursor: 'pointer',
                    pointerEvents: 'all',
                  }}
                >
                  <Play size={28} fill="rgba(164,108,252,0.9)" stroke="none" style={{ marginLeft: 4 }} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading state */}
          {!videoReady && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
              <motion.div
                style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid rgba(164,108,252,0.15)', borderTopColor: 'rgba(164,108,252,0.6)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}

          {/* Control bar */}
          <AnimatePresence>
            {showControls && videoReady && (
              <motion.div
                key="controls"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  zIndex: 6,
                  background: 'linear-gradient(to top, rgba(6,3,15,0.92) 0%, rgba(6,3,15,0.6) 60%, transparent 100%)',
                  padding: '28px 14px 12px',
                }}
                onClick={e => e.stopPropagation()}
              >
                {/* Progress bar */}
                <div
                  ref={progressRef}
                  onMouseDown={handleProgressMouseDown}
                  style={{
                    height: 3, marginBottom: 10,
                    background: 'rgba(255,255,255,0.12)',
                    borderRadius: 2, cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  {/* Buffered / played */}
                  <div style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: `${progress * 100}%`,
                    background: 'rgba(164,108,252,0.85)',
                    borderRadius: 2, transition: scrubbing ? 'none' : 'width 0.1s linear',
                  }} />
                  {/* Scrub handle */}
                  <motion.div
                    style={{
                      position: 'absolute', top: '50%', left: `${progress * 100}%`,
                      width: 11, height: 11, borderRadius: '50%',
                      background: 'rgba(164,108,252,1)',
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 0 8px rgba(164,108,252,0.5)',
                    }}
                    whileHover={{ scale: 1.4 }}
                  />
                </div>

                {/* Buttons row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Play/Pause */}
                  <button
                    onClick={handlePlayPause}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(255,255,255,0.9)', display: 'flex',
                      alignItems: 'center', padding: 4,
                    }}
                  >
                    {playing
                      ? <Pause size={18} fill="rgba(255,255,255,0.9)" stroke="none" />
                      : <Play size={18} fill="rgba(255,255,255,0.9)" stroke="none" style={{ marginLeft: 2 }} />
                    }
                  </button>

                  {/* Mute */}
                  <button
                    onClick={toggleMute}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(255,255,255,0.7)', display: 'flex',
                      alignItems: 'center', padding: 4,
                    }}
                  >
                    {muted
                      ? <VolumeX size={16} strokeWidth={1.5} />
                      : <Volume2 size={16} strokeWidth={1.5} />
                    }
                  </button>

                  {/* Time */}
                  <span style={{
                    color: 'rgba(255,255,255,0.55)', fontSize: '0.65rem',
                    fontFamily: 'monospace', letterSpacing: '0.05em', flexGrow: 1,
                  }}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(255,255,255,0.7)', display: 'flex',
                      alignItems: 'center', padding: 4,
                    }}
                  >
                    {isFullscreen
                      ? <Minimize2 size={15} strokeWidth={1.5} />
                      : <Maximize2 size={15} strokeWidth={1.5} />
                    }
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom glow */}
        <motion.div
          style={{
            position: 'absolute', bottom: -2, left: '5%', right: '5%', height: 50,
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
