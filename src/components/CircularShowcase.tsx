import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';

interface CircularItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface CircularShowcaseProps {
  items: CircularItem[];
  centerTitle?: string;
  centerDescription?: string;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isMobile;
}

export function CircularShowcase({
  items,
  centerTitle = 'Our Process',
  centerDescription = 'Click to explore',
}: CircularShowcaseProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  const radius = 280;
  const mobileRadius = 160;
  const currentRadius = isMobile ? mobileRadius : radius;

  const handleCenterClick = useCallback(() => {
    setIsExpanded((prev) => !prev);
    setSelectedIndex(null);
  }, []);

  const handleItemClick = useCallback((index: number) => {
    setSelectedIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <div className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: isMobile ? '700px' : '900px', padding: 'var(--space-8x) 0' }}>
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        {[1, 2, 3, 4].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full"
            style={{
              width: `${ring * 150}px`,
              height: `${ring * 150}px`,
              border: '1px solid rgba(255, 255, 255, 0.8)',
            }}
            animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
            transition={{
              duration: 30 + ring * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <motion.div
        className="absolute z-20 cursor-pointer"
        style={{
          width: isExpanded ? '220px' : '180px',
          height: isExpanded ? '220px' : '180px',
        }}
        whileHover={{ scale: 1.05 }}
        onClick={handleCenterClick}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center text-center"
          style={{
            border: '6px solid var(--color-text-dark)',
            backgroundColor: 'var(--color-primary)',
            padding: 'var(--space-4x)',
            boxShadow: isExpanded
              ? '0 0 60px rgba(124, 4, 252, 0.4)'
              : '0 0 30px rgba(124, 4, 252, 0.2)',
            transition: 'box-shadow 0.5s, width 0.5s, height 0.5s',
          }}
        >
          <div>
            <h3
              className="text-[var(--color-background-light)]"
              style={{ marginBottom: 'var(--space-1x)', fontSize: isMobile ? '1.2rem' : '1.5rem' }}
            >
              {centerTitle}
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-background-light)', opacity: 0.9, margin: 0 }}>
              {centerDescription}
            </p>
          </div>
        </div>

        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: '3px solid var(--color-secondary)' }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {items.map((item, index) => {
        const angle = (360 / items.length) * index - 90;
        const isSelected = selectedIndex === index;
        const x = Math.cos((angle * Math.PI) / 180) * currentRadius;
        const y = Math.sin((angle * Math.PI) / 180) * currentRadius;
        const cardSize = isMobile ? 130 : 170;

        return (
          <motion.div
            key={index}
            className="absolute z-10"
            style={{ left: '50%', top: '50%' }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x, y, opacity: 1 }}
            transition={{
              delay: index * 0.1,
              duration: 0.8,
              type: 'spring',
              stiffness: 100,
            }}
          >
            <svg
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                width: 0,
                height: 0,
                overflow: 'visible',
                pointerEvents: 'none',
              }}
            >
              <line
                x1="0"
                y1="0"
                x2={-x}
                y2={-y}
                stroke={isSelected ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)'}
                strokeWidth="2"
                opacity={isSelected ? 1 : 0.5}
                style={{ transition: 'opacity 0.3s, stroke 0.3s' }}
              />
            </svg>

            <motion.div
              className="relative cursor-pointer"
              style={{
                width: `${cardSize}px`,
                marginLeft: `${-cardSize / 2}px`,
                marginTop: `${-cardSize / 2}px`,
              }}
              whileHover={{ scale: 1.1, zIndex: 30 }}
              onClick={() => handleItemClick(index)}
            >
              <div
                style={{
                  border: '4px solid var(--color-text-dark)',
                  padding: isMobile ? 'var(--space-2x)' : 'var(--space-4x)',
                  backgroundColor: isSelected ? 'var(--color-secondary)' : 'var(--color-background-light)',
                  boxShadow: isSelected
                    ? '12px 12px 0 var(--color-primary)'
                    : '6px 6px 0 var(--color-text-dark)',
                  transform: isSelected ? 'translate(-4px, -4px)' : 'translate(0, 0)',
                  transition: 'all 0.5s',
                  position: 'relative',
                }}
              >
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    top: '-14px',
                    right: '-14px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '4px solid',
                    borderColor: isSelected ? 'var(--color-text-dark)' : 'var(--color-background-light)',
                    backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-text-dark)',
                  }}
                >
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: 'var(--font-stack-heading)',
                      color: 'var(--color-background-light)',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {item.icon && (
                  <div className="flex justify-center" style={{ marginBottom: 'var(--space-1x)' }}>
                    <div
                      style={{
                        padding: 'var(--space-1x)',
                        border: '2px solid',
                        borderColor: isSelected ? 'var(--color-background-light)' : 'var(--color-primary)',
                      }}
                    >
                      <div style={{ color: isSelected ? 'var(--color-background-light)' : undefined }}>
                        {item.icon}
                      </div>
                    </div>
                  </div>
                )}

                <h4
                  className="text-center"
                  style={{
                    marginBottom: 'var(--space-1x)',
                    fontSize: isMobile ? '0.85rem' : '1rem',
                    color: isSelected ? 'var(--color-background-light)' : undefined,
                  }}
                >
                  {item.title}
                </h4>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: isSelected ? 'auto' : 0,
                    opacity: isSelected ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  <p
                    className="text-xs text-center leading-relaxed"
                    style={{
                      color: isSelected ? 'var(--color-background-light)' : undefined,
                      opacity: isSelected ? 0.9 : undefined,
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </motion.div>

                <motion.div
                  className="absolute"
                  style={{
                    bottom: 0,
                    right: 0,
                    width: '24px',
                    height: '24px',
                    borderTop: '3px solid',
                    borderLeft: '3px solid',
                    borderColor: isSelected ? 'var(--color-background-light)' : 'var(--color-primary)',
                  }}
                  animate={{ rotate: isSelected ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {isSelected && (
                <motion.div
                  className="absolute inset-0"
                  style={{ border: '2px solid var(--color-primary)', borderRadius: '4px' }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        );
      })}

      {selectedIndex !== null && (
        <motion.div
          className="absolute w-full"
          style={{
            bottom: 'var(--space-4x)',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '28rem',
            padding: '0 var(--space-2x)',
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-text-dark)',
              color: 'var(--color-background-light)',
              border: '4px solid var(--color-primary)',
              padding: 'var(--space-4x)',
            }}
          >
            <div className="flex items-start justify-between" style={{ marginBottom: 'var(--space-2x)' }}>
              <h4 style={{ color: 'var(--color-background-light)', margin: 0 }}>
                {items[selectedIndex].title}
              </h4>
              <button
                onClick={() => setSelectedIndex(null)}
                style={{
                  color: 'var(--color-background-light)',
                  opacity: 0.7,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0 0 0 var(--space-2x)',
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = '1'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = '0.7'; }}
              >
                x
              </button>
            </div>
            <p className="text-sm" style={{ opacity: 0.9, margin: 0 }}>
              {items[selectedIndex].description}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
