import { useEffect, useRef, useState, useCallback } from 'react';
import { H2HLogo } from './H2HLogo';

interface LoaderProps {
  onComplete?: () => void;
}

const DURATION = 3200;
const REVEAL_DURATION = 1000;

// Moved outside the component to prevent recreation on every render
const STATUS_STAGES = [
  { at: 0, text: 'Initializing' },
  { at: 20, text: 'Loading Assets' },
  { at: 45, text: 'Building Scene' },
  { at: 70, text: 'Rendering World' },
  { at: 90, text: 'Almost Ready' },
  { at: 99, text: 'Launching' },
];

export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'done'>('loading');
  const [statusText, setStatusText] = useState('Initializing');
  const [glitchActive, setGlitchActive] = useState(false);
  const progressRef = useRef(0);

  const triggerGlitch = useCallback(() => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 180);
  }, []);

  useEffect(() => {
    let frameId: number;
    let revealTimeout: ReturnType<typeof setTimeout>;
    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(elapsed / DURATION, 1);
      // Easing function
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      const prog = Math.round(eased * 100);

      if (prog !== progressRef.current) {
        const prev = progressRef.current;
        progressRef.current = prog;
        setProgress(prog);

        for (let i = STATUS_STAGES.length - 1; i >= 0; i--) {
          if (prog >= STATUS_STAGES[i].at && (i === 0 || prev < STATUS_STAGES[i].at)) {
            setStatusText(STATUS_STAGES[i].text);
            triggerGlitch();
            break;
          }
        }
      }

      if (p < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setPhase('reveal');
        revealTimeout = setTimeout(() => {
          setPhase('done');
          onComplete?.();
        }, REVEAL_DURATION);
      }
    };

    frameId = requestAnimationFrame(tick);

    // Cleanup function prevents memory leaks if component unmounts early
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(revealTimeout);
    };
  }, [onComplete, triggerGlitch]);

  if (phase === 'done') return null;

  const isRevealing = phase === 'reveal';
  const screenFill = progress / 100;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0a0614' }}
    >
      <style>{`
        @keyframes iphone-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.08); }
        }
        @keyframes screen-scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .iphone-float {
          animation: iphone-float 3.2s ease-in-out infinite;
        }
        .glow-pulse {
          animation: glow-pulse 2.4s ease-in-out infinite;
        }
        .screen-scanline {
          animation: screen-scanline 2.2s linear infinite;
        }
      `}</style>

      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.55,
          pointerEvents: 'none',
        }}
      >
        <source src="https://ik.imagekit.io/qcvroy8xpd/two-astronauts-in-space-suits-stand-on-the-alien-p-2026-01-20-12-19-32-utc.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(10,6,20,0.3) 0%, rgba(10,6,20,0.65) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Curtain panels — split exit */}
      <div
        className="absolute inset-y-0 left-0 w-1/2"
        style={{
          background: '#0a0614',
          transform: isRevealing ? 'translateX(-100%)' : 'translateX(0)',
          transition: isRevealing ? `transform ${REVEAL_DURATION}ms cubic-bezier(0.76, 0, 0.24, 1)` : 'none',
          zIndex: 10,
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/2"
        style={{
          background: '#0a0614',
          transform: isRevealing ? 'translateX(100%)' : 'translateX(0)',
          transition: isRevealing ? `transform ${REVEAL_DURATION}ms cubic-bezier(0.76, 0, 0.24, 1)` : 'none',
          zIndex: 10,
        }}
      />

      {/* iPhone graphic */}
      <div
        style={{
          position: 'relative',
          width: 160,
          height: 280,
          transform: isRevealing ? 'scale(0.85)' : 'scale(1)',
          opacity: isRevealing ? 0 : 1,
          transition: isRevealing ? `transform ${REVEAL_DURATION * 0.5}ms ease, opacity ${REVEAL_DURATION * 0.4}ms ease` : 'none',
        }}
      >
        {/* Outer glow behind phone */}
        <div
          className="glow-pulse"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 200,
            height: 320,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, rgba(164,108,252,${0.12 + screenFill * 0.22}) 0%, rgba(164,108,252,0) 70%)`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* iPhone SVG */}
        <div className="iphone-float" style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
          <svg
            viewBox="0 0 160 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <defs>
              <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1a1a2e" />
                <stop offset="40%" stopColor="#2a2a3e" />
                <stop offset="100%" stopColor="#0f0f1a" />
              </linearGradient>
              <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d0d1f" />
                <stop offset="100%" stopColor="#060610" />
              </linearGradient>
              <linearGradient id="screenFillGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#291e56" />
                <stop offset="60%" stopColor="#6a3dbd" />
                <stop offset="100%" stopColor="#a46cfc" />
              </linearGradient>
              <linearGradient id="screenGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(164,108,252,0.25)" />
                <stop offset="100%" stopColor="rgba(164,108,252,0)" />
              </linearGradient>
              <linearGradient id="speculRight" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
              </linearGradient>
              <linearGradient id="islandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2a2a3e" />
                <stop offset="100%" stopColor="#111120" />
              </linearGradient>
              <clipPath id="screenClip">
                <rect x="10" y="18" width="140" height="244" rx="6" />
              </clipPath>
              <filter id="screenGlowFilter">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Phone body */}
            <rect x="1" y="1" width="158" height="278" rx="30" ry="30" fill="url(#bodyGrad)" />

            {/* Phone border */}
            <rect x="1" y="1" width="158" height="278" rx="30" ry="30" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

            {/* Screen bezel */}
            <rect x="8" y="16" width="144" height="248" rx="8" fill="#07070f" />

            {/* Screen surface */}
            <rect x="10" y="18" width="140" height="244" rx="6" fill="url(#screenGrad)" />

            {/* Screen progress fill */}
            <rect
              x="10"
              y={18 + 244 * (1 - screenFill)}
              width="140"
              height={244 * screenFill}
              rx="0"
              fill="url(#screenFillGrad)"
              opacity="0.55"
              clipPath="url(#screenClip)"
            />

            {/* Screen top glow (from progress) */}
            <rect
              x="10"
              y="18"
              width="140"
              height="60"
              rx="6"
              fill="url(#screenGlow)"
              opacity={screenFill}
              clipPath="url(#screenClip)"
            />

            {/* Scanline sweep */}
            <g clipPath="url(#screenClip)">
              <rect
                className="screen-scanline"
                x="10"
                y="0"
                width="140"
                height="40"
                fill="rgba(255,255,255,0.025)"
              />
            </g>

            {/* Screen specular reflection */}
            <rect x="10" y="18" width="140" height="244" rx="6" fill="url(#speculRight)" />

            {/* Screen top-left glare */}
            <ellipse cx="38" cy="40" rx="22" ry="14" fill="rgba(255,255,255,0.04)" transform="rotate(-20, 38, 40)" />

            {/* Dynamic island */}
            <rect x="52" y="26" width="56" height="16" rx="8" fill="url(#islandGrad)" />
            <rect x="52" y="26" width="56" height="16" rx="8" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" />

            {/* Camera dot inside island */}
            <circle cx="95" cy="34" r="4" fill="#111120" />
            <circle cx="95" cy="34" r="2.2" fill="#1a1a30" />
            <circle cx="94" cy="33" r="0.7" fill="rgba(255,255,255,0.15)" />

            {/* Home indicator */}
            <rect x="58" y="252" width="44" height="4" rx="2" fill="rgba(255,255,255,0.2)" />

            {/* Side button (right) */}
            <rect x="157" y="90" width="4" height="36" rx="2" fill="#2a2a40" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

            {/* Volume buttons (left) */}
            <rect x="-1" y="80" width="3" height="22" rx="1.5" fill="#2a2a40" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <rect x="-1" y="108" width="3" height="22" rx="1.5" fill="#2a2a40" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

            {/* Mute switch (left) */}
            <rect x="-1" y="62" width="3" height="12" rx="1.5" fill="#2a2a40" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

            {/* H2H Logo on screen */}
            <foreignObject x="20" y="105" width="120" height="70" opacity={0.2 + screenFill * 0.8} clipPath="url(#screenClip)">
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <H2HLogo height={40} />
              </div>
            </foreignObject>
          </svg>
        </div>
      </div>

      {/* Bottom HUD */}
      <div
        className="relative flex flex-col items-center gap-3 mt-6 select-none"
        style={{
          opacity: isRevealing ? 0 : 1,
          transform: isRevealing ? 'translateY(12px)' : 'translateY(0)',
          transition: isRevealing ? `opacity ${REVEAL_DURATION * 0.35}ms ease, transform ${REVEAL_DURATION * 0.35}ms ease` : 'none',
        }}
      >
        {/* Counter row */}
        <div className="flex items-baseline gap-1">
          <span
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '3.5rem',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              fontVariantNumeric: 'tabular-nums',
              filter: glitchActive
                ? 'drop-shadow(2px 0 0 rgba(164,108,252,0.9)) drop-shadow(-2px 0 0 rgba(100,60,200,0.7))'
                : 'none',
              transform: glitchActive ? 'translateX(1px)' : 'none',
              transition: 'filter 0.05s, transform 0.05s',
            }}
          >
            {progress}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '1.25rem',
              fontWeight: 300,
              color: 'var(--color-secondary)',
              letterSpacing: '-0.02em',
            }}
          >
            %
          </span>
        </div>

        {/* Progress track */}
        <div
          style={{
            position: 'relative',
            width: 220,
            height: 2,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              right: `${100 - progress}%`,
              background: 'linear-gradient(90deg, #291e56, #a46cfc)',
              transition: 'right 0.08s linear',
              boxShadow: '0 0 10px rgba(164,108,252,0.7), 0 0 4px rgba(164,108,252,1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${progress}%`,
              transform: 'translate(-50%, -50%)',
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 0 6px 2px rgba(164,108,252,0.9)',
              transition: 'left 0.08s linear',
            }}
          />
        </div>

        {/* Status label with glitch */}
        <div
          style={{
            position: 'relative',
            height: 18,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-secondary)',
              opacity: 0.75,
              filter: glitchActive
                ? 'drop-shadow(1px 0 0 rgba(164,108,252,0.9)) drop-shadow(-1px 0 0 rgba(41,30,86,0.5))'
                : 'none',
            }}
          >
            {statusText}
          </span>
          {glitchActive && (
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'var(--font-stack-heading)',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgba(164,108,252,0.4)',
                transform: 'translateX(2px)',
                pointerEvents: 'none',
              }}
            >
              {statusText}
            </span>
          )}
        </div>

        {/* Tick marks */}
        <div style={{ display: 'flex', gap: 3, alignItems: 'center', marginTop: 2 }}>
          {Array.from({ length: 20 }).map((_, i) => {
            const threshold = (i + 1) * 5;
            const active = progress >= threshold;
            return (
              <div
                key={i}
                style={{
                  width: i % 5 === 4 ? 2 : 1,
                  height: i % 5 === 4 ? 10 : 6,
                  borderRadius: 1,
                  background: active ? '#d4b8ff' : 'rgba(255,255,255,0.12)',
                  boxShadow: active ? '0 0 4px rgba(164,108,252,0.5)' : 'none',
                  transition: 'background 0.15s, box-shadow 0.15s',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Corner decorations */}
      {[
        { top: 24, left: 24, rotate: 0 },
        { top: 24, right: 24, rotate: 90 },
        { bottom: 24, right: 24, rotate: 180 },
        { bottom: 24, left: 24, rotate: 270 },
      ].map((pos, i) => {
        // Bug Fix: Extracting rotation to properly apply it via 'transform'
        const { rotate, ...positionProps } = pos; 
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...positionProps,
              transform: `rotate(${rotate}deg)`,
              width: 20,
              height: 20,
              opacity: isRevealing ? 0 : 0.3,
              transition: isRevealing ? 'opacity 0.2s ease' : 'none',
            }}
          >
            <svg viewBox="0 0 20 20" fill="none">
              <path
                d="M0 10 L0 0 L10 0"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}