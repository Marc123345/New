import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useOverlay } from '../hooks/useOverlay';

interface ServiceCardOverlayProps {
  service: {
    id: number;
    title: string;
    category: string;
    description: string;
    details: string[];
    color: string;
    bgColor: string;
  } | null;
  onClose: () => void;
}

export function ServiceCardOverlay({ service, onClose }: ServiceCardOverlayProps) {
  useOverlay(service !== null, onClose);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!service) return;
    const timer = setTimeout(() => modalRef.current?.focus(), 80);
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => { clearTimeout(timer); window.removeEventListener('keydown', handleKey); };
  }, [service, onClose]);

  return (
    <AnimatePresence>
      {service && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(4,4,8,0.80)', backdropFilter: 'blur(18px)' }}
          />

          <motion.div
            key="container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-card-title"
          >
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              initial={{ opacity: 0, y: 48, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full focus:outline-none"
              style={{
                maxWidth: 560,
                background: '#0d0d14',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px -16px rgba(0,0,0,0.85), 0 0 60px -20px ${service.bgColor}55`,
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="h-[3px] w-full origin-left"
                style={{ background: `linear-gradient(to right, ${service.bgColor}, ${service.color}, transparent)` }}
              />

              <div
                className="relative px-6 pt-6 pb-5 sm:px-8 sm:pt-7"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <motion.button
                  onClick={onClose}
                  aria-label="Close overlay"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 320, damping: 22 }}
                  className="absolute top-5 right-5 z-20 flex h-9 w-9 items-center justify-center transition-all duration-200 hover:rotate-90"
                  style={{
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >
                  <X size={16} strokeWidth={2} />
                </motion.button>

                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="block text-[10px] uppercase tracking-[0.35em] mb-3"
                  style={{ color: service.color, fontFamily: 'var(--font-stack-heading)' }}
                >
                  <span
                    className="inline-block w-4 h-[1px] mr-2 align-middle"
                    style={{ background: service.color }}
                  />
                  {service.category} &mdash; Service {String(service.id).padStart(2, '0')}
                </motion.span>

                <motion.h3
                  id="service-card-title"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="font-bold leading-tight tracking-tight"
                  style={{
                    fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                    color: '#fff',
                    fontFamily: 'var(--font-stack-heading)',
                  }}
                >
                  {service.title}
                </motion.h3>
              </div>

              <div className="px-6 py-6 sm:px-8 sm:py-7 space-y-6">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.45 }}
                  className="leading-[1.8] text-[0.9375rem]"
                  style={{ color: 'rgba(255,255,255,0.58)', fontFamily: 'var(--font-stack-body)' }}
                >
                  {service.description}
                </motion.p>

                {service.details.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.45 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="text-[10px] uppercase tracking-[0.35em]"
                        style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-stack-heading)' }}
                      >
                        What We Deliver
                      </span>
                      <span className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    </div>
                    <ul className="space-y-2">
                      {service.details.map((detail, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.34 + i * 0.05, duration: 0.35 }}
                          className="flex items-start gap-3 py-2.5 px-3 text-[0.875rem] leading-snug"
                          style={{
                            background: 'rgba(255,255,255,0.025)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            color: 'rgba(255,255,255,0.62)',
                            fontFamily: 'var(--font-stack-body)',
                          }}
                        >
                          <span className="mt-[2px] flex-shrink-0" style={{ color: service.color }}>→</span>
                          {detail}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
