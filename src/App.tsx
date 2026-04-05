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
import { ChatWidget } from "./components/ChatWidget";

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
          font-size: 48px;
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
            padding-top: 104px;
          }
          .hero-tagline {
            font-size: 32px;
            max-width: 100%;
          }
          .hero-canvas {
            border-radius: 12px;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            padding: 0.75em 0.75em;
            padding-top: 92px;
            gap: 0.5em;
          }
          .hero-tagline {
            font-size: 26px;
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
      <Section id="testimonials" className="bg-[var(--color-background-light)]" noPadding={true}>
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
