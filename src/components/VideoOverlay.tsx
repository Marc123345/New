import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const VIDEO_URL = 'https://ik.imagekit.io/qcvroy8xpd/Video_Generation_Successful.mp4?updatedAt=1771263861214';

interface VideoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoOverlay({ isOpen, onClose }: VideoOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0"
            style={{ zIndex: 150, background: 'rgba(4,0,10,0.94)', backdropFilter: 'blur(24px)' }}
          />

          <motion.div
            key="player"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed inset-0 flex items-center justify-center p-4 md:p-10"
            style={{ zIndex: 151, pointerEvents: 'none' }}
          >
            <div
              className="relative w-full"
              style={{
                maxWidth: 960,
                pointerEvents: 'all',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={onClose}
                aria-label="Close"
                className="absolute flex items-center justify-center"
                style={{
                  top: -48,
                  right: 0,
                  width: 40,
                  height: 40,
                  background: 'rgba(164, 108, 252, 0.06)',
                  border: '1px solid rgba(164, 108, 252, 0.25)',
                  borderRadius: 2,
                  color: 'rgba(164, 108, 252, 0.8)',
                  cursor: 'pointer',
                  zIndex: 10,
                }}
                whileHover={{
                  background: 'rgba(164, 108, 252, 0.12)',
                  borderColor: 'rgba(164, 108, 252, 0.5)',
                  color: '#a46cfc',
                  boxShadow: '0 0 20px rgba(164, 108, 252, 0.15)',
                }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={18} strokeWidth={2} />
              </motion.button>

              <motion.div
                style={{ position: 'relative' }}
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(164, 108, 252, 0.06), 0 0 60px rgba(140, 90, 220, 0.03)',
                    '0 0 50px rgba(164, 108, 252, 0.1), 0 0 100px rgba(140, 90, 220, 0.05)',
                    '0 0 30px rgba(164, 108, 252, 0.06), 0 0 60px rgba(140, 90, 220, 0.03)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: '16/9',
                    background: '#080410',
                    borderRadius: 4,
                    border: '1px solid rgba(164, 108, 252, 0.2)',
                  }}
                >
                  <video
                    ref={videoRef}
                    src={VIDEO_URL}
                    autoPlay
                    controls
                    playsInline
                    className="absolute inset-0 w-full h-full"
                    style={{ display: 'block', objectFit: 'cover' }}
                  />
                </div>

                <motion.div
                  style={{
                    position: 'absolute',
                    bottom: -2,
                    left: '8%',
                    right: '8%',
                    height: 40,
                    background: 'radial-gradient(ellipse at center, rgba(164, 108, 252, 0.08) 0%, transparent 70%)',
                    filter: 'blur(10px)',
                    pointerEvents: 'none',
                  }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
