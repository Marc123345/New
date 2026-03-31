import { useRef, type ReactNode, type CSSProperties } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface StickyPanelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  shadow?: boolean;
  sticky?: boolean;
  zIndex?: number;
  scaleOnExit?: boolean;
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

  // Track how far the *outer wrapper* has scrolled through the viewport.
  // The outer wrapper is 200vh tall (100vh content + 100vh scroll runway).
  // The inner sticky div locks to the top for the first 100vh, then the
  // remaining 100vh of scroll drives the exit animation.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Exit animations — only fire in the last ~50% of scroll progress
  // (i.e. during the "runway" scroll after content has stuck)
  const scale = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [1, 1, scaleOnExit ? 0.92 : 1]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    [1, 1, scaleOnExit ? 0.35 : 1]
  );
  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [0, 0, roundOnExit ? 28 : 0]
  );

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
    // Outer wrapper — 200vh gives the sticky child room to stick + animate out
    <div
      ref={ref}
      className="relative w-full"
      style={{ height: '200vh', zIndex }}
    >
      <motion.div
        className={`sticky top-0 w-full overflow-hidden ${className}`}
        style={{
          height: '100vh',
          scale,
          opacity,
          borderRadius,
          transformOrigin: 'center center',
          willChange: 'transform, opacity, border-radius',
          ...(shadow
            ? { boxShadow: '0 -40px 100px rgba(0,0,0,0.18), 0 -10px 40px rgba(0,0,0,0.1)' }
            : {}),
          ...style,
        }}
      >
        <div className="w-full h-full overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
