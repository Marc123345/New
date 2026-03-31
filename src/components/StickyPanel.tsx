import { useRef, type ReactNode, type CSSProperties } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface StickyPanelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  shadow?: boolean;
  sticky?: boolean;
  zIndex?: number;
  /** The outgoing section scales down and fades as the next section wipes over it */
  scaleOnExit?: boolean;
  /** Rounded corners that appear as section scales down */
  roundOnExit?: boolean;
}

export function StickyPanel({
  children,
  className = '',
  style,
  shadow = true,
  sticky = true,
  zIndex = 1,
  scaleOnExit = true,
  roundOnExit = true,
}: StickyPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    // "start start" = when top of element hits top of viewport
    // "end start" = when bottom of element hits top of viewport
    offset: ['start start', 'end start'],
  });

  // As user scrolls past this section, scale it down slightly (1 → 0.92)
  const scale = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, scaleOnExit ? 0.92 : 1]);
  // Fade it out gently (1 → 0.3)
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, scaleOnExit ? 0.4 : 1]);
  // Round corners as it shrinks (0 → 24px)
  const borderRadius = useTransform(scrollYProgress, [0, 0.8, 1], [0, 0, roundOnExit ? 24 : 0]);

  if (!sticky) {
    return (
      <section
        className={`relative w-full ${className}`}
        style={{ zIndex, ...style }}
      >
        {children}
      </section>
    );
  }

  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{ zIndex }}
    >
      <motion.div
        className={`sticky top-0 w-full overflow-hidden ${className}`}
        style={{
          scale,
          opacity,
          borderRadius,
          transformOrigin: 'center top',
          willChange: 'transform, opacity, border-radius',
          ...(shadow ? { boxShadow: '0 -30px 80px rgba(0,0,0,0.2), 0 -8px 30px rgba(0,0,0,0.12)' } : {}),
          ...style,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
