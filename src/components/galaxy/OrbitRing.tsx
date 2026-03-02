interface OrbitRingProps {
  radius: number;
  strokeColor?: string;
  dashArray?: string;
  duration?: number;
  reverse?: boolean;
  paused?: boolean;
}

export function OrbitRing({
  radius,
  strokeColor = 'rgba(164,108,252,0.12)',
  dashArray = '4 8',
  duration = 90,
  reverse = false,
  paused = false,
}: OrbitRingProps) {
  const size = radius * 2 + 4;
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      className="absolute"
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
        strokeDasharray={dashArray}
        style={{
          animation: paused ? 'none' : `orbitSpin ${duration}s linear infinite`,
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
