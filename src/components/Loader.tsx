import { useEffect, useRef, useState, useCallback } from 'react';
import { H2HLogo } from './H2HLogo';

interface LoaderProps {
  onComplete: () => void;
}

const ICONS = [
  { text: 'in', bg: '#0A66C2' },
  { text: 'f',  bg: '#1877F2' },
  { text: '▶', bg: '#FF0000' },
  { text: '𝕏', bg: '#000' },
  { text: 'G',  bg: '#4285F4' },
  { text: '⚛', bg: '#222222', fg: '#61DAFB' },
  { text: '', bg: '#000000', svg: 'tiktok' },
  { text: '', bg: 'ig-gradient', svg: 'instagram' },
];

const TIKTOK_PATH = 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z';
const IG_PATH = 'M66.004 18c-13.036 0-14.672.057-19.792.29-5.11.234-8.598 1.043-11.65 2.23-3.157 1.226-5.835 2.866-8.503 5.535-2.67 2.668-4.31 5.346-5.54 8.502-1.19 3.053-2 6.542-2.23 11.65C18.06 51.327 18 52.964 18 66s.058 14.667.29 19.787c.235 5.11 1.044 8.598 2.23 11.65 1.227 3.157 2.867 5.835 5.536 8.503 2.667 2.67 5.345 4.314 8.5 5.54 3.054 1.187 6.543 1.996 11.652 2.23 5.12.233 6.755.29 19.79.29 13.037 0 14.668-.057 19.788-.29 5.11-.234 8.602-1.043 11.656-2.23 3.156-1.226 5.83-2.87 8.497-5.54 2.67-2.668 4.31-5.346 5.54-8.502 1.18-3.053 1.99-6.542 2.23-11.65.23-5.12.29-6.752.29-19.788 0-13.036-.06-14.672-.29-19.792-.24-5.11-1.05-8.598-2.23-11.65-1.23-3.157-2.87-5.835-5.54-8.503-2.67-2.67-5.34-4.31-8.5-5.535-3.06-1.187-6.55-1.996-11.66-2.23-5.12-.233-6.75-.29-19.79-.29zm-4.306 8.65c1.278-.002 2.704 0 4.306 0 12.816 0 14.335.046 19.396.276 4.68.214 7.22.996 8.912 1.653 2.24.87 3.837 1.91 5.516 3.59 1.68 1.68 2.72 3.28 3.592 5.52.657 1.69 1.44 4.23 1.653 8.91.23 5.06.28 6.58.28 19.39s-.05 14.33-.28 19.39c-.214 4.68-.996 7.22-1.653 8.91-.87 2.24-1.912 3.835-3.592 5.514-1.68 1.68-3.275 2.72-5.516 3.59-1.69.66-4.232 1.44-8.912 1.654-5.06.23-6.58.28-19.396.28-12.817 0-14.336-.05-19.396-.28-4.68-.216-7.22-.998-8.913-1.655-2.24-.87-3.84-1.91-5.52-3.59-1.68-1.68-2.72-3.276-3.592-5.517-.657-1.69-1.44-4.23-1.653-8.91-.23-5.06-.276-6.58-.276-19.398s.046-14.33.276-19.39c.214-4.68.996-7.22 1.653-8.912.87-2.24 1.912-3.84 3.592-5.52 1.68-1.68 3.28-2.72 5.52-3.592 1.692-.66 4.233-1.44 8.913-1.655 4.428-.2 6.144-.26 15.09-.27zm29.928 7.97c-3.18 0-5.76 2.577-5.76 5.758 0 3.18 2.58 5.76 5.76 5.76 3.18 0 5.76-2.58 5.76-5.76 0-3.18-2.58-5.76-5.76-5.76zm-25.622 6.73c-13.613 0-24.65 11.037-24.65 24.65 0 13.613 11.037 24.645 24.65 24.645C79.617 90.645 90.65 79.613 90.65 66S79.616 41.35 66.003 41.35zm0 8.65c8.836 0 16 7.163 16 16 0 8.836-7.164 16-16 16-8.837 0-16-7.164-16-16 0-8.837 7.163-16 16-16z';

/* ── Particles for ambient depth ── */
function useParticles(count: number) {
  const [particles] = useState(() =>
    Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
      drift: (Math.random() - 0.5) * 30,
    }))
  );
  return particles;
}

export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'converge' | 'burst' | 'exit'>('loading');
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const DURATION = 2800;
  const particles = useParticles(30);

  const stableOnComplete = useCallback(onComplete, []);

  useEffect(() => {
    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.floor(eased * 100));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setPhase('converge');
        setTimeout(() => setPhase('burst'), 800);
        setTimeout(() => setPhase('exit'), 1500);
        setTimeout(stableOnComplete, 2100);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stableOnComplete]);

  const isConverge = phase === 'converge' || phase === 'burst' || phase === 'exit';
  const isBurst = phase === 'burst' || phase === 'exit';
  const isExit = phase === 'exit';

  // Orbit radius responsive to viewport
  const orbitRadius = typeof window !== 'undefined'
    ? Math.min(window.innerWidth, window.innerHeight) * 0.22
    : 160;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#141622',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: isExit ? 0 : 1,
        transition: isExit ? 'opacity 0.6s cubic-bezier(0.22,1,0.36,1)' : 'none',
        pointerEvents: isExit ? 'none' : 'all',
      }}
    >
      {/* ── Floating particles ── */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: `rgba(164,108,252,${0.15 + Math.random() * 0.15})`,
            animation: `loaderFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
            pointerEvents: 'none',
            ['--drift' as string]: `${p.drift}px`,
          }}
        />
      ))}

      {/* ── Pulsing orbit ring ── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: orbitRadius * 2,
          height: orbitRadius * 2,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: `1px solid rgba(164,108,252,${isConverge ? 0 : 0.08 + progress * 0.001})`,
          boxShadow: isConverge ? 'none' : `0 0 ${progress * 0.4}px rgba(164,108,252,0.05)`,
          transition: 'border-color 0.6s ease, box-shadow 0.6s ease',
          animation: isConverge ? 'none' : 'loaderRingPulse 3s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* ── Ambient glow — intensifies with progress, bursts on converge ── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: isBurst ? '250vmax' : `${120 + progress * 4}px`,
          height: isBurst ? '250vmax' : `${120 + progress * 4}px`,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: isBurst
            ? 'radial-gradient(circle, rgba(164,108,252,0.2) 0%, rgba(20,22,34,0) 60%)'
            : `radial-gradient(circle, rgba(164,108,252,${0.06 + progress * 0.002}) 0%, transparent 70%)`,
          transition: isBurst
            ? 'width 0.8s cubic-bezier(0.22,1,0.36,1), height 0.8s cubic-bezier(0.22,1,0.36,1)'
            : 'width 0.15s, height 0.15s',
          pointerEvents: 'none',
        }}
      />

      {/* ── Orbiting icon cubes ── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 0,
          height: 0,
          animation: isConverge ? 'none' : 'loaderOrbit 20s linear infinite',
          transition: 'none',
        }}
      >
        {ICONS.map((icon, i) => {
          const angle = (i / ICONS.length) * 360;
          const threshold = (i + 1) * 10;
          const visible = progress >= threshold;
          const igBg = 'linear-gradient(135deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)';

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 44,
                height: 44,
                borderRadius: 10,
                // Position along orbit, converge to center
                transform: isConverge
                  ? `translate(-50%, -50%) rotate(${angle}deg) translateY(0px) rotate(-${angle}deg) scale(0)`
                  : `translate(-50%, -50%) rotate(${angle}deg) translateY(-${orbitRadius}px) rotate(-${angle}deg) scale(${visible ? 1 : 0})`,
                background: visible
                  ? icon.svg === 'instagram' ? igBg : icon.bg
                  : 'rgba(164,108,252,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
                fontWeight: 800,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: visible ? (icon.fg || '#fff') : 'transparent',
                transition: isConverge
                  ? `transform 0.6s cubic-bezier(0.6,0,0.2,1) ${i * 0.05}s, background 0.3s, color 0.3s`
                  : `transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s, background 0.4s, color 0.4s`,
                boxShadow: visible && !isConverge
                  ? `0 0 16px ${icon.bg === 'ig-gradient' ? '#d62976' : icon.bg}55, 0 2px 8px rgba(0,0,0,0.4)`
                  : 'none',
              }}
            >
              {icon.svg === 'tiktok' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill={visible ? '#fff' : 'transparent'}>
                  <path d={TIKTOK_PATH}/>
                </svg>
              ) : icon.svg === 'instagram' ? (
                <svg width="16" height="16" viewBox="0 0 132 132" fill={visible ? '#fff' : 'transparent'}>
                  <path d={IG_PATH}/>
                </svg>
              ) : (
                icon.text
              )}
            </div>
          );
        })}
      </div>

      {/* ── Connection lines (SVG) ── */}
      <svg
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: orbitRadius * 2.5,
          height: orbitRadius * 2.5,
          pointerEvents: 'none',
          opacity: isConverge ? 0 : Math.min(progress / 100, 0.2),
          transition: 'opacity 0.5s ease',
          animation: isConverge ? 'none' : 'loaderOrbit 20s linear infinite',
        }}
        viewBox={`${-orbitRadius * 1.25} ${-orbitRadius * 1.25} ${orbitRadius * 2.5} ${orbitRadius * 2.5}`}
      >
        {ICONS.map((_, i) => {
          const a1 = (i / ICONS.length) * Math.PI * 2 - Math.PI / 2;
          const a2 = ((i + 1) % ICONS.length / ICONS.length) * Math.PI * 2 - Math.PI / 2;
          const visible = progress >= (i + 1) * 10;
          return (
            <g key={i}>
              {/* Ring segments */}
              <line
                x1={Math.cos(a1) * orbitRadius} y1={Math.sin(a1) * orbitRadius}
                x2={Math.cos(a2) * orbitRadius} y2={Math.sin(a2) * orbitRadius}
                stroke="#a46cfc" strokeWidth={0.8}
                opacity={visible ? 0.5 : 0}
                style={{ transition: 'opacity 0.5s' }}
              />
              {/* Spokes to center */}
              <line
                x1={0} y1={0}
                x2={Math.cos(a1) * orbitRadius} y2={Math.sin(a1) * orbitRadius}
                stroke="#a46cfc" strokeWidth={0.4}
                opacity={visible ? 0.25 : 0}
                strokeDasharray="4 4"
                style={{ transition: 'opacity 0.5s' }}
              />
            </g>
          );
        })}
      </svg>

      {/* ── Center content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
        }}
      >
        {/* Logo */}
        <div
          style={{
            opacity: isExit ? 0 : 1,
            transform: isBurst ? 'scale(1.2)' : 'scale(1)',
            transition: 'transform 0.8s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease',
            filter: `drop-shadow(0 0 ${20 + progress * 0.4}px rgba(164,108,252,${0.3 + progress * 0.005}))`,
          }}
        >
          <H2HLogo height={76} />
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(0.65rem, 1.2vw, 0.9rem)',
            fontWeight: 300,
            color: 'rgba(232,226,255,0.5)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            textAlign: 'center',
            opacity: progress > 25 && !isBurst ? 1 : 0,
            transform: progress > 25 ? 'translateY(0)' : 'translateY(6px)',
            transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          from B2B to H2H
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: 180,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            opacity: isBurst ? 0 : 1,
            transform: isBurst ? 'translateY(8px) scale(0.95)' : 'translateY(0)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          <div style={{ width: '100%', height: 2, background: 'rgba(164,108,252,0.08)', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #7c3aed, #a46cfc)',
                transition: 'width 0.06s linear',
                boxShadow: `${progress > 5 ? `0 0 6px rgba(164,108,252,0.5)` : 'none'}`,
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.5rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(232,226,255,0.2)',
            }}>
              Connecting
            </span>
            <span style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.6rem',
              fontWeight: 600,
              color: '#a46cfc',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom line ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          opacity: isBurst ? 0 : 0.35,
          transition: 'opacity 0.4s',
        }}
      >
        <div style={{ width: 20, height: 1, background: 'rgba(164,108,252,0.35)' }} />
        <span style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: '0.4rem',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'rgba(232,226,255,0.25)',
          whiteSpace: 'nowrap',
        }}>
          Build a Brand People Want to Talk To
        </span>
        <div style={{ width: 20, height: 1, background: 'rgba(164,108,252,0.35)' }} />
      </div>

      <style>{`
        @keyframes loaderOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes loaderRingPulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.03); }
        }
        @keyframes loaderFloat {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(var(--drift, 10px));
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
