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
            className="fixed inset-0 z-[150]"
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
            className="fixed inset-0 z-[151] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
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
                className="relative w-full overflow-y-auto flex flex-col"
                style={{
                  maxWidth: 700,
                  maxHeight: '92dvh',
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
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-center transition-all hover:scale-110 z-20"
                    style={{
                      width: 44,
                      height: 44,
                      color: '#fff',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(8px)',
                      border: '2px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    }}
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    // TWEAK: Increased height on larger screens (h-48 sm:h-72)
                    className="relative w-full h-48 sm:h-72 overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={SECONDARY_SERVICES[serviceIndex].image}
                      alt={SECONDARY_SERVICES[serviceIndex].title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to bottom, transparent 40%, rgba(251,251,252,0.9) 90%, rgba(251,251,252,1) 100%)',
                      }}
                    />
                  </motion.div>

                  {/* TWEAK: Increased clamp values for significantly more side/bottom padding */}
                  <div 
                    className="flex flex-col gap-6" 
                    style={{ padding: 'clamp(28px, 6vw, 56px)' }}
                  >
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
                        fontSize: 'clamp(1.85rem, 4.5vw, 2.75rem)', // Slightly larger
                        fontWeight: 700,
                        color: 'var(--color-text-dark)',
                        fontFamily: 'var(--font-stack-heading)',
                        textTransform: 'none',
                        letterSpacing: '-0.025em',
                        lineHeight: 1.15,
                        margin: 0, // Handled by gap-6
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
                        lineHeight: 1.75, // Better readability
                        fontSize: '1.1rem', // Bumped font size
                        fontFamily: 'var(--font-stack-body)',
                        margin: 0, // Handled by gap-6
                      }}
                    >
                      {SECONDARY_SERVICES[serviceIndex].description}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.4 }}
                      // TWEAK: Pushed the tags section down slightly to separate from description
                      className="pt-2" 
                    >
                      <div
                        className="uppercase mb-4"
                        style={{
                          fontSize: 10,
                          letterSpacing: '0.3em',
                          color: 'rgba(0,0,0,0.35)',
                          fontFamily: 'var(--font-stack-heading)',
                        }}
                      >
                        Key Areas
                      </div>
                      {/* TWEAK: Increased gap between tags to gap-3 */}
                      <div className="flex flex-wrap gap-3">
                        {SECONDARY_SERVICES[serviceIndex].tags.map((tag: string) => (
                          <span
                            key={tag}
                            // TWEAK: Increased padding inside the tags
                            className="px-5 py-2.5"
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