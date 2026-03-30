import { useRef, useEffect, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── African accent colors ── */
const OCHRE = '#C8832A';
const TERRACOTTA = '#B5401E';

/* ── Step data ── */
const STEPS = [
  {
    num: '01',
    title: 'From Brand Voice\nto Human Connection',
    body: 'At H2H we believe the most impactful brands are the ones that know how to connect — not just communicate. People don\'t want perfection. They want personality. They want brands that speak like humans and offer something meaningful.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80&fit=crop',
  },
  {
    num: '02',
    title: 'We Embed Ourselves\nin Your World',
    body: 'When you work with H2H, you get more than an agency. You get a partner — a flexible, responsive extension of your team. We adapt to your rhythm, align with your goals, and help you scale with clarity and purpose.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&fit=crop',
  },
  {
    num: '03',
    title: 'Strategy First.\nAlways.',
    body: 'Every piece of content, every campaign, every decision is rooted in data, insight, and intent. We combine strategy, creativity, and cultural fluency to build brands that people actually care about.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80&fit=crop',
  },
  {
    num: '04',
    title: 'Creatives Who\nStop the Scroll',
    body: 'Ideas that stop the scroll. We craft visuals, copy, and experiences that feel native to each platform — because generic doesn\'t cut it. Your brand deserves content that makes people pause.',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80&fit=crop',
  },
  {
    num: '05',
    title: 'Building Brand Ecosystems\nThat Actually Work',
    body: 'We don\'t just manage your social media. We build the entire ecosystem — content strategy, community management, paid amplification, creative production, and performance analytics. Everything connected. Everything measured. Everything human.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80&fit=crop',
  },
];

/* ── Memoized Adinkra shapes ── */
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

/* ════════════════════════════════════════════════════════════════════════════
   ABOUT SECTION — Scrollytelling with fixed crossfading images,
   glowing progress line, numbered steps, text-reveal animations.
   Inspired by 3200kelvin / IWC services pattern.
   ════════════════════════════════════════════════════════════════════════════ */

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('.about-step');
      const images = gsap.utils.toArray<HTMLElement>('.about-bg-image');

      /* ── Glowing progress line — scales with scroll ── */
      if (lineGlowRef.current) {
        gsap.to(lineGlowRef.current, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });
      }

      /* ── Background images — crossfade on step entry ── */
      images.forEach((img, i) => {
        if (i === 0) {
          gsap.set(img, { opacity: 1, scale: 1 });
        } else {
          gsap.set(img, { opacity: 0, scale: 1.1 });
        }
      });

      steps.forEach((step, i) => {
        const heading = step.querySelector('.about-step-heading');
        const body = step.querySelector('.about-step-body');
        const index = step.querySelector('.about-step-index');

        // Image crossfade — tied to each step
        if (i > 0 && images[i]) {
          // Fade out previous
          gsap.to(images[i - 1], {
            opacity: 0,
            scale: 0.95,
            filter: 'blur(6px)',
            ease: 'none',
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
              end: 'top 40%',
              scrub: true,
            },
          });
          // Fade in current
          gsap.to(images[i], {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
              end: 'top 40%',
              scrub: true,
            },
          });
        }

        // Index number — glow line appears
        if (index) {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 60%',
            onEnter: () => index.classList.add('appeared'),
            once: true,
          });
        }

        // Heading — line-by-line reveal with clip masks
        if (heading) {
          const lines = heading.querySelectorAll('.text-line');
          lines.forEach((line, li) => {
            gsap.fromTo(line,
              { yPercent: 100, rotate: 2 },
              {
                yPercent: 0,
                rotate: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: step,
                  start: 'top 55%',
                  toggleActions: 'play none none none',
                },
                delay: li * 0.15,
              }
            );
          });
        }

        // Body — word-by-word unblur
        if (body) {
          const words = body.querySelectorAll('.text-word');
          words.forEach((word, wi) => {
            gsap.fromTo(word,
              { opacity: 0, filter: 'blur(4px)' },
              {
                opacity: 0.8,
                filter: 'blur(0px)',
                duration: 0.4,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: step,
                  start: 'top 45%',
                  toggleActions: 'play none none none',
                },
                delay: wi * 0.008,
              }
            );
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  /* Split text into words for animation */
  const splitWords = (text: string) =>
    text.split(' ').map((word, i) => (
      <span key={i} className="text-word inline-block" style={{ opacity: 0, willChange: 'opacity, filter' }}>
        {word}&nbsp;
      </span>
    ));

  /* Split title into lines for clip-mask reveal */
  const splitLines = (text: string) =>
    text.split('\n').map((line, i) => (
      <div key={i} style={{ overflow: 'clip', position: 'relative', display: 'block' }}>
        <div className="text-line" style={{ position: 'relative', display: 'block', willChange: 'transform' }}>
          {line}
        </div>
      </div>
    ));

  return (
    <div ref={sectionRef} id="about" style={{ position: 'relative', background: 'var(--color-background-light)' }}>

      {/* ══════ FIXED BACKGROUND IMAGES ══════ */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        clipPath: 'inset(0)', overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', mixBlendMode: 'screen' }}>
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className="about-bg-image"
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50%', maxHeight: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                willChange: 'opacity, transform, filter',
              }}
            >
              <img
                src={step.image}
                alt=""
                loading={i === 0 ? 'eager' : 'lazy'}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 4 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ══════ STEPS CONTENT ══════ */}
      <div style={{ position: 'relative' }}>

        {/* ── Progress line with glow ── */}
        <div style={{
          position: 'absolute', top: 0, left: 'clamp(20px, 4vw, 56px)', bottom: 0, width: 1,
        }}>
          {/* Base line */}
          <div style={{
            width: '100%', height: '100%', position: 'absolute', top: 0, left: 0,
            background: 'var(--color-secondary)', opacity: 0.08,
          }} />
          {/* Glow line — scales with scroll */}
          <div
            ref={lineGlowRef}
            style={{
              width: '100%', height: '100%', position: 'absolute', top: 0, left: 0,
              background: 'var(--color-secondary)',
              opacity: 0.5, filter: 'blur(3px)',
              transformOrigin: 'top center', transform: 'scaleY(0)',
              willChange: 'transform',
            }}
          />
        </div>

        {/* ── Heading ── */}
        <div style={{
          paddingTop: 'clamp(100px, 14vw, 180px)',
          paddingBottom: 'clamp(120px, 16vw, 220px)',
          paddingLeft: 'clamp(60px, 8vw, 120px)',
          paddingRight: 'var(--space-4x)',
          position: 'relative',
        }}>
          <AfricanShapes style={{ position: 'absolute', top: '-10%', right: '-8%', width: '500px', height: '500px' }} />
          <span style={{
            fontFamily: 'var(--font-stack-heading)', fontSize: '0.8125em',
            fontWeight: 500, letterSpacing: '0.04em', lineHeight: 1.1,
            textTransform: 'uppercase', color: OCHRE, opacity: 0.8,
          }}>
            About Us
          </span>
        </div>

        {/* ── Steps ── */}
        {STEPS.map((step) => (
          <div
            key={step.num}
            className="about-step"
            style={{
              minHeight: '100vh', display: 'flex', flexDirection: 'column',
              position: 'relative',
              paddingLeft: 'clamp(60px, 8vw, 120px)',
              paddingRight: 'var(--space-4x)',
            }}
          >
            {/* Step heading grid: index | title */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 13fr',
              gap: 'var(--space-2x)',
              alignItems: 'start',
            }}>
              {/* Index */}
              <div
                className="about-step-index"
                style={{
                  display: 'flex', alignItems: 'center', gap: '1em',
                  paddingRight: '25%', transform: 'translateY(-50%)',
                }}
              >
                <div style={{ flex: 1, height: 1, position: 'relative' }}>
                  <div style={{ width: '100%', height: '100%', background: 'var(--color-secondary)', opacity: 0.1 }} />
                  <div
                    className="index-glow"
                    style={{
                      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                      background: 'var(--color-secondary)', filter: 'blur(3px)', opacity: 0.5,
                      transform: 'scaleX(0)', transformOrigin: 'left center', transition: 'transform 0.4s',
                    }}
                  />
                </div>
                <span style={{
                  fontFamily: 'var(--font-stack-heading)', fontSize: '0.8125em',
                  fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase',
                  color: 'var(--color-text-dark)', opacity: 0.5, transition: 'opacity 0.4s',
                }}>
                  {step.num}
                </span>
              </div>

              {/* Title — line-by-line reveal */}
              <div style={{ paddingRight: '20%' }}>
                <h3
                  className="about-step-heading"
                  style={{
                    fontFamily: 'var(--font-stack-heading)',
                    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                    fontWeight: 'bold', lineHeight: 0.9, textTransform: 'uppercase',
                    color: 'var(--color-text-dark)',
                    mixBlendMode: 'overlay', opacity: 0.8,
                    position: 'relative', top: '-0.4em',
                  }}
                >
                  {splitLines(step.title)}
                </h3>
              </div>
            </div>

            {/* Body — word-by-word unblur */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-2x)', flex: 1,
              paddingTop: 'var(--space-8x)', paddingBottom: 'clamp(80px, 12vw, 160px)',
            }}>
              <div /> {/* Empty left column */}
              <div
                className="about-step-body"
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1rem, 1.4vw, 1.4em)',
                  fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.15,
                  color: 'var(--color-text-dark)', opacity: 0.8,
                  paddingRight: '35%',
                }}
              >
                {splitWords(step.body)}
              </div>
            </div>
          </div>
        ))}

        {/* ── Closing section ── */}
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          paddingLeft: 'clamp(60px, 8vw, 120px)', paddingRight: 'var(--space-4x)',
          position: 'relative',
        }}>
          <AfricanShapes style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '600px', height: '600px' }} />
          <div style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
            <h3 style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 'bold', lineHeight: 0.9, textTransform: 'uppercase',
              color: 'var(--color-text-dark)',
            }}>
              Social-first.<br />Human-always.
            </h3>
            <p style={{
              fontFamily: 'var(--font-stack-body)',
              fontSize: 'clamp(0.9rem, 1.1vw, 1.125em)',
              lineHeight: 1.25, color: 'var(--color-text-dark)', opacity: 0.6,
              marginTop: 'var(--space-4x)',
            }}>
              We don't just deliver content — we embed ourselves in your world. H2H is a social-first agency built to help brands grow through authentic human connection.
            </p>
          </div>
        </div>

      </div>

      {/* ── CSS for .appeared state ── */}
      <style>{`
        .about-step-index.appeared .index-glow { transform: scaleX(1); }
        .about-step-index.appeared span { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
