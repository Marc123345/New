export function HeroWebGL() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="https://ik.imagekit.io/qcvroy8xpd/rotating-galaxy-4k-2026-01-28-03-26-41-utc.mp4?updatedAt=1771761519137"
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(4,4,8,0.78) 0%, rgba(13,3,21,0.72) 40%, rgba(4,4,8,0.80) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 65% 50%, rgba(124,4,252,0.18) 0%, transparent 65%)',
        }}
      />
    </div>
  );
}
