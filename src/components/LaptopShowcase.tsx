import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';


/* ── Simulated website pages that scroll inside the laptop screen ── */
const SHOWCASE_PAGES = [
  {
    id: 'hero',
    render: () => (
      <div style={{ minHeight: 420, background: 'linear-gradient(165deg, #0e0820 0%, #1a1040 50%, #291e56 100%)', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '60px 32px', position: 'relative' as const, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(164,108,252,0.3) 0%, transparent 70%)', transform: 'translateX(-50%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase' as const, color: '#a46cfc', marginBottom: 16, fontWeight: 700 }}>Your Digital Home</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', textAlign: 'center' as const, lineHeight: 1.05, letterSpacing: '-0.03em', maxWidth: 400 }}>
          Websites That<br />
          <span style={{ background: 'linear-gradient(135deg, #a46cfc, #7B2FF2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Work Harder.</span>
        </div>
        <div style={{ marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.55)', textAlign: 'center' as const, maxWidth: 320, lineHeight: 1.7 }}>
          Built for engagement. Optimised for search. Designed to convert visitors into conversations.
        </div>
        <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
          <div style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #a46cfc, #7B2FF2)', borderRadius: 6, fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Get Started</div>
          <div style={{ padding: '10px 24px', border: '1px solid rgba(164,108,252,0.4)', borderRadius: 6, fontSize: 10, fontWeight: 700, color: '#a46cfc', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Learn More</div>
        </div>
      </div>
    ),
  },
  {
    id: 'blog-grid',
    render: () => (
      <div style={{ padding: '40px 24px', background: '#0c0618' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#a46cfc', marginBottom: 6, fontWeight: 700 }}>Content Hub</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-0.02em' }}>Latest Insights</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { tag: 'Strategy', title: 'Why B2B Brands Need Human Stories', img: 'linear-gradient(135deg, #1a1040, #3b2470)' },
            { tag: 'LinkedIn', title: 'Employee Advocacy: The Untapped Channel', img: 'linear-gradient(135deg, #291e56, #4a2d8a)' },
            { tag: 'Leadership', title: 'Building Thought Leadership That Lasts', img: 'linear-gradient(135deg, #0e0820, #291e56)' },
            { tag: 'Content', title: 'The Content Hub Framework', img: 'linear-gradient(135deg, #1a1040, #0e0820)' },
          ].map((post) => (
            <div key={post.title} style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(164,108,252,0.15)', background: '#0e0a1f' }}>
              <div style={{ height: 80, background: post.img, position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: 6, left: 8, fontSize: 7, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#a46cfc', fontWeight: 700, padding: '2px 6px', background: 'rgba(10,6,18,0.8)', borderRadius: 3 }}>{post.tag}</div>
              </div>
              <div style={{ padding: '10px 10px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>{post.title}</div>
                <div style={{ marginTop: 6, fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>Read more →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'services',
    render: () => (
      <div style={{ padding: '40px 24px', background: 'linear-gradient(180deg, #0c0618 0%, #0e0820 100%)' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#a46cfc', marginBottom: 6, fontWeight: 700 }}>What We Build</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-0.02em' }}>Full-Stack Digital</div>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
          {[
            { icon: '🌐', title: 'Website Design', desc: 'Responsive, fast, SEO-optimised' },
            { icon: '✍️', title: 'Content Strategy', desc: 'Blogs, whitepapers, video scripts' },
            { icon: '📊', title: 'Analytics & SEO', desc: 'Data-driven optimisation' },
            { icon: '🎥', title: 'Video Production', desc: 'Brand films, interviews, reels' },
          ].map((s) => (
            <div key={s.title} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(164,108,252,0.12)', background: 'rgba(26,16,64,0.3)' }}>
              <div style={{ fontSize: 18, width: 36, height: 36, borderRadius: 8, background: 'rgba(164,108,252,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{s.title}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'stats',
    render: () => (
      <div style={{ padding: '40px 24px 60px', background: '#0e0820' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#a46cfc', marginBottom: 6, fontWeight: 700 }}>Impact</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-0.02em' }}>Built to Perform</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { val: '95+', label: 'SEO Score' },
            { val: '<2s', label: 'Load Time' },
            { val: '3.2x', label: 'Engagement' },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: 'center' as const, padding: '16px 8px', borderRadius: 8, border: '1px solid rgba(164,108,252,0.2)', background: 'rgba(26,16,64,0.2)' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#a46cfc', letterSpacing: '-0.02em' }}>{s.val}</div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, textAlign: 'center' as const }}>
          <div style={{ display: 'inline-block', padding: '12px 32px', background: 'linear-gradient(135deg, #a46cfc, #7B2FF2)', borderRadius: 8, fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '0.15em', textTransform: 'uppercase' as const, boxShadow: '0 8px 32px rgba(164,108,252,0.35)' }}>
            Start Your Project
          </div>
        </div>
      </div>
    ),
  },
];

interface LaptopShowcaseProps {
  open: boolean;
  onClose: () => void;
}

export const LaptopShowcase = memo(function LaptopShowcase({ open, onClose }: LaptopShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const scrollAnimRef = useRef(0);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Device orientation tilt for mobile (gyroscope)
  useEffect(() => {
    if (!open) return;
    const onOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0; // left-right tilt (-90 to 90)
      const beta = e.beta ?? 0;   // front-back tilt (-180 to 180)
      setTilt({
        x: Math.max(-6, Math.min(6, (beta - 45) * 0.15)),
        y: Math.max(-8, Math.min(8, gamma * 0.2)),
      });
    };
    window.addEventListener('deviceorientation', onOrientation, { passive: true });
    return () => window.removeEventListener('deviceorientation', onOrientation);
  }, [open]);

  // Mouse-follow 3D tilt for desktop
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = laptopRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const px = (e.clientX - cx) / (rect.width / 2);
    const py = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: py * -4, y: px * 6 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  // Auto-scroll the website content inside the laptop.
  // Stops permanently on first user touch so it never fights manual scrolling.
  const autoScrollStopped = useRef(false);

  useEffect(() => {
    if (!open) { autoScrollStopped.current = false; return; }
    const el = scrollRef.current;
    if (!el) return;

    // Stop auto-scroll permanently on any touch/mouse interaction
    const stopForever = () => {
      autoScrollStopped.current = true;
      cancelAnimationFrame(scrollAnimRef.current);
    };
    el.addEventListener('touchstart', stopForever, { passive: true, once: true });
    el.addEventListener('mousedown', stopForever, { once: true });
    el.addEventListener('wheel', stopForever, { passive: true, once: true });

    const startDelay = setTimeout(() => {
      if (autoScrollStopped.current) return;
      let scrollPos = 0;
      const speed = 0.4;

      const tick = () => {
        if (autoScrollStopped.current) return;
        scrollPos += speed;
        const maxScroll = el.scrollHeight - el.clientHeight;
        if (scrollPos >= maxScroll) return; // stop at bottom
        el.scrollTop = scrollPos;
        scrollAnimRef.current = requestAnimationFrame(tick);
      };
      scrollAnimRef.current = requestAnimationFrame(tick);
    }, 800);

    return () => {
      clearTimeout(startDelay);
      cancelAnimationFrame(scrollAnimRef.current);
      el.removeEventListener('touchstart', stopForever);
      el.removeEventListener('mousedown', stopForever);
      el.removeEventListener('wheel', stopForever);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="laptop-showcase-overlay"
          onClick={onClose}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          role="dialog"
          aria-modal="true"
          aria-label="Website & Content Hub Showcase"
        >
          {/* Close button */}
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="laptop-showcase-close"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <X size={20} />
          </motion.button>

          {/* Label */}
          <motion.div
            className="laptop-showcase-label"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <span className="laptop-showcase-label__tag">Website / Digital Content Hub</span>
            <span className="laptop-showcase-label__sub">This is what we build for you</span>
          </motion.div>

          {/* Laptop */}
          <motion.div
            ref={laptopRef}
            className="laptop-showcase-device"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.7, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.85, rotateX: 10 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            {/* Screen bezel */}
            <div className="laptop-screen">
              {/* Camera notch */}
              <div className="laptop-camera">
                <div className="laptop-camera__dot" />
              </div>

              {/* Website content — auto-scrolling */}
              <div
                ref={scrollRef}
                className="laptop-content"
              >
                {SHOWCASE_PAGES.map((page) => (
                  <div key={page.id}>{page.render()}</div>
                ))}
              </div>

              {/* Screen reflection overlay */}
              <div className="laptop-screen__reflection" />

              {/* Scan line effect */}
              <div className="laptop-screen__scanlines" />
            </div>

            {/* Keyboard base */}
            <div className="laptop-base">
              <div className="laptop-base__trackpad" />
              {/* Keyboard rows */}
              <div className="laptop-base__keys">
                {Array.from({ length: 4 }).map((_, row) => (
                  <div key={row} className="laptop-base__key-row">
                    {Array.from({ length: row === 3 ? 8 : 12 }).map((_, col) => (
                      <div
                        key={col}
                        className="laptop-base__key"
                        style={{ width: row === 3 && col === 4 ? 32 : undefined }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Reflection under laptop */}
          <motion.div
            className="laptop-showcase-reflection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          />

          <style>{`
            .laptop-showcase-overlay {
              position: fixed;
              inset: 0;
              z-index: 10000;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: rgba(6, 3, 18, 0.96);
              cursor: pointer;
              overflow: hidden;
              padding: 16px;
            }
            @media (min-width: 769px) {
              .laptop-showcase-overlay {
                background: rgba(6, 3, 18, 0.92);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
              }
            }

            .laptop-showcase-close {
              position: absolute;
              top: clamp(12px, 3vw, 24px);
              right: clamp(12px, 3vw, 24px);
              z-index: 10;
              width: 48px;
              height: 48px;
              border-radius: 50%;
              border: 1.5px solid rgba(255,255,255,0.2);
              background: rgba(255,255,255,0.06);
              color: #fff;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: background 0.2s, transform 0.3s;
            }
            .laptop-showcase-close:hover {
              background: rgba(255,255,255,0.15);
              transform: rotate(90deg);
            }

            .laptop-showcase-label {
              position: absolute;
              top: clamp(12px, 3vw, 28px);
              left: 50%;
              transform: translateX(-50%);
              z-index: 10;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 6px;
              pointer-events: none;
            }
            .laptop-showcase-label__tag {
              font-family: var(--font-stack-heading);
              font-size: clamp(0.55rem, 1.2vw, 0.7rem);
              font-weight: 800;
              letter-spacing: 0.25em;
              text-transform: uppercase;
              color: var(--color-secondary, #a46cfc);
              padding: 6px 16px;
              border: 1px solid rgba(164,108,252,0.4);
              background: rgba(41,30,86,0.4);
              border-radius: 999px;
              backdrop-filter: blur(8px);
              white-space: nowrap;
            }
            .laptop-showcase-label__sub {
              font-family: var(--font-stack-body);
              font-size: clamp(0.6rem, 1vw, 0.75rem);
              color: rgba(255,255,255,0.45);
              letter-spacing: 0.05em;
            }

            /* ── Laptop Device ── */
            .laptop-showcase-device {
              position: relative;
              cursor: default;
              will-change: transform;
              z-index: 5;
              flex-shrink: 0;
              max-width: 90vw;
              max-height: 70vh;
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            .laptop-screen {
              position: relative;
              width: clamp(280px, 80vw, 720px);
              aspect-ratio: 16 / 10;
              background: #0a0612;
              border-radius: clamp(8px, 1.2vw, 14px) clamp(8px, 1.2vw, 14px) 0 0;
              border: clamp(6px, 0.8vw, 10px) solid #2d2d35;
              border-bottom: clamp(3px, 0.4vw, 5px) solid #2d2d35;
              overflow: hidden;
              box-shadow:
                0 0 0 1px rgba(255,255,255,0.06),
                0 -1px 0 rgba(255,255,255,0.04) inset,
                0 30px 80px rgba(0,0,0,0.7),
                0 0 120px rgba(164,108,252,0.12);
            }

            .laptop-camera {
              position: absolute;
              top: 0;
              left: 50%;
              transform: translateX(-50%);
              z-index: 20;
              width: clamp(50px, 8vw, 80px);
              height: clamp(12px, 1.5vw, 18px);
              background: #2d2d35;
              border-radius: 0 0 8px 8px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .laptop-camera__dot {
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background: #4a4a58;
              box-shadow: 0 0 4px rgba(164,108,252,0.3);
            }

            .laptop-content {
              position: absolute;
              inset: 0;
              overflow-y: auto;
              overflow-x: hidden;
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            .laptop-content::-webkit-scrollbar { display: none; }

            .laptop-screen__reflection {
              position: absolute;
              inset: 0;
              pointer-events: none;
              z-index: 15;
              background: linear-gradient(
                115deg,
                transparent 0%,
                transparent 40%,
                rgba(255,255,255,0.03) 42%,
                rgba(255,255,255,0.06) 44%,
                rgba(255,255,255,0.03) 46%,
                transparent 48%,
                transparent 100%
              );
            }

            .laptop-screen__scanlines {
              position: absolute;
              inset: 0;
              pointer-events: none;
              z-index: 14;
              background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.03) 2px,
                rgba(0,0,0,0.03) 4px
              );
            }

            /* ── Keyboard Base ── */
            .laptop-base {
              position: relative;
              width: calc(100% + clamp(16px, 2vw, 30px));
              margin-left: calc(clamp(-8px, -1vw, -15px));
              height: clamp(40px, 7vw, 80px);
              background: linear-gradient(180deg, #35353e 0%, #2a2a32 100%);
              border-radius: 0 0 clamp(4px, 0.5vw, 6px) clamp(4px, 0.5vw, 6px);
              border: 1px solid rgba(255,255,255,0.08);
              border-top: 1px solid rgba(255,255,255,0.14);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: clamp(2px, 0.3vw, 3px);
              padding: clamp(4px, 0.6vw, 8px) clamp(12px, 2vw, 24px);
              box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            }

            .laptop-base__keys {
              display: flex;
              flex-direction: column;
              gap: clamp(1px, 0.2vw, 2px);
              width: 100%;
            }
            .laptop-base__key-row {
              display: flex;
              gap: clamp(1px, 0.15vw, 2px);
              justify-content: center;
            }
            .laptop-base__key {
              width: clamp(10px, 1.8vw, 22px);
              height: clamp(6px, 1vw, 12px);
              background: rgba(0,0,0,0.25);
              border-radius: 2px;
              border: 0.5px solid rgba(255,255,255,0.08);
            }

            .laptop-base__trackpad {
              position: absolute;
              bottom: clamp(4px, 0.8vw, 10px);
              left: 50%;
              transform: translateX(-50%);
              width: clamp(50px, 10vw, 120px);
              height: clamp(6px, 1vw, 10px);
              background: rgba(0,0,0,0.2);
              border-radius: 3px;
              border: 0.5px solid rgba(255,255,255,0.1);
            }

            /* ── Reflection under laptop ── */
            .laptop-showcase-reflection {
              position: relative;
              z-index: 4;
              width: clamp(240px, 75vw, 640px);
              height: clamp(20px, 3vw, 40px);
              background: radial-gradient(ellipse at center, rgba(164,108,252,0.15) 0%, transparent 70%);
              filter: blur(10px);
              margin-top: -6px;
              pointer-events: none;
              flex-shrink: 0;
            }

          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
