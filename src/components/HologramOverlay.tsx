import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play } from 'lucide-react';

const FOUNDER_VIDEO_URL =
  'https://ik.imagekit.io/qcvroy8xpd/Video_Generation_Successful.mp4?updatedAt=1771263861214';

interface HologramOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HologramOverlay({ isOpen, onClose }: HologramOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
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
    }
  }, [isOpen]);

  useEffect(() => {
    if (!playing || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scanY = 0;

    const drawFrame = () => {
      if (!video || video.paused || video.ended) return;

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 200, 220, 0.08)');
      gradient.addColorStop(0.5, 'rgba(0, 255, 240, 0.04)');
      gradient.addColorStop(1, 'rgba(0, 180, 220, 0.08)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      for (let y = 0; y < canvas.height; y += 3) {
        ctx.fillStyle = y % 6 === 0
          ? 'rgba(0, 255, 255, 0.04)'
          : 'rgba(0, 0, 0, 0.06)';
        ctx.fillRect(0, y, canvas.width, 1);
      }
      ctx.restore();

      scanY = (scanY + 1.5) % canvas.height;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGrad.addColorStop(0, 'rgba(0, 255, 255, 0)');
      scanGrad.addColorStop(0.5, 'rgba(0, 255, 240, 0.12)');
      scanGrad.addColorStop(1, 'rgba(0, 255, 255, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 30, canvas.width, 60);
      ctx.restore();

      if (Math.random() > 0.97) {
        const glitchY = Math.random() * canvas.height;
        const glitchH = 2 + Math.random() * 6;
        const shift = (Math.random() - 0.5) * 12;
        ctx.save();
        ctx.globalAlpha = 0.6;
        const slice = ctx.getImageData(0, glitchY, canvas.width, glitchH);
        ctx.putImageData(slice, shift, glitchY);
        ctx.restore();
      }

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
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0"
            style={{ zIndex: 150, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(24px)' }}
          />

          <motion.div
            key="holo-content"
            initial={{ opacity: 0, scale: 0.85, rotateX: 12 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateX: -8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed inset-0 flex items-center justify-center p-4 md:p-10"
            style={{ zIndex: 151, pointerEvents: 'none', perspective: 1200 }}
          >
            <div
              className="relative"
              style={{
                maxWidth: 720,
                width: '100%',
                pointerEvents: 'all',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                style={{
                  top: -52,
                  right: 0,
                  width: 40,
                  height: 40,
                  background: 'rgba(0, 255, 240, 0.06)',
                  border: '1px solid rgba(0, 255, 240, 0.25)',
                  borderRadius: 2,
                  color: 'rgba(0, 255, 240, 0.8)',
                  cursor: 'pointer',
                  zIndex: 10,
                }}
              >
                <X size={18} strokeWidth={2} />
              </button>

              <div className="holo-frame" style={{ position: 'relative' }}>
                <div
                  className="holo-glow"
                  style={{
                    position: 'absolute',
                    inset: -2,
                    borderRadius: 4,
                    border: '1px solid rgba(0, 255, 240, 0.2)',
                    boxShadow:
                      '0 0 30px rgba(0, 255, 240, 0.1), inset 0 0 30px rgba(0, 255, 240, 0.03), 0 0 80px rgba(0, 200, 220, 0.06)',
                    pointerEvents: 'none',
                  }}
                />

                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16/9',
                    overflow: 'hidden',
                    background: '#020a0a',
                    borderRadius: 4,
                  }}
                >
                  <video
                    ref={videoRef}
                    src={FOUNDER_VIDEO_URL}
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

                  {!playing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-5"
                      style={{ background: 'radial-gradient(ellipse at center, rgba(0, 255, 240, 0.04) 0%, transparent 70%)' }}
                    >
                      <motion.div
                        className="holo-idle-ring"
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: '50%',
                          border: '1.5px solid rgba(0, 255, 240, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          cursor: 'pointer',
                        }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={videoReady ? handlePlay : undefined}
                      >
                        <motion.div
                          style={{
                            position: 'absolute',
                            inset: -6,
                            borderRadius: '50%',
                            border: '1px solid rgba(0, 255, 240, 0.08)',
                          }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                          style={{
                            position: 'absolute',
                            inset: -14,
                            borderRadius: '50%',
                            border: '1px dashed rgba(0, 255, 240, 0.06)',
                          }}
                          animate={{ rotate: -360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        />
                        <Play
                          size={32}
                          fill="rgba(0, 255, 240, 0.6)"
                          stroke="rgba(0, 255, 240, 0.8)"
                          strokeWidth={1.5}
                          style={{ marginLeft: 4 }}
                        />
                      </motion.div>

                      <p
                        style={{
                          color: 'rgba(0, 255, 240, 0.6)',
                          fontSize: '0.7rem',
                          letterSpacing: '0.25em',
                          textTransform: 'uppercase',
                          fontFamily: 'var(--font-stack-heading)',
                        }}
                      >
                        {videoReady ? 'Initialize Hologram' : 'Loading Signal...'}
                      </p>
                    </motion.div>
                  )}

                  {playing && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 60,
                        background: 'linear-gradient(to top, rgba(0, 10, 10, 0.7), transparent)',
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: '0 16px 12px',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(0, 255, 240, 0.5)',
                          fontSize: '0.6rem',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          fontFamily: 'var(--font-stack-heading)',
                        }}
                      >
                        Live Holographic Feed
                      </span>
                    </div>
                  )}
                </div>

                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    left: '10%',
                    right: '10%',
                    height: 40,
                    background:
                      'radial-gradient(ellipse at center, rgba(0, 255, 240, 0.08) 0%, transparent 70%)',
                    filter: 'blur(8px)',
                    pointerEvents: 'none',
                  }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                style={{
                  textAlign: 'center',
                  marginTop: 20,
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  fontFamily: 'var(--font-stack-heading)',
                }}
              >
                Meet the Founder
              </motion.p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
