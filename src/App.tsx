import React, { Suspense, lazy, useState, useCallback } from "react";
import { Loader } from "./components/Loader";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LazySection, SectionLoader } from "./components/LazySection";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navigation } from "./components/Navigation";
import { ScrollReveal } from "./components/ScrollReveal";

import { Footer } from "./components/layout/Footer";
import { ContactForm } from "./components/ContactForm";
import { CursorTrail } from "./components/CursorTrail";

import { H2HLogo } from "./components/H2HLogo";
import { AboutSection } from "./components/AboutSection";
const LusionConnectors = lazy(() =>
  import("./components/LusionConnectors").then((m) => ({ default: m.LusionConnectors })),
);
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

function HeroLusion() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const storyUrl = 'https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Video%202026-03-03%20at%2019.21.41.mp4'
  const founderUrl = 'https://ik.imagekit.io/qcvroy8xpd/IMG_9186%20(1).mp4?updatedAt=1772720484624'

  return (
    <>
      <section
        id="hero"
        className="hero-section"
      >
        {/* Tagline + video buttons stacked below */}
        <div className="hero-top">
          <span className="hero-tagline">
            from B2B to H2H — Build a Brand People want to talk to.
          </span>

          <div className="hero-buttons">
            <button
              onClick={() => setActiveVideo(storyUrl)}
              className="hero-btn hero-btn--secondary"
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-button-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-button)'; }}
            >
              Hear Our Story
            </button>
            <button
              onClick={() => setActiveVideo(founderUrl)}
              className="hero-btn hero-btn--primary"
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-button-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-button)'; }}
            >
              Meet Our Founder
            </button>
          </div>
        </div>

        {/* ── 3D canvas — contained with rounded corners ── */}
        <div className="hero-canvas">
          <ErrorBoundary fallback={<div style={{ width: '100%', height: '100%', background: '#141622' }} />}>
            <Suspense fallback={<div style={{ width: '100%', height: '100%', background: '#141622' }} />}>
              <LusionConnectors />
            </Suspense>
          </ErrorBoundary>
        </div>

        {activeVideo && (
          <div
            onClick={() => setActiveVideo(null)}
            className="hero-video-overlay"
          >
            <button
              onClick={(e) => { e.stopPropagation(); setActiveVideo(null) }}
              className="hero-video-close"
            >
              ✕
            </button>
            <video
              src={activeVideo}
              autoPlay
              controls
              playsInline
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                cursor: 'default',
              }}
            />
          </div>
        )}
      </section>

      <style>{`
        .hero-section {
          width: 100%;
          height: calc(var(--vh, 1vh) * 100 + 30px);
          background: #f0f0f0;
          display: grid;
          grid-template-rows: auto 1fr;
          gap: clamp(1em, 3vw, 3em);
          padding: clamp(1.25em, 3vw, 3em) clamp(1.25em, 5vw, 5em);
          padding-top: calc(70px + clamp(1em, 2vw, 2em));
          box-sizing: border-box;
          overflow: hidden;
        }
        .hero-top {
          display: flex;
          flex-direction: column;
          gap: clamp(0.6em, 1.5vw, 1em);
        }
        .hero-tagline {
          font-family: var(--font-stack-heading);
          font-size: clamp(0.85rem, 1.6vw, 1.5em);
          font-weight: 700;
          color: #0a0a0a;
          max-width: 500px;
          line-height: 1.2;
        }
        .hero-buttons {
          display: flex;
          gap: clamp(0.5em, 1vw, 0.75em);
          flex-wrap: wrap;
        }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: clamp(10px, 1.5vw, 14px) clamp(16px, 2.5vw, 24px);
          border-radius: 8px;
          font-size: clamp(0.6rem, 1vw, 0.7rem);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-family: var(--font-stack-heading);
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          transition: background 0.25s ease, box-shadow 0.25s ease;
          box-shadow: var(--shadow-button);
          white-space: nowrap;
        }
        .hero-btn--secondary {
          border: 2px solid var(--color-secondary);
          background: var(--color-secondary);
        }
        .hero-btn--primary {
          border: 2px solid var(--color-primary);
          background: var(--color-primary);
        }
        .hero-canvas {
          border-radius: clamp(12px, 2vw, 20px);
          overflow: hidden;
          position: relative;
          min-height: 0;
        }
        .hero-video-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(0,0,0,0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .hero-video-close {
          position: absolute;
          top: clamp(12px, 2vw, 24px);
          right: clamp(12px, 2vw, 24px);
          width: clamp(36px, 5vw, 48px);
          height: clamp(36px, 5vw, 48px);
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.08);
          color: #fff;
          font-size: clamp(16px, 2vw, 20px);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        /* ── Mobile hero adjustments ── */
        @media (max-width: 768px) {
          .hero-section {
            height: calc(var(--vh, 1vh) * 100);
            gap: 0.75em;
            padding: 1em 1em;
            padding-top: calc(60px + 0.75em);
          }
          .hero-tagline {
            font-size: clamp(0.8rem, 3.5vw, 1.1rem);
          }
          .hero-btn {
            padding: 10px 16px;
            font-size: 0.58rem;
          }
          .hero-canvas {
            border-radius: 12px;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            padding: 0.75em 0.75em;
            padding-top: calc(56px + 0.5em);
            gap: 0.5em;
          }
          .hero-tagline {
            font-size: 0.82rem;
            max-width: 280px;
          }
          .hero-btn {
            padding: 8px 14px;
            font-size: 0.55rem;
            letter-spacing: 0.1em;
          }
        }
      `}</style>
    </>
  )
}

function AppContent() {

  return (
    <main className="min-h-screen bg-[var(--color-background-light)] selection:bg-[var(--color-primary)] selection:text-white">
      <CursorTrail />
      <Navigation />
      <ScrollProgress />

      {/* ═══ HERO ═══ */}
      <HeroLusion />

      {/* ═══ ABOUT ═══ */}
      <AboutSection />

      {/* ═══ 3-PILLAR ECOSYSTEM ═══ */}
      <LazySection>
        <Suspense fallback={<SectionLoader />}>
          <EcosystemServices />
        </Suspense>
      </LazySection>

      {/* ═══ SERVICES ═══ */}
      <Section id="services" className="bg-[var(--color-background-light)]" noPadding={true}>
        <ArcSlider />
      </Section>

      {/* ═══ TESTIMONIALS ═══ */}
      <Section id="testimonials" className="bg-[var(--color-background-light)]">
        <Testimonials />
      </Section>

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
