import { useEffect, useRef, useState } from 'react';
import { H2HLogo } from './H2HLogo';

interface LoaderProps {
  onComplete: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'done' | 'exit'>('loading');
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const DURATION = 2600;

  // Animated noise / particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let id = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // Draw subtle grid dots
      ctx.fillStyle = 'rgba(164,108,252,0.06)';
      const spacing = 40;
      for (let x = 0; x < w; x += spacing) {
        for (let y = 0; y < h; y += spacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      id = requestAnimationFrame(draw);
    };

    draw();
    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Progress ticker
  useEffect(() => {
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      // Ease out cubic
      const t = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.floor(eased * 100);
      setProgress(val);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setPhase('done');
        setTimeout(() => setPhase('exit'), 600);
        setTimeout(onComplete, 1300);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  const isExit = phase === 'exit';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#0e0b1f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: isExit ? 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.76,0,0.24,1)' : 'none',
        opacity: isExit ? 0 : 1,
        transform: isExit ? 'translateY(-40px)' : 'translateY(0)',
        pointerEvents: isExit ? 'none' : 'all',
      }}
    >
      {/* Grid dot canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      {/* Top-left corner bracket */}
      <div style={{ position: 'absolute', top: 32, left: 32 }}>
        <div style={{ width: 24, height: 24, borderTop: '2px solid rgba(164,108,252,0.4)', borderLeft: '2px solid rgba(164,108,252,0.4)' }} />
      </div>
      {/* Top-right corner bracket */}
      <div style={{ position: 'absolute', top: 32, right: 32 }}>
        <div style={{ width: 24, height: 24, borderTop: '2px solid rgba(164,108,252,0.4)', borderRight: '2px solid rgba(164,108,252,0.4)' }} />
      </div>
      {/* Bottom-left corner bracket */}
      <div style={{ position: 'absolute', bottom: 32, left: 32 }}>
        <div style={{ width: 24, height: 24, borderBottom: '2px solid rgba(164,108,252,0.4)', borderLeft: '2px solid rgba(164,108,252,0.4)' }} />
      </div>
      {/* Bottom-right corner bracket */}
      <div style={{ position: 'absolute', bottom: 32, right: 32 }}>
        <div style={{ width: 24, height: 24, borderBottom: '2px solid rgba(164,108,252,0.4)', borderRight: '2px solid rgba(164,108,252,0.4)' }} />
      </div>

      {/* Horizontal scan line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(164,108,252,0.15) 20%, rgba(164,108,252,0.4) 50%, rgba(164,108,252,0.15) 80%, transparent 100%)',
          top: `${progress}%`,
          transition: 'top 0.05s linear',
        }}
      />

      {/* Main content */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>

        {/* Logo */}
        <div
          style={{
            animation: 'loaderLogoPulse 3s ease-in-out infinite',
            filter: `drop-shadow(0 0 ${12 + progress * 0.18}px rgba(164,108,252,${0.3 + progress * 0.004}))`,
          }}
        >
          <H2HLogo height={72} />
        </div>

        {/* Social media icons row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {[
            { text: 'in', bg: '#0A66C2' },
            { text: 'f',  bg: '#1877F2' },
            { text: '▶', bg: '#FF0000' },
            { text: '𝕏', bg: '#000' },
            { text: '♪', bg: '#010101' },
            { text: 'G',  bg: '#4285F4' },
            { text: 'P',  bg: '#E60023' },
            { text: '♫', bg: '#1DB954' },
          ].map((icon, i) => {
            const threshold = (i + 1) * 11;
            const visible = progress >= threshold;
            return (
              <div
                key={i}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: visible ? icon.bg : 'rgba(164,108,252,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 800,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  color: visible ? '#fff' : 'rgba(164,108,252,0.15)',
                  transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
                  transform: visible ? 'scale(1)' : 'scale(0.7)',
                  opacity: visible ? 1 : 0.3,
                  boxShadow: visible ? `0 0 12px ${icon.bg}55` : 'none',
                }}
              >
                {icon.text}
              </div>
            );
          })}
        </div>

        {/* Counter + bar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, width: 320 }}>

          {/* Big counter */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(4rem, 10vw, 7rem)',
                fontWeight: 900,
                lineHeight: 1,
                color: '#e8e2ff',
                letterSpacing: '-0.04em',
                fontVariantNumeric: 'tabular-nums',
                textShadow: '0 0 40px rgba(164,108,252,0.5)',
              }}
            >
              {String(progress).padStart(2, '0')}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontWeight: 700,
                color: 'var(--color-secondary)',
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              %
            </span>
          </div>

          {/* Progress track */}
          <div style={{ position: 'relative', width: '100%' }}>
            {/* Track */}
            <div
              style={{
                width: '100%',
                height: 2,
                background: 'rgba(164,108,252,0.12)',
                position: 'relative',
                overflow: 'visible',
              }}
            >
              {/* Fill */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #291e56, #a46cfc)',
                  transition: 'width 0.05s linear',
                }}
              />
              {/* Glowing tip */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: `${progress}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#a46cfc',
                  boxShadow: '0 0 12px 4px rgba(164,108,252,0.8)',
                  transition: 'left 0.05s linear',
                }}
              />
            </div>

            {/* Tick marks */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
              {[0, 25, 50, 75, 100].map((tick) => (
                <div key={tick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 1, height: 4, background: progress >= tick ? 'rgba(164,108,252,0.7)' : 'rgba(164,108,252,0.2)', transition: 'background 0.3s' }} />
                  <span style={{
                    fontFamily: 'var(--font-stack-heading)',
                    fontSize: '0.5rem',
                    letterSpacing: '0.1em',
                    color: progress >= tick ? 'rgba(164,108,252,0.7)' : 'rgba(164,108,252,0.2)',
                    transition: 'color 0.3s',
                  }}>{tick}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status text */}
          <div style={{ height: 20, display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: '0.55rem',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: phase === 'done' ? 'var(--color-secondary)' : 'rgba(232,226,255,0.35)',
                transition: 'color 0.4s ease',
              }}
            >
              {phase === 'done' ? '— Ready —' : 'Initialising Experience'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom label */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ width: 32, height: 1, background: 'rgba(164,108,252,0.3)' }} />
        <span style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: '0.5rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'rgba(232,226,255,0.25)',
          whiteSpace: 'nowrap',
        }}>Human To Human Social</span>
        <div style={{ width: 32, height: 1, background: 'rgba(164,108,252,0.3)' }} />
      </div>

      <style>{`
        @keyframes loaderLogoPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `}</style>
    </div>
  );
}
