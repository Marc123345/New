import { useEffect, useRef, useState } from "react";
import { brandLogos } from "../lib/brandLogos";

const PEOPLE_IMAGES = [
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200",
];

interface BallItem {
  id: number;
  src: string;
  isPerson: boolean;
  size: number;
  left: number;
  top: number;
  animDuration: number;
  animDelay: number;
  driftX: number;
  driftY: number;
  rotateEnd: number;
}

function buildBalls(containerW: number, containerH: number): BallItem[] {
  const isMobile = containerW < 600;
  const count = isMobile ? 8 : 14;
  const minSize = isMobile ? 44 : 56;
  const maxSize = isMobile ? 72 : 100;

  const allItems = [
    ...PEOPLE_IMAGES.map((src) => ({ src, isPerson: true })),
    ...brandLogos.slice(0, 8).map((src) => ({ src, isPerson: false })),
  ];

  const balls: BallItem[] = [];
  for (let i = 0; i < count; i++) {
    const item = allItems[i % allItems.length];
    const size = minSize + Math.random() * (maxSize - minSize);
    balls.push({
      id: i,
      src: item.src,
      isPerson: item.isPerson,
      size,
      left: 5 + Math.random() * 80,
      top: 5 + Math.random() * 80,
      animDuration: 6 + Math.random() * 8,
      animDelay: -(Math.random() * 10),
      driftX: (Math.random() - 0.5) * 60,
      driftY: (Math.random() - 0.5) * 50,
      rotateEnd: (Math.random() - 0.5) * 30,
    });
  }
  return balls;
}

export function HeroWebGLPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [balls, setBalls] = useState<BallItem[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const build = () => {
      const w = container.clientWidth || container.offsetWidth || 400;
      const h = container.clientHeight || container.offsetHeight || 300;
      setBalls(buildBalls(w, h));
    };

    build();

    const ro = new ResizeObserver(build);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ pointerEvents: "none" }}
    >
      <style>{`
        @keyframes float-ball {
          0%   { transform: translate(0px, 0px) rotate(0deg) scale(1); }
          33%  { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(1.04); }
          66%  { transform: translate(calc(var(--dx) * -0.5), calc(var(--dy) * 0.8)) rotate(calc(var(--rot) * -0.6)) scale(0.97); }
          100% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
        }
      `}</style>

      {balls.map((ball) => (
        <div
          key={ball.id}
          style={{
            position: "absolute",
            left: `${ball.left}%`,
            top: `${ball.top}%`,
            width: ball.size,
            height: ball.size,
            borderRadius: "50%",
            overflow: "hidden",
            border: ball.isPerson ? "2px solid rgba(255,255,255,0.6)" : "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            animation: `float-ball ${ball.animDuration}s ${ball.animDelay}s ease-in-out infinite`,
            ["--dx" as string]: `${ball.driftX}px`,
            ["--dy" as string]: `${ball.driftY}px`,
            ["--rot" as string]: `${ball.rotateEnd}deg`,
            willChange: "transform",
          }}
        >
          <img
            src={ball.src}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              pointerEvents: "none",
            }}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
