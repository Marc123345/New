import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { SECONDARY_SERVICES } from '../constants/ecosystem';
import { useOverlay } from '../hooks/useOverlay';

interface ServiceOverlayProps {
  serviceIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ServiceOverlay({ serviceIndex, onClose, onNavigate }: ServiceOverlayProps) {
  useOverlay(serviceIndex !== null, onClose);

  return (
    <AnimatePresence>
      {serviceIndex !== null && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{
              backgroundColor: 'rgba(5,5,5,0.95)',
              backdropFilter: 'blur(28px)'
            }}
          />

          <motion.div
            key="container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
            onClick={onClose}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={serviceIndex}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full overflow-hidden"
                style={{
                  maxWidth: 700,
                  background: 'var(--color-background-light)',
                  border: '2px solid var(--color-surface-dark)',
                  boxShadow: 'var(--shadow-geometric)',
                }}
              >
                <div
                  style={{
                    height: 3,
                    background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))',
                  }}
                />

                <div style={{ padding: 0 }}>
                  <button
                    onClick={onClose}
                    aria-label="Close overlay"
                    className="absolute top-6 right-6 flex items-center justify-center transition-all hover:scale-110 z-20"
                    style={{
                      width: 44,
                      height: 44,
                      color: 'var(--color-background-light)',
                      backgroundColor: 'var(--color-primary)',
                      border: '2px solid var(--color-text-dark)',
                      boxShadow: 'var(--shadow-button)',
                    }}
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="relative w-full h-64 overflow-hidden"
                  >
                    <img
                      src={SECONDARY_SERVICES[serviceIndex].image}
                      alt={SECONDARY_SERVICES[serviceIndex].title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to bottom, transparent 50%, rgba(251,251,252,0.9) 100%)',
                      }}
                    />
                  </motion.div>

                  <div style={{ padding: 'clamp(28px, 5vw, 40px)' }}>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05, duration: 0.4 }}
                    >
                      <span
                        className="inline-block"
                        style={{
                          fontSize: 11,
                          letterSpacing: '0.3em',
                          color: 'var(--color-primary)',
                          opacity: 0.8,
                          textTransform: 'uppercase',
                          marginBottom: 12,
                          fontFamily: 'var(--font-stack-heading)',
                        }}
                      >
                        Service 0{serviceIndex + 1}
                      </span>
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                      style={{
                        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                        fontWeight: 700,
                        color: 'var(--color-text-dark)',
                        marginBottom: 16,
                        fontFamily: 'var(--font-stack-heading)',
                        textTransform: 'none',
                        letterSpacing: '-0.025em',
                        lineHeight: 1.15,
                      }}
                    >
                      {SECONDARY_SERVICES[serviceIndex].title}
                    </motion.h3>

                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      style={{
                        color: 'rgba(0,0,0,0.65)',
                        lineHeight: 1.7,
                        marginBottom: 28,
                        fontSize: '1.0625rem',
                        fontFamily: 'var(--font-stack-body)',
                      }}
                    >
                      {SECONDARY_SERVICES[serviceIndex].description}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.4 }}
                    >
                      <div
                        className="uppercase mb-3"
                        style={{
                          fontSize: 10,
                          letterSpacing: '0.3em',
                          color: 'rgba(0,0,0,0.35)',
                          fontFamily: 'var(--font-stack-heading)',
                        }}
                      >
                        Key Areas
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {SECONDARY_SERVICES[serviceIndex].tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-4 py-2"
                            style={{
                              fontSize: 12,
                              letterSpacing: '0.04em',
                              border: '1px solid var(--color-surface-dark)',
                              backgroundColor: 'rgba(124,4,252,0.05)',
                              color: 'var(--color-text-dark)',
                              fontFamily: 'var(--font-stack-body)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
