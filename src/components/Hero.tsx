import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ScrollReveal } from './ScrollReveal';
import { VideoOverlay } from './VideoOverlay';

function HeroButton({ variant, children, onClick }: { variant: 'primary' | 'outline'; children: React.ReactNode; onClick?: () => void }) {
  const isPrimary = variant === 'primary';
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-block px-8 py-4 border-2 cursor-pointer uppercase"
      style={{
        fontFamily: 'var(--font-stack-heading)',
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        background: isPrimary ? '#fbfbfc' : 'transparent',
        color: isPrimary ? '#291e56' : '#fbfbfc',
        borderColor: '#fbfbfc',
        boxShadow: hovered ? `6px 6px 0 #a46cfc` : `4px 4px 0 rgba(164,108,252,0.7)`,
        transform: hovered ? 'translate(-2px, -2px)' : 'translate(0, 0)',
        transition: 'box-shadow 0.18s ease, transform 0.18s ease',
      }}
    >
      {children}
    </button>
  );
}

const COLS = 12;
const ROWS = 16;
const TILE_GAP = 3;
const RIPPLE_RADIUS = 180;
const TILT_MAX = 28;
const LIFT_MAX = 22;
const SCALE_MAX = 1.18;
const SMOOTH = 0.12;

interface Tile {
  col: number;
  row: number;
  rotX: number;
  rotY: number;
  lift: number;
  scale: number;
  brightness: number;
  targetRotX: number;
  targetRotY: number;
  targetLift: number;
  targetScale: number;
  targetBrightness: number;
}

function LusionGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const tilesRef = useRef<Tile[]>([]);
  const rafRef = useRef<number>(0);

  const initTiles = useCallback(() => {
    const tiles: Tile[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        tiles.push({
          col: c, row: r,
          rotX: 0, rotY: 0, lift: 0, scale: 1, brightness: 1,
          targetRotX: 0, targetRotY: 0, targetLift: 0, targetScale: 1, targetBrightness: 1,
        });
      }
    }
    tilesRef.current = tiles;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    initTiles();

    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      const tileW = (W - TILE_GAP * (COLS + 1)) / COLS;
      const tileH = (H - TILE_GAP * (ROWS + 1)) / ROWS;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const active = mouseRef.current.active;

      const tiles = tilesRef.current;

      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const x0 = TILE_GAP + tile.col * (tileW + TILE_GAP);
        const y0 = TILE_GAP + tile.row * (tileH + TILE_GAP);
        const cx = x0 + tileW / 2;
        const cy = y0 + tileH / 2;

        if (active) {
          const dx = cx - mx;
          const dy = cy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const falloff = Math.max(0, 1 - dist / RIPPLE_RADIUS);
          const smooth = falloff * falloff * (3 - 2 * falloff);

          tile.targetRotY = (dx / RIPPLE_RADIUS) * TILT_MAX * smooth * -1;
          tile.targetRotX = (dy / RIPPLE_RADIUS) * TILT_MAX * smooth;
          tile.targetLift = smooth * LIFT_MAX;
          tile.targetScale = 1 + smooth * (SCALE_MAX - 1);
          tile.targetBrightness = 1 + smooth * 0.5;
        } else {
          tile.targetRotX = 0;
          tile.targetRotY = 0;
          tile.targetLift = 0;
          tile.targetScale = 1;
          tile.targetBrightness = 1;
        }

        tile.rotX += (tile.targetRotX - tile.rotX) * SMOOTH;
        tile.rotY += (tile.targetRotY - tile.rotY) * SMOOTH;
        tile.lift += (tile.targetLift - tile.lift) * SMOOTH;
        tile.scale += (tile.targetScale - tile.scale) * SMOOTH;
        tile.brightness += (tile.targetBrightness - tile.brightness) * SMOOTH;

        const scaleX = 1 - Math.abs(tile.rotY) / TILT_MAX * 0.18;
        const scaleY = 1 - Math.abs(tile.rotX) / TILT_MAX * 0.18;
        const shiftY = -tile.lift * (tile.rotX / (TILT_MAX + 0.001)) * 0.15;
        const shiftX = -tile.lift * (tile.rotY / (TILT_MAX + 0.001)) * 0.15;

        const liftFrac = tile.lift / LIFT_MAX;
        const bVal = Math.round(18 + liftFrac * 14);
        const alpha = 0.55 + liftFrac * 0.35;

        ctx.save();
        ctx.translate(cx + shiftX, cy + shiftY);
        ctx.transform(
          tile.scale * scaleX,
          (tile.rotX / TILT_MAX) * 0.06,
          -(tile.rotY / TILT_MAX) * 0.06,
          tile.scale * scaleY,
          0,
          0
        );

        const rw = tileW / 2;
        const rh = tileH / 2;

        const rx = Math.max(2, tileW * 0.06);

        ctx.beginPath();
        ctx.roundRect(-rw, -rh, tileW, tileH, rx);

        const grd = ctx.createLinearGradient(-rw, -rh, rw, rh);
        const purpleFrac = liftFrac * 0.7;
        grd.addColorStop(0, `rgba(${bVal + 8},${bVal},${bVal + 28},${alpha})`);
        grd.addColorStop(0.5, `rgba(${Math.round(bVal * 0.7 + purpleFrac * 80)},${Math.round(bVal * 0.5 + purpleFrac * 30)},${Math.round(bVal + purpleFrac * 100)},${alpha})`);
        grd.addColorStop(1, `rgba(${bVal},${bVal},${bVal + 18},${alpha * 0.85})`);

        ctx.fillStyle = grd;
        ctx.fill();

        if (liftFrac > 0.05) {
          ctx.beginPath();
          ctx.roundRect(-rw, -rh, tileW, tileH, rx);
          const borderAlpha = liftFrac * 0.6;
          ctx.strokeStyle = `rgba(${Math.round(100 + liftFrac * 100)},${Math.round(50 + liftFrac * 80)},${Math.round(200 + liftFrac * 55)},${borderAlpha})`;
          ctx.lineWidth = 0.8 + liftFrac * 0.6;
          ctx.stroke();
        }

        ctx.restore();
      }

      if (active) {
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, RIPPLE_RADIUS * 0.7);
        grd.addColorStop(0, 'rgba(164,108,252,0.06)');
        grd.addColorStop(1, 'rgba(164,108,252,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [initTiles]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

function StrokeWaveText({ children, style }: { children: string; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  const [wavePos, setWavePos] = useState(-1);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const DURATION = 700;

  const startWave = useCallback(() => {
    setHovered(true);
    setWavePos(0);
    cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);
      setWavePos(progress);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const endWave = useCallback(() => {
    setHovered(false);
    cancelAnimationFrame(rafRef.current);
    setWavePos(-1);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const chars = children.split('');
  const totalChars = chars.length;

  return (
    <span
      style={{ display: 'inline-block', cursor: 'default', ...style }}
      onMouseEnter={startWave}
      onMouseLeave={endWave}
    >
      {chars.map((char, i) => {
        if (char === ' ') return <span key={i}>&nbsp;</span>;

        let fillColor = 'transparent';
        let strokeColor = '#ffffff';

        if (wavePos >= 0) {
          const charCenter = (i + 0.5) / totalChars;
          const waveHalfWidth = 0.22;
          const dist = Math.abs(wavePos - charCenter);
          const inWave = dist < waveHalfWidth;

          if (inWave) {
            const t = 1 - dist / waveHalfWidth;
            const smooth = t * t * (3 - 2 * t);
            const r = Math.round(164 * smooth);
            const g = Math.round(108 * smooth);
            const b = Math.round(252 * smooth + 255 * (1 - smooth));
            const alpha = smooth;
            fillColor = `rgba(${r},${g},${b},${alpha})`;
            strokeColor = `rgba(${Math.round(164 + (255 - 164) * (1 - smooth))},${Math.round(108 + (255 - 108) * (1 - smooth))},${Math.round(252)},1)`;
          }
        }

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              WebkitTextStroke: `2px ${strokeColor}`,
              color: fillColor,
              transition: 'color 0.05s, -webkit-text-stroke-color 0.05s',
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}

export function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{ background: '#000' }}
    >
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

      <div
        className="relative z-10 px-6 md:px-12"
        style={{
          paddingTop: 'var(--space-8x)',
          paddingBottom: 'var(--space-8x)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[60vh]">
            <header>
              <motion.h1
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: 0.05 }}
                style={{
                  fontSize: 'clamp(2.8rem, 7vw, 5rem)',
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em',
                  fontFamily: 'var(--font-stack-heading)',
                  color: '#ffffff',
                  marginBottom: 'var(--space-6x)',
                  textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                }}
              >
                From{' '}
                <StrokeWaveText>B2B</StrokeWaveText>{' '}
                to{' '}
                <StrokeWaveText>H2H</StrokeWaveText>
                <br />
                Build a Brand People
                <br />
                Want to Talk To
              </motion.h1>

              <motion.p
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: 0.2 }}
                className="text-xl md:text-2xl"
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.6,
                  maxWidth: '36rem',
                  marginBottom: 'var(--space-6x)',
                  textShadow: '0 1px 10px rgba(0,0,0,0.4)',
                }}
              >
                People don't only want to connect with brands anymore;
                they connect with the people behind them.
              </motion.p>

              <motion.div
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: 0.35 }}
                className="flex flex-wrap gap-4"
              >
                <HeroButton variant="primary" onClick={() => setVideoOpen(true)}>
                  Hear Our Story
                </HeroButton>
                <HeroButton variant="outline" onClick={() => setVideoOpen(true)}>
                  Our Journey
                </HeroButton>
              </motion.div>
            </header>

            <ScrollReveal mode="blur" delay={0.2} className="w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <div
                  className="relative mx-auto w-full h-[340px] sm:h-[480px] md:h-[700px] lg:h-[820px] overflow-hidden"
                  style={{
                    border: "3px solid var(--color-text-dark)",
                    boxShadow: "10px 10px 0 var(--color-surface-dark)",
                    background: "#06020f",
                  }}
                >
                  <LusionGrid />
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <VideoOverlay isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
    </section>
  );
}
