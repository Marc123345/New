import { useRef, useEffect, useCallback, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OCHRE = '#C8832A';
const TERRACOTTA = '#B5401E';
const EARTH = '#7A4E2D';

const AfricanShapes = memo(function AfricanShapes({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <svg className="absolute pointer-events-none select-none" style={{ opacity: 0.04, ...style }} viewBox="0 0 800 800" fill="none">
      <circle cx="400" cy="400" r="380" stroke={OCHRE} strokeWidth="1" />
      <circle cx="400" cy="400" r="300" stroke={TERRACOTTA} strokeWidth="0.8" />
      <circle cx="400" cy="400" r="220" stroke={OCHRE} strokeWidth="0.6" />
      <rect x="280" y="280" width="240" height="240" stroke={OCHRE} strokeWidth="0.8" transform="rotate(45 400 400)" />
      <line x1="40" y1="400" x2="760" y2="400" stroke={EARTH} strokeWidth="0.4" />
      <line x1="400" y1="40" x2="400" y2="760" stroke={EARTH} strokeWidth="0.4" />
      <path d="M400 200 A200 200 0 0 1 600 400" stroke={TERRACOTTA} strokeWidth="0.6" fill="none" />
      <path d="M400 600 A200 200 0 0 1 200 400" stroke={TERRACOTTA} strokeWidth="0.6" fill="none" />
    </svg>
  );
});

/* ════════════════════════════════════════════════════════════════════════════
   ABOUT SECTION — IWC curtain stacking (optimized, smooth)

   Architecture:
   - Wrapper has explicit height = numPanels * 100vh
   - All panels are position:sticky, top:0 so they naturally stack
   - No GSAP pinning needed — CSS sticky handles it natively (no DOM cloning)
   - GSAP only handles the curtain clip-path + content reveals
   - Single scrub per panel = fewer ScrollTrigger instances
   - GPU-accelerated: clip-path inset on composited layers
   ════════════════════════════════════════════════════════════════════════════ */

const PANEL_COUNT = 5;

export function AboutSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (watermarkRef.current) {
        const x = (e.clientX - window.innerWidth / 2) * 0.012;
        const y = (e.clientY - window.innerHeight / 2) * 0.012;
        watermarkRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    });
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const mq = window.matchMedia('(pointer: fine)');
    if (mq.matches) {
      wrapper.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('.curtain-panel');

      panels.forEach((panel, i) => {
        const inner = panel.querySelector<HTMLElement>('.curtain-inner');
        const content = panel.querySelector<HTMLElement>('.curtain-content');

        if (i > 0 && inner) {
          // Curtain reveal — clip from bottom to full
          // Using clip-path inset which is GPU composited
          gsap.set(inner, { clipPath: 'inset(100% 0% 0% 0%)' });

          gsap.to(inner, {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'top top',
              scrub: true, // true = native smooth, no lerp overhead
            },
          });
        }

        // Content fade — fires once after reveal
        if (content) {
          gsap.set(content, { opacity: 0, y: 40 });

          ScrollTrigger.create({
            trigger: panel,
            start: i === 0 ? 'top 70%' : 'top 15%',
            onEnter: () => {
              gsap.to(content, {
                opacity: 1,
                y: 0,
                duration: 0.9,
                ease: 'power3.out',
              });
            },
            once: true,
          });
        }
      });
    }, wrapper);

    return () => {
      ctx.revert();
      wrapper.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  /* Shared panel style — position:sticky does the stacking natively */
  const panelStyle = (z: number): React.CSSProperties => ({
    position: 'sticky',
    top: 0,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    zIndex: z,
  });

  return (
    <div
      ref={wrapperRef}
      id="about"
      style={{
        background: 'var(--color-background-light)',
        position: 'relative',
      }}
    >

      {/* ══════ PANEL 1 — INTRO ══════ */}
      <div className="curtain-panel" style={panelStyle(1)}>
        <div className="curtain-inner absolute inset-0 overflow-hidden" style={{ background: 'var(--color-background-light)' }}>
          <div className="curtain-shapes" ref={watermarkRef} style={{ position: 'absolute', top: '-15%', right: '-10%', width: '600px', height: '600px' }}>
            <AfricanShapes style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="curtain-content container relative z-10 flex items-center min-h-screen" style={{ paddingTop: 'clamp(120px, 14vw, 180px)', paddingBottom: 'var(--space-8x)' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-stack-heading)', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: OCHRE, marginBottom: 'var(--space-4x)' }}>
                About Us
              </div>
              <h1 style={{ maxWidth: '800px' }}>From Brand Voice<br />to Human Connection</h1>
              <p style={{ maxWidth: '600px', fontSize: '1.2rem', color: 'rgba(232,226,255,0.7)', lineHeight: 1.65 }}>
                At H2H we believe the most impactful brands are the ones that know how to connect — not just communicate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ PANEL 2 — BELIEF ══════ */}
      <div className="curtain-panel" style={panelStyle(2)}>
        <div className="curtain-inner absolute inset-0 overflow-hidden" style={{ background: 'var(--color-background-light)' }}>
          <div className="curtain-shapes" style={{ position: 'absolute', top: '10%', left: '-12%', width: '400px', height: '400px' }}>
            <AfricanShapes style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="curtain-content container relative z-10 flex items-center min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-12 w-full" style={{ gap: 'var(--space-8x)' }}>
              <div className="lg:col-span-4">
                <span style={{ fontFamily: 'var(--font-stack-heading)', fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: OCHRE }}>Our Belief</span>
              </div>
              <div className="lg:col-span-8">
                <p style={{ fontSize: '1.3rem', lineHeight: 1.7 }}>
                  People don't want perfection. They want personality. They want to see and hear brands that speak like humans and offer something meaningful.
                </p>
                <p style={{ fontSize: '1.1rem', color: 'rgba(232,226,255,0.6)', lineHeight: 1.7 }}>
                  <strong style={{ color: 'var(--color-text-dark)' }}>H2H is a social-first agency</strong> built to help brands grow by making their digital presence feel more human — thoughtful, strategic, and real.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ PANEL 3 — QUOTE + WHY ══════ */}
      <div className="curtain-panel" style={panelStyle(3)}>
        <div className="curtain-inner absolute inset-0 overflow-hidden" style={{ background: 'var(--color-background-light)' }}>
          <div className="curtain-shapes" style={{ position: 'absolute', bottom: '-20%', right: '-8%', width: '500px', height: '500px' }}>
            <AfricanShapes style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="curtain-content container relative z-10 flex items-center min-h-screen" style={{ maxWidth: '900px' }}>
            <div>
              <blockquote style={{ borderLeft: `4px solid ${TERRACOTTA}`, paddingLeft: 'var(--space-4x)', margin: '0 0 var(--space-8x) 0', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-40px', left: '-12px', fontFamily: 'var(--font-stack-heading)', fontSize: 'clamp(5rem, 14vw, 12rem)', lineHeight: 1, color: TERRACOTTA, opacity: 0.1, pointerEvents: 'none', userSelect: 'none' }}>&ldquo;</span>
                <p style={{ fontStyle: 'italic', fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', lineHeight: 1.35, margin: 0, fontFamily: 'var(--font-stack-heading)', letterSpacing: '-0.01em' }}>
                  We don't just deliver content — we embed ourselves in your world.
                </p>
              </blockquote>
              <h2>Why H2H?</h2>
              <p style={{ maxWidth: '700px', color: 'rgba(232,226,255,0.7)', fontSize: '1.1rem', lineHeight: 1.7 }}>
                When you work with H2H, you get more than an agency. You get a partner — a flexible, responsive extension of your team. We adapt to your rhythm, align with your goals, and help you scale with clarity and purpose.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════ PANEL 4 — VALUE CARDS ══════ */}
      <div className="curtain-panel" style={panelStyle(4)}>
        <div className="curtain-inner absolute inset-0 overflow-hidden" style={{ background: 'var(--color-background-light)' }}>
          <div className="curtain-shapes" style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '700px' }}>
            <AfricanShapes style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="curtain-content container relative z-10 flex items-center min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-3 w-full" style={{ gap: 'var(--space-4x)' }}>
              {[
                { num: '01', title: 'Strategists', body: 'Every decision is rooted in data, insight, and intent. Strategy first, always.' },
                { num: '02', title: 'Creatives', body: 'Ideas that stop the scroll. Visuals and copy that feel native to each platform.' },
                { num: '03', title: 'Storytellers', body: "Brands are stories. We tell yours — consistent, compelling, and unmistakably human." },
              ].map((card) => (
                <div key={card.num} className="relative flex flex-col" style={{ background: 'var(--color-primary)', border: '1px solid rgba(164,108,252,0.12)', padding: 'var(--space-4x)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-geometric-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${OCHRE}, ${TERRACOTTA})` }} />
                  <span style={{ position: 'absolute', top: 'var(--space-2x)', right: 'var(--space-2x)', fontFamily: 'var(--font-stack-heading)', fontSize: 'clamp(3rem, 8vw, 5rem)', lineHeight: 1, color: 'rgba(164,108,252,0.06)', fontWeight: 'bold' }}>{card.num}</span>
                  <span style={{ fontFamily: 'var(--font-stack-heading)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: OCHRE, marginBottom: 'var(--space-2x)' }}>{card.num}</span>
                  <h3 style={{ marginBottom: 'var(--space-2x)' }}>{card.title}</h3>
                  <p style={{ color: 'rgba(232,226,255,0.6)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════ PANEL 5 — MANIFESTO ══════ */}
      <div className="curtain-panel" style={panelStyle(5)}>
        <div className="curtain-inner absolute inset-0 overflow-hidden" style={{ background: 'var(--color-background-light)' }}>
          <div className="curtain-shapes" style={{ position: 'absolute', top: '-25%', right: '-15%', width: '500px', height: '500px' }}>
            <AfricanShapes style={{ width: '100%', height: '100%' }} />
          </div>
          <div className="curtain-content container relative z-10 flex items-center min-h-screen">
            <div className="w-full">
              <div className="relative overflow-hidden" style={{ background: 'var(--color-primary)', border: '1px solid rgba(164,108,252,0.1)', padding: 'clamp(48px, 8vw, 96px)' }}>
                <AfricanShapes style={{ position: 'absolute', top: '-25%', right: '-15%', width: '500px', height: '500px' }} />
                <div className="relative z-10" style={{ maxWidth: '680px' }}>
                  <h2>Building brand ecosystems that actually work.</h2>
                  <p style={{ color: 'rgba(232,226,255,0.65)', fontSize: '1.1rem', lineHeight: 1.7 }}>
                    We don't just manage your social media. We build the entire ecosystem — content strategy, community management, paid amplification, creative production, and performance analytics. Everything connected. Everything measured. Everything human.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 text-center" style={{ marginTop: 'var(--space-8x)' }}>
                <span style={{ fontFamily: 'var(--font-stack-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--color-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 'bold' }}>H2H</span>
                <p style={{ fontFamily: 'var(--font-stack-heading)', fontSize: '0.85rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(232,226,255,0.4)', margin: 0 }}>Social-first. Human-always.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
