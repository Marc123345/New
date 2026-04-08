import React, { Suspense, lazy, useState, useCallback, useEffect, useRef } from "react";
import { Loader } from "./components/Loader";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LazySection, SectionLoader } from "./components/LazySection";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navigation } from "./components/Navigation";
import { ScrollReveal } from "./components/ScrollReveal";

import { Footer } from "./components/layout/Footer";
import { ContactForm } from "./components/ContactForm";
import { CursorTrail } from "./components/CursorTrail";
import { ChatWidget } from "./components/ChatWidget";


import { H2HLogo } from "./components/H2HLogo";
import { AboutSection } from "./components/AboutSection";
import { LusionConnectors } from "./components/LusionConnectors";
const EcosystemServices = lazy(() =>
  import("./components/EcosystemServices").then((m) => ({ default: m.EcosystemServices })),
);


const ArcSlider = lazy(() =>
  import("./components/ArcSlider").then((m) => ({ default: m.ArcSlider })),
);
const Testimonials = lazy(() =>
  import("./components/Testimonials").then((m) => ({ default: m.Testimonials })),
);
const BlogSection = lazy(() =>
  import("./components/BlogSection").then((m) => ({ default: m.BlogSection })),
);


const SECTION_PADDING: React.CSSProperties = {
  paddingTop: 'var(--space-8x)',
  paddingBottom: 'var(--space-8x)',
};

interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
  revealMode?: "blur" | "parallax" | "3d";
  delay?: number;
  noPadding?: boolean;
}

const Section = ({
  id,
  className = "",
  children,
  revealMode = "blur",
  delay = 0,
  noPadding = false,
}: SectionProps) => (
  <section
    id={id}
    className={className}
    style={noPadding ? undefined : SECTION_PADDING}
  >
    <LazySection>
      <ScrollReveal mode={revealMode} delay={delay}>
        {children}
      </ScrollReveal>
    </LazySection>
  </section>
);

// ─── Lusion-exact hero ───────────────────────────────────────────────────────

const BRAND_VIDEO = "https://ik.imagekit.io/qcvroy8xpd/H2H%20ANIMATON%20VIDEO%20FINAL.mp4";

function HeroLusion() {
  const [videoOpen, setVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [videoOpen]);

  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setVideoOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [videoOpen]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!videoOpen) { v.pause(); v.currentTime = 0; }
  }, [videoOpen]);

  return (
    <>
      <section
        id="hero"
        className="hero-section"
      >
        {/* Tagline */}
        <div className="hero-top">
          <h1 className="hero-tagline">
            from B2B to H2H — Build a Brand People want to talk to.
          </h1>
          <button
            type="button"
            className="hero-story-btn"
            onClick={() => setVideoOpen(true)}
          >
            <span className="hero-story-btn__play" aria-hidden>&#9654;</span>
            Hear Our Story
          </button>
        </div>

        {/* ── 3D canvas — contained with rounded corners ── */}
        <div className="hero-canvas">
          <ErrorBoundary fallback={<div style={{ width: '100%', height: '100%', background: '#141622' }} />}>
            <Suspense fallback={<div style={{ width: '100%', height: '100%', background: '#141622' }} />}>
              <LusionConnectors />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      {/* ── Brand video modal ── */}
      {videoOpen && (
        <div
          className="hero-video-overlay"
          onClick={() => setVideoOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Our Story"
        >
          <div className="hero-video-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setVideoOpen(false)}
              className="hero-video-close"
            >
              ✕
            </button>
            <div className="hero-video-header">
              <span className="hero-video-header__label">Our Story</span>
            </div>
            <div className="hero-video-stage">
              <video
                ref={videoRef}
                src={BRAND_VIDEO}
                controls
                autoPlay
                playsInline
                preload="auto"
                className="hero-video-player"
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hero-section {
          /* Nav height = 2×padding + logo + border ≈ clamp(55px, 9vw + 22px, 132px) */
          --nav-h: calc(clamp(43px, 8vw, 90px) + clamp(20px, 4vh, 40px) + 1px);
          width: 100%;
          height: calc(var(--vh, 1vh) * 100 + 30px);
          background: #f0f0f0;
          display: grid;
          grid-template-rows: auto 1fr;
          gap: clamp(1em, 3vw, 3em);
          padding: clamp(1.25em, 3vw, 3em) clamp(1.25em, 5vw, 5em);
          padding-top: calc(var(--nav-h) + 20px);
          box-sizing: border-box;
          overflow: hidden;
        }
        .hero-top {
          display: flex;
          flex-direction: column;
          gap: clamp(0.5em, 1vw, 0.75em);
          overflow: hidden;
        }
        .hero-tagline {
          font-family: var(--font-stack-heading);
          font-size: clamp(26px, 4vw, 48px);
          font-weight: 800;
          color: #5b21b6;
          max-width: min(90%, 1100px);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .hero-canvas {
          border-radius: clamp(12px, 2vw, 20px);
          overflow: hidden;
          position: relative;
          min-height: 0;
        }

        /* ── Mobile hero adjustments ── */
        @media (max-width: 768px) {
          .hero-section {
            height: calc(var(--vh, 1vh) * 100);
            gap: 0.75em;
            padding: 1em 1em;
            padding-top: calc(var(--nav-h) + 28px);
          }
          .hero-tagline {
            max-width: 100%;
          }
          .hero-canvas {
            border-radius: 12px;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            padding: 0.75em 0.75em;
            padding-top: calc(var(--nav-h) + 24px);
            gap: 0.5em;
          }
          .hero-story-btn {
            font-size: 12px;
            padding: 10px 20px;
            gap: 8px;
          }
        }

        /* ── Hear Our Story button ── */
        .hero-story-btn {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          margin-top: 8px;
          gap: 10px;
          background: var(--color-primary, #291e56);
          color: #ffffff;
          font-family: var(--font-stack-heading, system-ui, sans-serif);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 14px 28px;
          border-radius: 999px;
          border: 2px solid var(--color-secondary, #a46cfc);
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          box-shadow: 0 2px 12px rgba(164,108,252,0.2);
        }
        .hero-story-btn:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 16px rgba(164,108,252,0.3);
          background: var(--color-secondary, #a46cfc);
        }
        .hero-story-btn:focus-visible {
          outline: 3px solid var(--color-secondary, #a46cfc);
          outline-offset: 4px;
        }
        .hero-story-btn__play {
          font-size: 12px;
          line-height: 1;
        }

        /* ── Video overlay ── */
        .hero-video-overlay {
          position: fixed;
          inset: 0;
          background: rgba(6, 3, 18, 0.96);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(12px, 3vw, 32px);
          animation: heroVidFade 0.25s ease-out;
        }
        @media (min-width: 769px) {
          .hero-video-overlay {
            background: rgba(6, 3, 18, 0.88);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
          }
        }
        @keyframes heroVidFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .hero-video-modal {
          position: relative;
          width: 100%;
          max-width: 960px;
          background: #1a1040;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), var(--shadow-geometric, 10px 10px 0 #a46cfc);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: heroVidPop 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes heroVidPop {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .hero-video-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.08);
          color: #ffffff;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .hero-video-close:hover {
          background: rgba(255,255,255,0.18);
          transform: rotate(90deg);
        }
        .hero-video-header {
          padding: clamp(18px, 2.5vw, 24px) clamp(16px, 2.5vw, 28px);
          padding-right: 64px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .hero-video-header__label {
          display: inline-block;
          color: #ffffff;
          font-family: var(--font-stack-heading, system-ui, sans-serif);
          font-size: clamp(0.85rem, 1.3vw, 1rem);
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding-bottom: 6px;
          border-bottom: 3px solid var(--color-secondary, #a46cfc);
        }
        .hero-video-stage {
          background: #000;
          aspect-ratio: 16 / 9;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-video-player {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        @media (max-width: 640px) {
          .hero-video-modal {
            max-width: 100%;
            border-radius: 14px;
          }
          .hero-video-header {
            padding: 14px 12px;
            padding-right: 52px;
          }
          .hero-video-header__label {
            font-size: 0.72rem;
            letter-spacing: 0.1em;
          }
          .hero-video-close {
            top: 8px;
            right: 8px;
            width: 34px;
            height: 34px;
            font-size: 16px;
          }
        }
      `}</style>
    </>
  )
}

function AppContent() {

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-clip bg-[var(--color-background-light)] selection:bg-[var(--color-primary)] selection:text-white">
      <CursorTrail />
      <Navigation />
      <ScrollProgress />

      {/* ═══ HERO ═══ */}
      <HeroLusion />

      {/* ═══ ABOUT ═══ */}
      <AboutSection />

      {/* ═══ 3-PILLAR ECOSYSTEM ═══ */}
      <div id="ecosystem">
        <LazySection>
          <Suspense fallback={<SectionLoader />}>
            <EcosystemServices />
          </Suspense>
        </LazySection>
      </div>

      {/* ═══ SERVICES ═══ */}
      <Section id="services" className="bg-[var(--color-background-light)]" noPadding={true}>
        <ArcSlider />
      </Section>

      {/* ═══ TESTIMONIALS ═══ */}
      <Section id="testimonials" className="bg-white" noPadding={true}>
        <Testimonials />
      </Section>

      {/* Spacer between testimonials and blog */}
      <div className="h-20 sm:h-28 lg:h-36 bg-white" />

      {/* ═══ BLOG ═══ */}
      <div id="blog">
        <LazySection>
          <Suspense fallback={<SectionLoader />}>
            <BlogSection />
          </Suspense>
        </LazySection>
      </div>

      {/* ═══ CONTACT ═══ */}
      <Section id="contact" className="bg-[var(--color-background-light)]" delay={0.2} noPadding={true}>
        <ContactForm />
      </Section>

      {/* ═══ FOOTER ═══ */}
      <Footer />

      {/* ═══ FLOATING CHAT WIDGET ═══ */}
      <ChatWidget />

    </main>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const onComplete = useCallback(() => setLoaded(true), []);

  return (
    <ErrorBoundary>
      {!loaded && <Loader onComplete={onComplete} />}
      <AppContent />
    </ErrorBoundary>
  );
}
