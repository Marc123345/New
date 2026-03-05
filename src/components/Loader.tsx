import { useEffect, useRef, useState, useCallback } from 'react';

interface LoaderProps {
  onComplete?: () => void;
}

const DURATION = 3200;
const REVEAL_DURATION = 1000;

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
    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(elapsed / DURATION, 1);
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
        requestAnimationFrame(tick);
      } else {
        setPhase('reveal');
        setTimeout(() => {
          setPhase('done');
          onComplete?.();
        }, REVEAL_DURATION);
      }
    };

    requestAnimationFrame(tick);
  }, [onComplete, triggerGlitch]);

  if (phase === 'done') return null;

  const isRevealing = phase === 'reveal';
  const screenFill = progress / 100;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#0a0614', zIndex: 9999 }}
    >
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

      {/* Phone Image Graphic */}
      <div
        style={{
          position: 'relative',
          width: 220, // Increased slightly to make the photo pop
          height: 440,
          transform: isRevealing ? 'scale(0.85)' : 'scale(1)',
          opacity: isRevealing ? 0 : 1,
          transition: isRevealing ? `transform ${REVEAL_DURATION * 0.5}ms ease, opacity ${REVEAL_DURATION * 0.4}ms ease` : 'none',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)', // Adds depth to the photo
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
            width: 240,
            height: 480,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, rgba(164,108,252,${0.12 + screenFill * 0.22}) 0%, rgba(164,108,252,0) 70%)`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* User's Phone Image */}
        <img
          src="https://ik.imagekit.io/qcvroy8xpd/f2ed6720-a942-4339-ae14-69b93919a4c0.jpg"
          alt="Loading Phone"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        />

        {/* Screen Content Area overlaid onto the phone image */}
        <div
          style={{
            position: 'absolute',
            // Adjust these percentages to perfectly match the screen inside the provided phone image
            inset: '10% 8% 12% 8%', 
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: 16, // Smoothes the overlay corners
          }}
        >
          {/* H2H Logo */}
          <img
            src="https://ik.imagekit.io/qcvroy8xpd/H2H%20LOGO.jpeg?updatedAt=1760464355600"
            alt="H2H Logo"
            style={{
              width: '70%',
              zIndex: 3,
              borderRadius: '50%',
              boxShadow: `0 0 20px rgba(164,108,252,${screenFill})`, // Glows as it loads
            }}
          />

          {/* Loading Mask - Shrinks from 100% to 0% to reveal the logo underneath */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: `${100 - progress}%`,
              background: 'rgba(10, 6, 20, 0.95)', // Very dark overlay to hide un-loaded portion
              backdropFilter: 'blur(4px)',
              zIndex: 4,
              transition: 'height 0.1s linear',
              borderBottom: '2px solid rgba(164,108,252,0.8)', // A neat little laser line for the loading edge
              boxShadow: '0 5px 15px rgba(164,108,252,0.5)',
            }}
          />
        </div>
      </div>

      {/* Bottom HUD */}
      <div
        className="relative flex flex-col items-center gap-3 mt-8 select-none"
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
              color: 'var(--color-secondary, #a46cfc)', // Added fallback color just in case
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
              color: 'var(--color-secondary, #a46cfc)',
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
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            ...pos,
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
      ))}
    </div>
  );
}