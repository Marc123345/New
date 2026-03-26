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
const LusionConnectors = lazy(() =>
  import("./components/LusionConnectors").then((m) => ({ default: m.LusionConnectors })),
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
    <section
      id="hero"
      style={{
        width: '100%',
        height: '100vh',
        background: '#f0f0f0',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gap: '3em',
        padding: '3em 5em',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* ── Nav row: label | spacer | caption | spacer | button | button ── */}
      <nav style={{
        display: 'grid',
        gridTemplateColumns: 'auto 0.25fr 1fr 0.25fr auto auto',
        gap: '1em',
        alignItems: 'center',
      }}>
        <H2HLogo height={52} onDark={false} />

        <div />

        <span style={{
          fontFamily: 'var(--font-stack-heading)',
          fontSize: 'clamp(0.85rem, 1.6vw, 1.5em)',
          fontWeight: 700,
          color: '#0a0a0a',
          maxWidth: 500,
          lineHeight: 1.2,
        }}>
          from B2B to H2H — Build a Brand People want to talk to.
        </span>

        <div />

        <button
          onClick={() => setActiveVideo(storyUrl)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#a46cfc', color: 'white',
            height: 52, borderRadius: 8, padding: '0 2em',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Hear Our Story
        </button>

        <button
          onClick={() => setActiveVideo(founderUrl)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', color: '#a46cfc',
            height: 52, borderRadius: 8, padding: '0 2em',
            border: '1.5px solid rgba(164,108,252,0.4)',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Meet Our Founder
        </button>
      </nav>

      {/* ── 3D canvas — fills remaining height ── */}
      <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
        <ErrorBoundary fallback={<div style={{ width: '100%', height: '100%', background: '#141622' }} />}>
          <Suspense fallback={<div style={{ width: '100%', height: '100%', background: '#141622' }} />}>
            <LusionConnectors />
          </Suspense>
        </ErrorBoundary>
      </div>

      {activeVideo && (
        <div
          onClick={() => setActiveVideo(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setActiveVideo(null) }}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              width: 48,
              height: 48,
              borderRadius: '50%',
              border: '1.5px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
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
  )
}

function AppContent() {

  return (
    <main className="min-h-screen bg-[var(--color-background-light)] selection:bg-[var(--color-primary)] selection:text-white">
      <CursorTrail />
      <Navigation />
      <ScrollProgress />

      {/* ═══ HERO — exact Lusion layout ═══ */}
      <HeroLusion />

      <Section id="services" className="bg-[var(--color-background-light)]" noPadding={true}>
        <ArcSlider />
      </Section>

      <Section id="testimonials" className="bg-[var(--color-background-light)]">
        <Testimonials />
      </Section>

      <div id="blog">
        <LazySection>
          <Suspense fallback={<SectionLoader />}>
            <BlogSection />
          </Suspense>
        </LazySection>
      </div>

      <Section id="contact" className="bg-[var(--color-background-light)]" delay={0.2} noPadding={true}>
        <ContactForm />
      </Section>

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
