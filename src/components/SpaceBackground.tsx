import React, { useMemo, useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

interface DustParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  pulse: number;
  pulseSpeed: number;
}

function CosmicDustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const particles: DustParticle[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 0.3 + Math.random() * 1.2,
        opacity: 0.05 + Math.random() * 0.15,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.015,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        if (p.x < -5) p.x = w + 5;
        if (p.x > w + 5) p.x = -5;
        if (p.y < -5) p.y = h + 5;
        if (p.y > h + 5) p.y = -5;

        const a = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(164, 108, 252, ${a})`;
        ctx.fill();

        if (p.size > 0.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(164, 108, 252, ${a * 0.08})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

export function SpaceBackground() {
  const isMobile = useIsMobile();

  const depthStars = useMemo(() => {
    const count = isMobile ? 40 : 90;
    return Array.from({ length: count }, (_, i) => {
      const layer = i % 3;
      const sizeRange = layer === 0 ? [0.5, 1] : layer === 1 ? [1, 2] : [1.5, 2.5];
      return {
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        opacity: layer === 0 ? 0.15 + Math.random() * 0.2 : layer === 1 ? 0.3 + Math.random() * 0.3 : 0.5 + Math.random() * 0.4,
        layer,
        twinkleDuration: `${3 + Math.random() * 5}s`,
        twinkleDelay: `${Math.random() * 6}s`,
      };
    });
  }, [isMobile]);

  const nebulaClouds = useMemo(() => {
    if (isMobile) {
      return [
        { top: '10%', left: '60%', w: 350, h: 250, color: 'rgba(88, 28, 135, 0.06)', blur: 80, delay: '0s' },
        { top: '65%', left: '15%', w: 300, h: 200, color: 'rgba(59, 130, 246, 0.04)', blur: 70, delay: '4s' },
      ];
    }
    return [
      { top: '5%', left: '55%', w: 600, h: 400, color: 'rgba(88, 28, 135, 0.07)', blur: 100, delay: '0s' },
      { top: '30%', left: '-5%', w: 500, h: 350, color: 'rgba(59, 130, 246, 0.04)', blur: 90, delay: '3s' },
      { top: '60%', left: '65%', w: 450, h: 300, color: 'rgba(139, 92, 246, 0.05)', blur: 85, delay: '6s' },
      { top: '75%', left: '20%', w: 550, h: 280, color: 'rgba(30, 64, 175, 0.04)', blur: 95, delay: '9s' },
    ];
  }, [isMobile]);

  const constellationLines = useMemo(() => {
    if (isMobile) return [];
    return [
      { x1: '15%', y1: '20%', x2: '22%', y2: '28%', opacity: 0.06, delay: '0s' },
      { x1: '22%', y1: '28%', x2: '18%', y2: '38%', opacity: 0.04, delay: '1s' },
      { x1: '70%', y1: '15%', x2: '78%', y2: '22%', opacity: 0.05, delay: '2s' },
      { x1: '78%', y1: '22%', x2: '82%', y2: '18%', opacity: 0.04, delay: '3s' },
      { x1: '55%', y1: '70%', x2: '62%', y2: '65%', opacity: 0.05, delay: '4s' },
      { x1: '62%', y1: '65%', x2: '58%', y2: '58%', opacity: 0.04, delay: '5s' },
    ];
  }, [isMobile]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 70% 30%, rgba(88, 28, 135, 0.08) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 20% 70%, rgba(30, 64, 175, 0.06) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(139, 92, 246, 0.04) 0%, transparent 60%)
          `,
        }}
      />

      {nebulaClouds.map((cloud, i) => (
        <div
          key={`nebula-${i}`}
          className="space-nebula"
          style={{
            position: 'absolute',
            top: cloud.top,
            left: cloud.left,
            width: cloud.w,
            height: cloud.h,
            background: `radial-gradient(ellipse at center, ${cloud.color} 0%, transparent 70%)`,
            filter: `blur(${cloud.blur}px)`,
            '--nebula-delay': cloud.delay,
          } as React.CSSProperties}
        />
      ))}

      {depthStars.map((star) => (
        <div
          key={`depth-${star.id}`}
          className="space-depth-star"
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            background: star.layer === 2
              ? `radial-gradient(circle, rgba(200, 180, 255, ${star.opacity}) 0%, rgba(164, 108, 252, ${star.opacity * 0.5}) 100%)`
              : `rgba(255, 255, 255, ${star.opacity})`,
            boxShadow: star.layer === 2
              ? `0 0 ${star.size * 3}px rgba(164, 108, 252, ${star.opacity * 0.3})`
              : 'none',
            '--star-twinkle-dur': star.twinkleDuration,
            '--star-twinkle-delay': star.twinkleDelay,
            '--star-base-opacity': star.opacity,
          } as React.CSSProperties}
        />
      ))}

      {constellationLines.length > 0 && (
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          {constellationLines.map((line, i) => (
            <line
              key={`const-${i}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={`rgba(164, 108, 252, ${line.opacity})`}
              strokeWidth="0.5"
              className="space-constellation-line"
              style={{ '--const-delay': line.delay } as React.CSSProperties}
            />
          ))}
        </svg>
      )}

      {!isMobile && <CosmicDustCanvas />}

      <div
        className="space-aurora"
        style={{
          position: 'absolute',
          bottom: 0,
          left: '10%',
          right: '10%',
          height: '40%',
          background: 'linear-gradient(to top, rgba(88, 28, 135, 0.03) 0%, rgba(59, 130, 246, 0.02) 40%, transparent 100%)',
          filter: 'blur(60px)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(4, 6, 8, 0.4) 100%)',
        }}
      />
    </div>
  );
}
