import { type ReactNode, type CSSProperties } from 'react';

interface StickyPanelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Add a shadow on the leading edge so it looks like it's sliding over the previous section */
  shadow?: boolean;
  /** Set to false if the section should NOT be sticky (e.g. the very last section) */
  sticky?: boolean;
  /** z-index to control stacking order — higher sections slide over lower ones */
  zIndex?: number;
}

export function StickyPanel({
  children,
  className = '',
  style,
  shadow = true,
  sticky = true,
  zIndex = 1,
}: StickyPanelProps) {
  return (
    <section
      className={`relative w-full ${className}`}
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: 0,
        zIndex,
        ...(shadow ? { boxShadow: '0 -20px 60px rgba(0,0,0,0.25)' } : {}),
        ...style,
      }}
    >
      {children}
    </section>
  );
}
