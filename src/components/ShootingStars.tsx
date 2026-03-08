import { useMemo, memo } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

interface ShootingStarsProps {
  count?: number;
}

export const ShootingStars = memo(function ShootingStars({ count = 18 }: ShootingStarsProps) {
  const isMobile = useIsMobile();
  const effectiveCount = isMobile ? Math.min(count, 4) : count;
  const twinkleCount = isMobile ? 10 : 40;

  const stars = useMemo(() => {
    return Array.from({ length: effectiveCount }, (_, i) => ({
      id: i,
      top: `${Math.random() * 70}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${1.2 + Math.random() * 1.8}s`,
      size: 1 + Math.random() * 2,
    }));
  }, [effectiveCount]);

  const twinkleStars = useMemo(() => {
    return Array.from({ length: twinkleCount }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 1.5,
      baseOpacity: 0.3 + Math.random() * 0.7,
      duration: `${2 + Math.random() * 4}s`,
      delay: `${Math.random() * 5}s`,
    }));
  }, [twinkleCount]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ contain: 'strict' }}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            '--delay': star.delay,
            '--duration': star.duration,
          } as React.CSSProperties}
        />
      ))}
      {twinkleStars.map((star) => (
        <div
          key={`twinkle-${star.id}`}
          className="twinkle-star"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            '--base-opacity': star.baseOpacity,
            '--twinkle-duration': star.duration,
            '--twinkle-delay': star.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
});
