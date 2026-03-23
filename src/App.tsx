import React, { Suspense, lazy, useState, useCallback } from "react";
import { Loader } from "./components/Loader";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LazySection, SectionLoader } from "./components/LazySection";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navigation } from "./components/Navigation";
import { HeroTitle } from "./components/HeroTitle";
import { ScrollReveal } from "./components/ScrollReveal";
import { HeroStory } from "./components/HeroStory";
import { Footer } from "./components/layout/Footer";
import { ContactForm } from "./components/ContactForm";
import { CursorTrail } from "./components/CursorTrail";
import { HeroWebGLPanel } from "./components/HeroWebGLPanel";

const AboutStory = lazy(() =>
  import("./components/AboutStory").then((m) => ({ default: m.AboutStory })),
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

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.07)',
      }}
    >
      {/* Browser chrome bar */}
      <div
        style={{
          height: 42,
          background: '#f0eff0',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 14,
          gap: 7,
          flexShrink: 0,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', flexShrink: 0 }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', flexShrink: 0 }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', flexShrink: 0 }} />
        <div
          style={{
            flex: 1,
            marginLeft: 10,
            marginRight: 14,
            height: 22,
            background: '#fff',
            borderRadius: 5,
            border: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            color: '#999',
            letterSpacing: '0.01em',
            userSelect: 'none',
          }}
        >
          h2h.social
        </div>
      </div>
      {/* Canvas content */}
      {children}
    </div>
  );
}

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

function AppContent() {

  return (
    <main className="min-h-screen bg-[var(--color-background-light)] selection:bg-[var(--color-primary)] selection:text-white">
      <CursorTrail />
      <Navigation />
      <ScrollProgress />

      <section
        id="hero"
        className="relative overflow-hidden"
        style={{ height: '100vh', background: '#ffffff' }}
      >
        {/* ── FULL-VIEWPORT CANVAS ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <HeroWebGLPanel />
        </div>

        {/* ── TEXT OVERLAY — bottom-left, lusion-style ── */}
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(40px, 6vh, 88px)',
            left: 'clamp(24px, 5vw, 80px)',
            zIndex: 10,
          }}
        >
          <HeroTitle />
        </div>

        {/* ── SCROLL CUE ── */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          style={{ bottom: 28 }}
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg
              width="14" height="22"
              viewBox="0 0 14 22"
              fill="none"
              style={{ color: 'rgba(0,0,0,0.18)' }}
            >
              <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="1.5" />
              <rect x="6" y="5" width="2" height="4" rx="1" fill="currentColor" />
            </svg>
          </motion.div>
        </div>
      </section>

      <HeroStory />

      <div id="ecosystem" className="relative" style={{ zIndex: 2 }}>
        <EcosystemServices />
      </div>

      <div id="about" className="relative" style={{ zIndex: 2 }}>
        <Suspense fallback={<SectionLoader />}>
          <AboutStory />
        </Suspense>
      </div>

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
