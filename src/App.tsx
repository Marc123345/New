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
        className="relative min-h-screen overflow-hidden"
        style={{ background: '#ffffff' }}
      >
        <div
          className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 px-6 md:px-10 lg:px-16 min-h-screen"
          style={{ paddingTop: 'calc(var(--space-8x) + 32px)', paddingBottom: 'var(--space-8x)' }}
        >
          {/* ── TEXT ── */}
          <div className="lg:w-[42%] xl:w-[38%] flex flex-col justify-center shrink-0">
            <HeroTitle />
          </div>

          {/* ── BROWSER FRAME + CUBES ── */}
          <div className="lg:w-[58%] xl:w-[62%] w-full">
            <BrowserFrame>
              <div style={{ height: 'clamp(280px, 44vw, 620px)', position: 'relative', background: '#ffffff' }}>
                <HeroWebGLPanel />
              </div>
            </BrowserFrame>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce" aria-hidden="true">
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: 'rgba(0,0,0,0.25)', fontFamily: 'var(--font-stack-heading)', letterSpacing: '0.2em' }}
          >
            scroll
          </span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            style={{ color: 'rgba(0,0,0,0.18)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
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
