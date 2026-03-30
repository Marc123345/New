import { useRef, useEffect, useState, useCallback } from 'react';
import { Navigation } from '../components/Navigation';

/* ── African accent colors (used for borders, glows, decorative only) ── */
const OCHRE = '#C8832A';
const TERRACOTTA = '#B5401E';
const EARTH = '#7A4E2D';

/* ── Adinkra-inspired SVG watermarks ── */
function AdinkraWatermark({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={{ opacity: 0.05, ...style }} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="200" cy="200" r="180" stroke={OCHRE} strokeWidth="1" />
      <circle cx="200" cy="200" r="130" stroke={OCHRE} strokeWidth="0.8" />
      <circle cx="200" cy="200" r="80" stroke={OCHRE} strokeWidth="0.6" />
      <line x1="20" y1="200" x2="380" y2="200" stroke={TERRACOTTA} strokeWidth="0.5" />
      <line x1="200" y1="20" x2="200" y2="380" stroke={TERRACOTTA} strokeWidth="0.5" />
      <line x1="60" y1="60" x2="340" y2="340" stroke={EARTH} strokeWidth="0.4" />
      <line x1="340" y1="60" x2="60" y2="340" stroke={EARTH} strokeWidth="0.4" />
      <rect x="140" y="140" width="120" height="120" stroke={OCHRE} strokeWidth="0.8" transform="rotate(45 200 200)" />
      <rect x="160" y="160" width="80" height="80" stroke={TERRACOTTA} strokeWidth="0.6" transform="rotate(45 200 200)" />
    </svg>
  );
}

/* ── Kente stripe divider ── */
function KenteStripe({ animate = false }: { animate?: boolean }) {
  return (
    <div
      className="kente-stripe w-full"
      style={{
        height: '5px',
        background: `repeating-linear-gradient(90deg, ${OCHRE} 0px, ${OCHRE} 20px, ${TERRACOTTA} 20px, ${TERRACOTTA} 40px, ${EARTH} 40px, ${EARTH} 60px, ${OCHRE} 60px, ${OCHRE} 80px)`,
        transformOrigin: 'left',
        transform: animate ? undefined : 'scaleX(1)',
      }}
    />
  );
}

/* ── Number counter hook ── */
function useCounter(target: number, duration = 1400) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ── Scroll reveal hook ── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ── Value card ── */
function ValueCard({ num, title, description, delay }: { num: string; title: string; description: string; delay: number }) {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className="relative flex flex-col"
      style={{
        background: 'var(--color-primary)',
        border: `1px solid rgba(164,108,252,0.12)`,
        padding: 'var(--space-4x)',
        transitionDelay: `${delay}s`,
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-4px)';
        el.style.boxShadow = 'var(--shadow-geometric-hover)';
        const bar = el.querySelector('.accent-bar') as HTMLElement;
        if (bar) bar.style.height = '4px';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
        const bar = el.querySelector('.accent-bar') as HTMLElement;
        if (bar) bar.style.height = '2px';
      }}
    >
      {/* Top accent bar */}
      <div
        className="accent-bar absolute top-0 left-0 right-0"
        style={{ height: '2px', background: `linear-gradient(90deg, ${OCHRE}, ${TERRACOTTA})`, transition: 'height 0.3s ease' }}
      />
      <span
        style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: 'clamp(3rem, 8vw, 5rem)',
          lineHeight: 1,
          color: 'rgba(164,108,252,0.08)',
          fontWeight: 'bold',
          position: 'absolute',
          top: 'var(--space-2x)',
          right: 'var(--space-2x)',
        }}
      >
        {num}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: OCHRE,
          marginBottom: 'var(--space-2x)',
        }}
      >
        {num}
      </span>
      <h3 style={{ color: 'var(--color-text-dark)', marginBottom: 'var(--space-2x)' }}>{title}</h3>
      <p style={{ color: 'rgba(232,226,255,0.6)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>{description}</p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ABOUT PAGE
   ════════════════════════════════════════════════════════════════════════════ */

export function AboutPage() {
  const heroWatermarkRef = useRef<HTMLDivElement>(null);
  const [preloaderDone, setPreloaderDone] = useState(false);

  /* Preloader — fades out after 1.2s */
  useEffect(() => {
    const timer = setTimeout(() => setPreloaderDone(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  /* Hero parallax watermark on mousemove */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (heroWatermarkRef.current) {
      const x = (e.clientX - window.innerWidth / 2) * 0.015;
      const y = (e.clientY - window.innerHeight / 2) * 0.015;
      heroWatermarkRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  }, []);

  /* Scroll reveal refs */
  const beliefRef = useScrollReveal();
  const quoteRef = useScrollReveal();
  const whyRef = useScrollReveal();
  const manifestoRef = useScrollReveal();
  const footerRef = useScrollReveal();

  /* Kente divider scroll animation */
  useEffect(() => {
    const stripes = document.querySelectorAll('.kente-stripe');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.transform = 'scaleX(1)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    stripes.forEach((s) => {
      (s as HTMLElement).style.transform = 'scaleX(0)';
      (s as HTMLElement).style.transformOrigin = 'left';
      (s as HTMLElement).style.transition = 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(s);
    });
    return () => observer.disconnect();
  }, []);

  /* Hero text stagger */
  const heroWords = ['From', 'Brand Voice', 'to Human', 'Connection'];

  return (
    <div style={{ background: 'var(--color-background-light)', minHeight: '100vh' }}>
      {/* ── Preloader ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'var(--color-background-light)',
          opacity: preloaderDone ? 0 : 1,
          visibility: preloaderDone ? 'hidden' : 'visible',
          transition: 'opacity 1.2s ease-out, visibility 1.2s ease-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            color: 'var(--color-secondary)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          H2H
        </span>
      </div>

      <Navigation />

      {/* ══════ HERO ══════ */}
      <section
        className="section relative overflow-hidden"
        style={{ paddingTop: 'clamp(140px, 16vw, 200px)', paddingBottom: 'var(--space-12x)' }}
        onMouseMove={handleMouseMove}
      >
        {/* Kente top stripe */}
        <KenteStripe />

        {/* Adinkra watermark — parallax */}
        <div
          ref={heroWatermarkRef}
          className="absolute pointer-events-none will-change-transform"
          style={{ top: '-10%', right: '-5%', width: '600px', height: '600px' }}
        >
          <AdinkraWatermark style={{ width: '100%', height: '100%' }} />
        </div>

        <div className="container relative z-10">
          {/* Eyebrow */}
          <div
            style={{
              fontFamily: 'var(--font-stack-heading)',
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: OCHRE,
              marginBottom: 'var(--space-4x)',
              opacity: 0,
              transform: 'translateY(40px)',
              animation: preloaderDone ? 'heroReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards' : 'none',
            }}
          >
            About Us
          </div>

          {/* Staggered headline */}
          <h1 style={{ marginBottom: 'var(--space-4x)' }}>
            {heroWords.map((word, i) => (
              <span
                key={word}
                style={{
                  display: 'block',
                  opacity: 0,
                  transform: 'translateY(40px)',
                  animation: preloaderDone
                    ? `heroReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.1}s forwards`
                    : 'none',
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Subheading */}
          <p
            style={{
              maxWidth: '620px',
              fontSize: '1.2rem',
              color: 'rgba(232,226,255,0.7)',
              lineHeight: 1.65,
              opacity: 0,
              transform: 'translateY(40px)',
              animation: preloaderDone ? 'heroReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards' : 'none',
            }}
          >
            At H2H we believe the most impactful brands are the ones that know how to connect — not just communicate.
          </p>
        </div>

        <style>{`
          @keyframes heroReveal {
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>

      {/* ── Kente divider ── */}
      <div className="container"><KenteStripe animate /></div>

      {/* ══════ BELIEF BLOCK ══════ */}
      <section className="section">
        <div className="container" ref={beliefRef}>
          <div className="grid grid-cols-1 lg:grid-cols-12" style={{ gap: 'var(--space-8x)' }}>
            <div className="lg:col-span-4">
              <span
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: OCHRE,
                }}
              >
                Our Belief
              </span>
            </div>
            <div className="lg:col-span-8">
              <p style={{ fontSize: '1.25rem', color: 'var(--color-text-dark)', lineHeight: 1.7 }}>
                People don't want perfection. They want personality. They want brands that sound like someone — not something. We exist because brands deserve better than templated content and algorithmic guesswork.
              </p>
              <p style={{ fontSize: '1.1rem', color: 'rgba(232,226,255,0.6)', lineHeight: 1.7 }}>
                H2H is a social-first agency built to help brands grow through authentic human connection. We combine strategy, creativity, and cultural fluency to build brands that people actually care about.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Kente divider ── */}
      <div className="container"><KenteStripe animate /></div>

      {/* ══════ PULL QUOTE ══════ */}
      <section className="section">
        <div className="container" ref={quoteRef}>
          <blockquote
            style={{
              borderLeft: `4px solid ${TERRACOTTA}`,
              paddingLeft: 'var(--space-4x)',
              margin: 0,
              position: 'relative',
            }}
          >
            {/* Oversized quote mark */}
            <span
              style={{
                position: 'absolute',
                top: '-30px',
                left: '-10px',
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(5rem, 12vw, 10rem)',
                lineHeight: 1,
                color: TERRACOTTA,
                opacity: 0.15,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              &ldquo;
            </span>
            <p
              style={{
                fontStyle: 'italic',
                fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
                lineHeight: 1.4,
                color: 'var(--color-text-dark)',
                margin: 0,
                fontFamily: 'var(--font-stack-heading)',
                letterSpacing: '-0.01em',
              }}
            >
              We don't just deliver content — we embed ourselves in your world.
            </p>
          </blockquote>
        </div>
      </section>

      {/* ── Kente divider ── */}
      <div className="container"><KenteStripe animate /></div>

      {/* ══════ WHY H2H ══════ */}
      <section className="section">
        <div className="container" ref={whyRef}>
          <h2>Why H2H?</h2>
          <p style={{ maxWidth: '700px', color: 'rgba(232,226,255,0.7)', fontSize: '1.1rem', lineHeight: 1.7 }}>
            We're not an agency you hire. We're a partner you embed. H2H becomes an extension of your team — learning your voice, understanding your audience, and building systems that compound over time. No one-off campaigns. No cookie-cutter content. Just real, measurable growth built on human connection.
          </p>
        </div>
      </section>

      {/* ══════ VALUE CARDS ══════ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--space-4x)' }}>
            <ValueCard
              num="01"
              title="Strategists"
              description="We don't guess. Every piece of content, every campaign, every decision is rooted in data, insight, and intent. Strategy first, always."
              delay={0}
            />
            <ValueCard
              num="02"
              title="Creatives"
              description="Ideas that stop the scroll. We craft visuals, copy, and experiences that feel native to each platform — because generic doesn't cut it."
              delay={0.1}
            />
            <ValueCard
              num="03"
              title="Storytellers"
              description="Brands are stories. We help you tell yours in a way that's consistent, compelling, and unmistakably human — across every touchpoint."
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ── Kente divider ── */}
      <div className="container"><KenteStripe animate /></div>

      {/* ══════ MANIFESTO ══════ */}
      <section className="section">
        <div className="container" ref={manifestoRef}>
          <div
            className="relative overflow-hidden"
            style={{
              background: 'var(--color-primary)',
              border: `1px solid rgba(164,108,252,0.1)`,
              padding: 'clamp(var(--space-6x), 8vw, var(--space-12x))',
            }}
          >
            {/* Adinkra watermark */}
            <div className="absolute pointer-events-none" style={{ top: '-20%', right: '-10%', width: '500px', height: '500px' }}>
              <AdinkraWatermark style={{ width: '100%', height: '100%', opacity: 0.04 }} />
            </div>

            <div className="relative z-10" style={{ maxWidth: '680px' }}>
              <h2 style={{ color: 'var(--color-text-dark)' }}>
                Building brand ecosystems that actually work.
              </h2>
              <p style={{ color: 'rgba(232,226,255,0.65)', fontSize: '1.1rem', lineHeight: 1.7 }}>
                We don't just manage your social media. We build the entire ecosystem around it — content strategy, community management, paid amplification, creative production, and performance analytics. Everything connected. Everything measured. Everything human.
              </p>
            </div>

            {/* Kente stripe at bottom */}
            <div className="absolute bottom-0 left-0 right-0">
              <KenteStripe animate />
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER STRIP ══════ */}
      <section style={{ paddingTop: 'var(--space-8x)', paddingBottom: 'var(--space-8x)' }}>
        <div className="container" ref={footerRef}>
          <div className="flex flex-col items-center gap-6 text-center">
            <span
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                color: 'var(--color-secondary)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
            >
              H2H
            </span>
            <div style={{ width: '120px' }}>
              <KenteStripe animate />
            </div>
            <p
              style={{
                fontFamily: 'var(--font-stack-heading)',
                fontSize: '0.85rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(232,226,255,0.4)',
                margin: 0,
              }}
            >
              Social-first. Human-always.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
