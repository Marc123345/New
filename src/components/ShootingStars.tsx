import { useMemo } from 'react';

interface Star {
  id: number;
  top: string;
  left: string;
  delay: string;
  duration: string;
  size: number;
  opacity: number;
}

interface ShootingStarsProps {
  count?: number;
}

export function ShootingStars({ count = 18 }: ShootingStarsProps) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      top: `${Math.random() * 70}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${1.2 + Math.random() * 1.8}s`,
      size: 1 + Math.random() * 2,
      opacity: 0.4 + Math.random() * 0.6,
    }));
  }, [count]);

  const twinkleStars = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 1.5,
      baseOpacity: 0.3 + Math.random() * 0.7,
      duration: `${2 + Math.random() * 4}s`,
      delay: `${Math.random() * 5}s`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes shootingStar {
          0% {
            transform: translateX(0) translateY(0) rotate(-35deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(200px) rotate(-35deg);
            opacity: 0;
          }
        }
        .shooting-star {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(90deg, rgba(255,255,255,0.9), transparent);
          animation: shootingStar var(--duration) var(--delay) ease-in infinite;
          opacity: 0;
        }
        .shooting-star::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 100%;
          transform: translateY(-50%);
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6));
        }
      `}</style>
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
      {/* Static twinkling stars */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: var(--base-opacity); }
          50% { opacity: 0.1; }
        }
        .twinkle-star {
          position: absolute;
          border-radius: 50%;
          background: white;
          animation: twinkle var(--twinkle-duration) var(--twinkle-delay) ease-in-out infinite;
        }
      `}</style>
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
}
