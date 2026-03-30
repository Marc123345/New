import { useRef, useEffect, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OCHRE = '#C8832A';
const TERRACOTTA = '#B5401E';

const STEPS = [
  { num: '01', title: 'From Brand Voice\nto Human Connection', body: 'At H2H we believe the most impactful brands are the ones that know how to connect — not just communicate. People don\'t want perfection. They want personality. They want brands that speak like humans and offer something meaningful.' },
  { num: '02', title: 'We Embed Ourselves\nin Your World', body: 'When you work with H2H, you get more than an agency. You get a partner — a flexible, responsive extension of your team. We adapt to your rhythm, align with your goals, and help you scale with clarity and purpose.' },
  { num: '03', title: 'Strategy First.\nAlways.', body: 'Every piece of content, every campaign, every decision is rooted in data, insight, and intent. We combine strategy, creativity, and cultural fluency to build brands that people actually care about.' },
  { num: '04', title: 'Creatives Who\nStop the Scroll', body: 'Ideas that stop the scroll. We craft visuals, copy, and experiences that feel native to each platform — because generic doesn\'t cut it. Your brand deserves content that makes people pause.' },
  { num: '05', title: 'Building Brand Ecosystems\nThat Actually Work', body: 'We don\'t just manage your social media. We build the entire ecosystem — content strategy, community management, paid amplification, creative production, and performance analytics. Everything connected. Everything measured. Everything human.' },
];

const AfricanShapes = memo(function AfricanShapes({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <svg className="absolute pointer-events-none select-none" style={{ opacity: 0.035, ...style }} viewBox="0 0 800 800" fill="none">
      <circle cx="400" cy="400" r="380" stroke={OCHRE} strokeWidth="1" />
      <circle cx="400" cy="400" r="280" stroke={TERRACOTTA} strokeWidth="0.8" />
      <circle cx="400" cy="400" r="180" stroke={OCHRE} strokeWidth="0.6" />
      <rect x="280" y="280" width="240" height="240" stroke={OCHRE} strokeWidth="0.8" transform="rotate(45 400 400)" />
      <path d="M400 200 A200 200 0 0 1 600 400" stroke={TERRACOTTA} strokeWidth="0.6" fill="none" />
      <path d="M400 600 A200 200 0 0 1 200 400" stroke={TERRACOTTA} strokeWidth="0.6" fill="none" />
    </svg>
  );
});

/* Lighter purple for headings — high contrast on dark bg */
const HEADING_COLOR = '#c9b3ff';

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // 1 scrubbed instance — progress line (no blur, just opacity)
      if (lineGlowRef.current) {
        gsap.to(lineGlowRef.current, {
          scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: true },
        });
      }

      // 5 one-shot instances — pure CSS class toggles, zero GSAP tweens
      gsap.utils.toArray<HTMLElement>('.about-step').forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 55%',
          once: true,
          onEnter: () => step.classList.add('is-visible'),
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} id="about" style={{ position: 'relative', background: 'var(--color-background-light)' }}>

      {/* Subtle background image */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'url(https://ik.imagekit.io/qcvroy8xpd/download.jpeg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: 0.04, mixBlendMode: 'luminosity',
      }} />

      {/* Progress line — no blur, just solid color */}
      <div style={{ position: 'absolute', top: 0, left: 'clamp(20px, 4vw, 56px)', bottom: 0, width: 1, zIndex: 1 }}>
        <div style={{ width: '100%', height: '100%', position: 'absolute', background: 'var(--color-secondary)', opacity: 0.1 }} />
        <div ref={lineGlowRef} style={{
          width: 2, height: '100%', position: 'absolute', left: -0.5,
          background: 'var(--color-secondary)', opacity: 0.6,
          transformOrigin: 'top center', transform: 'scaleY(0)',
        }} />
      </div>

      {/* Section heading */}
      <div style={{ paddingTop: 'clamp(100px, 14vw, 180px)', paddingBottom: 'clamp(120px, 16vw, 220px)', paddingLeft: 'clamp(60px, 8vw, 120px)', paddingRight: 'var(--space-4x)', position: 'relative', zIndex: 2 }}>
        <AfricanShapes style={{ position: 'absolute', top: '-10%', right: '-8%', width: '500px', height: '500px' }} />
        <span style={{ fontFamily: 'var(--font-stack-heading)', fontSize: '0.8125em', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', color: OCHRE }}>
          About Us
        </span>
      </div>

      {/* Steps */}
      {STEPS.map((step, si) => (
        <div key={step.num} className="about-step" style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2,
          paddingLeft: 'clamp(60px, 8vw, 120px)', paddingRight: 'var(--space-4x)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 13fr', gap: 'var(--space-2x)', alignItems: 'start' }}>
            {/* Index */}
            <div className="about-step-index" style={{ display: 'flex', alignItems: 'center', gap: '1em', paddingRight: '25%', transform: 'translateY(-50%)' }}>
              <div style={{ flex: 1, height: 1, position: 'relative' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--color-secondary)', opacity: 0.1 }} />
                <div className="index-glow" />
              </div>
              <span className="index-num">{step.num}</span>
            </div>

            {/* Title — pure CSS animation */}
            <div style={{ paddingRight: '20%' }}>
              <h3 className="about-step-heading" style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 'bold', lineHeight: 0.9, textTransform: 'uppercase',
                color: HEADING_COLOR,
              }}>
                {step.title.split('\n').map((line, i) => (
                  <div key={i} style={{ overflow: 'clip', display: 'block' }}>
                    <div className="text-line" style={{ transitionDelay: `${i * 0.12}s` }}>{line}</div>
                  </div>
                ))}
              </h3>
            </div>
          </div>

          {/* Body */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2x)', flex: 1, paddingTop: 'var(--space-8x)', paddingBottom: 'clamp(80px, 12vw, 160px)' }}>
            <div />
            <p className="about-step-body" style={{
              fontFamily: 'var(--font-stack-body)',
              fontSize: 'clamp(1rem, 1.4vw, 1.4em)',
              fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.15,
              color: 'var(--color-text-dark)', paddingRight: '35%',
            }}>
              {step.body}
            </p>
          </div>
        </div>
      ))}

      {/* Closing */}
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingLeft: 'clamp(60px, 8vw, 120px)', paddingRight: 'var(--space-4x)', position: 'relative', zIndex: 2,
      }}>
        <AfricanShapes style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '600px', height: '600px' }} />
        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
          <h3 style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 'bold', lineHeight: 0.9, textTransform: 'uppercase',
            color: HEADING_COLOR,
          }}>
            Social-first.<br />Human-always.
          </h3>
          <p style={{
            fontFamily: 'var(--font-stack-body)',
            fontSize: 'clamp(0.9rem, 1.1vw, 1.125em)',
            lineHeight: 1.25, color: 'var(--color-text-dark)', opacity: 0.7,
            marginTop: 'var(--space-4x)',
          }}>
            We don't just deliver content — we embed ourselves in your world. H2H is a social-first agency built to help brands grow through authentic human connection.
          </p>
        </div>
      </div>

      {/* All animations via CSS — zero GSAP tweens */}
      <style>{`
        .index-glow {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: var(--color-secondary); opacity: 0.6;
          transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease;
        }
        .index-num {
          font-family: var(--font-stack-heading); font-size: 0.8125em; font-weight: 500;
          letter-spacing: 0.04em; text-transform: uppercase;
          color: var(--color-text-dark); opacity: 0.4; transition: opacity 0.4s ease;
        }
        .text-line {
          display: block; transform: translateY(110%);
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .about-step-body {
          opacity: 0; transform: translateY(16px);
          transition: opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s;
        }

        /* Triggered by ScrollTrigger adding .is-visible */
        .about-step.is-visible .index-glow { transform: scaleX(1); }
        .about-step.is-visible .index-num { opacity: 1; }
        .about-step.is-visible .text-line { transform: translateY(0); }
        .about-step.is-visible .about-step-body { opacity: 1; transform: translateY(0); }

        @media (prefers-reduced-motion: reduce) {
          .text-line, .about-step-body { transform: none !important; opacity: 1 !important; transition: none !important; }
          .index-glow { transform: scaleX(1) !important; transition: none !important; }
          .index-num { opacity: 1 !important; }
        }
      `}</style>
    </div>
  );
}
