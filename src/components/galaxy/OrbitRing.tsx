interface OrbitRingProps {
  radius: number;
  strokeColor?: string;
  dashPattern?: string;
  rotationDuration?: number;
  reverse?: boolean;
  paused?: boolean;
}

export function OrbitRing({
  radius,
  strokeColor = 'rgba(56,189,248,0.12)',
  dashPattern = '4 8',
  rotationDuration = 90,
  reverse = false,
  paused = false,
}: OrbitRingProps) {
  const size = radius * 2 + 4;
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      className="absolute hidden md:block"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1}
        strokeDasharray={dashPattern}
        style={{
          animation: paused ? 'none' : `orbitSpin ${rotationDuration}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal',
          transformOrigin: `${center}px ${center}px`,
        }}
      />
      <style>{`
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          circle { animation: none !important; }
        }
      `}</style>
    </svg>
  );
}
