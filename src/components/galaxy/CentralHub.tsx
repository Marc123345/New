import { H2HLogo } from '../H2HLogo';

export function CentralHub() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(41,30,86,0.6) 0%, rgba(41,30,86,0.15) 60%, transparent 100%)',
          boxShadow: '0 0 40px rgba(164,108,252,0.15), 0 0 80px rgba(41,30,86,0.1)',
        }}
      />

      <div className="hub-ring hub-ring-1" />
      <div className="hub-ring hub-ring-2" />
      <div className="hub-ring hub-ring-3" />

      <div
        className="relative z-10 flex items-center justify-center rounded-full"
        style={{
          width: 64,
          height: 64,
          background: 'linear-gradient(145deg, rgba(41,30,86,0.8) 0%, rgba(20,14,42,0.9) 100%)',
          border: '1px solid rgba(164,108,252,0.3)',
          boxShadow: '0 0 20px rgba(164,108,252,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <H2HLogo height={32} />
      </div>

      <style>{`
        .hub-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(164,108,252,0.15);
          animation: hubPulse 4s ease-out infinite;
        }
        .hub-ring-1 { width: 80px; height: 80px; animation-delay: 0s; }
        .hub-ring-2 { width: 92px; height: 92px; animation-delay: 1.3s; }
        .hub-ring-3 { width: 104px; height: 104px; animation-delay: 2.6s; }
        @keyframes hubPulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hub-ring { animation: none; opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
