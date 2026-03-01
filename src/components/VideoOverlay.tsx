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
            style={{ zIndex: 200, background: 'rgba(3,3,6,0.96)', backdropFilter: 'blur(24px)' }}
          />

          <motion.button
            key="close"
            onClick={onClose}
            aria-label="Close"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 320, damping: 22 }}
            className="fixed top-4 right-4 md:top-8 md:right-8 flex items-center justify-center transition-all duration-200 hover:rotate-90"
            style={{
              zIndex: 202,
              width: 44,
              height: 44,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 2,
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
          >
            <X size={18} strokeWidth={2} />
          </motion.button>

          <motion.div
            key="player"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center p-4 md:p-16"
            style={{ zIndex: 201, pointerEvents: 'none' }}
          >
            <div
              className="relative w-full"
              style={{ maxWidth: 960, pointerEvents: 'all' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: '16/9', background: '#000' }}
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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
