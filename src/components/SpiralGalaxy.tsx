import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export interface GalaxyItem {
  title: string;
  description: string;
  category: string;
  size?: 'small' | 'medium' | 'large';
}

interface SpiralGalaxyProps {
  items: GalaxyItem[];
  centerTitle?: string;
}

export function SpiralGalaxy({ items, centerTitle = 'Core Vision' }: SpiralGalaxyProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pulseActive, setPulseActive] = useState(false);

  const getSpiralPosition = (index: number, total: number) => {
    const turns = 2.5;
    const maxRadius = 350;
    const angle = (index / total) * turns * 2 * Math.PI;
    const radius = (index / total) * maxRadius;

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      angle: angle,
      radius: radius,
    };
  };

  const getSizeMultiplier = (size?: GalaxyItem['size']) => {
    switch (size) {
      case 'large': return 1.3;
      case 'medium': return 1.0;
      case 'small': return 0.7;
      default: return 1.0;
    }
  };

  const handleCenterClick = () => {
    setPulseActive(true);
    setActiveIndex(null);
    setTimeout(() => setPulseActive(false), 1000);
  };

  return (
    <div className="relative bg-gradient-to-b from-[var(--color-background-light)] to-[var(--color-surface-dark)]" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <defs>
          <radialGradient id="spiralGradient">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        {Array.from({ length: 50 }).map((_, i) => {
          const pos = getSpiralPosition(i, 50);
          return (
            <circle
              key={i}
              cx={`calc(50% + ${pos.x}px)`}
              cy={`calc(50% + ${pos.y}px)`}
              r="3"
              fill="var(--color-primary)"
              opacity={0.3}
            />
          );
        })}
      </svg>

      <div className="relative flex items-center justify-center" style={{ minHeight: '900px', paddingTop: '400px', paddingBottom: '400px' }}>
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          onClick={handleCenterClick}
        >
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-primary)]"
              style={{
                width: `${120 + ring * 40}px`,
                height: `${120 + ring * 40}px`,
              }}
              animate={
                pulseActive
                  ? { scale: [1, 2, 2.5], opacity: [0.5, 0.2, 0] }
                  : { scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }
              }
              transition={{
                duration: pulseActive ? 1 : 3,
                delay: ring * 0.2,
                repeat: pulseActive ? 0 : Infinity,
                ease: 'easeOut',
              }}
            />
          ))}

          <div
            className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] border-4 border-[var(--color-text-dark)] flex items-center justify-center"
            style={{ boxShadow: '0 0 40px rgba(0,0,0,0.4)' }}
          >
            {[0, 120, 240].map((rotation, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ top: '10%', left: '50%', marginLeft: '-8px' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
              >
                <div style={{ transform: `rotate(${rotation}deg) translateY(-50px)` }}>
                  <Star size={16} className="text-[var(--color-background-light)]" fill="var(--color-background-light)" />
                </div>
              </motion.div>
            ))}

            <div className="text-center px-4 relative z-10">
              <h3
                className="text-sm md:text-base text-[var(--color-background-light)]"
                style={{ fontFamily: 'var(--font-stack-heading)' }}
              >
                {centerTitle}
              </h3>
            </div>
          </div>
        </motion.div>

        {items.map((item, index) => {
          const pos = getSpiralPosition(index, items.length);
          const isActive = activeIndex === index;
          const sizeMultiplier = getSizeMultiplier(item.size);
          const baseSize = 100;
          const itemSize = baseSize * sizeMultiplier;

          return (
            <motion.div
              key={index}
              className="absolute left-1/2 top-1/2 z-10"
              style={{ x: pos.x, y: pos.y }}
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: index * 0.08, type: 'spring', stiffness: 100, damping: 15 }}
              whileHover={{ scale: 1.15, zIndex: 20 }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {isActive && (
                <svg
                  className="absolute pointer-events-none"
                  style={{
                    width: pos.radius * 2,
                    height: pos.radius * 2,
                    left: `calc(-50% - ${pos.radius}px)`,
                    top: `calc(-50% - ${pos.radius}px)`,
                    overflow: 'visible',
                  }}
                >
                  <motion.line
                    x1="50%"
                    y1="50%"
                    x2={`calc(50% + ${Math.cos(pos.angle) * pos.radius}px)`}
                    y2={`calc(50% + ${Math.sin(pos.angle) * pos.radius}px)`}
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeDasharray="8,4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
              )}

              <div
                className="relative cursor-pointer"
                style={{
                  width: `${itemSize}px`,
                  height: `${itemSize}px`,
                  marginLeft: `-${itemSize / 2}px`,
                  marginTop: `-${itemSize / 2}px`,
                }}
                onClick={() => setActiveIndex(isActive ? null : index)}
              >
                <motion.div
                  className="absolute w-2 h-2 rounded-full bg-[var(--color-secondary)]"
                  style={{ top: 0, left: '50%', marginLeft: '-4px' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3 + index * 0.5, repeat: Infinity, ease: 'linear' }}
                />

                <motion.div
                  className={`w-full h-full rounded-full border-4 flex flex-col items-center justify-center p-4 text-center transition-all ${
                    isActive
                      ? 'bg-[var(--color-primary)] border-[var(--color-text-dark)]'
                      : item.size === 'large'
                      ? 'bg-[var(--color-secondary)] border-[var(--color-text-dark)]'
                      : 'bg-[var(--color-background-light)] border-[var(--color-surface-dark)]'
                  }`}
                  style={{
                    boxShadow: isActive
                      ? '0 0 30px rgba(0,0,0,0.4)'
                      : item.size === 'large'
                      ? '10px 10px 0 var(--color-text-dark)'
                      : '6px 6px 0 var(--color-surface-dark)',
                  }}
                  animate={{ rotate: isActive ? [0, 360] : 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div
                    className={`absolute -top-2 -right-2 px-2 py-1 text-xs border-2 ${
                      isActive || item.size === 'large'
                        ? 'bg-[var(--color-text-dark)] text-[var(--color-background-light)] border-[var(--color-background-light)]'
                        : 'bg-[var(--color-primary)] text-[var(--color-background-light)] border-[var(--color-text-dark)]'
                    }`}
                    style={{ fontFamily: 'var(--font-stack-heading)' }}
                  >
                    {item.category}
                  </div>

                  <h5
                    className={`text-xs md:text-sm mb-1 ${
                      isActive || item.size === 'large'
                        ? 'text-[var(--color-background-light)]'
                        : 'text-[var(--color-text-dark)]'
                    }`}
                    style={{ fontFamily: 'var(--font-stack-heading)' }}
                  >
                    {item.title}
                  </h5>

                  {(isActive || item.size === 'large') && (
                    <motion.p
                      className={`text-xs leading-tight ${
                        isActive || item.size === 'large'
                          ? 'text-[var(--color-background-light)] opacity-90'
                          : 'text-[var(--color-text-dark)] opacity-70'
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {item.description.slice(0, item.size === 'large' ? 80 : 60)}...
                    </motion.p>
                  )}

                  {isActive && (
                    <>
                      {[0, 90, 180, 270].map((angle, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-[var(--color-background-light)] rounded-full"
                          style={{ top: '50%', left: '50%' }}
                          animate={{
                            x: Math.cos((angle * Math.PI) / 180) * 50,
                            y: Math.sin((angle * Math.PI) / 180) * 50,
                            opacity: [1, 0],
                            scale: [1, 0],
                          }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>

                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[var(--color-text-dark)] text-[var(--color-background-light)] border-2 border-[var(--color-background-light)] flex items-center justify-center"
                  style={{ fontFamily: 'var(--font-stack-heading)' }}
                >
                  <span className="text-xs">{String(index + 1).padStart(2, '0')}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {activeIndex !== null && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 max-w-2xl w-full mx-4 z-40"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
        >
          <div className="bg-[var(--color-text-dark)] text-[var(--color-background-light)] border-4 border-[var(--color-primary)] p-6 md:p-8 relative">
            <div className="absolute -top-4 -right-4 text-[var(--color-secondary)]">
              <Star size={32} fill="var(--color-secondary)" />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div
                  className="text-xs text-[var(--color-secondary)] mb-2"
                  style={{ fontFamily: 'var(--font-stack-heading)' }}
                >
                  {items[activeIndex].category}
                </div>
                <h4 className="text-[var(--color-background-light)] mb-3">
                  {items[activeIndex].title}
                </h4>
                <p className="text-sm opacity-90 leading-relaxed">
                  {items[activeIndex].description}
                </p>
              </div>
              <button
                onClick={() => setActiveIndex(null)}
                className="w-8 h-8 border-2 border-[var(--color-background-light)] text-[var(--color-background-light)] flex items-center justify-center hover:bg-[var(--color-primary)] transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
