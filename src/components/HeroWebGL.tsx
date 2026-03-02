export function HeroWebGL() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #020408 0%, #060210 40%, #020408 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 65% 50%, rgba(30,60,120,0.25) 0%, transparent 65%)',
        }}
      />
    </div>
  );
}
