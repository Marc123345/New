import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PlanetNodeProps {
  icon: ReactNode;
  label: string;
  accentColor: string;
  angle: number;
  radius: number;
  onClick: () => void;
  orbitDuration: number;
  reverse?: boolean;
  paused?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
}

export function PlanetNode({
  icon,
  label,
  accentColor,
  angle,
  radius,
  onClick,
  orbitDuration,
  reverse = false,
  paused = false,
  onHoverChange,
}: PlanetNodeProps) {
  const [hovered, setHovered] = useState(false);

  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return (
    <div
      className="absolute"
      style={{
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        animation: paused ? 'none' : `orbitSpin ${orbitDuration}s linear infinite`,
        animationDirection: reverse ? 'reverse' : 'normal',
      }}
    >
      <div
        className="absolute"
        style={{
          transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
        }}
      >
        <div
          style={{
            animation: paused ? 'none' : `orbitSpin ${orbitDuration}s linear infinite`,
            animationDirection: reverse ? 'normal' : 'reverse',
          }}
        >
          <button
            onClick={onClick}
            onMouseEnter={() => { setHovered(true); onHoverChange?.(true); }}
            onMouseLeave={() => { setHovered(false); onHoverChange?.(false); }}
            className="relative flex items-center justify-center rounded-full transition-transform duration-300 cursor-pointer"
            style={{
              width: 52,
              height: 52,
              background: `radial-gradient(circle at 35% 35%, ${accentColor}40, ${accentColor}18)`,
              border: `1px solid ${accentColor}50`,
              boxShadow: hovered
                ? `0 0 24px ${accentColor}50, 0 0 48px ${accentColor}20`
                : `0 0 12px ${accentColor}25`,
              transform: hovered ? 'scale(1.18)' : 'scale(1)',
              color: '#fff',
            }}
            aria-label={label}
          >
            <span className="flex items-center justify-center" style={{ width: 24, height: 24 }}>
              {icon}
            </span>
          </button>

          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute left-1/2 whitespace-nowrap pointer-events-none"
                style={{
                  top: -36,
                  transform: 'translateX(-50%)',
                  background: 'rgba(10,8,20,0.9)',
                  border: `1px solid ${accentColor}40`,
                  borderRadius: 4,
                  padding: '6px 12px',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.85)',
                  fontFamily: 'var(--font-stack-heading)',
                  boxShadow: `0 4px 16px rgba(0,0,0,0.5), 0 0 8px ${accentColor}15`,
                }}
              >
                {label}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
